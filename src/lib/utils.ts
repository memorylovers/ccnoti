import { exec } from "child_process";
import { promisify } from "util";
import { resolve } from "pathe";
import { homedir } from "os";

export const execAsync = promisify(exec);

/**
 * Resolve file path with tilde expansion and relative path support
 * @param filePath - The file path to resolve
 * @param baseDir - Base directory for relative paths (optional)
 * @returns Resolved absolute path
 */
export function resolvePath(filePath: string, baseDir?: string): string {
  try {
    // Handle empty or undefined input
    if (!filePath) return filePath;
    
    // Tilde expansion
    if (filePath.startsWith('~/')) {
      filePath = filePath.replace('~/', homedir() + '/');
    } else if (filePath === '~') {
      filePath = homedir();
    }
    
    // Convert relative paths to absolute paths
    return baseDir ? resolve(baseDir, filePath) : resolve(filePath);
  } catch {
    // Return original path on error
    return filePath;
  }
}
