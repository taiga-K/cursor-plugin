# 負例（ミューテーション）セット

設定導入後、一時コピーまたは一時ブランチに次を1件ずつ入れ、対応するチェックが落ちることを確認してから元に戻す。本番ソースに違反を残さない。

| 負例 | 入れ方 | 落ちるべきチェック |
|---|---|---|
| 型不整合 | 必須 props を欠いた呼出し | `pnpm typecheck` |
| `any` | 公開関数の引数を `any` にする | `pnpm lint`（`no-explicit-any`） |
| 上位レイヤー import | `entities` から `features` を import（`@/` エイリアス可） | `pnpm architecture`（Steiger） |
| 公開 API 迂回 | スライス内部ファイルを deep import | `pnpm architecture` |
| DOM への `style` | `<div style={{ color: "red" }} />` | `pnpm lint`（`react/forbid-dom-props`） |
| パッケージ直下 import | `import { Button } from "@astryxdesign/core"` | `pnpm lint`（`no-restricted-imports`） |
| 未処理 MSW リクエスト | ハンドラにない URL を fetch | `pnpm test`（`onUnhandledRequest: "error"`） |
| a11y 違反 | label のない input を story に置く | `pnpm test`（Storybook a11y、`parameters.a11y.test=error`） |
| story 欠落 | organisms の `.tsx` から `.stories.tsx` を外す | `pnpm check-stories` |

確認日: 2026-09-12。採用版でルール名や診断メッセージが異なる場合は、落ちたコマンドとメッセージを導入報告に残す。
