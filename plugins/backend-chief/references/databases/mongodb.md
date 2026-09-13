# MongoDBによるドキュメント実装

本プロファイルはNoSQL選択時のドキュメント型の具体例。MongoDBをNoSQL全体の必須製品にはしない。採用版の公式Go Driver APIを確認してからコードを書く。

## 設計・実装

1. 一緒に変更するデータを一つのdocumentへまとめられるか検討し、無制限に成長する配列は避ける。単一documentの更新は原子的だが、複数documentの更新全体が自動で原子的になるわけではない。[公式](https://www.mongodb.com/docs/manual/core/write-operations-atomicity/)
2. tenantと業務キーのunique indexを設計する。sharding等の構成でそのunique条件が成立するか、実際の製品構成で確かめる。
3. 条件付き更新のfilterへtenant、ID、期待versionを含め、更新でversionを増やす。更新結果のMatchedCount等を確認する。
4. 複数documentの取引が必要なら、採用構成の対応、session、read/write concernとretry条件を確認する。transaction callbackに外部通知等の再実行不能な副作用を入れない。
5. BSONはAdapterだけで扱う。利用者から受けた任意filter/operatorを実行せず、型付きの入力から構成する。

## 条件付き更新の形

```text
filter: tenant_id = 認証主体のtenant AND _id = 注文ID AND version = 期待値
update: $set(status = 新状態), $inc(version = 1)
result: matched = 1なら更新成立、0なら不存在または競合を契約に従って判定
```

これは設計表現でありGo Driverへ直接渡すJSONではない。idの型、document validation、projection、索引を採用スキーマに合わせる。

## 読み取りと移行

必要なread-your-writesや耐久性をread/write concern、read preference、sessionの選択と対応させる。[公式](https://www.mongodb.com/docs/manual/core/read-isolation-consistency-recency/)

schema_versionと新旧decoderの互換性を決め、backfillを再開可能にする。TTLは期限時刻の厳密な削除保証に使わず、期限切れデータを業務処理で拒否する。

## 検証

単一documentの同時更新、重複キー、複数documentのrollback、再試行、古い読み取りを検証する。transactionを使うテストは対応するreplica set等の構成を用意する必要があり、standalone実行だけで合格にしない。基盤構成はインフラ担当へ要求する。

[NoSQL能力表](nosql.md) / [テスト](../testing.md)
