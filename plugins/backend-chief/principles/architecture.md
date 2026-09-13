# 責務・依存方向

## 適用条件

配置、モジュール追加、外部技術の導入。

## 判断基準

ソース依存を内側へ向ける。DomainはGin・SQL・NoSQL SDK・ログ基盤に依存しない。Applicationは用途に必要な小さいportを所有し、Adapterが実装する。起動処理で実装を組み立てる。HTTP DTO、DBレコード、Domainを分け、gin.Contextを外へ渡さない。

## 理由

フレームワークやデータ形式の変更を、業務モデルの変更から独立させる。

## 具体例

注文ApplicationにReserveStock(ctx, ...)のportを置き、PostgreSQLかMySQLのAdapterを接続する。ドライバのTxをApplicationへ露出させない。

## 例外・案件判断

このディレクトリ名は本プラグインの推奨。既存名を維持してよい。interfaceは差し替えが必要な境界に置き、すべてのstructに一対一で作らない。

## 検証方法

go listの依存グラフを用いた禁止import検査、循環依存検査、Domain単独テスト。別コンテキストのAdapterや非公開実装への参照も確認する。

[原則索引](index.md) / [構成例](../references/architecture.md) / [公式資料](../references/sources.md) / [設計スキル](../skills/design-backend/SKILL.md)
