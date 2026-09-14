# 外部連携・ワーカー・資源管理

## 適用条件

外部API、非同期処理、バッチ、終了処理。

## 判断基準

再送・重複・順序逆転・部分失敗を前提に、受領と業務完了を分ける。永続的な受領前に成功応答やackを返さない。バッチは小さい再開単位とcheckpointを持つ。外部呼出しの再試行は副作用の冪等性とretry budgetを確認する。

## 理由

プロセスが落ちた時点でHTTPメモリ上の仕事は消える。at-least-once配送は重複を許す。

## 具体例

outboxは業務更新と同一原子単位に記録する。送信後・送信済み更新前の停止に備え、consumer側でもevent IDを重複排除する。

## 例外・案件判断

Domain Eventは業務上の出来事であり、同期処理でも使える。[イベントの判断](../references/domain-implementation.md)でTx内・commit後・外部配送を区別し、Domainの内部型を配送契約として直接公開しない。メッセージ基盤の作成は対象外。非同期化そのものは業務上必要な時だけ選び、in-process goroutineを耐久キューと扱わない。

## 検証方法

送信前後・ack前後の停止、重複、毒メッセージ、再開、終了中の新規受付とin-flight処理をテストする。

[原則索引](index.md) / [構成例](../references/architecture.md) / [公式資料](../references/sources.md) / [設計スキル](../skills/design-backend/SKILL.md)
