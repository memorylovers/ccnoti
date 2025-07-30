import { loadConfig } from "c12";
import { readFile } from "fs/promises";
import { existsSync } from "fs";
import defu from "defu";
import { dirname } from "pathe";
import { Options } from "../types";
import { getDefaultSoundFile } from "./default-sounds";
import { resolvePath } from "./utils";

/**
 * Configのデフォルト値
 */
export const defaultConfig: Options = {
  sound: false,
  soundFile: getDefaultSoundFile(),
  volume: 0.5,
  voice: false,
  desktop: false,
};

/**
 *  Configファイルの読み込み
 */
export async function loadMyConfig(configPath?: string): Promise<Options> {
  if (configPath) {
    // -c オプションで明示的に指定された場合
    if (!existsSync(configPath)) {
      console.error(`Config file not found: ${configPath}`);
      return defaultConfig;
    }

    try {
      const content = await readFile(configPath, "utf8");
      const config = JSON.parse(content);

      // Resolve soundFile path relative to config file directory
      if (config.soundFile) {
        const configDir = dirname(configPath);
        config.soundFile = resolvePath(config.soundFile, configDir);
      }

      return defu(config, defaultConfig);
    } catch (error) {
      console.error(`Failed to load config from ${configPath}:`, error);
      return defaultConfig;
    }
  } else {
    // 指定なしの場合はc12の自動探索
    const { config, configFile } = await loadConfig<Options>({
      name: "ccnoti",
      rcFile: ".ccnotirc",
      defaultConfig,
    });

    // Resolve soundFile path relative to config file directory if found
    if (config.soundFile && configFile) {
      const configDir = dirname(configFile);
      config.soundFile = resolvePath(config.soundFile, configDir);
    } else if (config.soundFile) {
      // If no config file path is available, resolve from current directory
      config.soundFile = resolvePath(config.soundFile);
    }

    return config;
  }
}
