import { describe, it, expect } from "vitest";
import { resolvePath } from "../src/lib/utils";
import { homedir } from "os";
import { resolve } from "pathe";

describe("resolvePath", () => {
  const home = homedir();
  const currentDir = process.cwd();

  describe("tilde expansion", () => {
    it("should expand ~ to home directory", () => {
      const result = resolvePath("~");
      expect(result).toBe(home);
    });

    it("should expand ~/path to home directory + path", () => {
      const result = resolvePath("~/Documents/test.txt");
      expect(result).toBe(resolve(home, "Documents/test.txt"));
    });

    it("should not expand ~ in the middle of path", () => {
      const result = resolvePath("/path/to/~file");
      expect(result).toBe(resolve("/path/to/~file"));
    });
  });

  describe("relative paths", () => {
    it("should resolve relative path from current directory", () => {
      const result = resolvePath("./test.txt");
      expect(result).toBe(resolve(currentDir, "./test.txt"));
    });

    it("should resolve parent directory path", () => {
      const result = resolvePath("../test.txt");
      expect(result).toBe(resolve(currentDir, "../test.txt"));
    });

    it("should resolve relative path with baseDir", () => {
      const baseDir = "/Users/test/project";
      const result = resolvePath("./config/test.txt", baseDir);
      expect(result).toBe(resolve(baseDir, "./config/test.txt"));
    });
  });

  describe("absolute paths", () => {
    it("should return absolute path unchanged", () => {
      const absolutePath = "/Users/test/file.txt";
      const result = resolvePath(absolutePath);
      expect(result).toBe(absolutePath);
    });

    it("should ignore baseDir for absolute paths", () => {
      const absolutePath = "/Users/test/file.txt";
      const baseDir = "/Users/other";
      const result = resolvePath(absolutePath, baseDir);
      expect(result).toBe(absolutePath);
    });
  });

  describe("edge cases", () => {
    it("should handle empty string", () => {
      const result = resolvePath("");
      expect(result).toBe("");
    });

    it("should handle undefined input", () => {
      const result = resolvePath(undefined as any);
      expect(result).toBe(undefined);
    });

    it("should handle null input", () => {
      const result = resolvePath(null as any);
      expect(result).toBe(null);
    });
  });

  describe("combined cases", () => {
    it("should expand tilde and resolve with baseDir", () => {
      const baseDir = "/Users/test/project";
      const result = resolvePath("~/Documents/test.txt", baseDir);
      // Tilde expansion should take precedence over baseDir
      expect(result).toBe(resolve(home, "Documents/test.txt"));
    });
  });
});