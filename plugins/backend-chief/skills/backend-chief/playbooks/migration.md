# 移行

適用：DB schema、DB製品、Goの責務配置の変更。

## 工程

1. [調査](../../assess-backend/SKILL.md)で新旧の契約、データ、依存者を確認する。
2. [移行](../../migrate-backend/SKILL.md)で変換、順序、再開、照合と復旧を実装する。
3. [レビュー](../../review-backend/SKILL.md)と[検証](../../verify-backend/SKILL.md)で旧新混在と途中失敗を確認する。
4. 実環境への適用条件と未確認を引き渡す。破壊的downを復旧保証としない。

## 完了時の成果

移行コードと検証、適用順、停止条件、戻せる範囲。

[共通形式](../../../references/output-contracts.md)に従う。省略した工程と未検証は理由を残す。
