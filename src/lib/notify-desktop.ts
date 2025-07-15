import { consola } from "consola";
import notifier from "node-notifier";
import { Options } from "../types";

export async function notifyDesktop(
  options: Options
): Promise<string | undefined> {
  try {
    const message = options.message || "";
    if (!message) return;

    // システム通知を表示する
    return await new Promise<string | undefined>((resolve) => {
      notifier.notify(
        {
          title: "ccnoti",
          message: message,
          sound: false,
          wait: false,
          timeout: false,
        },
        (error) => {
          if (error) {
            consola.debug("Notification error details:", error);
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
