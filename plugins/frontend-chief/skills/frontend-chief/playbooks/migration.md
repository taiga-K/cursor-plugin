# 段階移行

入力：現在の構成、目標、変更可能範囲。
1. [調査](../../assess-frontend/SKILL.md)で既存動作と検証の基準を残す。
2. [移行](../../migrate-frontend/SKILL.md)で対象・単位・共存・撤去条件・戻し方を決める。
3. 検証基盤が無い／不足なら[setup-frontend](../../setup-frontend/SKILL.md)で差分統合する。既存 CI を尊重し、置換しない。
4. Astryxなら[導入確認](../../../references/astryx.md)のCSS・テーマ基盤を検証し、旧部品ごとに選定手順で対応する部品を比較して対応表を作ってから一部品、一画面へ進む。
5. FSDなら[配置基準](../../../references/architecture.md)で公開APIと依存の移行を確認する。Next.jsなら採用版の公式移行資料を確認する。
6. 単位ごとに[実装](../../implement-frontend/SKILL.md)、[検証](../../verify-frontend/SKILL.md)、[レビュー](../../review-frontend/SKILL.md)を行う。
7. 旧参照と一時adapterを撤去し、対象範囲の完了と未移行範囲を報告する。

出力：移行計画、完了単位、回帰証拠（CI URL）、残る例外。情報不足：未知の契約に依存する単位を分ける。完了：対象範囲の二重管理が解消し、戻し方を含む検証が済んでいる。
