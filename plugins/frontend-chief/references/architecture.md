# 責務と配置

公式の根拠は [FSDのNext.jsガイド](https://fsd.how/docs/guides/tech/with-nextjs/) と [FSDのレイヤー](https://fsd.how/docs/reference/layers/)。以下の分類フォルダと命名は本プラグインの推奨。既存案件では移行単位を決めて適用する。

## Next.jsとFSD

```text
app/                         Next.jsのルーティング入口
  layout.tsx
  orders/page.tsx
  api/orders/route.ts
src/
  _app/                      FSD App
    providers/
    api-routes/              HTTPへの変換・入口の合成
  _pages/
    orders/
      api/                   この画面向けの取得・集約
      model/                 画面状態・表示用型
      ui/
        templates/           内容構造が必要な場合
        pages/               実際の内容を使う画面
      index.server.ts        サーバー専用の公開入口
  widgets/                   独立したUI領域が必要な場合
  features/                  再利用するユーザー操作
  entities/                  アプリが扱う業務概念
  shared/
    api/                     共通HTTP基盤
    ui/                      業務ロジックを含まないUI基盤
    lib/                     用途ごとの独立した関数群
```

全レイヤーを最初に作らない。FSDの_appと_pagesはNext.jsの予約名との衝突を避ける。ルートのappはルーティング境界として薄くし、画面とBFFの処理をFSD側へ接続する。Next.js固有のlayout、metadata、loading、errorはフレームワーク上の責務を保つ。

レイヤー方向は_app → _pages → widgets → features → entities → shared。別スライスへの依存は下位へ向かう。AppとSharedはセグメント間を参照できる。Entitiesの@xは公式の限定的な相互関係の公開方法であり、全レイヤーのcross-importを許す規約にはしない。

同一スライス内部は相対import、外部は公開APIを推奨する。index.tsにサーバー専用とクライアント利用可能なexportを混ぜない。必要ならindex.server.tsを公開し、サーバー専用実装にserver-onlyを付ける。クライアントから読み込める型は型専用の依存として分ける。全体を再exportする巨大なbarrelは作らない。

## UIの所有先

Atomicの分類はFSDの内部。atomsがshared、organismsがwidgetsという対応はしない。uiに必要な分類だけ作り、templatesとpagesの考え方も設計・実画面で扱う。AtomicのpagesはNext.js Pages Routerとは別概念。

shared/uiには業務ロジックを持たない部品。注文の表示はentities/order/ui、再注文操作は必要に応じfeatures/reorder/ui、複数の操作をまとめる画面は_pages/orders/uiが所有する。単一ページだけに必要な処理を無理にfeatureへ抽出しない。

共通レイアウトは業務文脈がなければshared/ui、ページ固有ならそのpage、ルート全体への適用はApp側で組み立てる。サイズが大きいという理由だけでは所有先を決めない。

## BFFの配置

- 共通通信・固定した接続先・共通エラー分類はshared/api。
- サービスの注文DTOと変換はentities/order/api。画面専用の集約は_pages/orders/api。
- 複数画面で再利用する集約は、その結果が表すentity・操作などの責務を確認して配置する。新しいbffレイヤーを追加しない。
- HTTP入口は_app/api-routesから下位の集約を呼び、HTTP status・headers・公開レスポンスへ変換する。
- Server Componentsは同じサーバー関数を呼ぶ。自分自身のHTTP入口をfetchしない。

業務トランザクションや複数サービスにまたがる業務確定をBFFで実装しない。サービス数とFSDのスライス数は独立。公開API契約を変える場合は [成果物形式](output-contracts.md)で互換性を記録する。
