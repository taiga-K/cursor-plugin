---
name: implement-frontend
description: 決まった設計に従ってTypeScript・Next.js・FSD・Astryxの画面、部品、薄いBFFを実装する。機能追加・UI変更・原因が特定された修正に使用する。
---

# フロントエンド実装

## 入力

設計と受入条件、対象差分、採用版、API契約。

## 手順

1. 未コミット変更と対象範囲を確認し、検証できる単位を選ぶ。設計不足が責務を変えるなら[設計](../design-frontend/SKILL.md)へ戻る。**不具合の修正なら**、意図した理由で失敗する回帰テスト（または理由付きの代替回帰）が既にあることを確認してから進む。無ければ[バグ修正](../frontend-chief/playbooks/bug-fix.md)へ戻る。
2. [型境界](../../principles/types.md)、[FSD](../../principles/fsd.md)で公開APIと状態を先に表す。生成された型だけで外部値を信頼しない。
3. UIは[Atomic](../../principles/atomic.md)と[Astryx手順](../../references/astryx.md)に従う。設計で選定済みの部品を採用版の CLI か型定義で import path・props を確定し、MCP の記述と差があれば採用版に合わせて記録する。設計に部品選定がなければ実装せず[設計](../design-frontend/SKILL.md)へ戻る。不要なラッパーや空分類を作らない。
4. `shared/ui` と organisms 以上を新設・変更する場合は、[テスト戦略](../../references/testing-strategy.md)に従い状態を網羅する story（と必要な `play`）を実装と同時に追加する。story なしで完了にしない。
5. [Next.js](../../principles/next-state.md)と[BFF](../../principles/bff.md)に従い、サーバー専用コード、セッション、UI向け変換を分ける。BFF・秘密情報モジュールに `import "server-only"` を付ける。[BFF例](../../references/bff-example.md)を失敗設計の参考にする。
6. [利用体験](../../principles/experience.md)、[コンテンツ](../../principles/content.md)、[秘密情報](../../principles/security.md)を画面の状態と入力へ反映する。
7. [検証スキル](../verify-frontend/SKILL.md)で元の受入条件と CI を確認する。予期しない契約変更を発見したら設計へ戻り理由を記録する。

## 出力

変更した振る舞い、設計からの変更理由、検証結果、残る制約。依頼外の改善は別提案として扱う。 [共通形式](../../references/output-contracts.md)を使う。

## 情報不足

利用できないサービスは契約に沿う明示的なモックで局所検証できる。実API確認済みとは報告しない。

## 完了条件

対象範囲の動作と必要なチェックが確認され、未検証を含む報告が実際の結果と一致する。
