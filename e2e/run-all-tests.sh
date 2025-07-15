#!/bin/bash

# run-all-tests.sh - すべての実行例を実行

SCRIPT_DIR=$(dirname $0)

echo "=== ccnoti 実行例 ==="
echo

echo ">>> 基本実行例"
$SCRIPT_DIR/test-basic.sh
echo

echo ">>> 組み合わせ実行例"
$SCRIPT_DIR/test-combinations.sh
echo

echo "すべての実行例が完了しました"