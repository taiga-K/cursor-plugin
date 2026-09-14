# interface・パッケージ

対象はGoの型・関数のAPIと依存関係。Web APIの契約は[API規約](../web-api.md)、Domain/Repository/Query/Txの所有は[構成](../architecture.md)が正本。

| 観点 | 採用する判断と理由 | 条件・例外 | 確認方法 |
|---|---|---|---|
| 小さなinterface | 利用側が必要な振る舞いで定義する。実装の全メソッドを複写しない | mock用の形式的抽象を増やさない。意味のまとまりを1メソッドずつ分割しない | 各利用者が必要とするメソッドと依存方向を確認 |
| 引数と戻り値 | 差替えに意味がある引数はinterface、返却は具象型を基本にする | 内部実装の非公開化・複数実装の選択が契約ならinterface返却を許容。内側のAPIが外側の具象型をimportしない | 公開面と将来の互換性、実際の差替えを確認 |
| constructor | ゼロ値で安全に使えない型は`New`で依存と値を検証し、失敗をerrorで返す | exported型は`New`を迂回してゼロ値を作れる。非公開フィールドだけで不正状態の生成を完全禁止できると説明しない | ゼロ値・不正引数・nil依存と公開操作の契約を確認 |
| 最小のexport | 必要な契約だけ公開する。埋込みによる意図しないメソッド公開を避ける | 単純なDTOの公開フィールドは有用。Domainの不変条件を無条件setterや公開フィールドで破らない | 利用側から呼べる操作と変更可能な状態を列挙 |
| 使えるゼロ値 | 自然に有効な型は初期化負担を減らす | 必須IDや金額等を無理に有効化しない。constructor、公開操作の防御、必要な非公開型で契約を守る | constructorなしでの利用と業務上の有効性を別々に確認 |
| cleanup契約 | 獲得と解放の責任を対にする。通常は`Close() error`、組立てた複数資源はcleanup関数も使う | すべてのconstructorへcleanup返却を付けない。途中失敗時の解放、複数回呼出し、解放失敗の扱いを定義 | 獲得途中失敗、正常終了、再終了、close失敗を確認 |
| package名と分割 | 提供する機能で短く名付け、凝集度と公開境界で分ける | 機械的な複数形禁止や一型一ファイル、一集約一moduleを要求しない | 呼出し側で意味が通り、変更理由がまとまるか |
| internal/cmd | 公開しないコードにinternalを使い、mainは設定・配線・実行を担当する | internalはディレクトリに基づくimport制限であり、Domainの純粋性を自動保証しない。既存構成は必要な範囲で活用 | 実packageのimportと公開意図を確認 |
| 循環依存 | 境界の誤りを見直す。利用側interface、責務の抽出、凝集したpackageの統合を比較する | 循環回避だけの共通modelに業務概念を寄せない | import graphと内向き依存を検証 |
| global/init | 可変状態とI/Oの隠れた初期化を避け、起動処理から依存を渡す | sentinel error、静的な表、登録用途等は理由があれば許容。時計を全体globalでテスト差替えしない | import時の副作用、初期化失敗、テストの独立性を確認 |
| util/common/base | 責務の分からない置場を作らず、単一利用のhelperは利用側へ置く | 既存package名だけを根拠に全体再配置しない。切出しは機能と依存のまとまりで決める | 新しいhelperの所有先と利用箇所を確認 |
| 依存の最小化 | 標準ライブラリで足りるか確認し、外部依存の保守・安全性・価値を比較する | 暗号等の難しい処理を依存削減のために自作しない。コード複製を一般推奨にしない | 採用版、利用範囲、既存依存との重複を確認 |

## interfaceの配置と準拠確認

「利用側」は常にApplicationを意味しない。Domain Serviceが利用するRepositoryはDomainの契約になり得る。外側のAdapterで`var _ domain.Repository = (*Repository)(nil)`と確認しても、依存が外側から内側へ向いていれば適切。準拠確認を同一packageか標準ライブラリのinterfaceだけに限定せず、依存方向で判断する。逆向きのimportや循環を作る準拠確認は避ける。

## 例：必要な能力を受け取り、資源の所有を移さない

この関数は渡されたReaderを閉じない。Closeの責任は獲得した呼出し元にある。最大量の指定は外部入力の読取りに対する契約であり、全Domain関数へ技術的制限を付ける例ではない。ErrInvalidLimitは[エラー例](errors-and-control-flow.md)の定義を使う。入力rは非nil、許容するmaxBytesは1からMaxInt-1とする。

<!-- go-example: interfaces.go -->
```go
package coding

import (
	"errors"
	"fmt"
	"io"
)

// ErrTooLarge indicates that a payload exceeds its allowed size.
var ErrTooLarge = errors.New("payload too large")

// ReadPayload reads at most maxBytes, probing one extra byte for overflow.
// The caller owns r and must close it if necessary. Read errors are wrapped.
// r must be non-nil; maxBytes must be between 1 and MaxInt-1 inclusive.
func ReadPayload(r io.Reader, maxBytes int) ([]byte, error) {
	if maxBytes <= 0 || maxBytes == int(^uint(0)>>1) {
		return nil, ErrInvalidLimit
	}
	data, err := io.ReadAll(io.LimitReader(r, int64(maxBytes)+1))
	if err != nil {
		return nil, fmt.Errorf("read payload: %w", err)
	}
	if len(data) > maxBytes {
		return nil, ErrTooLarge
	}
	return data, nil
}
```

Goはinterfaceに入ったtyped nilを一律安全には扱えない。nilの可否は入力契約で定め、汎用reflect検査で全依存を包むことを標準にしない。

Functional Optionsは任意設定が増え、その意図を明確にできる場合に選ぶ。小さなconstructorは通常引数または設定structで十分。必須依存を任意optionへ隠さず、競合するoptionや不正値を初期化時に検証する。

[型・データ構造](types-and-data.md) / [一次資料](../sources.md)
