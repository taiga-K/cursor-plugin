# Goの型・エラー・並行処理

## 適用条件

Goコード全般、goroutine、入力変換。実装・修正・レビューの具体手順は[go-coding](../skills/go-coding/SKILL.md)へ進み、必要な分野だけ読む。

## 判断基準

ゼロ値と未指定を区別する。constructor・公開操作・非公開フィールドで不変条件を守る。[Domain実装](../references/domain-implementation.md)に従い、新規生成と再構成を区別し、復元時に守る条件と旧版データの扱いを決める。VOの等価性と不変性を定義し、slice/map/pointerの参照共有による外部変更を防ぐ。エラーを握り潰さず、公開する原因はerrors.Is/Asで分類できるよう保持する。境界で隠す外部詳細は契約エラーへ変換する。想定内の失敗はerror、panicは制御フローにしない。context.ContextはI/Oの先頭引数へ伝播し、共有structへ保存しない。goroutineは開始元が終了・回収・並列数を所有する。

## 理由

Goの型だけでは負数、無効なenum、ゼロ値、typed nilを排除できない。goroutineの放置はリソース漏れになる。

## 具体例

金額をfloat64で足さず、通貨と最小単位の整数または明示したdecimalで表し、丸めとoverflowを検証する。日時は時点・業務日・タイムゾーンを区別する。

## 例外・案件判断

変更対象の命名・宣言・制御構文は[Goコーディング標準](../skills/go-coding/SKILL.md)へ揃え、公開互換性と採用版を守る。pureなDomainの演算へcontextを形式的に追加しない。同期APIのdeadline方針はAPI規約を優先する。ID形式やdecimalライブラリは案件判断。

## 検証方法

go test、go vet、race detector、入力のfuzz、キャンセル・goroutine終了・境界値を確認する。文字列へのエラー照合やanyによる型回避をレビューする。

[原則索引](index.md) / [構成例](../references/architecture.md) / [公式資料](../references/sources.md) / [設計スキル](../skills/design-backend/SKILL.md)
