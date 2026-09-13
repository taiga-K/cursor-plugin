# 型と外部入力の境界

概念：[Parse, don't validate](../references/concepts.md)、[Make illegal states unrepresentable](../references/concepts.md)、[Railway Oriented Programming](../references/concepts.md)。詳細は[型の防護](../references/type-guardrails.md)。

## 適用条件

API・URL・ストレージ・フォーム・状態設計。

## 判断基準

型は値の意味と取り得る状態を表す。外部値をunknownとして受け、境界で検証して内部へ渡す。型注釈や生成されたDTOだけでは実行時データを検証できない。型で不可能にできるものを lint やレビューだけで守らない。

推奨：strictと[型の防護](../references/type-guardrails.md)のフラグを基礎に、判別可能なunionと `Result` で成功・失敗・部分成功を表す。型の出典はスキーマの `z.infer`（または同等）に限る。型アサーションやanyで不整合を隠さない。IDの混同が実害になる場所でのみブランド型などを検討する。

## 理由

booleanの組み合わせや無条件の型キャストは、矛盾する状態と不正データを後工程へ渡す。

## 具体例

{ status: 'ready', items: [] }と{ status: 'failed', reason: 'timeout' }を区別する。金額の通貨・単位をAPI契約に従って扱い、画面の丸めを決済額の確定処理に流用しない。

## 例外

検証済みの内部値を全関数で再検証しない。生成コードの制約は呼出し境界で吸収する。非null assertionが必要なら成立根拠と壊れる条件を説明する。

## 検証方法

型検査に加え、未知のenum、欠落値、null、境界値、不正なURL値を使う。API契約とUI用型の変換をテストする。

[型の防護](../references/type-guardrails.md) / [関連スキル](../skills/implement-frontend/SKILL.md) / [原則索引](index.md) / [一次資料](../references/sources.md)
