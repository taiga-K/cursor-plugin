# Redisによるキー値・キャッシュ実装

本プロファイルはNoSQL選択時のキー値型の具体例。Redisはcache/projectionとして利用するか、永続的な正本として使うかを先に区別する。正本にする場合は永続化・復旧・replication・evictionの条件が未確認のまま業務保証を約束しない。

## 設計・実装

1. keyに用途・tenant・IDの境界を持たせ、値のschema versionとTTLの意味を定義する。キー名や値へ秘密を埋め込まない。
2. 複数命令のread-modify-writeには、目的に合う原子命令、WATCHによる競合検出、transaction、script等を選ぶ。
3. MULTI/EXECをRDBのrollbackと同一視しない。実行時エラー時に他の命令が取り消される保証はない。[公式](https://redis.io/docs/latest/develop/using-commands/transactions/)
4. Clusterで複数キー操作を使うならhash slot制限を確認し、全tenantを同じslotへ集中させない。
5. cache-asideは更新後の無効化、期限、stampede対策、障害時のfallback負荷を設計する。cacheだけを頼りに一意性や最終認可を決めない。

## 条件付き作成の形

`SET key value NX PX ttl` は期限付きの存在しないキーの作成候補になるが、これだけで永続的な冪等性や分散ロックの完全性を保証しない。期限切れ後の旧処理の継続、failover、削除前の所有者確認を設計する。金銭や在庫の正しさは正本側の制約・条件付き更新で守る。

## 検証

TTL境界、同時作成、WATCH競合、途中の命令エラー、eviction、cache再構築、ネットワーク断後の再送を確認する。処理済み記録のTTLが再送期間より短い場合は重複実行が再び可能になることを契約に記す。

[NoSQL能力表](nosql.md) / [整合性](../../principles/consistency.md)
