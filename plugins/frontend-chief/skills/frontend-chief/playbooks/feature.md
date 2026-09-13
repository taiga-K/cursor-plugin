# 機能追加

入力：ユーザー操作、期待する結果、対象画面またはBFF。
1. [調査](../../assess-frontend/SKILL.md)で呼出し元と契約・既存の状態を確認する。
2. [設計](../../design-frontend/SKILL.md)で責務・公開API・データフロー・UI状態を決める。新しいUI部品を使うなら[Astryx選定手順](../../../references/astryx.md)で候補を比較して記録する。[BFF原則](../../../principles/bff.md)でサービス本体との境界を確認する。
3. 受入条件を Given-When-Then で書き、可能なら先に失敗する story の `play`・統合テスト・E2E のいずれかとして置く（BDD）。強制はバグ修正の TDD のみ。種別名は[テスト戦略](../../../references/testing-strategy.md)の決定表に従う。
4. [実装](../../implement-frontend/SKILL.md)で型と境界から始め、表示と操作を接続する。`shared/ui` と organisms 以上は story を同時に作る。
5. [検証](../../verify-frontend/SKILL.md)で成功・空・失敗・必要な部分成功を確認する。完了の証拠は CI URL。
6. [レビュー](../../review-frontend/SKILL.md)で回帰と依存境界を確認する。

出力：設計理由、変更、検証結果（CI URL）。情報不足：契約の不明部分を仮定と明示。完了：追加した操作の結果と失敗時の状態が検証できている。
