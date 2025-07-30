import { describe, it, expect, vi, beforeEach } from "vitest";
import { resolveOption } from "../src/lib/option";
import { Options, PartialOptions } from "../src/types";
import { consola } from "consola";

// Mock consola
vi.mock("consola", () => ({
  consola: {
    warn: vi.fn(),
  },
}));

describe("resolveOption", () => {
  const mockConsola = vi.mocked(consola.warn);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockConfig: Options = {
    sound: false,
    soundFile: "/default.aiff",
    volume: 0.5,
    voice: false,
    desktop: false,
  };

  describe("basic merge tests", () => {
    it("returns config when no args provided", () => {
      const result = resolveOption(mockConfig, {});
      expect(result).toEqual(mockConfig);
    });

    it("merges args with config defaults", () => {
      const args: PartialOptions = {
        sound: true,
        message: "Test Message",
      };
      const result = resolveOption(mockConfig, args);

      expect(result).toEqual({
        ...mockConfig,
        sound: true,
        message: "Test Message",
      });
    });
  });

  describe("precedence tests (args > config)", () => {
    it("args takes precedence over config", () => {
      const args: PartialOptions = {
        sound: true,
        desktop: true,
      };

      const result = resolveOption(mockConfig, args);

      expect(result.sound).toBe(true); // from args
      expect(result.desktop).toBe(true); // from args
    });

    it("complex precedence with multiple properties", () => {
      const config: Options = {
        sound: false,
        soundFile: "/config.aiff",
        volume: 0.5,
        voice: false,
        desktop: false,
      };
      const args: PartialOptions = {
        sound: true,
        voice: false,
        message: "args-message",
      };

      const result = resolveOption(config, args);

      expect(result.sound).toBe(true); // from args
      expect(result.soundFile).toBe("/config.aiff"); // from config
      expect(result.voice).toBe(false); // from args
      expect(result.desktop).toBe(false); // from config
      expect(result.message).toBe("args-message"); // from args
    });
  });

  describe("partial options merge", () => {
    it("merges non-overlapping properties from config and args", () => {
      const config: Options = {
        sound: true,
        soundFile: "/config.aiff",
        volume: 0.5,
        voice: false,
        desktop: false,
      };
      const args: PartialOptions = {
        message: "args-message",
        desktop: true,
      };

      const result = resolveOption(config, args);

      expect(result).toEqual({
        sound: true,
        soundFile: "/config.aiff",
        volume: 0.5,
        voice: false,
        desktop: true,
        message: "args-message",
      });
    });

    it("handles partial options correctly", () => {
      const config: Options = {
        sound: true,
        soundFile: "/default.aiff",
        volume: 0.5,
        voice: true,
        desktop: true,
      };
      const partialArgs: PartialOptions = {
        sound: false,
      };

      const result = resolveOption(config, partialArgs);

      expect(result.sound).toBe(false);
      expect(result.voice).toBe(true);
      expect(result.desktop).toBe(true);
    });
  });

  describe("edge cases", () => {
    it("handles empty PartialOptions", () => {
      const emptyPartial: PartialOptions = {};
      const result = resolveOption(mockConfig, emptyPartial);

      expect(result).toEqual(mockConfig);
    });

    it("handles undefined values correctly", () => {
      const config: Options = {
        ...mockConfig,
        message: "config-message",
      };
      const args: PartialOptions = {
        message: undefined,
      };

      const result = resolveOption(config, args);

      // undefined in args should not override config
      expect(result.message).toBe("config-message");
    });

    it("correctly merges all Options properties", () => {
      const config: Options = {
        sound: false,
        soundFile: "/config.aiff",
        volume: 0.5,
        voice: false,
        desktop: false,
      };
      const args: PartialOptions = {
        sound: true,
        soundFile: "/args.aiff",
        voice: true,
        desktop: true,
        message: "args-message",
      };

      const result = resolveOption(config, args);

      // Verify all properties exist and have correct values
      expect(result).toHaveProperty("sound", true); // from args
      expect(result).toHaveProperty("soundFile", "/args.aiff"); // from args
      expect(result).toHaveProperty("voice", true); // from args
      expect(result).toHaveProperty("desktop", true); // from args
      expect(result).toHaveProperty("message", "args-message"); // from args
    });
  });

  describe("type validation", () => {
    it("returns proper Options type", () => {
      const result = resolveOption(mockConfig, {});

      // Type assertion should work without errors
      const typedResult: Options = result;

      // Check that required properties exist
      expect(typeof typedResult.sound).toBe("boolean");
      expect(typeof typedResult.soundFile).toBe("string");
      expect(typeof typedResult.voice).toBe("boolean");
      expect(typeof typedResult.desktop).toBe("boolean");
    });
  });

  describe("volume validation", () => {
    it("should use volume from args over config", () => {
      const args: PartialOptions = {
        volume: 0.8,
      };

      const result = resolveOption(mockConfig, args);

      expect(result.volume).toBe(0.8);
      expect(mockConsola).not.toHaveBeenCalled();
    });

    it("should warn and use default for invalid volume in config", () => {
      const configWithInvalidVolume: Options = {
        ...mockConfig,
        volume: 1.5,
      };

      const result = resolveOption(configWithInvalidVolume, {});

      expect(result.volume).toBe(0.5);
      expect(mockConsola).toHaveBeenCalledWith(
        "Invalid volume 1.5 in configuration. Using default volume 0.5"
      );
    });

    it("should warn and use default for negative volume", () => {
      const args: PartialOptions = {
        volume: -0.3,
      };

      const result = resolveOption(mockConfig, args);

      expect(result.volume).toBe(0.5);
      expect(mockConsola).toHaveBeenCalledWith(
        "Invalid volume -0.3 in configuration. Using default volume 0.5"
      );
    });

    it("should accept boundary values", () => {
      const args1: PartialOptions = { volume: 0.0 };
      const result1 = resolveOption(mockConfig, args1);
      expect(result1.volume).toBe(0.0);

      const args2: PartialOptions = { volume: 1.0 };
      const result2 = resolveOption(mockConfig, args2);
      expect(result2.volume).toBe(1.0);

      expect(mockConsola).not.toHaveBeenCalled();
    });
  });
});
