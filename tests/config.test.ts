import { describe, it, expect, vi, beforeEach } from "vitest";
import { loadMyConfig, defaultConfig } from "../src/lib/config";
import { Options } from "../src/types";

// Mock c12's loadConfig
vi.mock("c12", () => ({
  loadConfig: vi.fn(),
}));

// Mock fs modules
vi.mock("fs", () => ({
  existsSync: vi.fn(),
}));

vi.mock("fs/promises", () => ({
  readFile: vi.fn(),
}));

// Import the mocked functions
import { loadConfig } from "c12";
import { existsSync } from "fs";
import { readFile } from "fs/promises";

describe("config", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  describe("defaultConfig", () => {
    it("has correct default values", () => {
      expect(defaultConfig).toEqual({
        sound: false,
        soundFile: "/System/Library/Sounds/Glass.aiff",
        volume: 0.5,
        voice: false,
        desktop: false,
      });
    });
  });

  describe("loadMyConfig", () => {
    it("uses c12 auto-discovery when no config path is provided", async () => {
      const customConfig: Options = {
        sound: true,
        soundFile: "/custom/sound.aiff",
        voice: true,
        desktop: false,
      };
      
      vi.mocked(loadConfig).mockResolvedValue({
        config: customConfig,
        configFile: ".ccnotirc",
        layers: [],
      });
      
      const result = await loadMyConfig();
      
      expect(loadConfig).toHaveBeenCalledWith({
        name: "ccnoti",
        rcFile: ".ccnotirc",
        defaultConfig,
      });
      expect(result).toEqual(customConfig);
    });

    it("loads configuration directly from specified config file", async () => {
      const customConfig = {
        sound: true,
        voice: true,
      };

      vi.mocked(existsSync).mockReturnValue(true);
      vi.mocked(readFile).mockResolvedValue(JSON.stringify(customConfig));

      const result = await loadMyConfig("custom-config.json");

      expect(existsSync).toHaveBeenCalledWith("custom-config.json");
      expect(readFile).toHaveBeenCalledWith("custom-config.json", "utf8");
      expect(loadConfig).not.toHaveBeenCalled();
      
      // Check that defu merged with defaults
      expect(result).toEqual({
        sound: true,
        soundFile: "/System/Library/Sounds/Glass.aiff",
        volume: 0.5,
        voice: true,
        desktop: false,
      });
    });

    it("returns default config when config file does not exist", async () => {
      vi.mocked(existsSync).mockReturnValue(false);
      
      // Mock console.error to avoid noise in test output
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      const result = await loadMyConfig("nonexistent.json");

      expect(existsSync).toHaveBeenCalledWith("nonexistent.json");
      expect(readFile).not.toHaveBeenCalled();
      expect(loadConfig).not.toHaveBeenCalled();
      expect(result).toEqual(defaultConfig);
      expect(consoleErrorSpy).toHaveBeenCalledWith("Config file not found: nonexistent.json");
      
      consoleErrorSpy.mockRestore();
    });

    it("handles JSON parse errors gracefully", async () => {
      vi.mocked(existsSync).mockReturnValue(true);
      vi.mocked(readFile).mockResolvedValue("{ invalid json");
      
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      const result = await loadMyConfig("invalid.json");

      expect(result).toEqual(defaultConfig);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining("Failed to load config from invalid.json:"),
        expect.any(Error)
      );
      
      consoleErrorSpy.mockRestore();
    });

    it("handles empty config file", async () => {
      vi.mocked(existsSync).mockReturnValue(true);
      vi.mocked(readFile).mockResolvedValue("{}");

      const result = await loadMyConfig("empty-config.json");

      // Empty config should be merged with defaults
      expect(result).toEqual(defaultConfig);
    });

    it("handles config with only optional fields", async () => {
      const configWithOptionals = {
        message: "Test Message",
      };

      vi.mocked(existsSync).mockReturnValue(true);
      vi.mocked(readFile).mockResolvedValue(JSON.stringify(configWithOptionals));

      const result = await loadMyConfig("optional-config.json");

      expect(result).toEqual({
        ...defaultConfig,
        message: "Test Message",
      });
    });

    it("handles readFile rejection gracefully", async () => {
      vi.mocked(existsSync).mockReturnValue(true);
      vi.mocked(readFile).mockRejectedValue(new Error("Permission denied"));
      
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      const result = await loadMyConfig("protected.json");

      expect(result).toEqual(defaultConfig);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Failed to load config from protected.json:",
        expect.any(Error)
      );
      
      consoleErrorSpy.mockRestore();
    });

    it("uses c12 auto-discovery with correct parameters", async () => {
      vi.mocked(loadConfig).mockResolvedValue({
        config: defaultConfig,
        configFile: undefined,
        layers: [],
      });

      await loadMyConfig();

      expect(loadConfig).toHaveBeenCalledTimes(1);
      expect(loadConfig).toHaveBeenCalledWith({
        name: "ccnoti",
        rcFile: ".ccnotirc",
        defaultConfig,
      });
    });

    it("handles complex configuration scenarios with defu merge", async () => {
      // Test with partial config that should be merged with defaults
      const partialConfig = {
        sound: true,
        desktop: true,
        message: "This is a complex test message",
      };

      vi.mocked(existsSync).mockReturnValue(true);
      vi.mocked(readFile).mockResolvedValue(JSON.stringify(partialConfig));

      const result = await loadMyConfig("complex-config.json");

      expect(result).toEqual({
        sound: true,
        soundFile: "/System/Library/Sounds/Glass.aiff", // From default
        volume: 0.5, // From default
        voice: false, // From default
        desktop: true,
        message: "This is a complex test message",
      });
      
      // Verify each property individually
      expect(result.sound).toBe(true);
      expect(result.soundFile).toBe("/System/Library/Sounds/Glass.aiff");
      expect(result.voice).toBe(false);
      expect(result.desktop).toBe(true);
      expect(result.message).toBe("This is a complex test message");
    });
  });
});
