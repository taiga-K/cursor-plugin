---
name: assess-backend
description: 既存Goバックエンドの構造・契約・データフローを調べる。現状説明、変更前の調査、障害の原因調査に使用する。
---

# バックエンド調査

## 入力

対象リポジトリ、調査したい振る舞い、再現条件や差分。

## 手順

1. ローカル指示、未コミット変更、go.mod/go.work、Gin、DB設定、migration、OpenAPI、CIを確認する。資格情報を出力しない。
2. 入口からApplication・Domain・Adapterまで実行経路を追い、[構成](../../references/architecture.md)と現状の責務を対応させる。業務変更では[モデルの具体例](../../references/domain-modeling.md)とコード・テストの対応を確認し、Repository、入出力、生成/再構成の所有先を調べる。
3. [DB選択](../../references/database-selection.md)から採用済みのDB手順だけを読み、製品・版・正本・原子性・テスト環境を確認する。
4. 不具合は対象のHTTP/worker/DB操作で再現し、観測と仮説を分ける。性能は件数・負荷・実行計画を伴う証拠を集める。
5. 指定[API](../../references/web-api.md)・[ログ](../../references/logging.md)への適合と、インフラに依存する未確認事項を整理する。

## 出力

実行経路、根拠、現状契約、採用DB、問題候補、未確認事項。調査依頼だけならコード変更へ進まない。 [共通形式](../../references/output-contracts.md)に従う。

## 情報不足

アクセスできない環境や未提示の業務意図は未確認として分離する。調べれば分かる版やファイル配置を利用者へ質問しない。

## 完了条件

次の設計が根拠付きで行えるか、調査目的への回答と不確実性が明示されている。
