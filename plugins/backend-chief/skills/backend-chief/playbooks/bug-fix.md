# バグ修正

適用：誤動作、競合、リソース漏れ、回帰。

## 工程

1. [調査](../../assess-backend/SKILL.md)で同じHTTP/worker/DB操作を再現し、観測から原因を絞る。
2. 失敗する回帰テストを作る。実DBの並行性が原因ならmockだけで置き換えない。
3. 境界や契約に影響する場合は[設計](../../design-backend/SKILL.md)し、[実装](../../implement-backend/SKILL.md)で原因を修正する。無関係な全面移行はしない。
4. [検証](../../verify-backend/SKILL.md)で元の条件が通ることと関連する失敗経路を確認する。

## 完了時の成果

原因、再現、修正、変更前の失敗と変更後の証拠。

[共通形式](../../../references/output-contracts.md)に従う。省略した工程と未検証は理由を残す。
