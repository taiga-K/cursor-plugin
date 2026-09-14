# 一次資料と更新方針

確認日：2026-09-13。以下は参照先であり、全ツールを導入する指定ではない。動的なlatest/currentページの内容を全採用版へ適用せず、実装時に対象の版と照合する。

| 資料 | 用途 |
|---|---|
| [Futureログ設計](https://future-architect.github.io/arch-guidelines/documents/forLog/log_guidelines.html) | 指定標準。JSON、レベル、キー、アクセスログ、メッセージ管理 |
| [Future Web API設計](https://future-architect.github.io/arch-guidelines/documents/forWebAPI/web_api_guidelines.html) | 指定標準。契約、排他、エラー、キャンセル、機能配置 |
| [DDD Reference / Eric Evans](https://www.domainlanguage.com/ddd/reference/) | ユビキタス言語、コンテキスト、モデルの概念 |
| [The Clean Architecture / Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) | ソース依存の方向と境界 |
| [Effective Go](https://go.dev/doc/effective_go) | Goの基礎規約。現代の全機能を網羅する資料ではない |
| [Go仕様](https://go.dev/ref/spec) | 型の参照共有・比較・公開範囲。sliceの容量制限はappendの保護であり、既存要素の共有解消にはコピーが必要 |
| [Go Code Review Comments](https://go.dev/wiki/CodeReviewComments) | interface・receiver・命名の参考。Domainとの境界判断は本プラグインが明示 |
| [Go doc comment](https://go.dev/doc/comment)、[Example](https://pkg.go.dev/testing#hdr-Examples) | 表示と実行条件を確認し、出力なしExampleを実行済みにしない |
| [Go 1.22ループ変数](https://go.dev/blog/loopvar-preview) | module/fileの言語版を確認し、捕捉対策を一律削除しない |
| [Go 1.23 timer](https://go.dev/wiki/Go123Timer) | timerの再利用・Stop/Resetは採用版、main module、GODEBUGを確認 |
| [WaitGroup.Go](https://pkg.go.dev/sync#WaitGroup.Go) | Go 1.25以降。panicしない関数という契約を確認 |
| [Go 1.26 release notes](https://go.dev/doc/go1.26) | errors.AsType、new(expr)等は対応版を満たす場合だけ採用 |
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

## DDD・クリーンアーキテクチャの採用判断

正本は[モデリング](domain-modeling.md)・[Domain実装](domain-implementation.md)・[構成](architecture.md)・[DDD原則](../principles/ddd.md)・[テスト](testing.md)で、根拠は上表のDDD Reference・The Clean Architecture・Go仕様へ結ぶ。個別の書籍や著者の資料を前提にせず、改良は本文と公式資料の照合で行う。

再構成は初期化と常時不変条件を区別し、復元時の検証・信頼条件・旧版データの扱いを明示する。RepositoryのDomain配置は基本案であり、Applicationで取得して純粋なDomainへ渡す方式を一律禁止しない。特定のID・ORM・mock・図作成ツール、contextによるTx伝播はそのまま必須にしない。複数集約の単一Tx、Domain型を返す方式、同期のDomain Eventは条件を説明して選べる。型の参照共有・比較・公開範囲は[Go仕様](https://go.dev/ref/spec)に従う。実装では採用版と失敗経路を検証する。

## Goコーディング標準

正本は[go-coding](../skills/go-coding/SKILL.md)と[references/go](go/)の6分野の文書で、根拠は上表のGo公式資料へ結ぶ。個別の書籍や著者の資料を前提にせず、標準の改良は6文書の本文と公式資料の照合で行う。Go仕様、DDDの不変条件、API・ログの指定規約と衝突する記法は採らない。sliceの容量制限、interface準拠確認の依存方向、Go版によるrange・timer・新APIの差、Exampleの実行条件を区別する。独自例は[本文から抽出する検査](../scripts/check-go-examples.py)で検証し、モデルの利用評価とは分ける。

## 更新手順

[update-backend](../skills/update-backend/SKILL.md)で対象の資料・依存版・既存の規約を比較する。変更点が関係する原則、専門スキル、例、評価シナリオへ届くか確認する。ガイドラインの更新を自動で案件の破壊的変更へ適用しない。

[API対応表](web-api.md)と[ログ対応表](logging.md)に採用判断がある。ログ時間単位の原文内の差異はlogging.mdに記録済み。HTTP例と最新RFCの差異は実装する該当機能について確認する。参照先が取得できないときは、確認できた採用版ソースなどを用い、未確認を明記する。

ディレクトリ配置、手動DI、slog選択、DB別のport設計は本プラグインの推奨。原著者の要求や公式仕様と表現しない。文書の全文をコピーせず、短い対応表と原資料へのリンクを維持する。
