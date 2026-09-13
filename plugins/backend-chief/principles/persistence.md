# 永続化・DB選択

## 適用条件

DB導入、Repository、索引、データ形式。

## 判断基準

先に読み書きのアクセスパターン、正本、整合性、件数と増加率を決める。PostgreSQL・MySQL・NoSQLの選択は既存の設定・設計記録に残す。保存契約は業務操作単位にし、汎用CRUD Repositoryや全製品共通のSQL方言を作らない。DBの制約とアプリの検証を併用する。

## 理由

DBの違いを隠し切ろうとすると、原子性や検索性能の保証まで曖昧になる。

## 具体例

RDBのunique制約とNoSQLの条件付き作成をそれぞれ実装し、同じ業務上の一意性を別々の実DBテストで証明する。

## 例外・案件判断

既存ORMを理由なく交換しない。複数DBは業務上の利点が保守負担を上回る場合に採用し、跨る原子性を約束しない。

## 検証方法

選択したDBの専用手順、DDL/索引、実行計画、実DB契約テスト。SQLiteやmockだけでPostgreSQL/MySQL互換を証明しない。

[原則索引](index.md) / [構成例](../references/architecture.md) / [公式資料](../references/sources.md) / [設計スキル](../skills/design-backend/SKILL.md)
