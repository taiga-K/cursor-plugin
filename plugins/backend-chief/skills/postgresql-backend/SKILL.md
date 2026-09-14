---
name: postgresql-backend
description: PostgreSQLを選んだGoバックエンドの永続化を設計・実装・レビューする。SQLSTATE・MVCC・条件付き更新・RETURNING・索引を扱う。DBサーバーの構築は対象外。
---

# PostgreSQLによる永続化

## 入力

業務操作、選択したDB、採用版、アクセスパターン、設計/実装/レビューの作業種別。

## 手順

1. [DB選択](../../references/database-selection.md)で利用者の選択を確認し、[PostgreSQL専用資料](../../references/databases/postgresql.md)を読む。未採用DBを同時導入しない。
2. 既存の製品・版・ドライバ・schema・索引・実行環境を調べ、既存の設定・設計記録に実際の能力を記録する。
3. 専用資料の手順でSQLSTATE・MVCC・条件付き更新・RETURNING・索引を確認し、[整合性](../../principles/consistency.md)を保証する具体的な操作を設計する。
4. 実装依頼ならAdapterと移行コード、実DBテストを作る。レビュー依頼なら同じ観点で差分と証拠を評価し、勝手に変更しない。
5. [テスト戦略](../../references/testing.md)で並行性・制約・失敗・型変換を検証する。結果を[検証スキル](../verify-backend/SKILL.md)へ渡す。

## 出力

選択DBの能力、schema/索引、業務portとAdapterまたは指摘、取引・移行・検証結果。 [共通形式](../../references/output-contracts.md)に従う。

## 情報不足

製品固有のAPIや整合性が不明なら公式資料と採用版を調べる。実DB未実行を明記する。

## 完了条件

選択したDBの実際の能力に設計が対応し、依頼種別に合う成果物と検証限界が示される。
