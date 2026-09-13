# バックエンドのテスト・検証戦略

テスト種別は守るリスクから選ぶ。採用DBだけを検証し、全DBを常時起動しない。複数Adapterの互換性を約束する場合だけ、その全実装で同じ業務契約を検証する。

| 変更対象 | 主な検証 | 証明できないこと |
|---|---|---|
| Domain | table-driven単体、状態遷移、境界値、必要なfuzz | DBの制約と並行性 |
| Application | fake portで認可・取引要求・副作用・エラー分岐 | 実DBのcommitと分離レベル |
| DB Adapter | 選んだ製品の実DB、rollback、制約、同時更新 | 別製品での互換性 |
| Gin | httptestのrouter、middleware、HTTP契約、ログ | 本番ネットワークの設定 |
| API変更 | OpenAPI lint、互換性差分、consumer契約、主要E2E | 全利用者の未申告依存 |
| Worker/Batch | 再送、停止位置、ack、checkpoint、再開 | 基盤の配送保証の未確認部分 |
| Migration | 空DBと旧schema、backfill、混在版、途中失敗 | 未検証の本番データ分布 |
| 性能 | 代表データ量、EXPLAIN、bench、負荷試験 | 別環境の同等性能 |

## setupで実装する検証契約

対象リポジトリのREADME・Makefile・CI・既存テストを調べ、利用できる検証を先に使う。不足がある場合に、その構成と失敗条件に合う検査を実装する。実行手順は既存の管理場所へ反映し、実際の起動・操作・期待結果・証拠の保存・後片付けを一度通して確かめる。検証のために起動したプロセスと一時データだけを片付け、証拠は残す。

以下はコマンドの例。採用する検査と実行方法は対象に合わせる。対象moduleごとに実行し、monorepoのgo.workだけで全moduleを検証済みにしない。

```sh
gofmt -l .
go vet ./...
go test ./...
go test -race ./...
go build ./...
```

gofmt -lは差分ファイル名を出すだけで失敗終了しないため、CIでは出力が空であることを判定する。raceは対応環境で実行し、CGO・ツールチェーンの必要条件を記録する。govulncheckや静的解析、OpenAPI検証、コード生成の差分検査は採用版を固定して追加する。ツールがないのに通過したとは書かない。

DB integration testは明示的に対象DSNと実行方法を持ち、接続不能時は必須CI jobを失敗にする。通常のunit jobと分けるなら必須integration jobの存在を確認する。実DBをskipしたgreenを全体合格と呼ばない。接続先は専用の使い捨てDBとし、対象の確認なしにtruncate/dropを行う手順にしない。

## 必須の負例候補

- tenant Aの主体がtenant BのIDへアクセスする。
- 同じ在庫へ並行要求し、残数が負にならない。
- 同じ冪等キーの再送、異なるpayload、処理中の重複、応答断後の再照会。
- callback途中失敗とcommit失敗。取引内の操作がpoolへ漏れていない。
- NoSQLの条件付き更新失敗、古いread、TTL境界。
- 外部通知後・ack前の停止と二重配信。
- ログにpassword/token/cookie/queryの機密が含まれない。

ここから変更に関係するものを選ぶ。対象外に全て追加しない。テストの負例が変更前に失敗することを確認し、無効化されたassertやskipでgreenにしない。

## 完了報告

対象、採用版、コマンド、結果、CI URLまたはローカル記録、DB種別、未実行項目と理由を[検証結果](output-contracts.md)へ残す。環境がない場合は接続条件と再現可能な実行手順を残す。実Cursorによるスキル利用評価は[別シナリオ](../evals/scenarios.md)である。
