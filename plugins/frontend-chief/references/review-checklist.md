# 変更に応じたレビュー観点

全項目を毎回形式的に実施しない。変更に関わる行の原則を読み、破綻する条件を探す。

| 変更 | 観点 | 原則 |
|---|---|---|
| 要件・新規機能 | 利用者の操作と受入条件が対応するか、範囲を増やしていないか | [目的](../principles/outcomes.md) |
| 配置・export | 上位依存、同一レイヤーのcross-import、deep import、不要な抽出、server-only混入 | [FSD](../principles/fsd.md) |
| 型・入力 | unknown境界、型キャスト、未定義の状態、DTOと画面型の責任、`Result` の欠落 | [型](../principles/types.md)、[型の防護](type-guardrails.md) |
| UI部品 | 役割と合成、実際の内容、過剰なラッパー、部品の操作契約、選定記録（候補比較・確認元・採用版との差分）、既存の同役割部品との不一致、必須 story の有無と状態網羅 | [Atomic](../principles/atomic.md)、[Astryx](../principles/astryx.md)、[選定手順](astryx.md)、[テスト戦略](testing-strategy.md) |
| 状態・更新 | URLとstoreの重複、競合応答、二重送信、キャッシュ無効化、hydration | [Next.js](../principles/next-state.md) |
| BFF | 業務判断の侵入、必須/任意の失敗、タイムアウト、非冪等な再試行、`server-only` | [BFF](../principles/bff.md) |
| 認証・公開入口 | サービス側認可、秘密、任意URL転送、公開エラー、CSRF | [セキュリティ](../principles/security.md) |
| 操作 | キーボード、フォーカス、入力保持、エラー関連付け、読み上げ | [体験](../principles/experience.md) |
| コンテンツ | 長文、翻訳、日時・通貨、公開範囲とmetadata | [内容](../principles/content.md) |
| 遅延・依存 | 測定根拠、直列通信、bundle、レイアウト変動、診断可能なログ | [性能](../principles/performance.md) |
| テスト | 決定表に沿う種別選択、独立した期待値、TDD（修正前は落ちる回帰）、locator規約（role優先）、CI URL、未検証の明示。設定や期待値の緩和がないか | [検証](../principles/verification.md)、[テスト戦略](testing-strategy.md) |
| 移行 | 契約の互換性、共存と撤去条件、戻し方 | [保守](../principles/evolution.md) |

報告は[レビュー形式](output-contracts.md)を使う。形式上の不一致をユーザー影響のない重大障害として扱わない。重要度 P0〜P3 は影響範囲で決め、Google の Nit / Optional / FYI に近い指摘は P3 に寄せる。

バグ修正PRでは、修正前は失敗する回帰テスト（または明記した代替回帰）があるかを確認する。無い場合は完了としない。

Steiger の版によっては export-from の依存に検出の限界がある。index の再export先も追い、通常のimport検証が成功しただけで境界が完全に保証されたとしない。
