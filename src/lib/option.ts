import defu from "defu";
import { consola } from "consola";
import { Options, PartialOptions } from "../types";
import { resolvePath } from "./utils";

/**
 * resolve option values
 *
 * priorities: arg > config
 * @param config from config file (with defaults merged)
 * @param args from arguments
 */
export function resolveOption(config: Options, args: PartialOptions): Options {
  const options = defu(args, config);
  
  // Resolve soundFile path from CLI arguments
  if (args.soundFile && options.soundFile) {
    options.soundFile = resolvePath(options.soundFile);
  }
  
  
  // 音量の検証
  if (options.volume !== undefined && options.volume !== null) {
    if (options.volume < 0.0 || options.volume > 1.0) {
      consola.warn(`Invalid volume ${options.volume} in configuration. Using default volume 0.5`);
      options.volume = 0.5;
    }
  }
  
  return options as Options;
}
