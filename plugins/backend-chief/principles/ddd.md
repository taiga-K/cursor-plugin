# 業務モデル・集約

## 適用条件

業務ルール、状態遷移、コンテキストの分割。

## 判断基準

具体例とドメインエキスパートの知識から、用語・ルール・モデルの適用範囲を確かめる。未決事項を推測で確定せず、モデルとコードを継続して更新する。[モデリング](../references/domain-modeling.md)で集約の不変条件、件数、競合、変更のまとまりを比較する。

EntityはIDによる同一性、Value Objectは値による等価性と不変性を持つ。変更は集約ルートを通し、Repositoryは集約単位の取得・保存を表す。自然な所有先のない業務判断はDomain Service、複雑な生成はFactory、操作の調整・認可・Tx境界はApplicationへ置く。[実装判断](../references/domain-implementation.md)で使い分ける。

## 理由

業務判断がHandlerやSQLへ分散すると、HTTP以外の入口でルールが抜ける。

## 具体例

注文の取消可否はOrder.Cancelで判定する。管理画面APIとバッチが同じ操作を使う。他コンテキストの顧客は顧客IDとして参照し、顧客テーブルの都合を注文へ持ち込まない。

## 例外・案件判断

参照に集約の復元が必要かを判断し、複数集約のJOIN・絞込・ページング等には[Query Service](../references/architecture.md)を比較する。CQRSは部分的に採用でき、別DBやEvent Sourcingを必須にしない。全プリミティブのVO化、全機能のDomain Service化、全種類のモデル図作成を強制しない。

## 検証方法

生成・変更・再構成、同一性・等価性・参照漏出、集約の保存復元を[テスト](../references/testing.md)で確認する。集約内部の不変条件を原子的に守ることと、複数集約を同じTxに含める採用判断を分ける。

[原則索引](index.md) / [構成例](../references/architecture.md) / [公式資料](../references/sources.md) / [設計スキル](../skills/design-backend/SKILL.md)
