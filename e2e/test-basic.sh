#!/bin/bash

# test-basic.sh - 基本的な実行例

CCNOTI="node $(dirname $0)/../bin/cli.mjs"

echo "=== ccnoti 基本実行例 ==="
echo

echo "# ヘルプ表示"
$CCNOTI --help
echo
read -p "Enterキーを押して続行..." -r

echo "# 効果音のみ"
$CCNOTI --sound
echo
read -p "Enterキーを押して続行..." -r

echo "# カスタム効果音"
$CCNOTI --sound --soundFile=/System/Library/Sounds/Ping.aiff
echo
read -p "Enterキーを押して続行..." -r

echo "# チルダ展開を使用した効果音（システムサウンドを使用）"
# ホームディレクトリにテスト用ファイルを配置
mkdir -p ~/test-sounds
cp /System/Library/Sounds/Hero.aiff ~/test-sounds/Hero.aiff
$CCNOTI --sound --soundFile=~/test-sounds/Hero.aiff
# クリーンアップ
rm -rf ~/test-sounds
echo
read -p "Enterキーを押して続行..." -r

echo "# 相対パスを使用した効果音（実際の音声ファイルをコピー）"
# テスト用の音声ファイルをコピー
mkdir -p ./test-sounds
cp /System/Library/Sounds/Pop.aiff ./test-sounds/test.aiff
$CCNOTI --sound --soundFile=./test-sounds/test.aiff
# クリーンアップ
rm -rf ./test-sounds
echo
read -p "Enterキーを押して続行..." -r

echo "# 音量指定（小音量 0.1）"
$CCNOTI --sound --volume 0.1
echo
read -p "Enterキーを押して続行..." -r

echo "# 音量指定（デフォルト 0.5）"
$CCNOTI --sound --volume 0.5
echo
read -p "Enterキーを押して続行..." -r

echo "# 音量指定（大音量 1.0）"
$CCNOTI --sound --volume 1.0
echo
read -p "Enterキーを押して続行..." -r

echo "# 音量指定（範囲外 - 警告が出るはず）"
$CCNOTI --sound --volume 1.5
echo
read -p "Enterキーを押して続行..." -r

echo "# 音声読み上げ"
$CCNOTI --voice --message="テスト音声"
echo
read -p "Enterキーを押して続行..." -r

echo "# 英語での読み上げ"
$CCNOTI --voice --message="Test voice"
echo
read -p "Enterキーを押して続行..." -r

echo "# 通知表示"
$CCNOTI --desktop --message="テスト通知"
echo

echo "完了"