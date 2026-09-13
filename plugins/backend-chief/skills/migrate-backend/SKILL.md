---
name: migrate-backend
description: DBスキーマ、DB製品、Goアーキテクチャの移行を設計・実装・検証する。実環境への配備やDB基盤構築は別責務。
---

# バックエンド・データの段階移行

## 入力

現状、移行先、データ量、互換性と停止時間の制約。

## 手順

1. [assess-backend](../assess-backend/SKILL.md)でコード・データ・consumer・既存移行手順を調べる。
2. [移行原則](../../principles/evolution.md)と[DB選択](../../references/database-selection.md)で新旧の差、変換不能値、整合性、混在期間を設計する。
3. expand/backfill/切替/contractの必要性を判断し、再開点・二重書込の扱い・照合・打切り・復旧方法を記録する。
4. コードとmigrationを実装し、使い捨て環境で途中失敗と再実行を検証する。MySQL DDLやNoSQLの原子性をRDB共通とみなさない。
5. [verify-backend](../verify-backend/SKILL.md)で旧新の契約と不変条件を確認し、適用条件・順序を[インフラ側](../../references/infrastructure-handoff.md)へ引き渡す。

## 出力

移行コード、手順、データ照合、停止と復旧の条件、検証証拠。 [共通形式](../../references/output-contracts.md)に従う。

## 情報不足

実データ量や業務の許容停止時間が不明なら性能・本番適用可否を未確認にする。テスト用と確認できないDBへ破壊的操作をしない。

## 完了条件

再現可能な移行プログラムと検証結果が揃い、実環境の適用責任が分かれる。
