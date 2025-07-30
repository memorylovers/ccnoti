import { consola } from "consola";
import { existsSync } from "fs";
import sound from "sound-play";
import { Options } from "../types";
import { resolvePath } from "./utils";

export async function notifySound(
  options: Options
): Promise<string | undefined> {
  try {
    // soundFileが空文字の場合はスキップ
    if (!options.soundFile || options.soundFile === "") {
      return;
    }

    // Resolve path (tilde expansion and relative path)
    const resolvedPath = resolvePath(options.soundFile);

    // ファイルの存在確認
    if (!existsSync(resolvedPath)) {
      throw new Error(`Sound file not found: ${options.soundFile}`);
    }

    // 音量の検証とデフォルト値の設定
    let volume = options.volume ?? 0.5;
    if (volume < 0.0 || volume > 1.0) {
      consola.warn(`Invalid volume ${volume}. Using default volume 0.5`);
      volume = 0.5;
    }

    // sound-playで再生
    await sound.play(resolvedPath, volume);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    consola.error(message);
    return `Sound error: ${message}`;
  }
}
