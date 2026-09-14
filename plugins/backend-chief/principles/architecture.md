# 責務・依存方向

## 適用条件

配置、モジュール追加、外部技術の導入。

## 判断基準

ソース依存を内側へ向ける。DomainはGin・SQL・NoSQL SDK・ログ基盤に依存しない。集約のRepository契約はDomain、ユースケース固有のQuery・Tx管理・通知等のportはApplication所有を基本とし、Adapterが実装する。起動処理で実装を組み立てる。HTTP DTO、Applicationの入出力、DBレコード、Domainの所有関係を分け、gin.Contextを外へ渡さない。

## 理由

フレームワークやデータ形式の変更を、業務モデルの変更から独立させる。

## 具体例

注文のRepository契約をDomain、UnitOfWorkと注文検索の契約をApplicationへ置き、選択したDBのAdapterを接続する。Domain ServiceがRepositoryを使う場合も内側の契約へ依存し、ドライバのTxをDomain/Applicationへ露出させない。

## 例外・案件判断

ディレクトリ名は推奨例で、既存名を維持してよい。Application所有のRepositoryを使い、取得した情報を純粋なDomainの判断へ渡す方式も選べる。既存方式を配置だけで違反とせず、集約契約と依存方向を確認する。interfaceは依存逆転や差し替えに必要な境界へ置き、全structに一対一で作らない。

## 検証方法

go listの依存グラフを用いた禁止import検査、循環依存検査、Domain単独テスト。別コンテキストのAdapterや非公開実装への参照も確認する。

[原則索引](index.md) / [構成例](../references/architecture.md) / [公式資料](../references/sources.md) / [設計スキル](../skills/design-backend/SKILL.md)
