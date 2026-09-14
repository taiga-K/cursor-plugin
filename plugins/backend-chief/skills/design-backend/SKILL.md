---
name: design-backend
description: Go・Gin・DDD・クリーンアーキテクチャでバックエンドを設計する。機能追加、境界変更、API・永続化の設計に使用する。
---

# バックエンド設計

## 入力

目的と受入条件、現状調査、選択DB、既存契約と制約。

## 手順

依頼された境界に関係する工程を選ぶ。Goの型・関数だけの設計にDB・HTTP・モデル全体の設計を追加しない。

1. [判断原則](../../principles/judgment.md)と[モデリング](../../references/domain-modeling.md)で具体例・境界例から業務用語、不変条件、状態遷移、コンテキストと集約を確かめる。エキスパートの知識と仮説・未決事項を分け、既存のモデル記録を使う。
2. [Domain実装](../../references/domain-implementation.md)でEntity/VO・生成/再構成・Service/Factoryを選び、[構成](../../references/architecture.md)でRepositoryとApplication port、入出力・Queryの所有先を決める。Goの型・関数の公開契約とpackage設計は[go-coding](../go-coding/SKILL.md)の設計として確認する。依存方向と認可を確認し、既存構成は必要な範囲だけ変更する。
3. 永続化が関係する場合に[DB選択](../../references/database-selection.md)から専用スキルへ進む。選択DBの能力で保証可能な取引境界、排他、冪等性、索引、移行を具体化する。
4. [API](../../references/web-api.md)でOpenAPI、正常/異常応答、互換性、キャンセルを設計し、[ログ](../../references/logging.md)の観測項目を決める。
5. [認可](../../principles/security.md)、[整合性](../../principles/consistency.md)、[外部連携](../../principles/reliability.md)の失敗経路を整理する。
6. 代替案と採用理由、実装順、[テスト](../../references/testing.md)、[インフラ引き渡し](../../references/infrastructure-handoff.md)をまとめる。

## 出力

所有先、契約、DBプロファイル、取引・失敗の設計、比較と根拠、検証条件。 [共通形式](../../references/output-contracts.md)に従う。

## 情報不足

DB製品や業務上の整合性が未決なら影響を示して確認し、独立なDomainや契約を進める。未選択のDBを導入しない。

## 完了条件

次工程が業務の具体例、責務・境界、原子性、失敗、検証条件に基づいて実装でき、未決事項と見直し条件が分かる。実装中の発見はモデルへ戻して更新する。
