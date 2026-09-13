# ワーカー・バッチ

適用：耐久的な非同期処理や再開可能なバッチの構築。

## 工程

1. [設計](../../design-backend/SKILL.md)で受領と完了、取引単位、最大実行時間、ack、重複、順序、再開点を定める。
2. [信頼性原則](../../../principles/reliability.md)と選択DB手順でoutbox/inboxやcheckpointの保存を設計する。基盤が提供する配送保証は確認する。
3. [実装](../../implement-backend/SKILL.md)でHTTPと共通のApplicationを利用し、worker固有の入口と終了処理を接続する。
4. [検証](../../verify-backend/SKILL.md)で停止位置、二重配信、毒メッセージ、再開を確認する。キュー作成やスケジューラ設定はインフラへ渡す。

## 完了時の成果

業務処理、再送・再開の契約、失敗時の証拠、基盤への要求。

[共通形式](../../../references/output-contracts.md)に従う。省略した工程と未検証は理由を残す。
