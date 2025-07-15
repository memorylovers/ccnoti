# CLAUDE.md - 開発者向けガイドライン

## プロジェクト構造

```txt
src/
├── cli.ts               # CLIエントリーポイント
├── index.ts            # パブリックAPIエクスポート
├── main.ts             # メイン通知処理ロジック
├── types.ts            # TypeScript型定義
└── lib/
    ├── config.ts       # 設定ファイル読み込み
    ├── notify-desktop.ts # デスクトップ通知機能
    ├── notify-sound.ts   # 効果音再生機能
    ├── notify-voice.ts   # 音声読み上げ機能
    ├── option.ts       # オプション解決ロジック
    └── utils.ts        # 共通ユーティリティ

tests/                   # 単体テスト
├── config.test.ts      # 設定ファイル読み込みテスト
├── notify-desktop.test.ts # デスクトップ通知テスト
└── option.test.ts      # オプション解決ロジックテスト

e2e/                     # E2Eテスト
├── run-all-tests.sh    # 全テスト実行
├── test-basic.sh       # 基本機能テスト
└── test-combinations.sh # 機能組み合わせテスト
```

## モジュールの責務

### cli.ts

- コマンドラインインターフェースの定義
- 引数の解析
- main.tsの`ccnoti`関数を呼び出し
- エラーハンドリング

### main.ts

- `ccnoti`関数として通知ロジックを統合
- 各通知機能を条件に応じて実行
- エラーを配列として収集し返す

### lib/config.ts

- `.ccnotirc` 設定ファイルの読み込み
- デフォルト設定の管理

### lib/notify-*.ts

- 各通知機能の実装
  - `notify-sound.ts`: sound-playライブラリによるクロスプラットフォーム音声再生（Windows/macOS）
  - `notify-voice.ts`: macOS sayコマンドによる音声読み上げ
  - `notify-desktop.ts`: node-notifierによるデスクトップ通知
- エラーハンドリング
- プラットフォーム固有の処理

### lib/option.ts

- コマンドライン引数、設定ファイルからのオプションの優先順位解決
- 最終的なオプション値の決定

## 開発時の注意事項

### 型定義

- `Options`: 実行時に使用される最終的なオプション
- `PartialOptions`: CLI引数や設定ファイルから読み込まれる部分的なオプション

### エラーハンドリング

- 各通知機能は独立してエラーをキャッチ
- エラーが発生しても他の通知は実行される
- 各notify関数が `string | undefined` を返す（エラー時のみメッセージ）
- エラーがある場合は exit code 1 を返す

## テストとビルドコマンド

```bash
# 開発環境セットアップ
pnpm install

# TypeScript型チェック
pnpm typecheck

# ビルド
pnpm build

# 開発モード（ファイル監視）
pnpm dev

# ローカルテスト実行
node bin/cli.mjs --sound --voice --message "テスト"

# 単体テスト実行
pnpm test
```

## テスト

### 単体テスト (tests/)

Vitestフレームワークを使用した単体テストを実装しています。

- **config.test.ts**: 設定ファイルの読み込みロジックのテスト
  - c12による自動探索機能
  - 指定ファイルの直接読み込み
  - エラーハンドリング（ファイル不在、JSON解析エラー）
  - デフォルト設定との統合

- **notify-desktop.test.ts**: デスクトップ通知機能のテスト
  - メッセージ空文字/未定義時の早期リターン
  - node-notifierとの連携
  - エラーハンドリング

- **option.test.ts**: オプション解決ロジックのテスト
  - CLI引数と設定ファイルの優先順位
  - 部分的なオプションの統合
  - エッジケースの処理

### E2Eテスト (e2e/)

実際にCLIを実行してインタラクティブに動作確認するシェルスクリプト群です。

- **run-all-tests.sh**: すべてのE2Eテストを順次実行
- **test-basic.sh**: 基本機能の動作確認
  - ヘルプ表示
  - 効果音再生（デフォルト/カスタム）
  - 音声読み上げ（日本語/英語）
  - デスクトップ通知
- **test-combinations.sh**: 複数機能の組み合わせテスト
  - 効果音＋通知
  - 音声読み上げ＋通知
  - 効果音＋音声読み上げ
  - 全機能同時実行
