# テスト戦略（第二層の設計）

概念：[Testing Trophy](concepts.md)、[Test Pyramid](concepts.md)、Testing Library 指針、FSD のテスト配置、TDD、BDD の Given-When-Then。

根拠にする資料（確認日 2026-09-12）：

- Kent C. Dodds Testing Trophy（静的 → 単体 → 統合を厚く → E2E は薄く）
- Martin Fowler Test Pyramid（E2E は脆く高価、数を絞る）
- Testing Library：「利用者が使う方法に近いほど信頼できる」
- FSD 公式ブログのテスト戦略（`shared`/`entities` に単体、`features` に統合、E2E は `src` の外）
- Next.js：非同期 Server Components は単体で描画せず E2E で確認
- Playwright：role ベースの locator、ARIA snapshot、axe、`toHaveScreenshot`
- Storybook：story を仕様と自動テストの単一の出典にする（Vitest addon）

## 変更の種類 → テスト種別

必要な信頼を得られる最も低い層を選ぶ。

| 変更 | 選ぶ層 | 手段 |
|---|---|---|
| 純粋な変換・BFF 集約・型境界 | 単体 | Vitest。MSW で上流の成功・空・失敗・不正応答・部分失敗を差し替える |
| `shared/ui` と各スライスの organisms 以上 | 部品（story） | Storybook。状態（初期・読み込み・空・エラー・無効・部分成功）を story で網羅。`play` で操作、`addon-a11y` で WCAG 2.2 A/AA。Vitest addon で CI 実行 |
| 状態・URL・フォームを含む feature | 統合 | Testing Library + MSW。実装内部ではなく操作と表示で書く |
| 非同期 RSC、Route Handler、認証・キャッシュを含む画面 | E2E | Playwright。build 済みアプリと MSW（instrumentation） |
| ページ全体の構造・a11y | E2E | `toMatchAriaSnapshot` と `@axe-core/playwright`（`wcag2a`/`wcag2aa`/`wcag21a`/`wcag21aa`/`wcag22aa`）。生 DOM snapshot は使わない |
| 見た目が要件の画面 | E2E（CI 限定） | `toHaveScreenshot`。Linux CI だけを基準、`mask`、`animations: "disabled"`。ローカル OS の基準画像をコミットしない |

## E2E 規約

- PR ごとのスモーク：業務上重要な旅程 3〜10 本、認証・権限・ルーティング整合の各 1 本。広い回帰は nightly。
- locator は `getByRole` / `getByLabel` を優先。CSS セレクタや `data-testid` は最後の手段として理由を書く。
- `retries` は CI で 1。再試行で通ったものは不安定として記録し、通常成功と同一視しない。
- trace は失敗時のみ保存。
- MSW シナリオは環境変数か専用ヘッダで切り替え、テスト間で状態を共有しない。本番ビルドでモックを有効にしない。

## FSD / Atomic への配置

| テスト | 置き場所 |
|---|---|
| 単体 | 対象セグメントの隣（`model/summary.test.ts`） |
| story | 部品の隣（`ui/organisms/orders-list.stories.tsx`） |
| 統合 | スライスの `__tests__` か隣接 |
| E2E | `e2e/`（`src` の外） |

`shared/ui` と `**/ui/organisms/**`（および templates / pages 相当）の `.tsx` には対応する `.stories.tsx` を必須とする。機械検査は `scripts/check-stories.mjs`（プラグイン固有の規約）。

## 書かないもの

- 実装詳細（内部 state、関数の呼び出し回数）への断定
- 全 DOM の snapshot 固定
- モックだけで通る「実 API 確認済み」の報告
- テストを通すためだけの期待値・設定の緩和

## バグ修正と TDD

バグは失敗する回帰テストから始める（Red → Green → Refactor）。テスト種別はこの決定表で最も低い層を選ぶ。失敗テストが現実的でない場合は理由を明記し、最も近い実行可能な回帰確認へ切り替える。黙って省略しない。

機能追加では受入条件を Given-When-Then で先に story の `play`・統合・E2E として書くことを推奨する。強制はバグ修正のみ。

## 証拠

完了の証拠は CI の実行 URL とする。ローカルの `pnpm verify` は同じスクリプトを呼ぶが、報告の正本は CI。[検証ガイド](verification.md) / [概念対応](concepts.md) / [原則: 検証](../principles/verification.md)
