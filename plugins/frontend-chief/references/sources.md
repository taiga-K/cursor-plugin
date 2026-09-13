# 公式資料と更新

確認日: 2026-09-12。リンク先の最新版と、対象アプリのロックファイルの版が一致するとは限らない。版固有の設定は採用版のdocs・型定義・変更履歴で確認する。

| 対象 | 一次資料 | 更新時に確認する内容 |
|---|---|---|
| FSD | [Layers](https://fsd.how/docs/reference/layers/)、[Public API](https://fsd.how/docs/reference/public-api/)、[Next.js](https://fsd.how/docs/guides/tech/with-nextjs/) | 依存規則、例外、Next.jsの配置 |
| Atomic | [Brad Frost原著](https://atomicdesign.bradfrost.com/chapter-2/)、[FSD FAQ](https://fsd.how/docs/get-started/faq/) | 5段階とUIへの適用。独自フォルダ規約と区別 |
| Next.js | [Server/Client](https://nextjs.org/docs/app/getting-started/server-and-client-components)、[BFF](https://nextjs.org/docs/app/guides/backend-for-frontend)、[Data security](https://nextjs.org/docs/app/guides/data-security) | 描画・キャッシュ・認証境界 |
| Astryx | [Working with AI](https://astryx.atmeta.com/docs/working-with-ai)（MCP・agent docs）、[CLI](https://astryx.atmeta.com/docs/cli)、[Core](https://astryx.atmeta.com/docs/core)、[Migration](https://astryx.atmeta.com/docs/migration)、[Tokens](https://astryx.atmeta.com/docs/tokens) | MCPのツール構成、CLIコマンド、API、CSSレイヤー、テーマ、互換性 |
| TypeScript | [TSConfig](https://www.typescriptlang.org/tsconfig/)、[typescript-eslint](https://typescript-eslint.io/) | strict、追加フラグ、strict-type-checked |
| 概念 | [Parse, don't validate](https://lexi-lambda.github.io/blog/2019/11/05/parse-don-t-validate/)、[ROP](https://fsharpforfunandprofit.com/rop/)、[Test Pyramid](https://martinfowler.com/bliki/TestPyramid.html)、[Testing Trophy](https://kentcdodds.com/blog/write-tests)、[ADR](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)、[TDD](https://martinfowler.com/bliki/TestDrivenDevelopment.html) | 独自語を増やす前に既知概念を探す |
| 検証 | [Steiger](https://github.com/feature-sliced/steiger)、[Vitest](https://nextjs.org/docs/app/guides/testing/vitest)、[Playwright](https://playwright.dev/docs/best-practices)、[Playwright a11y](https://playwright.dev/docs/accessibility-testing)、[Storybook Vitest](https://storybook.js.org/docs/writing-tests/integrations/vitest-addon)、[MSW](https://mswjs.io/docs)、[Testing Library](https://testing-library.com/docs/guiding-principles)、[FSD testing](https://feature-sliced.design/blog/frontend-testing-strategy) | 設定形式、RSC制約、locator、ARIA snapshot |
| CI | [GitHub Actions](https://docs.github.com/en/actions)、[pnpm action](https://github.com/pnpm/action-setup)、[Playwright CI](https://playwright.dev/docs/ci)（公式 Action 非推奨） | 公式 Action の版、required checks |
| 状態・境界 | [TanStack Query](https://tanstack.com/query/latest/docs/framework/react/overview)、[Zod](https://zod.dev/) | キャッシュ責任、入力検証 |
| アクセシビリティ | [WCAG 2.2](https://www.w3.org/TR/WCAG22/)、[ARIA APG](https://www.w3.org/WAI/ARIA/apg/) | 成功基準と操作パターン |
| 性能 | [Web Vitals](https://web.dev/articles/vitals) | 実ユーザー計測とラボ計測の違い |

資料が取得できない場合、インストール済みパッケージの型と同梱docsを調べる。それでも不明なAPIは実装を推測せず、未確認として切り出す。CLIの最新版を無条件に実行しない。

更新PRでは変更理由、対象バージョン、影響を受ける原則・手順、例題の再検証結果を記録する。一般原則は版固有のコマンドから分離する。

利用者が参照した [BFFの記事](https://zenn.dev/overflow_offers/articles/20220418-what-is-bff-architecture) は担当範囲を決めた背景資料。NestJSやGraphQLの採用を義務付ける資料として扱わない。

関連：[概念対応](concepts.md) / [テスト戦略](testing-strategy.md) / [型の防護](type-guardrails.md)
