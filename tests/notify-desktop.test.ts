import { describe, it, expect, vi, beforeEach } from "vitest";
import { notifyDesktop } from "../src/lib/notify-desktop";
import { Options } from "../src/types";
import notifier from "node-notifier";

// Mock node-notifier
vi.mock("node-notifier", () => ({
  default: {
    notify: vi.fn(),
  },
}));

// Mock consola
vi.mock("consola", () => ({
  consola: {
    debug: vi.fn(),
    error: vi.fn(),
  },
}));

describe("notifyDesktop", () => {
  const mockOptions: Options = {
    sound: false,
    soundFile: "/test.aiff",
    voice: false,
    desktop: true,
    message: "Test message",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("message handling", () => {
    it("returns early when message is undefined", async () => {
      const options = { ...mockOptions, message: undefined };
      const result = await notifyDesktop(options);

      expect(result).toBeUndefined();
      expect(notifier.notify).not.toHaveBeenCalled();
    });

    it("returns early when message is empty string", async () => {
      const options = { ...mockOptions, message: "" };
      const result = await notifyDesktop(options);

      expect(result).toBeUndefined();
      expect(notifier.notify).not.toHaveBeenCalled();
    });

    it("shows notification when message is provided", async () => {
      const mockNotify = vi.mocked(notifier.notify);
      mockNotify.mockImplementation((options, callback) => {
        if (callback && typeof callback === "function") callback(null, "");
        return notifier; // Return the notifier instance to match the type
      });

      const result = await notifyDesktop(mockOptions);

      expect(result).toBeUndefined();
      expect(notifier.notify).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "ccnoti",
          message: "Test message",
          sound: false,
          wait: false,
        }),
        expect.any(Function)
      );
    });
  });

  describe("error handling", () => {
    it("returns error message when notification fails", async () => {
      const mockNotify = vi.mocked(notifier.notify);
      const testError = new Error("Notification failed");
      mockNotify.mockImplementation((options, callback) => {
        if (callback && typeof callback === "function") callback(testError, "");
        return notifier;
      });

      const result = await notifyDesktop(mockOptions);

      expect(result).toBe("Failed to show notification: Notification failed");
    });

    it("handles non-Error exceptions", async () => {
      const mockNotify = vi.mocked(notifier.notify);
      mockNotify.mockImplementation(() => {
        throw "String error";
      });

      const result = await notifyDesktop(mockOptions);

      expect(result).toBe("Notification error: Unknown error");
    });
  });
});