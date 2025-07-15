import { consola } from "consola";
import notifier from "node-notifier";
import path from "path";
import { Options } from "../types";

export async function notifyDesktop(
  options: Options
): Promise<string | undefined> {
  try {
    const message = options.message || "";
    if (!message) return;

    const notificationOptions = {
      title: "ccnoti",
      message: message,
    };

    consola.debug("Notification options:", notificationOptions);

    const iconPath = path.resolve(process.cwd(), "assets/icon.png");
    consola.debug("Icon path:", iconPath);

    // システム通知を表示する
    return await new Promise<string | undefined>((resolve) => {
      notifier.notify(
        {
          title: notificationOptions.title,
          message: notificationOptions.message,
          icon: iconPath,
          sound: false, // システム音は無効化（音はnotify-soundで再生）
          wait: false,
        },
        (error) => {
          if (error) {
            resolve(`Failed to show notification: ${error.message}`);
          } else {
            resolve(undefined);
          }
        }
      );
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    consola.error(message);
    return `Notification error: ${message}`;
  }
}
