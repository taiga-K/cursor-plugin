# テストの書き方

ここはテストコードの設計を判断する文書。何をどの環境で検証するか、実DB・CI・完了の条件は[テスト戦略](../testing.md)が正本。

| 観点 | 採用する判断と理由 | 条件・例外 | 確認方法 |
|---|---|---|---|
| テーブル駆動 | 同じ手順で入力・期待値を変えるテストはtableとsubtestを基本にする | 条件分岐やmockの設定flagだらけになるなら独立したテストへ分ける。単一ケースへ強制しない | 1行のケースから期待する振る舞いを読めるか |
| 名前・構造 | 対象と振る舞いが分かるTest名・subtest名、近接した`_test.go`を使う | 公開契約は外部test packageも選べる。統合テストの既存配置を名前だけで移動しない | `go test -run`で失敗ケースを選択できるか |
| 失敗メッセージ | 操作・入力・got/wantを示す。helperは`Helper()`を呼ぶ | 秘密を失敗出力へ含めない。大きな値は意味のある差分にする | 故意に期待値を変え、原因と呼出し行を追えるか |
| 差替え境界 | 実Domainを使い、I/O・時刻等を利用側の小さな契約で差し替える | fakeで足りるならmock生成器は不要。mockの呼出し順が契約でなければ固定しない | 実装内部の変更だけで壊れるテストになっていないか |
| 継続改善 | 不具合は再現する負例を追加し、修正前後を確認する | カバレッジ率を品質の代理にしない。単純な表現変更へ実装の複写テストを追加しない | 新しいテストが対象の不具合を検出するか |

資源の解放は`Cleanup`でテストの寿命に結びつける。`Parallel`はケースが可変状態・環境変数・DB等を安全に分離できるときに使う。すべてのテストへ付けない。Go 1.22未満の言語設定ではrange変数の捕捉に注意し、現行toolchainで走ったという理由だけで捕捉用変数を削除しない。

エラーは`Is/As`で契約を確認し、文字列は文字列自体が契約の場合に比較する。JSONも構造・型・nil/空の契約を確認し、タイムスタンプを含む全体snapshotだけに頼らない。HTTPは`httptest`、DBは選択製品の実DBでしか保証できない挙動を区別する。fuzz・benchmarkは入力空間・性能に検証価値がある場合に選ぶ。

## 例：分類と公開ドキュメントを検証する

[エラー例](errors-and-control-flow.md)のParseLimitに対する独自例。失敗メッセージから入力と期待分類を特定できる。Exampleは出力を持つため実行される。

<!-- go-example: example_test.go -->
```go
package coding

import (
	"errors"
	"fmt"
	"testing"
)

func TestParseLimit(t *testing.T) {
	tests := []struct {
		name    string
		input   string
		want    int
		wantErr error
	}{
		{name: "positive", input: "8", want: 8},
		{name: "zero", input: "0", wantErr: ErrInvalidLimit},
		{name: "negative", input: "-1", wantErr: ErrInvalidLimit},
		{name: "text", input: "many", wantErr: ErrInvalidLimit},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := ParseLimit(tt.input)
			if got != tt.want || !errors.Is(err, tt.wantErr) {
				t.Errorf("ParseLimit(%q) = (%d, %v), want (%d, %v)",
					tt.input, got, err, tt.want, tt.wantErr)
			}
		})
	}
}

func ExampleParseLimit() {
	limit, err := ParseLimit("8")
	fmt.Println(limit, err)
	// Output: 8 <nil>
}
```

ここではsubtestを並行化しておらず、次のiterationに進む前に呼出しが終わるため、古い言語版でも捕捉用の再宣言は不要。

[命名・コメント](naming-and-comments.md) / [並行処理](concurrency.md) / [一次資料](../sources.md)
