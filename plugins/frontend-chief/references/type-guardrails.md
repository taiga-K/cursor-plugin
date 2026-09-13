# 型とアーキテクチャの防護（第一層）

概念：[Parse, don't validate](concepts.md)、[Make illegal states unrepresentable](concepts.md)、[Railway Oriented Programming](concepts.md)、FSD Public API、BFF。型やモジュール境界で不可能にできるものを、lint・レビュー・手順だけで守らない。

対象版の確認日: 2026-09-12。採用版の tsconfig・Next.js・Zod の docs と差分があれば採用版を正とする。

## TypeScript

Next.js 採用版が生成する tsconfig を起点に、次を足す。

| フラグ | 目的 |
|---|---|
| `strict` | 前提 |
| `noUncheckedIndexedAccess` | 添字アクセスの `undefined` を隠さない |
| `exactOptionalPropertyTypes` | optional と `undefined` 代入を混同しない |
| `verbatimModuleSyntax` | 型だけの import を実行時に残さない |
| `noPropertyAccessFromIndexSignature` | 索引署名へのドットアクセスを防ぐ |
| `noFallthroughCasesInSwitch` | switch のフォールスルーを防ぐ |

## サーバー／クライアント境界

BFF・セッション・秘密情報を扱うモジュールは `import "server-only"` を必須にする。クライアント専用は `"client-only"`。Server Components は自分の Route Handler へ HTTP で往復しない。

秘密情報のクライアント漏出を型とランタイムで防ぎたい場合、採用版の Next.js が対応していれば `experimental.taint` と `experimental_taintObjectReference` / `taintUniqueValue` を選択肢として検討する。未対応なら採用しない。

## 外部入力と Result

境界では `unknown` で受け、Zod（または同等）で検証する。型の出典は `z.infer` のみとし、手書き型との二重定義をしない。

失敗を例外の制御フローにしない。集約・変換は `Result`（成功／失敗の判別可能ユニオン、または同等の Either）で返す。[BFF例](bff-example.md)を参照する。

```ts
type Result<T, E> =
  | { ok: true; value: T }
  | { ok: false; error: E };
```

UI 状態も判別可能ユニオンで表し、成功と空、失敗と部分成功を同じ形に畳まない。

## 網羅性

判別可能ユニオンの `switch` は `default` で `never` チェックを行い、新しい分岐の追加漏れを型エラーにする。ESLint の `switch-exhaustiveness-check`（typescript-eslint）と併用する。

## FSD

別スライスへの依存は下位レイヤーへ向かう。公開 API（`index.ts`）経由で import し、deep import しない。機械検証は Steiger の recommended を CI の関門にする。

## 検証

設定導入後は[負例](../skills/setup-frontend/templates/negative-cases.md)で、型不整合・`any`・server-only 欠落・上位レイヤー import が検出されることを確認する。

[原則: 型](../principles/types.md) / [原則: FSD](../principles/fsd.md) / [概念対応](concepts.md)
