---
name: frontend-chief
description: TypeScript・Next.js・FSD・Atomic Design・Astryxの画面とBFFを一貫した基準で設計・実装・検証する入口。フロントエンド全体の進め方を求める依頼や /frontend-chief で使用する。
---

# Frontend Chief

## 入力

利用者の目的、対象リポジトリまたは差分、制約。最初にローカルの指示、未コミット変更、採用バージョン、API契約、既存チェックを確認する。UIを含む依頼では、同梱のAstryx MCP（`search`／`get`）が使えるかを確認し、部品は[選定手順](../../references/astryx.md)で決める。バックエンド本体の作成依頼は対象境界を説明する。

## 手順

1. 新規か既存か、求める成果物が実装か調査・レビューかを判定する。発見できる事実は調べ、成果に影響する未決の意図だけ質問する。
2. 以下から主となる手順を一つ選ぶ。複合依頼は主手順に必要な専門スキルを追加する。BFFの機能追加は機能追加、BFF障害はバグ修正へ進む。
3. [原則索引](../../principles/index.md)から変更に関わる原則を読む。全原則の全文を毎回読む必要はない。
4. 手順の各工程を作業項目にし、省略する工程には理由を付ける。依頼の範囲と既存の操作権限を守る。
5. 変更は検証できる単位で進める。検証結果を見てから次へ進み、未検証を完了へ言い換えない。

| トリガー | 主手順 |
|---|---|
| 新規アプリの標準導入 | [新規導入](playbooks/new-project.md) |
| 画面・振る舞い・BFFの追加 | [機能追加](playbooks/feature.md) |
| UI部品の新設・再利用 | [UI部品追加](playbooks/ui-component.md) |
| 再現する不具合・回帰・障害 | [バグ修正](playbooks/bug-fix.md) |
| CI の失敗調査・検証のみ | [verify-frontend](../verify-frontend/SKILL.md) |
| 差分や設計への指摘のみ | [レビュー](playbooks/review.md) |
| FSD・Astryx・Next.jsの既存構成変更 | [段階移行](playbooks/migration.md) |
| 検証基盤の導入 | [setup-frontend](../setup-frontend/SKILL.md) |
| 検証基盤の版追従・Dependabot対応 | [update-frontend](../update-frontend/SKILL.md) |
| 現状や仕組みの説明のみ | [調査スキル](../assess-frontend/SKILL.md) |

## 出力

[共通形式](../../references/output-contracts.md)に従い、成果、判断を変えた原則と具体的な選択、実行した検証、未解決事項を報告する。小さな修正に長い設計書を強制しない。

## 情報不足・完了条件

API契約や実行環境が不足する場合は、確認済みの事実、仮定、進められる範囲を分ける。架空のAPIや成功結果を作らない。依頼に対応する成果物と検証証拠が揃ったときに完了。調査・レビューは報告が成果物であり、コード変更へ自動的に進まない。
