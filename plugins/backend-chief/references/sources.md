# 一次資料と更新方針

確認日：2026-09-13。以下は参照先であり、全ツールを導入する指定ではない。動的なlatest/currentページの内容を全採用版へ適用せず、実装時に対象の版と照合する。

| 資料 | 用途 |
|---|---|
| [Futureログ設計](https://future-architect.github.io/arch-guidelines/documents/forLog/log_guidelines.html) | 指定標準。JSON、レベル、キー、アクセスログ、メッセージ管理 |
| [Future Web API設計](https://future-architect.github.io/arch-guidelines/documents/forWebAPI/web_api_guidelines.html) | 指定標準。契約、排他、エラー、キャンセル、機能配置 |
| [DDD Reference / Eric Evans](https://www.domainlanguage.com/ddd/reference/) | ユビキタス言語、コンテキスト、モデルの概念 |
| [The Clean Architecture / Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) | ソース依存の方向と境界 |
| [Effective Go](https://go.dev/doc/effective_go) | Goの基礎規約。現代の全機能を網羅する資料ではない |
| [Go transactions](https://go.dev/doc/database/execute-transactions) | sql.Txと取引の実行 |
| [slog](https://pkg.go.dev/log/slog) | 構造化ログとHandler |
| [Gin](https://gin-gonic.com/en/docs/) | router、binding、middleware、採用版API |
| [PostgreSQL isolation](https://www.postgresql.org/docs/current/transaction-iso.html) | 分離レベル、再試行 |
| [sqlcとpgx](https://docs.sqlc.dev/en/v1.31.1/guides/using-go-and-pgx.html) | SQLからGoへの生成例。導入版の資料を再確認 |
| [MySQL isolation](https://dev.mysql.com/doc/refman/8.4/en/innodb-transaction-isolation-levels.html) | InnoDBの読み取りとロック |
| [MySQL implicit commit](https://dev.mysql.com/doc/refman/8.4/en/implicit-commit.html) | DDLを含む取引の注意 |
| [Go MySQL Driver](https://github.com/go-sql-driver/mysql) | 接続設定と型変換 |
| [MongoDB atomicity](https://www.mongodb.com/docs/manual/core/write-operations-atomicity/) | 原子操作と複数documentの取引 |
| [MongoDB consistency](https://www.mongodb.com/docs/manual/core/read-isolation-consistency-recency/) | read/write concernとsession |
| [Redis transactions](https://redis.io/docs/latest/develop/using-commands/transactions/) | WATCH、MULTI/EXEC、rollbackとの差 |
| [oapi-codegen](https://github.com/oapi-codegen/oapi-codegen) | OpenAPIからの生成候補。採用する仕様版とGin対応を確認 |

## 更新手順

[update-backend](../skills/update-backend/SKILL.md)で対象の資料・依存版・既存の規約を比較する。変更点が関係する原則、専門スキル、例、評価シナリオへ届くか確認する。ガイドラインの更新を自動で案件の破壊的変更へ適用しない。

[API対応表](web-api.md)と[ログ対応表](logging.md)に採用判断がある。ログ時間単位の原文内の差異はlogging.mdに記録済み。HTTP例と最新RFCの差異は実装する該当機能について確認する。参照先が取得できないときは、確認できた採用版ソースなどを用い、未確認を明記する。

ディレクトリ配置、手動DI、slog選択、DB別のport設計は本プラグインの推奨。原著者の要求や公式仕様と表現しない。文書の全文をコピーせず、短い対応表と原資料へのリンクを維持する。
