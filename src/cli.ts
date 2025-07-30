import { runMain as _runMain, defineCommand } from "citty";
import { consola } from "consola";
import { description, name, version } from "../package.json";
import { loadMyConfig } from "./lib/config";
import { resolveOption } from "./lib/option";
import { ccnoti } from "./main";
import { Options, PartialOptions } from "./types";

export const runMain = () => _runMain(main);

const main = defineCommand({
  meta: { name, version, description },
  args: {
    // 通知オプション
    sound: {
      type: "boolean",
      description: "Play sound effect",
      alias: "s",
    },
    voice: {
      type: "boolean",
      description: "Enable text-to-speech",
      alias: "v",
    },
    desktop: {
      type: "boolean",
      description: "Show system notification",
      alias: "d",
    },
    soundFile: {
      type: "string",
      description: "Sound file path to play",
    },
    volume: {
      type: "string",
      description: "Sound volume (0.0-1.0)",
      alias: "V",
    },
    // テキストオプション
    message: {
      type: "string",
      alias: "m",
      description: "Notification message text",
    },
    // 設定ファイルオプション
    config: {
      type: "string",
      alias: "c",
      description: "Path to config file",
    },
  },
  run: async ({ args }) => {
    consola.debug(`args=${JSON.stringify(args, null, 2)}`);

    try {
      // 1. 設定ファイルを読み込む
      const config: Options = await loadMyConfig(
        args.config as string | undefined
      );

      // 2. オプションをマージ（優先順位: コマンドライン引数 > 設定ファイル）
      // configはCLI引数であり通知オプションではないので除外
      const { config: _, volume, ...optionArgs } = args;

      // volumeを数値に変換
      const parsedOptions: PartialOptions = {
        ...optionArgs,
        ...(volume !== undefined && { volume: parseFloat(volume as string) }),
      };

      const options = resolveOption(config, parsedOptions);
      consola.debug("Final options:", options);

      // 4. 各機能を実行
      const errors = await ccnoti(options);

      // エラー時は、exit code 1を返す
      if (errors.length > 0) {
        consola.error("Unexpected error:", errors);
        process.exit(1);
      }
    } catch (error) {
      consola.error("Unexpected error:", error);
      process.exit(1);
    }
  },
});
