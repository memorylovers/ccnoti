#!/bin/bash

# test-combinations.sh - 組み合わせ実行例

CCNOTI="node $(dirname $0)/../bin/cli.mjs"

echo "=== ccnoti 組み合わせ実行例 ==="
echo

echo "# 効果音＋通知"
$CCNOTI --sound --desktop --message="音声と通知のテスト"
echo
read -p "Enterキーを押して続行..." -r

echo "# 音声読み上げ＋通知"
$CCNOTI --voice --desktop --message="音声読み上げと通知"
echo
read -p "Enterキーを押して続行..." -r

echo "# 効果音＋音声読み上げ"
$CCNOTI --sound --voice --message="両方の音声機能"
echo
read -p "Enterキーを押して続行..." -r

echo "# 全機能有効"
$CCNOTI --sound --voice --desktop --message="すべての機能"
echo
read -p "Enterキーを押して続行..." -r

echo "# カスタム効果音＋音声＋通知"
$CCNOTI --sound --soundFile=/System/Library/Sounds/Hero.aiff --voice --desktop --message="Complete!"
echo
read -p "Enterキーを押して続行..." -r

echo "# 日本語で全機能"
$CCNOTI --sound --voice --desktop --message="テスト完了"
echo

echo "完了"