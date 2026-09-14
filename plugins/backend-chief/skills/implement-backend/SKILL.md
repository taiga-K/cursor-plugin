---
name: implement-backend
description: 設計済みのGo・Ginバックエンドを実装する。業務ロジック、API、DB Adapter、外部連携、workerの追加・修正に使用する。
---

# バックエンド実装

## 入力

受入条件、設計、対象差分、関係する場合は選択したDBと版。

## 手順

以下から変更対象に関係する工程だけを実施する。Go関数だけの変更へDomainモデル・HTTP境界・DB導入を追加しない。

1. Goコードの変更では[go-coding](../go-coding/SKILL.md)で採用版と変更範囲を確認し、命名・型・エラー等の標準を全層へ適用する。Domainの変更は[Go](../../principles/go.md)と[Domain実装](../../references/domain-implementation.md)に従い、型の同一性/等価性・所有権、不変条件、生成/変更/再構成を実装する。業務の具体例と失敗ケースをテストへ対応させ、バグ修正は再現テストの失敗を確認する。
2. [構成](../../references/architecture.md)に従い、集約のRepository契約とApplicationの入出力・Query/Tx等のportを配置し、操作・認可・取引境界を実装する。[整合性](../../principles/consistency.md)に従い、エラー分類と再試行可能性を明示する。
3. 永続化の変更では[DB選択](../../references/database-selection.md)から該当専用スキルを実行し、Adapter、索引、移行コード、実DBテストを作る。生成コードは正本のSQL/schemaから更新し直接編集しない。
4. [Gin](../../references/gin.md)でHTTP境界を接続し、[API規約](../../references/web-api.md)と[ログ規約](../../references/logging.md)を実装・テストする。
5. worker/batchは[耐久性](../../principles/reliability.md)に沿って重複・停止・再開を実装する。クラウド資源の作成へ範囲を広げない。
6. 依存を起動処理で接続し、[verify-backend](../verify-backend/SKILL.md)を実行する。実装で見つかった業務の疑問は[モデルへ戻して確認](../../references/domain-modeling.md)し、コード・テスト・関連するモデル記録と契約を既存の管理場所で更新する。

## 出力

振る舞いの変更、実装差分、DBと依存版、検証証拠、未完了条件。 [共通形式](../../references/output-contracts.md)に従う。

## 情報不足

必要な外部接続がないときは契約とテスト可能な単位を完成させ、integration未実行を明記する。成功結果や認証主体を捏造しない。

## 完了条件

受入条件を満たす実装と適切な検証が揃う。必須検証が未実行なら未完了範囲として報告する。
