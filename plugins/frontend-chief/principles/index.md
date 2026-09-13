# 原則索引

目的に関わる行を選び、本文を読んでから適用する。「公式」は資料の定義、「推奨」はこのプラグインの規約、「案件判断」は利用者・プロダクトの制約で決める事項。

| 原則 | 読む場面 |
|---|---|
| [目的と意思決定](outcomes.md) | 要件整理・設計・レビュー |
| [責務・依存・公開API](fsd.md) | 配置決定・機能分割・リファクタリング |
| [型と外部入力の境界](types.md) | API・URL・ストレージ・フォーム・状態設計 |
| [Atomic Designと合成](atomic.md) | UI部品の新設・抽出・分類 |
| [Astryxとデザインシステム](astryx.md) | UI実装・テーマ変更・既存CSS移行 |
| [描画・状態・キャッシュ](next-state.md) | Next.js画面・検索・フォーム・データ更新 |
| [BFFとマイクロサービス](bff.md) | 画面向けAPI・データ集約・API契約変更 |
| [認証・認可・秘密情報](security.md) | BFF・認証・外部入力・HTML表示 |
| [アクセシビリティと画面状態](experience.md) | 画面実装・フォーム・ダイアログ・レビュー |
| [コンテンツ・国際化・SEO](content.md) | 公開ページ・日時・金額・複数言語・動的コンテンツ |
| [性能と観測](performance.md) | 遅延・大規模一覧・依存追加・運用 |
| [振る舞いと完了の証拠](verification.md) | 実装・バグ修正・レビュー・完了報告 |
| [変更コスト・移行・保守](evolution.md) | 標準導入・依存更新・技術負債・障害後の改善 |

原則は多数決や機械的な優先順位で選ばない。衝突する場合は利用者への影響、契約、実行可能な代替案を[設計結果](../references/output-contracts.md)に残す。公式の必須規則と任意の好みを同じ強さで指摘しない。

用語は[概念対応表](../references/concepts.md)の確立された概念名を使い、独自語を増やさない。型・境界の機械化は[型の防護](../references/type-guardrails.md)、テスト種別は[テスト戦略](../references/testing-strategy.md)、導入は[setup-frontend](../skills/setup-frontend/SKILL.md)。
