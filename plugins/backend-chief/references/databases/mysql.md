# MySQLプロファイル

## 入力と選定

製品・採用版・storage engine・SQL mode・照合順序・タイムゾーンを確認する。MariaDBや互換サービスを同じMySQLの版として扱わない。新規はInnoDBとdatabase/sql＋go-sql-driver/mysqlを候補にする。既存ORMは必要性がなければ置換しない。

## 実装手順

1. 業務上の一意性とtenant境界をDDLにする。文字列の大小文字・アクセント・末尾空白が同一性に与える影響を照合順序ごとにテストする。文字セットは案件に合わせてutf8mb4等を明示する。
2. bind parameterを使い、sort列等を許可リスト化する。MySQLのプレースホルダは通常 `?`。PostgreSQLのSQLをそのまま転用しない。
3. 実際の分離レベルを調べる。InnoDBの標準既定はRepeatable Read。索引とアクセス条件によりgap/next-key lock等の競合範囲が変わる。必要な読み取りを一律SELECT FOR UPDATEにしない。[公式](https://dev.mysql.com/doc/refman/8.4/en/innodb-transaction-isolation-levels.html)
4. deadlockやlock timeoutを分類し、callback全体をrollbackした上で必要なら新しいTxで再実行する。自動rollbackの範囲をエラーごとに決めつけない。
5. RowsAffectedとそのドライバ設定を確認する。条件付き更新ではversionを必ず増やし、更新件数0を成功にしない。DBの生エラーをHTTPへ返さない。

## 条件付き更新の例

```sql
UPDATE orders
SET status = ?, version = version + 1
WHERE tenant_id = ? AND id = ? AND version = ?;
```

Applicationへ返す次のversionは影響件数確認後に確定する。複数文なら同じsql.Txを使う。金額はDECIMALや整数等を使い、Goとのscan/encodeで精度を失わない。DATETIMEとTIMESTAMPの変換、ドライバのparseTime/loc、DB sessionのtime zoneを混同しない。

## 移行と検証

多くのDDLには暗黙commitがある。migration全体のrollbackを約束せず、途中失敗からの再開と前進修復を作る。[公式](https://dev.mysql.com/doc/refman/8.4/en/implicit-commit.html)

実DBで一意性、照合順序、索引とロック範囲、同時更新、deadlock、日時・NULL・小数、移行途中失敗を確認する。テスト環境のengineとSQL modeを本番想定と対応させる。

[整合性原則](../../principles/consistency.md) / [テスト](../testing.md) / [DB選択](../database-selection.md)
