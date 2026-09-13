---
name: verify-frontend
description: 変更に対応した型検査・FSDチェック・テスト・実ブラウザ確認を選び、ローカルのverifyとCIの結果を完了の証拠としてまとめる。実装後、修正後、検証依頼、CI赤の調査に使用する。
---

# フロントエンド検証

概念：Testing Trophy、Definition of Done。完了の証拠の正本は CI の実行 URL。フックで lint を代替しない。

## 入力

受入条件、差分、実行環境、既存の検証コマンド、PR またはブランチ。

## 手順

1. [検証原則](../../principles/verification.md)で変更と必要な証拠を対応付ける。[テスト戦略](../../references/testing-strategy.md)と[検証ガイド](../../references/verification.md)を読む。
2. 既存の `pnpm verify`（または同等）を実行する。設定がない場合は[setup-frontend](../setup-frontend/SKILL.md)へ誘導する。設定や期待値を通すためだけに緩めない。
3. 変更種別に応じ、単体・story・統合・E2E・a11y を[テスト戦略](../../references/testing-strategy.md)の決定表で選んで実行する。非同期 RSC は Next.js 実行環境で確認する。
4. UI は[利用体験](../../principles/experience.md)、[コンテンツ](../../principles/content.md)、必要なら[性能](../../principles/performance.md)を操作で確かめる。
5. 失敗が変更に由来するか既存状態かを分ける。修正が必要なら原因の証拠を返し、テストを通すためだけに期待値を変えない。`eslint-disable`・`@ts-expect-error`・`test.skip` の追加は理由と期限を付ける。
6. バグ修正の検証では、修正前に落ちる回帰テスト（または理由付きの代替回帰）があることを確認する。無ければ完了条件未達として報告する。
7. CI 確認：利用者が push を指示した、または作業ブランチが既に PR に紐づく場合のみ push する。`main` / 保護ブランチへは push しない。`gh pr checks` または `gh run list` / `gh run view` で CI を確認し、実行 URL を報告に含める。`gh` が使えない・GitHub 以外なら CI URL を利用者から受け取るか Web UI で確認し、確認方法を記す。push しない場合はローカル結果と「CI 未確認」を分けて報告する。
8. 成功・失敗・未実行と実行条件を[検証形式](../../references/output-contracts.md)で報告する。

## 出力

実行コマンド、環境、観測結果、ブラウザ操作、CI URL（または未確認の理由）、未実行と理由。[共通形式](../../references/output-contracts.md)を使う。

## 情報不足

実環境がないときは静的検証とモックの結果を分け、残りを未実行とする。ソースを読んだだけでブラウザ確認済みにしない。CI が無い場合は未整備として報告し、setup-frontend を提案する。既存の個別チェック（lint/test/typecheck）だけで進められる場合はそれを実行し、setup は提案に留める。

## 完了条件

受入条件ごとに証拠または未検証の理由があり、CI が緑で URL が報告に含まれる（CI 未整備・未 push ならその旨とローカル結果を分けて記載）。総括が結果を誇張していない。
