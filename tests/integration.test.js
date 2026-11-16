/**
 * Integration Test Suite for Node Core Easy Kit Demo
 *
 * Uses Node.js native test runner (`node:test`) and strict assertions (`node:assert/strict`).
 * Verifies all modules, error handling, invalid inputs, and node-core-easy-kit integration.
 */

import { test, describe, before, after } from "node:test";
import assert from "node:assert/strict";
import { rm, mkdir } from "node:fs/promises";
import path from "node:path";
import os from "node:os";

import {
  createOrWriteFile,
  readFileContent,
  checkFileExists,
  getFileStatistics,
  listDirectoryContents,
  resolveFilePaths
} from "../src/file-manager.js";

import {
  getCompleteSystemInfo,
  formatSystemReport
} from "../src/system-info.js";

import {
  generateSha256,
  generateFileChecksum,
  compareHashes
} from "../src/security.js";

import {
  createJsonFile,
  readJsonFile,
  updateJsonConfig
} from "../src/json-manager.js";

import {
  getPackageMetadata,
  runLiveDiagnostics
} from "../src/about.js";

import {
  isNonEmptyString,
  validateFilePath,
  validateMenuChoice,
  validateJsonString,
  formatBytes,
  formatUptime
} from "../src/utils/validators.js";

// Dedicated sandbox directory inside temp
const TEST_DIR = path.join(os.tmpdir(), `node-core-demo-test-${Date.now()}`);

