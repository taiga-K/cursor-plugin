---
name: update-backend
description: Go・Gin・DBドライバ・検証ツール・参照ガイドラインを更新する。採用版追従や標準変更の反映に使用する。
---

# バックエンド標準・依存の更新

## 入力

更新対象、採用版、変更履歴、既存契約と検証。

## 手順

1. [公式資料](../../references/sources.md)と採用版のrelease notesを読み、互換性・廃止・脆弱性修正・生成コードへの影響を調べる。
2. 必要な更新範囲と戻せる単位を決める。DB製品やORMの全面交換を依存更新に混ぜない。
3. go.mod/go.sum、生成ツールとCIの版、必要なコードを更新する。ガイドライン変更は[API](../../references/web-api.md)・[ログ](../../references/logging.md)への差分を記録する。
4. [verify-backend](../verify-backend/SKILL.md)で対象DBとHTTP契約を検証し、既存の設定・設計記録と変更理由を更新する。プラグイン文書の更新ならvalidatorと[利用評価](../../evals/scenarios.md)を確認する。

## 出力

採用版の変更、互換性判断、更新差分、検証、既存維持や保留の理由。 [共通形式](../../references/output-contracts.md)に従う。

## 情報不足

最新版を取得できない場合は最新と断言しない。版固定を勝手に外さず確認元を示す。

## 完了条件

指定更新が反映され、旧契約への影響と必要な検証が確認できる。
