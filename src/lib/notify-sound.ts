import { consola } from "consola";
import { existsSync } from "fs";
import sound from "sound-play";
import { Options } from "../types";

export async function notifySound(
  options: Options
): Promise<string | undefined> {
  try {
    // soundFileが空文字の場合はスキップ
    if (!options.soundFile || options.soundFile === "") {
      return;
    }

    // ファイルの存在確認
    if (!existsSync(options.soundFile)) {
      throw new Error(`Sound file not found: ${options.soundFile}`);
    }

    // 音量の検証とデフォルト値の設定
    let volume = options.volume ?? 0.5;
    if (volume < 0.0 || volume > 1.0) {
      consola.warn(`Invalid volume ${volume}. Using default volume 0.5`);
      volume = 0.5;
    }

    // sound-playで再生
    await sound.play(options.soundFile, volume);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    consola.error(message);
    return `Sound error: ${message}`;
  }
}
