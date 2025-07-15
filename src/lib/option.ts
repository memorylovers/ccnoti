import defu from "defu";
import { Options, PartialOptions } from "../types";

/**
 * resolve option values
 *
 * priorities: arg > config
 * @param config from config file (with defaults merged)
 * @param args from arguments
 */
export function resolveOption(config: Options, args: PartialOptions): Options {
  const options = defu(args, config);
  return options as Options;
}
