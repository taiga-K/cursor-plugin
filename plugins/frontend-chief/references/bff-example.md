# BFFの部分失敗を設計する例

概念：[BFF](concepts.md)、[Parse, don't validate](concepts.md)、[Railway Oriented Programming](concepts.md)、[Graceful degradation](concepts.md)。

注文履歴では注文が必須、おすすめが任意とする。これはこの例のプロダクト要件であり、任意サービスを全案件へ適用する規則ではない。

## 型境界

上流の未知の値は `unknown` として受け取り、entityの境界で検証してから型付きの値にする。失敗は例外ではなく `Result` で返す。上流レスポンス全体をspreadせず、公開するフィールドだけを選ぶ。

```ts
// entities/order/model/order.ts
export type Order = { id: string; label: string };

export type Result<T, E> =
  | { ok: true; value: T }
  | { ok: false; error: E };

export function parseOrders(value: unknown): Result<Order[], "invalid-response"> {
  if (!Array.isArray(value)) return { ok: false, error: "invalid-response" };
  const orders: Order[] = [];
  for (const item of value) {
    if (
      typeof item !== "object" || item === null ||
      !("id" in item) || typeof item.id !== "string" ||
      !("label" in item) || typeof item.label !== "string"
    ) {
      return { ok: false, error: "invalid-response" };
    }
    orders.push({ id: item.id, label: item.label });
  }
  return { ok: true, value: orders };
}
```

## UI用の状態

画面が区別すべき状態を判別可能なユニオンで表す。失敗を空配列で隠さない。

```ts
// pages/orders/model/summary.ts
export type Summary =
  | { status: "ready"; orders: Order[]; recommendations: string[] }
  | { status: "degraded"; orders: Order[]; reason: "recommendations-unavailable" }
  | { status: "failed"; reason: "orders-unavailable" | "invalid-response" };
```

## 集約処理

必須と任意を `Promise.allSettled` で並行に取得し、必須の失敗は `failed`、任意の失敗は `degraded` に写す。ソースは関数で注入し、テストから固定データと失敗を差し込めるようにする。

```ts
// pages/orders/api/load-summary.ts
type Sources = {
  readOrders: () => Promise<unknown>;
  readRecommendations: () => Promise<unknown>;
};

export async function loadSummary(sources: Sources): Promise<Summary> {
  const [ordersResult, recommendationsResult] = await Promise.allSettled([
    Promise.resolve().then(sources.readOrders),
    Promise.resolve().then(sources.readRecommendations),
  ]);
  if (ordersResult.status === "rejected") {
    return { status: "failed", reason: "orders-unavailable" };
  }
  const parsed = parseOrders(ordersResult.value);
  if (!parsed.ok) {
    return { status: "failed", reason: parsed.error };
  }
  if (
    recommendationsResult.status === "rejected" ||
    !Array.isArray(recommendationsResult.value) ||
    !recommendationsResult.value.every((item: unknown) => typeof item === "string")
  ) {
    return { status: "degraded", orders: parsed.value, reason: "recommendations-unavailable" };
  }
  return { status: "ready", orders: parsed.value, recommendations: recommendationsResult.value };
}
```

`Promise.resolve().then(fn)` で包むのは、同期的にthrowするソースも `rejected` として扱うため。

| 条件 | 結果 | UI |
|---|---|---|
| 両方成功 | ready、注文、おすすめ | 取得した内容 |
| 注文は空で両方成功 | ready、空の注文 | 正常な空状態 |
| おすすめだけ失敗・不正応答 | degraded、注文、失敗理由 | 注文を維持し、おすすめの失敗を通知 |
| 注文の通信失敗 | failed、orders-unavailable | 取得失敗 |
| 注文の不正応答 | failed、invalid-response | 取得失敗 |

## テスト

期待値は入力から独立した明示値で書く。上の表の各行に加えて、上流が余計なフィールドを含む場合に公開しないこと、同期的な失敗も分類されることを確認する。バグ修正ではこの層の失敗テストを先に書く（[テスト戦略](testing-strategy.md)）。

```ts
it("必要なデータを保持し、上流の余計な項目を公開しない", async () => {
  expect(await loadSummary({
    readOrders: async () => [{ id: "1", label: "キーボード", internalToken: "secret" }],
    readRecommendations: async () => ["マウス"],
  })).toEqual({ status: "ready", orders: [{ id: "1", label: "キーボード" }], recommendations: ["マウス"] });
});

it("空の成功と障害を区別する", async () => {
  expect(await loadSummary({
    readOrders: async () => [],
    readRecommendations: async () => [],
  })).toEqual({ status: "ready", orders: [], recommendations: [] });
});
```

## HTTP入口とServer Components

Route Handlerは成功・部分成功を200、上流失敗を502へ変換する。Server Componentsは同じサーバー関数を直接呼び、自分のHTTP入口をHTTPで経由しない。サーバー専用ファイルは `import "server-only"` を付ける。

```ts
// pages/orders/api/load-demo-summary.server.ts
import "server-only";
export async function loadDemoSummary() {
  return loadSummary({ readOrders, readRecommendations });
}

// app/api/orders/route.ts
export async function GET() {
  const summary = await loadDemoSummary();
  return Response.json(summary, {
    status: summary.status === "failed" ? 502 : 200,
    headers: { "Cache-Control": "no-store" },
  });
}
```

実案件のHTTP契約、キャッシュ、再認証の扱いは別途設計する。

## 実サービスへ適用するとき

この例はソースを関数で注入し、固定データを返す検証用の形である。認証基盤や上流HTTP実装を省略している。公開アプリ用の完全なBFFとしてコピーしない。

実サービスのadapterは許可した接続先だけに接続し、HTTP status・Content-Type・サイズ・schemaを契約に応じて検証する。タイムアウトとAbortSignalを渡し、全体と上流ごとの待機上限を決める。Promise.allSettledだけでは待機は打ち切られない。必須と任意の依存関係によっては、任意サービスを待たず別境界でstreamする案も比較する。

更新の再試行は冪等性・重複防止の契約を確認する。認証情報をサーバーで扱い、BFF入口とサービスの両方で必要な権限を確認する。ログは秘密を含めず、相関ID、上流、所要時間、公開しない失敗分類を残す。
