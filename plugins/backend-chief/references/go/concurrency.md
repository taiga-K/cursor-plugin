# 並行処理

対象は複数の処理の調整と資源寿命。ワーカーの耐久性・再配送は[外部連携原則](../../principles/reliability.md)、HTTPのdeadlineは[API規約](../web-api.md)に従う。

| 観点 | 採用する判断と理由 | 条件・例外 | 確認方法 |
|---|---|---|---|
| 並行と並列 | 並行化は処理の構成、並列化は同時実行の手段。必要性と所有者を先に決める | 逐次で十分な処理はgoroutine化しない。待ち時間・競合を測らず高速化を保証しない | 同じ契約での正しさと必要な実測 |
| channel | 方向を型で表し、送信側全体の完了を知る側がcloseする。通常0/1から選ぶ | Nのbufferは流量・上限・backpressureに根拠を持つ。closeは常に必須ではない。受信者の都合だけでcloseしない | 複数送信者、受信停止、満杯、close後の挙動 |
| select | 待ち合わせに終了・キャンセル経路を用意する | defaultによるbusy loop、閉じたchannelからの無限受信、nil channelの永久待機を確認。キャンセルcaseが常に優先されるとは限らない | 入力と取消が同時にreadyな場合も許容する契約 |
| sync | 共有状態はMutexを基本に必要十分な同期を選ぶ。使用後のMutex/WaitGroupをコピーしない | RWMutex/atomicは守る不変条件と測定から選ぶ。複数項目の条件は単一atomicだけで守れない | race検査、copylocks、WaitGroup登録がWaitより先か |
| context | I/Oを行うcall pathの先頭引数へ伝播し、派生contextのcancelを解放する | nilや独自context型、依存注入代わりのValueを避ける。純粋なDomain演算へ不要な引数を足さない | 実際の下流呼出しが渡されたcontextを使うか |
| goroutine終了 | 起動元が停止条件・完了待機・同時実行数を所有する | バックグラウンド処理もプロセス寿命の所有者を明示。cancelを呼ぶだけでは完了待機にならない | 正常、入力切断、下流停止、取消後に全goroutineが終了するか |

期限・timerは目的を区別する。同期Handlerへ一律`WithTimeout`を入れず、受け取ったdeadline/cancelを下流へ伝える。ループでのtimer再利用は必要性を測り、Stop/Resetの仕様を対象版で確認する。Go 1.23前後のtimerの意味の差を無視して古いdrainパターンを機械的に移植しない。

WaitGroupを使う場合は起動前に`Add`し、各goroutineで`Done`を保証する。Go 1.25以降で使える[WaitGroup.Go](https://pkg.go.dev/sync#WaitGroup.Go)も選べるが、対応版と関数がpanicしない契約を確認する。error回収・取消が必要ならその契約も設計する。panicをすべてrecoverして正常終了扱いにしない。

## 例：送信待ちも中断でき、完了を観測できる

独自の転送例。起動元は取消後にdoneを待つ。入力を閉じる責任は入力の所有者にあり、この関数は自分の出力だけを閉じる。取消と送信が同時に可能なら値が送られることはあり、即時の厳密停止は保証しない。

<!-- go-example: concurrency.go -->
```go
package coding

import "context"

// Forward forwards values until input closes or ctx is canceled.
// Callers that stop receiving must cancel ctx and wait for done.
func Forward(ctx context.Context, input <-chan int) (<-chan int, <-chan struct{}) {
	output := make(chan int)
	done := make(chan struct{})
	go func() {
		defer close(done)
		defer close(output)
		for {
			select {
			case <-ctx.Done():
				return
			case value, ok := <-input:
				if !ok {
					return
				}
				select {
				case output <- value:
				case <-ctx.Done():
					return
				}
			}
		}
	}()
	return output, done
}
```

正常転送だけでなく、入力待ち・送信待ちのそれぞれで取消し、doneとoutputの終了を確認する。テストは`sleep`で偶然の成功を待たず、channel等で状態を同期する。テストのtimeoutはハング検知であり、サービスの一律業務deadlineとは別。

[テストの書き方](testing.md) / [一次資料](../sources.md)
