import { notifyDesktop } from "./lib/notify-desktop";
import { notifySound } from "./lib/notify-sound";
import { notifyVoice } from "./lib/notify-voice";
import { Options } from "./types";

export async function ccnoti(options: Options): Promise<string[]> {
  const promises: Promise<string | undefined>[] = [];

  // 効果音（soundオプションまたはdesktopオプションが有効な場合）
  if (!!options.sound || !!options.desktop) promises.push(notifySound(options));

  // 音声読み上げ
  if (!!options.voice) promises.push(notifyVoice(options));

  // デスクトップ通知
  if (!!options.desktop) promises.push(notifyDesktop(options));

  // 全ての通知処理を並列実行
  const results = await Promise.allSettled(promises);

  // エラー収集
  const errors = results.flatMap((result) => {
    if (result.status === "fulfilled" && result.value) {
      return [result.value];
    } else if (result.status === "rejected") {
      return [result.reason?.message || "Unknown error"];
    }
    return [];
  });

  return errors;
}
