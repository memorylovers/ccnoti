import { existsSync } from "fs";

/**
 * プラットフォームごとのサウンドファイル候補リスト
 */
const soundFallbacks: Record<string, string[]> = {
  darwin: [
    // Primary system sounds (most commonly used)
    "/System/Library/Sounds/Glass.aiff",
    "/System/Library/Sounds/Ping.aiff",
    "/System/Library/Sounds/Pop.aiff",
    "/System/Library/Sounds/Tink.aiff",
    "/System/Library/Sounds/Hero.aiff",
    "/System/Library/Sounds/Submarine.aiff",
    "/System/Library/Sounds/Purr.aiff",
    "/System/Library/Sounds/Blow.aiff",
    "/System/Library/Sounds/Bottle.aiff",
    "/System/Library/Sounds/Frog.aiff",
    "/System/Library/Sounds/Funk.aiff",
    "/System/Library/Sounds/Morse.aiff",
    "/System/Library/Sounds/Sosumi.aiff",
    "/System/Library/Sounds/Basso.aiff",
  ],
  win32: [
    // Common Windows notification sounds
    "C:\\Windows\\Media\\chimes.wav",
    "C:\\Windows\\Media\\ding.wav",
    "C:\\Windows\\Media\\notify.wav",
    "C:\\Windows\\Media\\Windows Notify.wav",
    "C:\\Windows\\Media\\Windows Notify System Generic.wav",
    "C:\\Windows\\Media\\Windows Background.wav",
    "C:\\Windows\\Media\\Windows Balloon.wav",
    "C:\\Windows\\Media\\chord.wav",
    "C:\\Windows\\Media\\tada.wav",
    "C:\\Windows\\Media\\Windows Error.wav",
    "C:\\Windows\\Media\\Windows Exclamation.wav",
    "C:\\Windows\\Media\\Windows Information Bar.wav",
    "C:\\Windows\\Media\\Windows Hardware Insert.wav",
    "C:\\Windows\\Media\\Windows Hardware Remove.wav",
    "C:\\Windows\\Media\\Windows Message Nudge.wav",
    "C:\\Windows\\Media\\Windows Proximity Notification.wav",
  ],
  linux: [], // Linux is not supported by sound-play library
};

/**
 * プラットフォームごとのデフォルトサウンドファイルを取得
 * 存在するファイルを優先的に返す
 */
export function getDefaultSoundFile(): string {
  const platform = process.platform;
  const candidates = soundFallbacks[platform] || soundFallbacks.darwin;

  // 存在する最初のファイルを返す
  for (const soundFile of candidates) {
    if (existsSync(soundFile)) return soundFile;
  }

  // すべて存在しない場合は空文字を返す
  return candidates.length > 0 ? candidates[0] : "";
}
