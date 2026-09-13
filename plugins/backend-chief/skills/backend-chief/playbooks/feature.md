# 機能追加

適用：HTTP APIや業務ロジック、DB操作の追加・変更。

## 工程

1. [調査](../../assess-backend/SKILL.md)で契約と実行経路を確認する。
2. [設計](../../design-backend/SKILL.md)で不変条件、認可、取引、失敗、DBとAPIの互換性を決める。
3. [実装](../../implement-backend/SKILL.md)でDomainから一つの経路を完成させる。移行が必要なら先に新旧互換の順を決める。
4. [レビュー](../../review-backend/SKILL.md)で境界・競合・漏洩を確認し、[検証](../../verify-backend/SKILL.md)の結果を受入条件へ対応させる。

## 完了時の成果

変更された利用者の振る舞い、設計判断、選択DB、検証、未解決。

[共通形式](../../../references/output-contracts.md)に従う。省略した工程と未検証は理由を残す。
