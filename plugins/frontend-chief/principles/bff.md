# BFFとマイクロサービス

概念：[Backend for Frontend](../references/concepts.md)、[Graceful degradation](../references/concepts.md)、[Railway Oriented Programming](../references/concepts.md)。例は[BFF例](../references/bff-example.md)。

## 適用条件

画面向けAPI・データ集約・API契約変更。

## 判断基準

BFFはNext.js内に置き、表示のための集約・変換を担当する。サービスの業務判断、DB、最終認可を移さない。エンドポイント数ではなく、画面に必要な契約から設計する。失敗は空データへ畳まず、`Result` と判別可能ユニオンで公開する。

推奨：ブラウザのHTTP入口は薄いRoute Handlerにし、必要なサーバー処理は再利用する。Server Componentsは自分のRoute HandlerへHTTPで往復しない。サーバー専用モジュールに `import "server-only"` を付ける。更新はServer Actionも選べるが、読取の汎用RPCにしない。

## 理由

サービスの障害や契約差分をBFFで整理するとUIの複雑さを減らせるが、失敗を成功へ変換すると利用者が誤判断する。

## 具体例

注文情報が必須で推薦が任意なら、推薦の失敗時は『推薦を取得できません』を含む部分成功とする。注文情報が失敗したら注文一覧を空配列に置換せず失敗として表示する。

## 例外

既存Gateway/BFFが同じ責務を持つなら重複させない。独立デプロイ・負荷特性・利用クライアントが分かれた場合は別BFFへの分離を検討し、担当はフロントエンドのままでもよい。

## 検証方法

入力検証、契約変更、必須／任意サービス失敗、タイムアウト、キャンセル、再試行上限を検証する。非冪等な更新は契約上の重複防止なしに自動再試行しない。

[関連スキル](../skills/implement-frontend/SKILL.md) / [原則索引](index.md) / [一次資料](../references/sources.md)
