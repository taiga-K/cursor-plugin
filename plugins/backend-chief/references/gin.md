# GinでHTTP境界を実装する

[公式ドキュメント](https://gin-gonic.com/en/docs/)と対象のgo.mod/go.sumで採用版を確認する。以下は本プラグインの実装規約。実際のAPIを記憶だけで生成せず、採用版の型・ソースを参照する。

bindingによる応答確定とproxyの扱いは[公式リポジトリの使用例](https://github.com/gin-gonic/gin/blob/master/docs/doc.md)にも記載されている。masterは参照索引として使い、導入時は採用tagの内容へ合わせる。

## 起動とmiddleware

gin.Newを起点に、相関・アクセスログ、panic回復、認証、必要な入力制限を明示的に組み立てる。外側のアクセスログが内側の回復後の最終statusを記録できる順序にする。認証でAbortされた場合、404/405、panicの場合も漏れをテストする。NoRoute/NoMethodとHandleMethodNotAllowedの扱いを明示する。

SetTrustedProxies等で信頼するproxyを明示する。全proxyを無条件に信頼してX-Forwarded-Forを認可に使わない。proxy一覧の実値はインフラとの契約で確定する。CORSは配置先を決めて重複実装しない。

## Handlerの責務

1. bodyサイズ制限、Content-Type、path/query/bodyの構文を検証する。
2. ShouldBind系など、応答を自動確定しないAPIを選び、[Problem Details](web-api.md)へ統一する。requiredタグと数値0/falseの扱いを確認する。
3. 認証middlewareから得た型付き主体と検証済み入力をApplicationへ渡す。主体の型assertion失敗を成功扱いしない。
4. c.Request.Context()を渡す。gin.Context、HTTP status、DTOをDomain/Applicationへ渡さない。
5. Applicationの結果を応答DTOへ変換する。errorは一箇所で分類し、応答を一度だけ書く。

Handlerから直接SQLを書かない。認可をmiddlewareだけで完了したとみなさない。汎用ShouldBindで入力元が曖昧になる場合はJSON/query等を明示する。

## 並行処理と終了

リクエスト終了後にgin.Contextを保持して非同期処理を継続しない。耐久処理は永続化したjob/eventから再開する。net/http.Serverを起動側が所有し、終了通知で新規受付とworker取込を止め、in-flight処理を待ってからDBやexporterを閉じる。Shutdownの待機上限は業務APIのtimeoutとは別のプロセス終了契約にする。

livenessはプロセスの生存、readinessは受付可否として設計し、応答に接続先や秘密を含めない。毎回全依存への重い問い合わせを行わない。ReadHeaderTimeout等の通信制限は[API規約](web-api.md)の業務期限と区別して設定する。

## 検証

httptestを用いた実際のrouterで、正常系、無効JSON、上限超過、0/false、未認証、権限不足、404、405、panic、キャンセル、二重書込、ログを確認する。モックHandlerだけでmiddlewareの完成扱いにしない。
