---
name: migrate-frontend
description: 既存フロントエンドをFSD・Astryx・Next.jsの標準へ段階移行する。新旧共存、互換性、撤去条件、回帰検証が必要な依頼に使用する。
---

# フロントエンド移行

## 入力

現状、目標、変更可能範囲、既存契約、利用中の検証。

## 手順

1. [調査](../assess-frontend/SKILL.md)で基準となる動作を確認する。[変更原則](../../principles/evolution.md)で対象と対象外を明示する。
2. [設計](../design-frontend/SKILL.md)で移行単位・共存・adapter・削除条件・戻し方を決める。未合意のAPI契約変更を含めない。
3. Astryxなら[導入確認](../../references/astryx.md)でCSS基盤とテーマを先に確認し、旧部品ごとに選定手順で対応するAstryx部品を比較して対応表を作る。名前が似ている部品を機械的に対応付けない。FSDなら公開APIと依存を移行する単位を決める。
4. [実装](../implement-frontend/SKILL.md)と[検証](../verify-frontend/SKILL.md)を単位ごとに実施する。局所の移行を完了する前に全体へ広げない。
5. 削除条件を満たした旧参照、二重設定、adapterを除去し再検証する。[レビュー](../review-frontend/SKILL.md)で残る例外を確認する。

## 出力

移行形式。完了した対象範囲、残る旧構成、削除条件、回帰結果を明記する。 [共通形式](../../references/output-contracts.md)を使う。

## 情報不足

移行先のAPIが未確認ならその部分を止め、基盤調査と契約確認を進める。既存を一括置換することで不確実性を解消しない。

## 完了条件

合意した範囲が標準へ移り、その範囲の二重管理が解消されている。全体移行と局所完了を区別する。
