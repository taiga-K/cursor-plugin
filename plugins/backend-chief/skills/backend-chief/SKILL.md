---
name: backend-chief
description: Go・Gin・DDD・クリーンアーキテクチャでバックエンドを構築する入口。PostgreSQL・MySQL・NoSQLを選んだ設計・実装・検証や /backend-chief の依頼に使用する。クラウド基盤の構築は別責務。
---

# Backend Chief

## 入力

目的、対象リポジトリまたは差分、制約。最初にローカル指示、未コミット変更、Go/Ginの採用版、API契約、DB選択、検証方法を調べる。汎用プラグインの推奨と案件固有の判断を区別する。

## 手順

1. 新規/既存と、実装/調査/レビュー/検証の成果物を判定する。観測できる事実は調べ、業務意図やDB製品など成果に影響する未決事項だけ確認する。
2. 下表から主手順を選び、必要な専門スキルを組み合わせる。調査・レビューのみの依頼を実装へ拡大しない。
3. [原則索引](../../principles/index.md)の関連原則を読む。指定[API](../../references/web-api.md)・[ログ](../../references/logging.md)は該当機能で適用する。
4. 既存の依存定義・接続設定・設計記録から[DB選択](../../references/database-selection.md)を確認し、PostgreSQLなら[専用スキル](../postgresql-backend/SKILL.md)、MySQLなら[専用スキル](../mysql-backend/SKILL.md)、NoSQLなら[専用スキル](../nosql-backend/SKILL.md)を使う。全DBの同時導入はしない。
5. 工程と受入条件を記録し、検証可能な単位で進める。省略は対象外である理由を残す。小さな修正に大規模な設計や全DBテストを課さない。

| 依頼 | 主手順 |
|---|---|
| 新規構築・標準導入 | [新規導入](playbooks/new-project.md) |
| 機能追加・API/業務ルール変更 | [機能追加](playbooks/feature.md) |
| 不具合・競合・キャンセル漏れ | [バグ修正](playbooks/bug-fix.md) |
| 非同期consumer・バッチ構築 | [ワーカー](playbooks/worker.md) |
| 設計・実装レビュー | [レビュー](playbooks/review.md) |
| スキーマ・DB製品・構成の移行 | [移行](playbooks/migration.md) |
| 現状の説明・原因調査だけ | [assess-backend](../assess-backend/SKILL.md) |
| 設計・選定だけ | [design-backend](../design-backend/SKILL.md) |
| 設計済みの実装 | [implement-backend](../implement-backend/SKILL.md) |
| 検証・CI失敗 | [verify-backend](../verify-backend/SKILL.md) |
| 検証基盤の導入 | [setup-backend](../setup-backend/SKILL.md) |
| 依存・基準・検証基盤の更新 | [update-backend](../update-backend/SKILL.md) |

## 責務境界

HTTP、Domain、Application、永続化、外部SDK、ワーカー、移行プログラム、テストと検証CIを扱う。クラウド資源・IAM・ネットワーク・配備の構築は[インフラ契約](../../references/infrastructure-handoff.md)へ分ける。フロントエンドのUI/BFFにはAPI契約を渡す。モデル固定・外部プラグイン・並列エージェント・MCPは要求しない。

## 出力・完了条件

[共通形式](../../references/output-contracts.md)で成果、判断を変えた原則、選択DB、検証証拠、未解決を示す。実装は受入条件と検証が揃ったときに完了。調査・レビューは報告が成果物。[利用評価](../../evals/scenarios.md)で入口と判断の対応を確認できる。

## 情報不足

DB未選択・NoSQL製品未確定・業務の整合性未決は影響を示して確認する。その間は独立な設計や検証を進める。環境がなくても架空のAPIや成功証拠を作らず、未実行を明記する。
