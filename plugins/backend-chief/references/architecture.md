# Go・Ginの構成と責務

この配置は推奨例。ディレクトリ名より依存方向と業務の所有先を守る。初期は一つのGo moduleと一つのAPIプロセスでよく、必要になる前に空のコンテキストやサービスを作らない。

```text
cmd/api/main.go                  設定・接続・DI・開始と終了
cmd/worker/main.go               非同期処理が必要なときだけ
internal/order/domain/          Entity、Value Object、不変条件
internal/order/application/     Use Case、port、認可、取引境界
internal/order/adapter/http/     Gin Handler、DTO、HTTPエラー変換
internal/order/adapter/postgres/ 選択したDBの実装だけ配置
internal/order/adapter/mysql/    MySQLを選択した場合の代替例
internal/order/adapter/mongodb/  MongoDBを選択した場合の代替例
internal/platform/              接続生成、設定、ログ、計装
api/openapi.yaml                HTTP契約
migrations/                     選択DBのDDL・データ移行
```

上のDBフォルダは選択肢であり全て作る指示ではない。複数DB採用時にも、各コンテキストが使う実装のみ置く。共通platformに業務ルールを集めない。

## 依存とデータフロー

- HTTP Adapter → Application → Domain。DB Adapter → Applicationのport / Domain。mainが全実装を接続する。
- Domainは純粋なGo型を中心とし、標準ライブラリと審査した値型依存だけを許す。Applicationはcontext等を使えるが、Gin・DBドライバ・platformの実装へ依存しない。
- リクエストDTO → 構文検証 → 主体の取得 → Applicationの認可と業務操作 → port → DB。結果は応答DTOへ明示変換する。
- スキーマ生成型をDomainに流用しない。ドライバのNullable型やBSONタグはAdapter内に留める。
- コンテキスト間は公開されたApplication契約またはイベントで連携する。他コンテキストのテーブルへ無断で書かない。循環するユースケース呼出しは上位の調整処理へ移す。

## 取引portの例

```go
// application側。Txの実装型は内側へ公開しない。
type OrderStore interface {
    Load(ctx context.Context, tenantID, orderID string) (domain.Order, error)
    Save(ctx context.Context, order domain.Order, expectedVersion int64) error
}
type UnitOfWork interface {
    Within(ctx context.Context, work func(OrderStore) error) error
}
```

このコードは配置と境界の抜粋であり完成アプリではない。実際のID型とメソッドは業務要件に合わせる。複数Repositoryが同じ取引へ参加するなら、callbackにそれらを束ねたportを渡す。Adapterはbegin失敗、callback失敗、panic、commit失敗の経路を持ち、rollbackを確実に試行し、エラーを返す。callback内のportがTx外のpoolを使う実装は禁止する。

取引を保証できないNoSQLへこのportを形だけ実装しない。単一ドキュメントの条件付き更新や専用の業務portへ設計を変える。[DB選択](database-selection.md)で能力を確認する。

## 機械的な防護

まず対象のpackage構造、責務、公開境界、既存の解析ツールとCIを調べる。上の配置例への変更を前提にしない。既存検査で保証できる内容を確認し、不足する依存規則だけを設定または検査コードとして実装する。

例えば `go list -deps -json ./...` の実際のimportから、Domain→Gin/DB、Application→Adapter/platform、コンテキストを跨ぐ非公開参照を調べる。対象パスと許可する値型依存は案件の構造から定義する。文字列検索だけで依存の正しさを保証しない。

検査を追加・変更したら、一時的なfixtureで正当な依存が通り、禁止依存が落ちることを確認する。対象packageが検査から漏れていないか、必要なbuild tag・GOOS・テスト専用import・生成コードを含むかも確認する。helperを経由する間接依存や公開型の意味など、検査で保証しない範囲を明記する。

[DDD](../principles/ddd.md) / [Go規約](../principles/go.md) / [Gin実装](gin.md)
