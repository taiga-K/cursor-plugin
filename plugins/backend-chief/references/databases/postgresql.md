# PostgreSQLプロファイル

## 入力と選定

採用版、pgx/database/sql/ORM、スキーマ、拡張、接続pool、実際の分離レベルを確認する。新規の候補はpgx、明示SQLの生成にはsqlc。どちらも指定必須ではない。poolの最大数とアプリのインスタンス数の関係はインフラへ引き渡す。

## 実装手順

1. 集約とアクセスパターンからPK・FK・unique・check・NOT NULLを定義する。tenantごとの一意性ならtenantを制約に含める。
2. 値はbind parameterへ渡す。列名・sortは許可リスト。JSONBを利用してもschemaと検索要件の設計を省かない。
3. 読み書きに応じて分離レベルを選び実際の設定を記録する。PostgreSQLの標準既定はRead Committedで、同一取引でも文ごとに見える状態が変わり得る。Repeatable Read/Serializableでも再試行経路を設計する。[公式](https://www.postgresql.org/docs/current/transaction-iso.html)
4. 制約違反はドライバの型とSQLSTATEで分類する。既知の業務制約だけをConflict等へ変換し、全てのDBエラーを409にしない。deadlock/serialization failureの再試行は取引全体を対象にする。
5. 検索条件とORDER BYに対応した索引を代表データ量でEXPLAINする。EXPLAIN ANALYZEは実行するため、書込SQLでは使い捨てデータか適切な検証環境を使う。

## 条件付き更新の例

以下は注文集約のヘッダー更新の抜粋。認可済みtenantとIDを使う。子データ更新がある場合も同じ取引でヘッダーのversionを更新する。

```sql
UPDATE orders
SET status = $1, version = version + 1
WHERE tenant_id = $2 AND id = $3 AND version = $4
RETURNING version;
```

返却行なしを検知する。不存在・他tenant・版競合の応答区別は認可とAPI契約で決め、存在情報を漏らさない。事前SELECTだけで競合を防いだつもりにならない。

## 移行と検証

選んだmigration toolで順序・checksum・多重適用防止を管理する。DDLを一律にtransactionで囲めるとは限らないため、採用版で各文の対応を確認する。索引追加のロック影響も調べる。本番適用は別責務。

実DBで制約、rollback、同時更新、serialization failure時の取引再実行、contextキャンセル、金額・日時・NULLの往復を確認する。ユニットテストのmockはこれらの代用にしない。

[整合性原則](../../principles/consistency.md) / [テスト](../testing.md) / [DB選択](../database-selection.md)
