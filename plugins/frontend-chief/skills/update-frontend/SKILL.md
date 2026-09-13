---
name: update-frontend
description: setup-frontendが導入した検証基盤を、プラグインtemplates・依存・GitHub Actionsの版差分に追従させる。依存更新やプラグイン更新後の再整合に使用する。
---

# フロントエンド検証基盤の更新

## 入力

現行の設定ファイル、ロックファイル、`.github/workflows`、プラグインの [templates/](../setup-frontend/templates/)。

## 手順

1. templates と現行設定の差分、依存の版差分、Actions の版タグ差分を列挙する。
2. 破壊的変更を採用版の公式 docs・CHANGELOG で確認する。不明な API を推測で埋めない。
3. 差分を統合する。案件固有の例外（Steiger の狭い除外など）は理由付きで残す。
4. `pnpm verify`、必要なら `pnpm build` と `pnpm test:e2e` を実行する。
5. [negative-cases.md](../setup-frontend/templates/negative-cases.md) から代表的な負例を再確認する。
6. Astryx 採用なら upgrade コマンド（採用版の名称に従う）を実行し結果を記録する。
7. Dependabot PR を扱う場合：changelog を読み、`verify` が通ることを確認してからマージ判断を利用者に渡す。設定を緩めて通さない。
8. 更新報告：版差分、取り込んだ変更、残した例外、検証結果、CI URL（実行した場合）。

## 出力

差分一覧、検証結果、残課題。[共通形式](../../references/output-contracts.md)を使う。

## 情報不足

上流の互換性が崩れている場合は更新を止め、互換版または段階更新案を示す。

## 完了条件

列挙した差分への対応方針が決まり、必要な検証が通り、報告が結果と一致する。
