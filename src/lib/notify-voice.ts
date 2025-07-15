import { consola } from "consola";
import { Options } from "../types";
import say from "say";

export async function notifyVoice(
  options: Options
): Promise<string | undefined> {
  try {
    const text = options.message || "";
    if (!text) return;

    // say.speak をPromiseでラップ
    await new Promise<void>((resolve, reject) => {
      say.speak(
        text,
        undefined, // デフォルト音声を使用
        1.0, // 通常速度
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    consola.error(message);
    return `Voice error: ${message}`;
  }
}
