# Goの型・エラー・並行処理

## 適用条件

Goコード全般、goroutine、入力変換。

## 判断基準

ゼロ値と未指定を区別する。constructorと非公開フィールドで不変条件を守り、DB復元時も検証する。エラーを握り潰さず、errors.Is/Asで分類できるようwrapする。想定内の失敗はerror、panicは制御フローにしない。context.ContextはI/Oの先頭引数へ伝播し、共有structへ保存しない。goroutineは開始元が終了・回収・並列数を所有する。

## 理由

Goの型だけでは負数、無効なenum、ゼロ値、typed nilを排除できない。goroutineの放置はリソース漏れになる。

## 具体例

金額をfloat64で足さず、通貨と最小単位の整数または明示したdecimalで表し、丸めとoverflowを検証する。日時は時点・業務日・タイムゾーンを区別する。

## 例外・案件判断

pureなDomainの演算へcontextを形式的に追加しない。同期APIのdeadline方針はAPI規約を優先する。ID形式やdecimalライブラリは案件判断。

## 検証方法

go test、go vet、race detector、入力のfuzz、キャンセル・goroutine終了・境界値を確認する。文字列へのエラー照合やanyによる型回避をレビューする。

[原則索引](index.md) / [構成例](../references/architecture.md) / [公式資料](../references/sources.md) / [設計スキル](../skills/design-backend/SKILL.md)
