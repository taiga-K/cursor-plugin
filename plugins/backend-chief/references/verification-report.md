# 作成時の検証記録

日付：2026-09-13。対象：backend-chief 0.1.0。環境：macOS arm64、Node.js 24.3.0、Python 3とPyYAML。以下は修正後の配布物の検証記録。

## 実行した検証

| 検証 | 結果・範囲 |
|---|---|
| リポジトリのvalidate-template.mjs | 成功。Cursor manifest、marketplace、frontmatter、配布先を確認 |
| backend-chiefのvalidate-content.ts | 成功。ローカルリンク、スキル名、入口からの到達性 |
| backend-chiefのvalidate-content.test.ts | 5テスト成功。正常、欠損リンク、範囲外リンク、孤立スキル、frontmatter欠損 |
| skill-creatorのquick_validate.py | 全12スキル成功 |
| 既存frontend-chiefのvalidatorとテスト | 成功。5テスト。既存プラグイン本文の変更なし |
| git diff --check | 成功 |

hooks/MCPがないというリポジトリvalidatorの警告は、任意コンポーネントを同梱していないためのもの。案件側の依存検査は、[構成例](architecture.md)の責務を実際のpackageへ対応させて必要な検査を実装・検証する手順として記載している。

## 文書の机上確認

[シナリオ](../evals/scenarios.md)の経路と、必要な判断が参照先へ到達することを確認した。特に、NoSQL未選択時の製品確認、MySQL/PostgreSQL間の移行、同期APIのtimeout規約、インフラへの責務分離、実DB未実行の報告を確認した。修正では、既存の配置・記録・検査を調査し、不足するものだけを作る経路と、検証後の後片付け・証拠保持を確認した。これはモデルにシナリオを実行させた評価ではない。

指定のログ・APIガイドラインと製品公式資料を参照し、[sources](sources.md)へ記録した。ログの時間単位には原資料内の差異があるため、[採用判断](logging.md)を明示した。

## 未実行

- Cursor上でのインストール・スキル検出・実際の対話実行。
- 各シナリオによるアプリ生成とGo/Ginの実行。
- PostgreSQL、MySQL、MongoDB、Redis等の実DBへの接続とintegration test。
- クラウド基盤の構築・配備。本プラグインの対象外。

本成果物は開発手順・判断原則・検証支援を配布するプラグインであり、全DBを接続済みのバックエンドアプリではない。実案件の成果物は[検証戦略](testing.md)に従って別途検証する。
