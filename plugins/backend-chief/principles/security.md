# 認証・認可・データ境界

## 適用条件

公開入口、認証、マルチテナント、外部入力。

## 判断基準

認証済み主体からtenantと権限を確定し、リクエストのtenant_idを信頼しない。Applicationで操作と対象への最終認可を行い、Repositoryの条件にtenantを含める。API入口の構文検証とDomainの意味検証を分ける。値をSQLに連結せず、列名・sort・NoSQL演算子は許可リストで組み立てる。

## 理由

BFFやGatewayの検証だけでは、別経路やバッチ経由の権限逸脱を防げない。

## 具体例

他テナントのorder_idを渡した要求を拒否する。NoSQL検索は利用者のJSONをそのままフィルタに渡さず、型付きDTOから必要な条件だけを構成する。

## 例外・案件判断

認証プロバイダー、RBAC/ABAC、Cookie/Bearerの選択は案件依存。トークン検証では署名・発行者・対象・期限を方式に応じて確認し、独自暗号を作らない。

## 検証方法

未認証、権限不足、他tenant、存在漏洩、過剰な入力、mass assignment、SSRF対象URL、ログの秘密漏洩をテストする。

[原則索引](index.md) / [構成例](../references/architecture.md) / [公式資料](../references/sources.md) / [設計スキル](../skills/design-backend/SKILL.md)
