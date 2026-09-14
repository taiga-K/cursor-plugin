# Go・Ginの構成と責務

この配置は推奨例。ディレクトリ名より依存方向と業務の所有先を守る。初期は一つのGo moduleと一つのAPIプロセスでよく、必要になる前に空のコンテキストやサービスを作らない。

```text
cmd/api/main.go                  設定・接続・DI・開始と終了
cmd/worker/main.go               非同期処理が必要なときだけ
internal/order/domain/          集約、VO、Domain Service、Repository契約
internal/order/application/     Use Case、入出力、Query/Tx等のport、認可
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

- HTTP Adapter → Application → Domain。DB Adapter → DomainのRepository契約 / ApplicationのQuery・Tx等のport。mainが全実装を接続する。
- Domainは純粋なGo型を中心とし、標準ライブラリと審査した値型依存だけを許す。Applicationはcontext等を使えるが、Gin・DBドライバ・platformの実装へ依存しない。
- HTTP request DTO → 構文検証・主体の取得 → Application所有のinput → 認可とDomain操作 → Repository等のport。結果はApplication resultからHTTP response DTOへ明示変換する。Applicationの入出力はHTTP status・表示用フォーマット・binding/DB生成型へ依存しない。
- 同型DTOを形式的に増やさず、各境界の変更理由と所有者を確認する。Domain型をApplicationの戻り値に使う場合は、外側からの変更や表示ロジック混入を防ぐ条件を決める。
- スキーマ生成型をDomainに流用しない。ドライバのNullable型やBSONタグはAdapter内に留める。
- コンテキスト間は公開されたApplication契約またはイベントで連携する。他コンテキストのテーブルへ無断で書かない。同一コンテキストの公開ユースケース同士を安易に呼び合わせず、共通処理は[責務に応じて切り出す](domain-implementation.md)。

## 契約の配置と取引portの例

| 契約 | 基本の所有先 | 理由 |
|---|---|---|
| 集約のRepository | Domain | 集約の取得・保存の単位を表す |
| Queryと戻りDTO | Application | 必要な参照結果はユースケースで決まる |
| UnitOfWork・業務知識を持たない通知 | Application | 操作の調整・確定範囲を表す |

Domain ServiceがRepositoryを必要とするならDomainの契約へ依存する。Application所有のRepositoryからデータを取得し、純粋なDomainの判断へ渡す既存方式も妥当。配置だけでなく、集約契約と業務判断の所有先から評価する。

```go
// domain側。Orderは集約ルート。versionをsnapshotに添える一案。
type Snapshot struct {
    Order   Order
    Version int64
}
type Repository interface {
    Load(ctx context.Context, tenantID, orderID string) (Snapshot, error)
    Save(ctx context.Context, order Order, expectedVersion int64) error
}
```

```go
// application側。Txの実装型は内側へ公開しない。
type UnitOfWork interface {
    Within(ctx context.Context, work func(domain.Repository) error) error
}
```

このコードは配置と境界の抜粋であり完成アプリではない。実際のID型とメソッドは業務要件に合わせる。複数Repositoryが同じ取引へ参加するなら、callbackにそれらを束ねたportを渡す。Adapterはbegin失敗、callback失敗、panic、commit失敗の経路を持ち、rollbackを確実に試行し、エラーを返す。callback内のportがTx外のpoolを使う実装は禁止する。Domain Serviceもそのcallbackで渡されたRepositoryを使うよう組み立て、取引前に注入したpool用Repositoryを混ぜない。読み込んだsnapshotのversionを保存時に照合し、保存後に同じ状態を再利用するなら新しいversionを取得する。rollbackはメモリの状態を戻さないため、再試行は新たなロードから行う。

取引を保証できないNoSQLへこのportを形だけ実装しない。単一ドキュメントの条件付き更新や専用の業務portへ設計を変える。[DB選択](database-selection.md)で能力を確認する。

## Query Serviceの使い分け

更新用Repositoryと異なり、Query Serviceは参照に必要な項目だけを取得できる。複数集約のJOIN・検索・集計・ページングで、全集約の復元やアプリ内JOINを避けたいときに比較する。契約と戻りDTOはApplication、SQLやNoSQL検索とマッピングはAdapterに置く。

QueryのDTOを不完全な集約として保存しない。更新は必要なDomainの不変条件と競合制御を通す。参照側にも認可・tenant条件を適用し、更新直後の表示等に必要な整合性と試験を定める。別DB・レプリカ・Event Sourcingは別の判断であり、全GETへQuery Serviceを追加することも求めない。

## 用語と境界

CAのEntities層はDDDのEntityという型分類と同義ではない。本プラグインではDomainに対応させ、Entity・VO・Domain Service・Repository契約等を含める。コンテキスト・集約・Go packageは異なる境界であり、[モデリング](domain-modeling.md)で意味の範囲と可視性を対応させる。ディレクトリ名をCAの図に合わせることは目的にしない。

## 機械的な防護

まず対象のpackage構造、責務、公開境界、既存の解析ツールとCIを調べる。上の配置例への変更を前提にしない。既存検査で保証できる内容を確認し、不足する依存規則だけを設定または検査コードとして実装する。

例えば `go list -deps -json ./...` の実際のimportから、Domain→Gin/DB、Application→Adapter/platform、コンテキストを跨ぐ非公開参照を調べる。対象パスと許可する値型依存は案件の構造から定義する。文字列検索だけで依存の正しさを保証しない。

検査を追加・変更したら、一時的なfixtureで正当な依存が通り、禁止依存が落ちることを確認する。対象packageが検査から漏れていないか、必要なbuild tag・GOOS・テスト専用import・生成コードを含むかも確認する。helperを経由する間接依存や公開型の意味など、検査で保証しない範囲を明記する。

[DDD](../principles/ddd.md) / [Go規約](../principles/go.md) / [Gin実装](gin.md)
