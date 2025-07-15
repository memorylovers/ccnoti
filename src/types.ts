/**
 * Runtime options for ccnoti
 * Fields with default values are required, others are optional
 */
export interface Options {
  // Notification options
  /** Whether to play a sound effect */
  sound: boolean;
  /** Path to the sound file to play */
  soundFile: string;
  /** Whether to use text-to-speech */
  voice: boolean;
  /** Whether to show a system notification */
  desktop: boolean;

  // Text option
  /** Notification message text */
  message?: string;
}

/**
 * Partial options for input (CLI arguments, config files, etc.)
 * All fields are optional
 */
export type PartialOptions = Partial<Options>;
