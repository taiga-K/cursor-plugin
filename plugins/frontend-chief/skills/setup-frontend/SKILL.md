---
name: setup-frontend
description: Next.js・FSD・Astryx向けに型・ESLint・Steiger・Vitest・Storybook・Playwright・MSW・GitHub Actionsの検証基盤を導入する。新規導入や検証基盤がない既存案件のセットアップに使用する。
---

# フロントエンド検証基盤の導入

概念：Defense in depth の第二層（静的解析・CI・テスト）。証拠の正本は CI。フックは使わない。

## 入力

対象リポジトリ、パッケージマネージャ（既定 pnpm）、採用している Next.js / TypeScript / Astryx の版、既存の ESLint・テスト・CI。

## 手順

1. 現状を検出する：`package.json`、ロックファイル、`tsconfig`、`eslint.config.*`、テストランナー、`.github/workflows`、Astryx / FSD の有無。
2. [templates/](templates/) を差分統合する。既存設定を丸ごと置換しない。各テンプレート先頭の対象版・確認日を採用版と照合し、差分があれば採用版の公式 docs を正とする。`*.example.*` は参考専用で、Vitest / Playwright / Storybook が実行するパスにはコピーしない（有効化するときは経路を実在ルートに合わせてリネームする）。
3. [package.scripts.md](templates/package.scripts.md) のスクリプトと依存を追加する。`verify` が typecheck → lint → architecture → check-stories → test を直列で実行するようにする。
4. Storybook（`.storybook/`）、MSW（`tests/msw/`）、Playwright（`playwright.config.ts`、`e2e/`）、`src/instrumentation.ts` を配置する。`pnpm exec msw init public --save` でワーカーを生成する。`e2e/*.example.spec.ts` は経路が存在するまで有効化しない（`playwright.config.ts` の `testIgnore` が除外する）。本番で `NEXT_PUBLIC_API_MOCKING` を有効にしない。Next.js 16 なら ESLint を flat import（`eslint-config-next/core-web-vitals`）へ差し替え、FlatCompat は使わない。
5. Astryx 採用なら採用版の agents 初期化コマンドを実行し、生成物を読む。
6. `pnpm exec playwright install chromium` のあと、`pnpm verify` と `pnpm build` を通す。`test` は Vitest の unit と storybook プロジェクトを含む。
7. [negative-cases.md](templates/negative-cases.md) に従い、一時コピーまたは一時ブランチで負例を1件ずつ入れ、対応チェックが落ちることを確認してから戻す。結果を記録する。
8. `.github/workflows/frontend-verify.yml` と `dependabot.yml` を置く。workflow 内の pnpm `version:` は `package.json` の `packageManager` と二重指定しない（`packageManager` があるなら `version:` を外す）。CodeQL / dependency-review / Chromatic は任意。利用者に required checks への登録手順を案内する（権限操作はしない）。
9. 導入報告：追加差分、未導入と理由、負例結果、CI ワークフローの有無。

## 出力

導入したファイル一覧、`verify` / `build` の結果、負例確認表、CI 設定と required checks の案内。[共通形式](../../references/output-contracts.md)を使う。

## 情報不足

既存 Jest 等がある場合は置換せず共存条件を設計する。版がテンプレートと大きく異なる場合は公式既定を起点に必要な差分だけ移植する。

## 完了条件

`pnpm verify` と `pnpm build` が通り、負例が検出され、CI ワークフローがリポジトリにあり、required checks の登録方法を利用者が実行できる。