describe("Node Core Easy Kit Demo - Comprehensive Integration Tests", () => {
  before(async () => {
    await mkdir(TEST_DIR, { recursive: true });
  });

  after(async () => {
    try {
      await rm(TEST_DIR, { recursive: true, force: true });
    } catch {
      // Ignore cleanup error if already removed
    }
  });

  /* ------------------------------------------------------------------ */
  /* MODULE 1: FILE MANAGER TESTS                                       */
  /* ------------------------------------------------------------------ */
  describe("Module 1: File Manager", () => {
    const testFile = path.join(TEST_DIR, "nested", "folder", "sample.txt");
    const testContent = "Hello from Node Core Easy Kit integration test!";

    test("createOrWriteFile creates nested directories and writes content", async () => {
      const result = await createOrWriteFile(testFile, testContent);
      assert.strictEqual(result.success, true);
      assert.strictEqual(typeof result.path, "string");
      assert.strictEqual(path.isAbsolute(result.path), true);
    });

    test("readFileContent reads back written content accurately via readText", async () => {
      const result = await readFileContent(testFile);
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.content, testContent);
    });

    test("checkFileExists detects existing file correctly", async () => {
      const result = await checkFileExists(testFile);
      assert.strictEqual(result.exists, true);
      assert.strictEqual(result.isDirectory, false);
      assert.strictEqual(path.isAbsolute(result.resolvedPath), true);
    });

    test("checkFileExists returns false for non-existent file", async () => {
      const nonExistent = path.join(TEST_DIR, "does-not-exist.txt");
      const result = await checkFileExists(nonExistent);
      assert.strictEqual(result.exists, false);
    });

    test("getFileStatistics returns metadata and formatted file size", async () => {
      const result = await getFileStatistics(testFile);
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.stats.isFile, true);
      assert.strictEqual(result.stats.isDirectory, false);
      assert.strictEqual(typeof result.stats.sizeBytes, "number");
      assert.strictEqual(result.stats.sizeBytes > 0, true);
      assert.match(result.stats.sizeFormatted, /\d+(\.\d+)?\s*(B|KB|MB)/);
    });

    test("listDirectoryContents lists entries within directory", async () => {
      const parentDir = path.join(TEST_DIR, "nested", "folder");
      const result = await listDirectoryContents(parentDir);
      assert.strictEqual(result.success, true);
      assert.strictEqual(Array.isArray(result.entries), true);
      const found = result.entries.some((e) => e.name === "sample.txt" && e.type === "File");
      assert.strictEqual(found, true);
    });

    test("resolveFilePaths resolves multiple segments into absolute path", () => {
      const result = resolveFilePaths("data", "nested", "test.txt");
      assert.strictEqual(result.success, true);
      assert.strictEqual(path.isAbsolute(result.resolved), true);
    });

    test("Error Handling: readFileContent on non-existent file returns code ENOENT", async () => {
      const result = await readFileContent(path.join(TEST_DIR, "missing.txt"));
      assert.strictEqual(result.success, false);
      assert.strictEqual(result.code, "ENOENT");
    });

    test("Invalid Input: createOrWriteFile rejects empty filePath or invalid content", async () => {
      const r1 = await createOrWriteFile("", "some content");
      assert.strictEqual(r1.success, false);
      assert.match(r1.error, /non-empty string/i);

      const r2 = await createOrWriteFile(testFile, 12345);
      assert.strictEqual(r2.success, false);
      assert.match(r2.error, /must be a string/i);
    });
  });

  /* ------------------------------------------------------------------ */
  /* MODULE 2: SYSTEM INFORMATION TESTS                                 */
  /* ------------------------------------------------------------------ */
  describe("Module 2: System Information", () => {
    test("getCompleteSystemInfo gathers node-core-easy-kit runtime and OS data", () => {
      const info = getCompleteSystemInfo();

      // node-core-easy-kit properties
      assert.strictEqual(typeof info.nodeVersion, "string");
      assert.strictEqual(info.nodeVersion.startsWith("v"), true);
      assert.strictEqual(typeof info.platform, "string");
      assert.strictEqual(typeof info.architecture, "string");
      assert.strictEqual(typeof info.workingDirectory, "string");

      // Extended OS properties
      assert.strictEqual(typeof info.cpuCount, "number");
      assert.strictEqual(info.cpuCount > 0, true);
      assert.strictEqual(typeof info.totalMemoryBytes, "number");
      assert.strictEqual(info.totalMemoryBytes > 0, true);
      assert.strictEqual(typeof info.totalMemoryFormatted, "string");
      assert.strictEqual(typeof info.freeMemoryFormatted, "string");
      assert.strictEqual(typeof info.uptimeSeconds, "number");
    });

    test("formatSystemReport outputs formatted string with all required metrics", () => {
      const report = formatSystemReport();
      assert.match(report, /SYSTEM INFORMATION/);
      assert.match(report, /Node\.js Version/);
      assert.match(report, /Platform/);
      assert.match(report, /Architecture/);
      assert.match(report, /Working Directory/);
      assert.match(report, /CPU Core Count/);
      assert.match(report, /Total RAM/);
      assert.match(report, /Free RAM/);
      assert.match(report, /System Uptime/);
    });
  });

  /* ------------------------------------------------------------------ */
  /* MODULE 3: SECURITY UTILITIES TESTS                                 */
  /* ------------------------------------------------------------------ */
  describe("Module 3: Security Utilities", () => {
    test("generateSha256 produces exact known SHA-256 hex digest", () => {
      // Known SHA-256 vectors:
      // "" -> e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
      const emptyHash = generateSha256("");
      assert.strictEqual(emptyHash, "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");

      // "hello world" -> b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9
      const helloHash = generateSha256("hello world");
      assert.strictEqual(helloHash, "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9");
    });

    test("generateFileChecksum reads file via readText and calculates SHA-256", async () => {
      const checksumFile = path.join(TEST_DIR, "checksum-test.txt");
      await createOrWriteFile(checksumFile, "hello world");

      const result = await generateFileChecksum(checksumFile);
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.hash, "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9");
    });

    test("compareHashes verifies matching and non-matching hashes safely", () => {
      const h1 = generateSha256("test-string");
      const h2 = generateSha256("test-string");
      const h3 = generateSha256("other-string");

      assert.strictEqual(compareHashes(h1, h2), true);
      assert.strictEqual(compareHashes(h1, h3), false);
      assert.strictEqual(compareHashes(h1, "short-invalid"), false);
      assert.strictEqual(compareHashes(null, undefined), false);
    });

    test("Invalid Input: generateSha256 throws TypeError on non-string input", () => {
      assert.throws(() => generateSha256(12345), {
        name: "TypeError"
      });
    });
  });

  /* ------------------------------------------------------------------ */
  /* MODULE 4: JSON MANAGER TESTS                                       */
  /* ------------------------------------------------------------------ */
  describe("Module 4: JSON Manager", () => {
    const jsonFile = path.join(TEST_DIR, "configs", "app.json");

    test("createJsonFile creates formatted JSON file from object", async () => {
      const payload = { app: "Demo", port: 3000, enabled: true };
      const result = await createJsonFile(jsonFile, payload);
      assert.strictEqual(result.success, true);
      assert.strictEqual(typeof result.path, "string");
    });

    test("readJsonFile parses and returns JSON structure", async () => {
      const result = await readJsonFile(jsonFile);
      assert.strictEqual(result.success, true);
      assert.deepStrictEqual(result.data, { app: "Demo", port: 3000, enabled: true });
    });

    test("updateJsonConfig modifies simple and nested properties", async () => {
      // Update existing property
      const r1 = await updateJsonConfig(jsonFile, "port", 8080);
      assert.strictEqual(r1.success, true);
      assert.strictEqual(r1.updatedData.port, 8080);

      // Add nested property
      const r2 = await updateJsonConfig(jsonFile, "database.pool.max", 20);
      assert.strictEqual(r2.success, true);
      assert.strictEqual(r2.updatedData.database.pool.max, 20);

      // Verify persistence by reading back from disk
      const readBack = await readJsonFile(jsonFile);
      assert.strictEqual(readBack.data.port, 8080);
      assert.strictEqual(readBack.data.database.pool.max, 20);
    });

    test("Graceful Handling: readJsonFile on malformed JSON returns error without throwing", async () => {
      const corruptFile = path.join(TEST_DIR, "corrupt.json");
      await createOrWriteFile(corruptFile, "{ key: this is invalid json }");

      const result = await readJsonFile(corruptFile);
      assert.strictEqual(result.success, false);
      assert.match(result.error, /JSON syntax error/i);
      assert.strictEqual(typeof result.rawContent, "string");
    });

    test("Invalid Input: createJsonFile rejects invalid JSON string", async () => {
      const target = path.join(TEST_DIR, "bad-string.json");
      const result = await createJsonFile(target, "{ broken json ");
      assert.strictEqual(result.success, false);
      assert.match(result.error, /Invalid JSON payload/i);
    });
  });

  /* ------------------------------------------------------------------ */
  /* MODULE 5: ABOUT & LIVE DIAGNOSTICS                                 */
  /* ------------------------------------------------------------------ */
  describe("Module 5: About & Package Diagnostics", () => {
    test("getPackageMetadata returns correct package specification", () => {
      const meta = getPackageMetadata();
      assert.strictEqual(meta.packageName, "node-core-easy-kit");
      assert.strictEqual(meta.version, "1.0.1");
      assert.strictEqual(meta.author, "Sanchit Baviskar (GitHub: Sanchit07-dev)");
      assert.strictEqual(meta.exportedFunctions.length, 5);
    });

    test("runLiveDiagnostics executes all 5 package exports successfully", async () => {
      const logs = [];
      const logger = (msg) => logs.push(msg);
      const passed = await runLiveDiagnostics(logger);
      assert.strictEqual(passed, true);
      assert.strictEqual(logs.some((l) => l.includes("Testing getRuntimeInfo()")), true);
      assert.strictEqual(logs.some((l) => l.includes("Testing resolvePath()")), true);
      assert.strictEqual(logs.some((l) => l.includes("Testing writeText()")), true);
      assert.strictEqual(logs.some((l) => l.includes("Testing readText()")), true);
      assert.strictEqual(logs.some((l) => l.includes("Testing delay(")), true);
    });
  });

  /* ------------------------------------------------------------------ */
  /* UTILITY VALIDATOR TESTS                                            */
  /* ------------------------------------------------------------------ */
  describe("Validators & Helpers", () => {
    test("isNonEmptyString validates correctly", () => {
      assert.strictEqual(isNonEmptyString("hello"), true);
      assert.strictEqual(isNonEmptyString("   "), false);
      assert.strictEqual(isNonEmptyString(""), false);
      assert.strictEqual(isNonEmptyString(null), false);
      assert.strictEqual(isNonEmptyString(123), false);
    });

    test("validateFilePath flags empty or non-string paths", () => {
      assert.strictEqual(validateFilePath("data/file.txt").valid, true);
      assert.strictEqual(validateFilePath("").valid, false);
      assert.strictEqual(validateFilePath(null).valid, false);
    });

    test("validateMenuChoice handles range bounds and inputs", () => {
      assert.strictEqual(validateMenuChoice("3", 1, 6).valid, true);
      assert.strictEqual(validateMenuChoice("3", 1, 6).value, 3);
      assert.strictEqual(validateMenuChoice("0", 1, 6).valid, false);
      assert.strictEqual(validateMenuChoice("7", 1, 6).valid, false);
      assert.strictEqual(validateMenuChoice("abc", 1, 6).valid, false);
      assert.strictEqual(validateMenuChoice("", 1, 6).valid, false);
    });

    test("validateJsonString checks JSON validity", () => {
      const good = validateJsonString('{"active":true}');
      assert.strictEqual(good.valid, true);
      assert.strictEqual(good.data.active, true);

      const bad = validateJsonString('{ bad }');
      assert.strictEqual(bad.valid, false);
      assert.strictEqual(typeof bad.error, "string");
    });

    test("formatBytes converts sizes properly", () => {
      assert.strictEqual(formatBytes(0), "0 B");
      assert.strictEqual(formatBytes(1024), "1.00 KB");
      assert.strictEqual(formatBytes(1048576), "1.00 MB");
      assert.strictEqual(formatBytes(1073741824), "1.00 GB");
    });

    test("formatUptime converts seconds to readable format", () => {
      assert.strictEqual(formatUptime(45), "45s");
      assert.strictEqual(formatUptime(3665), "1h 1m 5s");
      assert.strictEqual(formatUptime(90061), "1d 1h 1m 1s");
      assert.strictEqual(formatUptime(-10), "0s");
    });
  });
});
