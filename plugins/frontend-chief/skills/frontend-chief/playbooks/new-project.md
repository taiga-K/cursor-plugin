# 新規導入

入力：作る画面と利用者、制約、API契約、リポジトリ。
1. [調査](../../assess-frontend/SKILL.md)で新規であること、採用版、サービス境界を確認する。
2. [設計](../../design-frontend/SKILL.md)で受入条件、Next.jsの配置、FSDの最小構成、必要なUI状態を決める。
3. [setup-frontend](../../setup-frontend/SKILL.md)で型・lint・Steiger・Vitest・Storybook・Playwright・MSW・CI を導入する。設計の直後に行い、実装前に負例で検出を確認する。
4. [Astryx確認](../../../references/astryx.md)で採用版とCSS・テーマ基盤を確認する。最初の画面はテンプレートから探し、部品は選定手順で決める。
5. [実装](../../implement-frontend/SKILL.md)で最小の実画面とサービス接続を一経路通す。空レイヤーを揃えることを目的にしない。
6. [検証](../../verify-frontend/SKILL.md)で画面の操作、型、境界、失敗状態と CI を確認する。
7. [レビュー](../../review-frontend/SKILL.md)で所有先と品質を確認する。

出力：設計、動作する対象範囲、検証証拠（CI URL）。契約未定なら独立部分だけ進める。完了：受入条件を満たした一経路と明示された制約。プラグインは雛形生成コマンドを提供しない。
