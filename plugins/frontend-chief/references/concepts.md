# 概念対応表

このプラグインは独自の用語を増やさない。使う語は確立された概念へ対応付け、対応できない語は改名するか削除する。新しい語を導入する前に既知の概念名を探し、見つからなければ導入しない。

| プラグインでの言い方 | 一般概念 | 一次資料 |
|---|---|---|
| 四層防御（型・CI・スキル・手順） | Defense in depth、Shift-left testing | セキュリティ工学の多層防御、テストのシフトレフト |
| 外部値を `unknown` で受け境界で検証 | Parse, don't validate、Ports and Adapters の境界 | Alexis King "Parse, don't validate"、Hexagonal Architecture |
| `Result` / 成功・失敗の戻り値 | Railway Oriented Programming、Either | Scott Wlaschin ROP、関数型の Either |
| 判別可能ユニオンで UI 状態 | Make illegal states unrepresentable | Yaron Minsky、型駆動設計 |
| 部分失敗の `degraded` | Graceful degradation | 分散システム／フロントの段階的劣化 |
| Next.js 内の画面向け API | Backend for Frontend (BFF) | Sam Newman / SoundCloud、Next.js BFF ガイド |
| 公開 API・レイヤー依存方向 | FSD Public API / Layers、Clean Architecture の依存規則 | FSD 公式、Uncle Bob Clean Architecture |
| 採用理由・落とした案・部品選定の記録 | Architecture Decision Record (ADR) | Michael Nygard |
| 負例で検出を確認 | Mutation testing（テストのテスト）の考え方 | ミューテーションテスト |
| テスト種別の決定 | Testing Trophy、Test Pyramid、Testing Library 指針 | Kent C. Dodds、Martin Fowler、Testing Library |
| バグ修正は失敗テストから | TDD（Red-Green-Refactor） | Kent Beck |
| 受入条件を先にテストとして書く | Acceptance criteria、Given-When-Then (BDD) | Dan North BDD、Gherkin |
| 完了の定義 | Definition of Done | Scrum Guide |
| レビュー重要度 P0〜P3 | 業界慣行の優先度。Google の Nit / Optional / FYI と対応を注記 | Google Code Review Developer Guide |
| Atomic の分類フォルダは必要なものだけ | Brad Frost Atomic Design と FSD FAQ に基づく配置の選択（概念ではなく運用） | Atomic Design 原著、FSD FAQ |

原則本文では「公式」「推奨」「案件判断」を区別する。公式は一次資料の定義、推奨はこのプラグインの規約、案件判断は利用者・プロダクトの制約で決める。

関連：[型の防護](type-guardrails.md) / [テスト戦略](testing-strategy.md) / [一次資料](sources.md)
