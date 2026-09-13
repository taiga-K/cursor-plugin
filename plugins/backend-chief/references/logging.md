# ログ規約の適用

指定資料は[Futureログ設計ガイドライン](https://future-architect.github.io/arch-guidelines/documents/forLog/log_guidelines.html)。確認日2026-09-13。実装時は該当節を読み、以下の索引と対応させる。

## 指定資料の対応表

| 参照する節 | 採用する規約 | 検証 |
|---|---|---|
| レイアウト | JSON Lines。ローカルだけ非構造形式も可 | 各行のJSON parse |
| 推奨するキー名称 | 共通スキーマと用途別の拡張、ベンダー依存の変換は収集側 | キー・型・単位 |
| ログレベル | 業務コードはDEBUG〜ERROR、LOG_LEVELで設定 | 環境別出力 |
| メッセージコード・ドキュメント管理 | WARN以上にコードと対応手順を紐づける | 定義表との照合 |
| ユーザーメッセージとログ | 開示用と診断用を分離し、相関IDで追跡 | 生エラー非公開 |
| アクセスログ | 入口と応答を記録、ヘルスチェックを除外 | 正常・失敗・panic |

## Go側の推奨実装

slogを使い、JSONHandlerのReplaceAttr等でtime→timestamp、level→severity.text、msg→messageを調整する。[slog公式](https://pkg.go.dev/log/slog)

起動時にservice.name、service.version、deployment.environmentを付与する。HTTPではrequest.id、http.request.method、url.path、user_agent.originalを記録し、応答時にhttp.response.status_codeとhttp.server.request.durationを付ける。trace_id/span_idは有効なtrace contextがあるときに計装から付与し、request.idをtrace_idに偽装しない。

属性はフラットにする。request body、Authorization、Cookie、パスワード、トークン、DSN、生のSQL bind値を丸ごと記録しない。許可する属性と長さを定義し、ユーザー入力をメッセージ本文へ連結しない。url.pathに生クエリを含めず、パス内に機密がある設計ならマスク方法を定める。IP・ユーザーIDの記録は案件のデータ方針で決める。

業務コードが返したerrorは境界で一度分類する。想定内の利用者エラーを機械的にERRORへ上げず、対応の必要性からレベルを選ぶ。panicのstackにも機密がないか確認する。Ginの既定Logger/Recoveryを追加したまま二重出力や非構造ログを混在させない。

## 単位の決定

原資料の共通拡張表には処理時間のナノ秒、Web APIログ項目表にはミリ秒の記述がある。本プラグインのHTTPアクセスログは、用途に直接対応する後者を採用し、http.server.request.durationを数値のミリ秒とする。例えば125msは125で出力する。time.Durationを直接slogへ渡して表現を任せない。

これはアプリログのスキーマであり、OTel metricの同名instrumentと単位まで同一とは宣言しない。exporter/collectorへの変換で単位を確認する。共通基盤に別規約がある案件では明示して変換し、同じキーへ単位を混在させない。

## 定義と検証

案件のメッセージ定義にはコード、レベル、固定文、許可属性、原因、アプリ側の診断手順、運用担当への引き渡し先を持たせる。本文・属性を含めたJSON Linesをparseして、必須キー、型、ミリ秒、秘密の非出力、相関ID、ヘルスチェック除外をテストする。

収集先・保持期間・アクセス制御・通知ルールの構築は[インフラ側](infrastructure-handoff.md)。診断ログのサンプリングと、欠落できない監査記録を混同しない。

[観測原則](../principles/observability.md) / [Gin](gin.md)
