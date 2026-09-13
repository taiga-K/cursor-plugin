---
name: implement-backend
description: 設計済みのGo・Ginバックエンドを実装する。業務ロジック、API、DB Adapter、外部連携、workerの追加・修正に使用する。
---

# バックエンド実装

## 入力

受入条件、設計、対象差分、選択したDBと版。

## 手順

1. [Go](../../principles/go.md)と[DDD](../../principles/ddd.md)に従い、型・不変条件と失敗ケースを先に実装する。バグ修正は再現テストが失敗することを確認する。
2. Applicationの操作とport、認可、取引境界を実装する。[整合性](../../principles/consistency.md)に従い、エラー分類と再試行可能性を明示する。
3. [DB選択](../../references/database-selection.md)から該当専用スキルを実行し、Adapter、索引、移行コード、実DBテストを作る。生成コードは正本のSQL/schemaから更新し直接編集しない。
4. [Gin](../../references/gin.md)でHTTP境界を接続し、[API規約](../../references/web-api.md)と[ログ規約](../../references/logging.md)を実装・テストする。
5. worker/batchは[耐久性](../../principles/reliability.md)に沿って重複・停止・再開を実装する。クラウド資源の作成へ範囲を広げない。
6. 依存を起動処理で接続し、[verify-backend](../verify-backend/SKILL.md)を実行する。変更に関係する設定・契約・設計記録を、それぞれ既存の管理場所で更新する。

## 出力

振る舞いの変更、実装差分、DBと依存版、検証証拠、未完了条件。 [共通形式](../../references/output-contracts.md)に従う。

## 情報不足

必要な外部接続がないときは契約とテスト可能な単位を完成させ、integration未実行を明記する。成功結果や認証主体を捏造しない。

## 完了条件

受入条件を満たす実装と適切な検証が揃う。必須検証が未実行なら未完了範囲として報告する。
