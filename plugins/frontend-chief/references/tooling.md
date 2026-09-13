# 推奨技術と導入条件

採用はpackage.jsonとロックを確認して判断する。ここでの推奨は全依存の自動追加を意味しない。既存案件では同じ責務を満たす技術を維持できる。

| 領域 | 起点・候補 | 導入条件 | 既存を維持する条件 |
|---|---|---|---|
| 言語 | TypeScript strict | 新規の基本方針 | 既存のstrict化は対象範囲を分ける |
| フレームワーク | Next.js App Router | 新規の標準 | Pages Router等は別途移行範囲を決める |
| UI | Astryx | 採用版の部品・CSS基盤を確認後 | 移行中の旧UIは撤去条件を持つ |
| UI部品の探索 | Astryx MCP（プラグイン同梱、`search`／`get`） | 部品の選定・比較。実装前に[選定手順](astryx.md)で使う | 使えない環境ではCLIの `search`・`component --list` |
| UI部品の採用版確認 | Astryx CLI（`@astryxdesign/cli`）、`init --features agents` の生成物 | 選んだ部品のimport path・propsを採用版で確定 | 型定義や同梱docsで同じ確認ができる |
| スタイル | Astryxの正式な拡張方法とトークン | 部品APIで表現できないレイアウト等 | CSS Modules等はレイヤー・トークンを整合させ共存可 |
| 一時UI | Reactのstate/reducer | 最も近い所有者へ置く | 専用storeに実際の共有責任がある |
| サーバー状態 | RSCの取得、必要ならTanStack Query | クライアントの再取得・キャッシュ・楽観更新が必要 | SWR等が同じ責任を果たし二重管理がない |
| URL | Next.jsのparams/searchParams | 共有・履歴・再読込で再現すべき状態 | 既存URL補助ライブラリが契約を保つ |
| フォーム | HTMLとReact/Next.jsの標準機構 | まず単純な入力と送信 | 動的フィールド等の複雑性を既存ライブラリが解決する |
| 外部入力 | 境界検証、候補はZod | 複数入力でスキーマの再利用・型推論が必要 | 同等の実行時検証がある |
| API型 | サービスの正式契約 | OpenAPI/GraphQL等、実際の契約から生成 | 既存生成系が契約と同期する |
| 静的検証 | tsc、ESLint、Steiger | 型・Next.js・FSDの機械的検証。設定は[setup-frontend](../skills/setup-frontend/SKILL.md) | 同等のルールと負例検出を証明できる |
| 単体・story | Vitest、Testing Library、Storybook（Vitest addon、a11y） | 変換・状態・操作・部品状態の回帰。[テスト戦略](testing-strategy.md) | Jest等が同じ振る舞いを検証する |
| APIモック | MSW（Vitest node / Playwright instrumentation） | 上流の成功・空・失敗・部分失敗を差し替える | 同等の契約モックがある |
| ブラウザ | Playwright（ARIA snapshot、axe、CI限定screenshot） | UI操作、非同期RSC、実環境の検証 | 既存E2E基盤が必要な操作面を扱える |
| CI | GitHub Actions（公式 Action + pnpm/action-setup） | `verify` と e2e を required checks に | 同等の関門とログが残る |
| 依存更新 | Dependabot（npm、github-actions） | 週次。更新PRは verify を通す | 既存の更新ボットが同等 |
| 任意 | CodeQL、dependency-review、Chromatic（無料枠） | セキュリティ／視覚回帰が必要な場合 | — |
| 任意（FSD ESLint） | flat config 対応の個人保守プラグイン | Steiger を関門にした上での補助 | 公式 eslintrc 時代の config に依存しない |

バージョンの最新追従を採用理由にしない。型定義・フレームワーク・ビルド・テスト環境の互換性を確認し、ロックする。

新ライブラリの判断には、解決する問題、標準APIで足りない理由、bundle・保守・学習コスト、導入しない場合、撤去条件を記録する。[一次資料](sources.md)と[概念対応](concepts.md)を参照する。フックで lint/test を代替しない。完了の証拠は CI。
