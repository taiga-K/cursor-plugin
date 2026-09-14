# 型・データ構造

対象は値の初期化・所有権・変換とreceiver、generics。Domainの生成・再構成・不変条件は[Domain実装](../domain-implementation.md)に従う。

| 観点 | 採用する判断と理由 | 条件・例外 | 確認方法 |
|---|---|---|---|
| ゼロ値の利用 | `sync.Mutex`やbuffer等の有効なゼロ値を直接使う | nil mapへの書込みやnil依存は安全にならない。ゼロ値と未指定を混同しない | 未初期化状態・初回操作をテスト |
| struct初期化 | フィールド名付きリテラルを標準にし、不要なゼロ指定を省く。参照は通常`&T{}` | 意図を伝えるゼロ指定は許容。`new(expr)`はGo 1.26以降であり、`new(T)`との役割を区別する | 項目追加・並替えで意味が変わらないか |
| receiver | 変更する型、mutexを含む型、コピー禁止の型はpointer。同一型のreceiverを揃える | 小さな不変値はvalueを選ぶ。value receiverでもslice/map等の参照は共有される。map/chan自体へのpointerは通常不要 | コピーで更新が消えないか、`go vet`のcopylocks、所有権テスト |
| 宣言 | 関数内で初期値があるなら`:=`、意図的なゼロ値なら`var` | packageレベル・明示型・外側への代入は適切な宣言を選ぶ。`err`のshadowingに注意 | scopeとdeferから参照される変数を追う |
| slice/map | 内部の空sliceはnilを標準にし、空判定は`len`。mapの書込み前に初期化する | JSONの`null`と`[]`、nilと空が意味を持つ契約は維持。要素数が分かる場合の確保と、根拠のない性能最適化を区別 | nil/空、len/cap、JSON、入力・返却後の変更をテスト |
| enum | 名前付き型と定数を使い、ゼロを未設定/不正として予約することを基本にする | ゼロが自然な有効値なら明示して許容。型だけで範囲外castは防げず境界で検証する。保存値をiotaの並替えで変えない | ゼロ・未知値・旧保存値・変換のテスト |
| generics | 複数の型で同じアルゴリズムと制約を再利用する場合に選ぶ | 1つの業務型のために汎用Repositoryや万能制約を作らない。振る舞いの差替えはinterface、単純な処理は具象型で十分 | 型ごとの重複が減るか、制約で必要操作を表せるか |

## sliceの容量制限はコピーではない

`s[:n:n]`はappendによる容量内の上書きを制限するが、既存要素は元の配列と共有する。要素への代入を防ぐには独立した配列が必要。さらにslice/map/pointerを要素に持つ場合、浅いコピーでは要素の参照先が共有される。型の不変性・所有権に応じ、必要な深さでコピーする。[Go仕様](https://go.dev/ref/spec#Slice_expressions)

次は参照を含む入力と返却値を保護する独自例。Labelsはゼロ値も空として有効なコレクションであり、業務上必須の値までゼロ値で有効にする指定ではない。

<!-- go-example: types.go -->
```go
package coding

// Label is a label and its aliases in a transport or input value.
type Label struct {
	Name    string
	Aliases []string
}

// Labels owns its values. Its zero value is an empty collection.
type Labels struct {
	values []Label
}

// NewLabels copies values, including their aliases.
func NewLabels(values []Label) Labels {
	return Labels{values: cloneLabels(values)}
}

// Values returns an independent copy of the labels.
func (l Labels) Values() []Label {
	return cloneLabels(l.values)
}

func cloneLabels(values []Label) []Label {
	if values == nil {
		return nil
	}
	result := make([]Label, len(values))
	for i, value := range values {
		result[i] = value
		if value.Aliases != nil {
			result[i].Aliases = make([]string, len(value.Aliases))
			copy(result[i].Aliases, value.Aliases)
		}
	}
	return result
}
```

このコピーは示した型に対するもの。循環参照・共有identityを持つDomainを汎用deep-copyで複製しない。等価性もアドレスや機械的な全フィールド比較ではなく業務の値に基づいて定義する。

[interface・パッケージ](interfaces-and-packages.md) / [一次資料](../sources.md)
