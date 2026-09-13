# 検証の選び方と設定

概念：[Testing Trophy](concepts.md)、ミューテーション（負例で検出確認）、Definition of Done。種別の決定は[テスト戦略](testing-strategy.md)を正本とする。設定の実体は[setup-frontend/templates](../skills/setup-frontend/templates/)にある。

## 変更と証拠

[テスト戦略の決定表](testing-strategy.md)に従う。要約：

| 対象 | 最小の証拠 | 補う確認 |
|---|---|---|
| 型・公開API | tsc、呼出し元 | 実行時の外部入力 |
| FSD配置 | Steiger | 規則外の責務判断 |
| 変換・BFF | 必須/任意失敗を含む単体（MSW） | 実サービス、認証、HTTP入口 |
| UI部品（shared/ui・organisms以上） | Storybook story + play + a11y | 実画面でのキーボード |
| feature統合 | Testing Library + MSW | — |
| 非同期RSC・認証画面 | Playwright E2E | ARIA snapshot、axe |
| 見た目が要件 | `toHaveScreenshot`（CI Linuxのみ） | Chromatic（任意・無料枠） |
| 性能 | 同条件の変更前後計測 | 本番の実ユーザー指標 |

完了の証拠の正本は CI の実行 URL。ローカルの `pnpm verify` は同じスクリプトを呼ぶ。

## 設定の適用

[setup-frontend](../skills/setup-frontend/SKILL.md) で templates を差分統合する。既存設定や package.json を置換しない。版追従は[update-frontend](../skills/update-frontend/SKILL.md)。

| ツール | 起点 | プラグインとして足す差分 |
|---|---|---|
| TypeScript | Next.js採用版のtsconfig | [tsconfig.strict-fragment.json](../skills/setup-frontend/templates/tsconfig.strict-fragment.json) |
| ESLint | eslint-config-next | [eslint.config.mjs](../skills/setup-frontend/templates/eslint.config.mjs) |
| Steiger | recommended | [steiger.config.ts](../skills/setup-frontend/templates/steiger.config.ts)。移行例外は狭いパスへ理由付き |
| Vitest + Storybook | unit / storybook projects | [vitest.config.ts](../skills/setup-frontend/templates/vitest.config.ts)、`.storybook/` |
| MSW | handlers 共有 | `tests/msw/` + instrumentation（E2Eのみ） |
| Playwright | build済みを起動 | [playwright.config.ts](../skills/setup-frontend/templates/playwright.config.ts) |
| story必須検査 | プラグイン固有 | [check-stories.mjs](../skills/setup-frontend/templates/scripts/check-stories.mjs) |

## 正例と負例

導入・変更後は正常コードが通ることと、[負例](../skills/setup-frontend/templates/negative-cases.md)が検出されることの両方を確認する。元ソースに違反を残さない。

## CI

[frontend-verify.yml](../skills/setup-frontend/templates/.github/workflows/frontend-verify.yml) を使う。公式 Action のみ（`actions/checkout`、`actions/setup-node`、`actions/upload-artifact`、`pnpm/action-setup`）。Playwright の公式 Action は非推奨のため、`pnpm exec playwright install --with-deps chromium` をステップで実行する。Dependabot で npm と github-actions を更新する。

失敗を許す設定を標準にしない。移行中の既存違反は対象パス・理由・解消条件を記録し、新規違反と区別する。認証cookieや顧客データを含む成果物を公開しない。再試行で通った不安定なテストを通常成功と同一視しない。

## 限界と報告

リンク検証や例題の経路確認は、エージェントが同じ判断を再現することを保証しない。モックやjsdomの成功を Astryx や実APIの成功としない。

MSW の instrumentation は起動時1回。ハンドラ変更のホットリロードには制限がある。本番ビルドでモックを有効にしない。

結果は[共通形式](output-contracts.md)を使い、未実行の理由と残る確認、CI URL を記載する。
