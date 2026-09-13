---
name: setup-backend
description: 新規Go・Ginバックエンドの構成と検証基盤を導入する。既存案件への標準導入にも使用する。クラウド基盤の構築は対象外。
---

# バックエンドの構築と検証基盤導入

## 入力

対象リポジトリ、新規/既存、業務の最小ユースケース、DBの選択。

## 手順

1. 既存の指示、変更、module、契約、CI、起動・検証方法を調べる。Go/Gin/DB/ドライバの採用版は依存定義や接続設定から確認する。追加の設計判断は[共通形式](../../references/output-contracts.md)に従い、既存のREADMEや設計記録へ必要な分だけ残す。
2. [DB選択](../../references/database-selection.md)から一つまたは指定された組合せを選ぶ。NoSQLは製品と能力を確定する。DB未決なら独立な業務モデルを先に進める。
3. [design-backend](../design-backend/SKILL.md)で最小の業務経路を設計する。[構成](../../references/architecture.md)の責務を実際のpackageへ対応させ、必要な構成と依存を決める。
4. [implement-backend](../implement-backend/SKILL.md)でDomain→Application→選択DB→Ginを一経路接続し、API・ログ・起動と終了・設定を実装する。DB不要の経路に形だけRepositoryを作らない。
5. [検証戦略](../../references/testing.md)に従い、既存のテスト・Makefile・CIを再利用し、不足する検査だけを実装する。依存検査は実際のpackage構造と既存ツールから設計し、一時的な負例で禁止依存を検出できることを確認する。起動・操作・期待結果・証拠の保存・後片付けは、対象の実行経路で使える手順にして既存の検証手順へ反映する。
6. [verify-backend](../verify-backend/SKILL.md)で作成・変更した検証手順を一度実行する。自分で起動したプロセスと一時データを後片付けし、証拠が残ることを確認する。必要な接続・終了・観測の条件を[インフラ契約](../../references/infrastructure-handoff.md)へ渡す。

## 出力

実装された最小業務経路、採用技術と設計判断、対象に合う検証手順と実行証拠、基盤への要求。[共通形式](../../references/output-contracts.md)に従い、必要な情報を対象の管理方法で残す。

## 情報不足

業務要件がない場合は利用者の用途を確認する。サンプルの注文ドメインを利用者の要件として導入しない。外部基盤がない場合の未実行項目を分ける。

## 完了条件

実装と検証方法が再現可能。必要な接続条件と未充足事項が明らかになる。
