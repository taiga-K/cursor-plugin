# 責務・依存・公開API

概念：FSD Public API / Layers、Clean Architecture の依存規則（[概念対応](../references/concepts.md)）。機械化は[型の防護](../references/type-guardrails.md)と Steiger。

## 適用条件

配置決定・機能分割・リファクタリング。

## 判断基準

先に業務上のまとまりと変更理由を決め、その後にレイヤー・スライス・セグメントを選ぶ。小さな単独ページの処理を必ずfeaturesへ抽出する規約にはしない。依存方向は型と Steiger で不可能にし、レビューだけで守らない。

公式：別スライスへの依存は下位レイヤーへ向かう。AppとSharedはスライスを持たずセグメント間を参照できる。Entitiesの相互関係には公式の@x公開APIがある。推奨：通常の公開APIを使い、@xは実在する関係を示す最小の型連携などに限定して理由を残す。

## 理由

画面の見た目やバックエンドのサービス数で分割すると、ユーザー操作の一変更が多数のモジュールに広がる。

## 具体例

注文詳細ページが注文entityと再注文featureを合成する。再注文featureから取消featureを直接呼ばず、上位で合成する。共通のHTTP通信はshared/api、注文の契約変換はentities/order/apiへ置く。

## 例外

公式の例外と既存移行の一時例外を区別する。移行例外には対象パス・理由・削除条件を付け、プロジェクト全体のルールを無効にしない。

## 検証方法

依存図、公開API、循環参照、deep importを確認し、Steigerと実際のビルドで検証する。サーバー専用exportの漏出も確認する。

[型の防護](../references/type-guardrails.md) / [関連スキル](../skills/design-frontend/SKILL.md) / [原則索引](index.md) / [一次資料](../references/sources.md)
