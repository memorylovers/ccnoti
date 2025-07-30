import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { notifySound } from "../src/lib/notify-sound";
import { Options } from "../src/types";
import { consola } from "consola";

// Mock dependencies
vi.mock("fs", () => ({
  existsSync: vi.fn(),
}));

vi.mock("sound-play", () => ({
  default: {
    play: vi.fn().mockResolvedValue(undefined),
  },
}));

import { existsSync } from "fs";
import sound from "sound-play";

describe("notifySound", () => {
  const mockSound = vi.mocked(sound);
  const mockExistsSync = vi.mocked(existsSync);
  let mockConsola: any;
  let mockConsolaError: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockExistsSync.mockReturnValue(true);
    mockConsola = vi.spyOn(consola, "warn").mockImplementation(() => {});
    mockConsolaError = vi.spyOn(consola, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("volume handling", () => {
    it("should use provided volume when valid", async () => {
      const options: Options = {
        sound: true,
        soundFile: "/test.aiff",
        volume: 0.3,
        voice: false,
        desktop: false,
      };

      await notifySound(options);

      expect(mockSound.play).toHaveBeenCalledWith("/test.aiff", 0.3);
      expect(mockConsola).not.toHaveBeenCalled();
    });

    it("should use default volume when not provided", async () => {
      const options: Options = {
        sound: true,
        soundFile: "/test.aiff",
        voice: false,
        desktop: false,
      };

      await notifySound(options);

      expect(mockSound.play).toHaveBeenCalledWith("/test.aiff", 0.5);
      expect(mockConsola).not.toHaveBeenCalled();
    });

    it("should warn and use default when volume is less than 0", async () => {
      const options: Options = {
        sound: true,
        soundFile: "/test.aiff",
        volume: -0.5,
        voice: false,
        desktop: false,
      };

      await notifySound(options);

      expect(mockConsola).toHaveBeenCalledWith(
        "Invalid volume -0.5. Using default volume 0.5"
      );
      expect(mockSound.play).toHaveBeenCalledWith("/test.aiff", 0.5);
    });

    it("should warn and use default when volume is greater than 1", async () => {
      const options: Options = {
        sound: true,
        soundFile: "/test.aiff",
        volume: 1.5,
        voice: false,
        desktop: false,
      };

      await notifySound(options);

      expect(mockConsola).toHaveBeenCalledWith(
        "Invalid volume 1.5. Using default volume 0.5"
      );
      expect(mockSound.play).toHaveBeenCalledWith("/test.aiff", 0.5);
    });

    it("should accept boundary values", async () => {
      const options1: Options = {
        sound: true,
        soundFile: "/test.aiff",
        volume: 0.0,
        voice: false,
        desktop: false,
      };

      await notifySound(options1);
      expect(mockSound.play).toHaveBeenCalledWith("/test.aiff", 0.0);

      const options2: Options = {
        sound: true,
        soundFile: "/test.aiff",
        volume: 1.0,
        voice: false,
        desktop: false,
      };

      await notifySound(options2);
      expect(mockSound.play).toHaveBeenCalledWith("/test.aiff", 1.0);
      expect(mockConsola).not.toHaveBeenCalled();
    });
  });

  describe("error handling", () => {
    it("should return early when soundFile is empty", async () => {
      const options: Options = {
        sound: true,
        soundFile: "",
        voice: false,
        desktop: false,
      };

      const result = await notifySound(options);

      expect(result).toBeUndefined();
      expect(mockSound.play).not.toHaveBeenCalled();
    });

    it("should return error when file does not exist", async () => {
      mockExistsSync.mockReturnValue(false);
      const options: Options = {
        sound: true,
        soundFile: "/nonexistent.aiff",
        voice: false,
        desktop: false,
      };

      const result = await notifySound(options);

      expect(result).toBe(
        "Sound error: Sound file not found: /nonexistent.aiff"
      );
      expect(mockConsolaError).toHaveBeenCalledWith(
        "Sound file not found: /nonexistent.aiff"
      );
      expect(mockSound.play).not.toHaveBeenCalled();
    });

    it("should handle sound.play errors", async () => {
      mockSound.play.mockRejectedValueOnce(new Error("Play failed"));
      const options: Options = {
        sound: true,
        soundFile: "/test.aiff",
        voice: false,
        desktop: false,
      };

      const result = await notifySound(options);

      expect(result).toBe("Sound error: Play failed");
      expect(mockConsolaError).toHaveBeenCalledWith("Play failed");
    });
  });
});
