# Frontend Chief

TypeScript・Next.js App Router・FSD・Atomic Design・Astryxを採用するフロントエンド向けCursorプラグイン。画面とNext.js内のBFFを対象とし、チーフエンジニアの判断を、理由・例外・検証まで追える形で共有する。

防護の優先順位（Defense in depth / Shift-left）：

1. 型とアーキテクチャで不正を不可能にする
2. 静的解析・CI・テストで検出する（証拠の正本は CI）
3. スキルとルールで手順を固定する
4. 人間のプロンプトは最後の手段

フックで lint/test を代替しない。独自概念は作らず、[概念対応表](references/concepts.md)の確立された概念名を使う。

## 使い方

Cursorでこのプラグインを読み込んだ環境では /frontend-chief に依頼する。専門スキルは個別にも利用できる。導入・公開操作はこのリポジトリの作成作業には含まれない。

| 依頼例 | 手順 |
|---|---|
| 「新規の管理画面をこの標準で始めたい」 | [新規導入](skills/frontend-chief/playbooks/new-project.md) |
| 「注文履歴に絞り込みを追加」 | [機能追加](skills/frontend-chief/playbooks/feature.md) |
| 「Astryxで検索フォームを作りたい」 | [UI部品追加](skills/frontend-chief/playbooks/ui-component.md) |
| 「戻る操作で条件が消える」 | [バグ修正](skills/frontend-chief/playbooks/bug-fix.md)（TDD） |
| 「この差分をレビュー」 | [レビュー](skills/frontend-chief/playbooks/review.md) |
| 「既存UIをAstryxへ移行」 | [段階移行](skills/frontend-chief/playbooks/migration.md) |
| 「検証基盤を入れたい」 | [setup-frontend](skills/setup-frontend/SKILL.md) |
| 「検証基盤を更新したい」 | [update-frontend](skills/update-frontend/SKILL.md) |

入口は [frontend-chief](skills/frontend-chief/SKILL.md)。詳細は必要なときだけ読む。常駐ルール、モデル固定、外部プラグイン、フック、並列エージェントは必須にしない。

## Astryx MCP

プラグインは [Astryx公式のMCPサーバー](https://astryx.atmeta.com/docs/working-with-ai)（`https://astryx.atmeta.com/mcp`）を `mcp.json` で同梱する。追加設定なしで `search(query)` と `get(name)` が使え、UI部品の[選定手順](references/astryx.md)はこれを前提にする。エージェントは記憶から部品名や props を書かず、要件を役割・状態・操作で書いて候補を探し、比較して選び、選定理由を設計に残す。

MCPはホスト側の最新資料を返すため、選んだ部品のAPIは採用版のCLI（`@astryxdesign/cli`）か型定義で確定する。差があれば採用版を正とする。MCPが使えない環境ではCLIの `search` と `component --list` で同じ手順を行う。検索語には案件固有の機密を含めない。

## 標準と既存案件

新規は標準を使う。既存案件では構成・契約・検証の現状を調べ、変更対象と移行単位を決める。局所的な修正を全体移行へ拡大しない。バックエンドサービスの業務ルール・DB・最終認可は別プラグインの責務。

文書は「公式」「推奨」「案件判断」を区別する。Atomic Designの5段階を採用し、必要な分類フォルダだけ作るのは本プラグインの推奨規約。[原則索引](principles/index.md)に適用条件と関連手順をまとめる。

## 文書と出力

- [概念対応表](references/concepts.md)：独自語を作らないための一般概念への対応
- [型の防護](references/type-guardrails.md)：tsconfig・server-only・Result・z.infer
- [テスト戦略](references/testing-strategy.md)：Trophy / Pyramid に基づく決定表、TDD、Storybook / E2E 規約
- [構成と配置例](references/architecture.md)：FSD、Next.js、Atomic、BFFの境界
- [技術選定表](references/tooling.md)：導入条件と既存構成を維持する条件
- [成果物の形式](references/output-contracts.md)：調査、設計、レビュー、検証、移行
- [Astryx選定と確認手順](references/astryx.md)：MCPによる部品探索・比較、採用版の確認、CSS・テーマの検証
- [検証ガイド](references/verification.md)：CI が証拠、負例、MSW、templates への参照
- [BFFの部分失敗の例](references/bff-example.md)：Result、集約、HTTP入口
- [例題と評価基準](evals/scenarios.md)：9種類の依頼を追跡する評価
- [公式資料と更新方針](references/sources.md)

## リポジトリでの検証

Node.js 22.18以上。リポジトリルートで実行する。

```sh
node scripts/validate-template.mjs
node plugins/frontend-chief/scripts/validate-content.ts
node --test plugins/frontend-chief/scripts/validate-content.test.ts
```

frontmatter、ローカル参照、入口からのスキル到達性を確認する。文書を変更したら実行し、[例題](evals/scenarios.md)の経路を読み直す。

pstackから構成の考え方を参考にした。本文はこのプラグイン向けに記述しており、pstackのモデル・権限・外部依存の設定を要求しない。
