# DBの選択と併用

利用者がPostgreSQL・MySQL・NoSQLを選択する。未指定なら既存の依存・設定・DDLを調べる。新規で選定が必要なら、アクセスパターンと整合性を比較し、選択を利用者へ提案する。未選択のDBを勝手に導入しない。

| 選択 | 専用手順 | 設計の焦点 |
|---|---|---|
| PostgreSQL | [postgresql-backend](../skills/postgresql-backend/SKILL.md) / [詳細](databases/postgresql.md) | 制約、MVCC、競合、索引、SQL方言 |
| MySQL | [mysql-backend](../skills/mysql-backend/SKILL.md) / [詳細](databases/mysql.md) | InnoDB、分離レベル、ロック範囲、照合順序、DDL |
| NoSQL | [nosql-backend](../skills/nosql-backend/SKILL.md) / [選定と能力表](databases/nosql.md) | 製品確定、アクセスパターン、原子単位、整合性、分割キー |

## 案件へ保存する内容

製品・版・ドライバ版・接続方式、索引、移行とテストのコマンドは、既存の依存定義・接続設定・migration・検証手順から確認し、変更した正本を更新する。コンテキスト→ストアの対応、正本/キャッシュ/投影の区別、トランザクション・一意性・読取整合性などの判断は、既存の設計記録へ残す。資格情報の実値を書かない。

## 選択肢の比較

複数レコードの強い整合性、JOINや柔軟な検索が重要ならRDBを比較する。自然な集約を一つのドキュメントへ保持できるならドキュメントDBを比較する。キーによる低遅延アクセスや期限付きデータならKVSを比較する。これは製品選択の判断材料であり、RDBが常に正解、NoSQLが常に高速という意味ではない。

GoのDBアクセスは、PostgreSQLではpgxまたはdatabase/sql、MySQLではdatabase/sqlと対応ドライバを候補とする。SQLを正本にする場合はsqlcを検討できる。採用版の対応方言・型・生成機能を確認する。既存のGORM/Ent等は移行利益がない限り維持し、モデルをDomainから分離する。

## 複数DBと切替

DBを使い分けることと、環境変数だけで透過的に切り替えられることは別の要件。選択したAdapterだけを起動時に接続する。データの正本は一つに定め、別DBへの投影は遅延・失敗・再構築を契約化する。DB間のdual writeを原子的とみなさない。

切替依頼は[migrate-backend](../skills/migrate-backend/SKILL.md)へ進み、型・NULL・ソート・精度・制約・原子性の差、変換、整合性検証、切替点、旧系へ戻す可否を設計する。複数Adapterを維持する要件なら、同じ業務契約テストを各実DBで走らせる。
