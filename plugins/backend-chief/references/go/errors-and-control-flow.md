# エラー・制御構文

対象は失敗の契約、分岐とループ、資源解放。

| 観点 | 採用する判断と理由 | 条件・例外 | 確認方法 |
|---|---|---|---|
| errorは値 | 戻り値を検査し、呼出し側が判断できる分類を設計する | メッセージ解析で制御しない。成功は明示的な`nil`を返しtyped nilを避ける | 成功・失敗とinterface化したnilをテスト |
| エラーの公開面 | 分岐だけならsentinel、属性が必要なら型、判別不要ならopaque errorを選ぶ | 公開する型・sentinel・unwrap先は互換性契約になる。SDK型を業務契約にしない | `errors.Is/As`の結果と利用者の分岐を確認 |
| wrap | 操作を識別する文脈を添え、原因を公開する契約なら`%w`で保持する | 全境界で自動wrapしない。外部の詳細を隠す場合は内部で原因を扱い契約エラーへ変換。秘密をメッセージへ含めない | wrap後の分類とHTTP/ログへの漏出を検証 |
| 一度だけ処理 | 回復・変換・伝播・最終記録の責任を決め、同じ失敗を各層でlogしてreturnしない | fallback等でその場で処理を完結する記録は許容。採用ログ形式は[ログ規約](../logging.md)に従う | 失敗1回に対する記録数と復旧結果を確認 |
| panic | 想定する入力・I/O失敗はerror。通常の分岐やライブラリ内の`log.Fatal/os.Exit`を避ける | 静的な不変設定のMustは起動時の限定用途。recoverは同じgoroutineでのみ働く | 異常入力でプロセス終了せず、cleanupが実行されるか |
| エラーを減らす設計 | APIの状態や操作を整理し、不要な失敗条件をなくす | 削除対象なしを成功とする等は業務契約が認める場合だけ。握り潰しや暗黙fallbackへ置換しない | 「失敗しなくなった」後も要件を満たすか |
| 浅い分岐 | guard・早期returnで正常経路を追いやすくする | Txやcleanupを飛ばさない。順序依存の条件は同値性を検証する | 同じ入力で結果と副作用が一致するか |
| switch | 同じ対象の多分岐や排他的条件を整理する | 2条件でも常にswitchにしない。順序・default・fallthroughによる意味を確認 | 境界条件、未知値、複数条件一致をテスト |
| range | 要素はコピーされる。元を変えるならindexから操作する。map順序に依存しない | ループ内の変数宣言と既存変数への代入を区別。捕捉対策の削除は言語版と振る舞いを確認 | 構造体要素の更新、closure、subtestを実行 |
| defer | 関数の全終了経路で片付ける。登録時の引数評価とLIFOを理解する | ループ内は関数に区切る等で寿命を限定。Close/commitの失敗を戻り値へ反映する必要性を契約で判断 | 途中失敗、解放順序、cleanup失敗をテスト |
| 明示return | 結果を明示して返し、naked returnを標準にしない | named result自体は禁止しない。deferが返すerrorを更新する等の用途を許容し、shadowingを避ける | 全return経路とdefer後の実際の戻り値を確認 |

メッセージは通常小文字で始め、末尾の句点や冗長な「error」「failed to」を避ける。固有の識別子・既存の機械可読契約まで文体のために壊さない。ユーザー向け表示文・ログの固定メッセージとは区別する。

## 例：公開するエラーの境界を限定する

変換ライブラリのエラー型を公開せず、呼出し側へ保証する分類を保つ独自例。内部原因の観測が必要なら境界内で扱い、秘密や生errorをHTTPへ返さない。

<!-- go-example: errors.go -->
```go
package coding

import (
	"errors"
	"fmt"
	"strconv"
)

// ErrInvalidLimit indicates that a limit is not a positive integer.
var ErrInvalidLimit = errors.New("invalid limit")

// ParseLimit parses a positive limit. Invalid input wraps ErrInvalidLimit.
func ParseLimit(raw string) (int, error) {
	limit, err := strconv.Atoi(raw)
	if err != nil || limit <= 0 {
		return 0, fmt.Errorf("parse limit: %w", ErrInvalidLimit)
	}
	return limit, nil
}
```

Go 1.26の`errors.AsType`は対応版が条件を満たす場合に使う。それ以前は`errors.As`を使い、採用版の引上げを記法改善に混ぜない。Go 1.22以降のループ変数の意味はmoduleの`go`宣言とfileのbuild制約にも依存する。`for _, v = range ...`は既存変数への代入であり、新しい変数宣言と同じ扱いにしない。

[型・データ構造](types-and-data.md) / [並行処理](concurrency.md) / [一次資料](../sources.md)
