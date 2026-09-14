# 永続化・DB選択

## 適用条件

DB導入、Repository、索引、データ形式。

## 判断基準

業務モデルと読み書きのアクセスパターン、正本、整合性、件数と増加率からDBを比較し、選択は既存の設定・設計記録に残す。更新用Repositoryは集約ルートを通した取得・保存の契約とし、業務判断をAdapterへ押し出さない。[Repositoryの実装判断](../references/domain-implementation.md)に従い、不完全な集約の復元や子専用の更新でルートの条件を迂回させない。全製品共通のSQL方言や、すべての型に使う汎用CRUD Repositoryを作らない。DBの制約とDomainの検証を併用する。

## 理由

DBの違いを隠し切ろうとすると、原子性や検索性能の保証まで曖昧になる。

## 具体例

RDBのunique制約とNoSQLの条件付き作成をそれぞれ実装し、同じ業務上の一意性を別々の実DBテストで証明する。

## 例外・案件判断

集約単位の保存は全カラムの書き換えを強制しない。部分SQL更新やNoSQLの条件付き操作でも、集約の不変条件とversionの整合性を保証する。ReserveStock等の業務portはRepositoryと同一視せず、業務判断の所有者と保存時の競合条件を明示する。存在確認・件数取得は契約に合えば利用できる。既存ORMを理由なく交換しない。複数DBは業務上の利点が保守負担を上回る場合に採用し、跨る原子性を約束しない。

## 検証方法

選択したDBの専用手順、DDL/索引、実行計画、実DB契約テスト。SQLiteやmockだけでPostgreSQL/MySQL互換を証明しない。

[原則索引](index.md) / [構成例](../references/architecture.md) / [公式資料](../references/sources.md) / [設計スキル](../skills/design-backend/SKILL.md)
