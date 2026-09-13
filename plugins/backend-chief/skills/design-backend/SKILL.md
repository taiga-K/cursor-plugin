---
name: design-backend
description: Go・Gin・DDD・クリーンアーキテクチャでバックエンドを設計する。機能追加、境界変更、API・永続化の設計に使用する。
---

# バックエンド設計

## 入力

目的と受入条件、現状調査、選択DB、既存契約と制約。

## 手順

1. [判断原則](../../principles/judgment.md)と[DDD](../../principles/ddd.md)で業務用語、不変条件、状態遷移、コンテキストと集約を決める。
2. [構成](../../references/architecture.md)から所有先と依存方向、Application port、認可、DTO変換を決める。既存構成は必要な範囲だけ変更する。
3. [DB選択](../../references/database-selection.md)から専用スキルへ進む。選択DBの能力で保証可能な取引境界、排他、冪等性、索引、移行を具体化する。
4. [API](../../references/web-api.md)でOpenAPI、正常/異常応答、互換性、キャンセルを設計し、[ログ](../../references/logging.md)の観測項目を決める。
5. [認可](../../principles/security.md)、[整合性](../../principles/consistency.md)、[外部連携](../../principles/reliability.md)の失敗経路を整理する。
6. 代替案と採用理由、実装順、[テスト](../../references/testing.md)、[インフラ引き渡し](../../references/infrastructure-handoff.md)をまとめる。

## 出力

所有先、契約、DBプロファイル、取引・失敗の設計、比較と根拠、検証条件。 [共通形式](../../references/output-contracts.md)に従う。

## 情報不足

DB製品や業務上の整合性が未決なら影響を示して確認し、独立なDomainや契約を進める。未選択のDBを導入しない。

## 完了条件

次工程が境界・原子性・失敗・検証条件を判断し直さず実装できる。
