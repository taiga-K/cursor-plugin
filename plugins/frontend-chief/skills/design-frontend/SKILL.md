---
name: design-frontend
description: Next.js・FSDの責務、公開API、状態とBFFのデータフローを設計する。境界をまたぐ変更、機能追加、技術選定に使用する。
---

# フロントエンド設計

## 入力

目的と受入条件、現状調査、契約、制約。小さな局所変更なら回答内の短い設計でよい。

## 手順

1. [目的](../../principles/outcomes.md)から観測可能な成功条件を定める。重要な意図の未決事項だけ確認する。
2. [構成例](../../references/architecture.md)と[FSD](../../principles/fsd.md)で所有先と公開APIを決める。画面とマイクロサービスの境界を一対一対応させない。
3. [型](../../principles/types.md)、[状態](../../principles/next-state.md)、[BFF](../../principles/bff.md)でデータフロー、状態、失敗、キャッシュの責任を決める。
4. UIに関わる[Atomic](../../principles/atomic.md)、[Astryx](../../principles/astryx.md)、[利用体験](../../principles/experience.md)を適用する。UI部品を新設・変更するなら[選定手順](../../references/astryx.md)を実行する：要件を役割・状態・操作で書き、Astryx MCPの `search` を複数の言い回しで実行し、候補2〜3を `get` で読んで比較表を作り、選定と落とした理由を設計に記す。記憶から部品名を書かない。
5. 有力な代替案と変更コストを比較する。[技術選定表](../../references/tooling.md)の条件に合わない依存を追加しない。
6. [セキュリティ](../../principles/security.md)、[性能](../../principles/performance.md)の影響を評価し、実装単位と検証条件を決める。

## 出力

設計形式の項目を満たす。UIを含む場合は部品選定の記録を含める。API変更は入出力・エラー・互換性・合意状況も記述する。 [共通形式](../../references/output-contracts.md)を使う。

## 情報不足

不明なAPIレスポンスやAstryxのpropsを作らない。Astryx MCPが使えないならCLIの `search` で代替し、それも無理なら部品選定を未確認として切り出す。独立に設計できる責務を進め、依存する部分に仮定と確認先を示す。

## 完了条件

次工程が所有先、境界、UI状態、使う部品、採用理由、完了条件を判断し直さず実装できる。
