/**
 * Module 1: File Manager
 *
 * Demonstrates real-world integration of `node-core-easy-kit` for file operations:
 * - `writeText(filePath, content)`: writes text files and automatically creates parent directories.
 * - `readText(filePath)`: reads UTF-8 text files asynchronously with custom ENOENT error handling.
 * - `resolvePath(...parts)`: cross-platform absolute path resolution.
 */

import { stat, readdir } from "node:fs/promises";
import { readText, writeText, resolvePath } from "node-core-easy-kit";
import { validateFilePath, formatBytes } from "./utils/validators.js";

/**
 * Creates or writes text content to a target file.
 * Automatically creates any missing parent directories via node-core-easy-kit's writeText.
 *
 * @param {string} filePath - Target file path
 * @param {string} content - Text content
 * @returns {Promise<{ success: boolean, path?: string, error?: string }>}
 */
export async function createOrWriteFile(filePath, content) {
  const validation = validateFilePath(filePath);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }
  if (typeof content !== "string") {
    return { success: false, error: "Content must be a string." };
  }

  try {
    const savedPath = await writeText(filePath, content);
    return { success: true, path: savedPath };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Reads the text content of a file using node-core-easy-kit's readText.
 *
 * @param {string} filePath - Path to file
 * @returns {Promise<{ success: boolean, content?: string, error?: string, code?: string }>}
 */
export async function readFileContent(filePath) {
  const validation = validateFilePath(filePath);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  try {
    const content = await readText(filePath);
    return { success: true, content };
  } catch (err) {
    return { success: false, error: err.message, code: err.code };
  }
}

/**
 * Checks whether a file exists at the given path.
 * Demonstrates node-core-easy-kit's resolvePath and readText error inspection.
 *
 * @param {string} filePath - Path to inspect
 * @returns {Promise<{ exists: boolean, resolvedPath: string, isDirectory?: boolean }>}
 */
export async function checkFileExists(filePath) {
  const validation = validateFilePath(filePath);
  if (!validation.valid) {
    throw new TypeError(validation.error);
  }

  const resolved = resolvePath(filePath);

  try {
    const s = await stat(resolved);
    return { exists: true, resolvedPath: resolved, isDirectory: s.isDirectory() };
  } catch (err) {
    if (err && err.code === "ENOENT") {
      return { exists: false, resolvedPath: resolved, isDirectory: false };
    }
    throw err;
  }
}

/**
 * Retrieves detailed file metadata and statistics.
 * Uses node-core-easy-kit's resolvePath for reliable cross-platform path handling.
 *
 * @param {string} filePath - Path to inspect
 * @returns {Promise<{ success: boolean, stats?: object, error?: string }>}
 */
export async function getFileStatistics(filePath) {
  const validation = validateFilePath(filePath);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  try {
    const absolutePath = resolvePath(filePath);
    const s = await stat(absolutePath);

    return {
      success: true,
      stats: {
        path: absolutePath,
        sizeBytes: s.size,
        sizeFormatted: formatBytes(s.size),
        isFile: s.isFile(),
        isDirectory: s.isDirectory(),
        isSymbolicLink: s.isSymbolicLink(),
        created: s.birthtime.toISOString(),
        modified: s.mtime.toISOString(),
        mode: (s.mode & 0o777).toString(8)
      }
    };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Lists contents of a directory with file types and sizes.
 * Uses node-core-easy-kit's resolvePath.
 *
 * @param {string} dirPath - Directory to list (defaults to ".")
 * @returns {Promise<{ success: boolean, directory?: string, entries?: Array<object>, error?: string }>}
 */
export async function listDirectoryContents(dirPath = ".") {
  try {
    const absolutePath = resolvePath(dirPath);
    const dirents = await readdir(absolutePath, { withFileTypes: true });

    const entries = await Promise.all(
      dirents.map(async (d) => {
        const itemPath = resolvePath(absolutePath, d.name);
        let sizeFormatted = "-";
        let isFile = d.isFile();
        let isDirectory = d.isDirectory();

        if (isFile) {
          try {
            const s = await stat(itemPath);
            sizeFormatted = formatBytes(s.size);
          } catch {
            // Keep default
          }
        }

        return {
          name: d.name,
          type: isDirectory ? "Directory" : isFile ? "File" : "Other",
          size: sizeFormatted,
          fullPath: itemPath
        };
      })
    );

    return { success: true, directory: absolutePath, entries };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Resolves multiple path segments into an absolute path using node-core-easy-kit's resolvePath.
 *
 * @param {...string} parts
 * @returns {{ success: boolean, resolved?: string, error?: string }}
 */
export function resolveFilePaths(...parts) {
  try {
    const resolved = resolvePath(...parts);
    return { success: true, resolved };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Interactive File Manager Menu
 * @param {import("node:readline/promises").Interface} rl
 */
export async function runFileManagerMenu(rl) {
  let stay = true;
  while (stay) {
    console.log("\n========================================");
    console.log("             FILE MANAGER               ");
    console.log("  (Powered by node-core-easy-kit)       ");
    console.log("========================================");
    console.log("1. Create / Write Text File  [writeText]");
    console.log("2. Read Text File            [readText]");
    console.log("3. Check File Existence      [resolvePath]");
    console.log("4. Retrieve File Statistics  [resolvePath]");
    console.log("5. List Directory Contents   [resolvePath]");
    console.log("6. Resolve Path Segments     [resolvePath]");
    console.log("7. Return to Main Menu");
    console.log("========================================");

    const answer = await rl.question("Select an option (1-7): ");
    const choice = answer.trim();

    switch (choice) {
      case "1": {
        const filePath = await rl.question("\nEnter target file path (e.g., data/notes.txt): ");
        if (!filePath.trim()) {
          console.log("⚠️  File path cannot be empty.");
          break;
        }
        const content = await rl.question("Enter text content to write: ");
        console.log("Writing file using node-core-easy-kit: writeText()...");
        const result = await createOrWriteFile(filePath.trim(), content);
        if (result.success) {
          console.log(`✅ File saved successfully!`);
          console.log(`   Absolute Path: ${result.path}`);
        } else {
          console.log(`❌ Error: ${result.error}`);
        }
        break;
      }
      case "2": {
        const filePath = await rl.question("\nEnter file path to read (e.g., data/notes.txt): ");
        if (!filePath.trim()) {
          console.log("⚠️  File path cannot be empty.");
          break;
        }
        console.log("Reading file using node-core-easy-kit: readText()...");
        const result = await readFileContent(filePath.trim());
        if (result.success) {
          console.log("\n--- File Content Start ---");
          console.log(result.content);
          console.log("--- File Content End ---\n");
        } else {
          console.log(`❌ Error reading file: ${result.error}`);
        }
        break;
      }
      case "3": {
        const filePath = await rl.question("\nEnter file path to check: ");
        if (!filePath.trim()) {
          console.log("⚠️  File path cannot be empty.");
          break;
        }
        try {
          const result = await checkFileExists(filePath.trim());
          if (result.exists) {
            console.log(`✅ File exists at: ${result.resolvedPath} (${result.isDirectory ? "Directory" : "File"})`);
          } else {
            console.log(`ℹ️  File does not exist: ${result.resolvedPath}`);
          }
        } catch (err) {
          console.log(`❌ Error: ${err.message}`);
        }
        break;
      }
      case "4": {
        const filePath = await rl.question("\nEnter file path for stats: ");
        if (!filePath.trim()) {
          console.log("⚠️  File path cannot be empty.");
          break;
        }
        const result = await getFileStatistics(filePath.trim());
        if (result.success) {
          console.log("\n📊 File Statistics:");
          console.log(`  • Path:       ${result.stats.path}`);
          console.log(`  • Type:       ${result.stats.isDirectory ? "Directory" : result.stats.isFile ? "Regular File" : "Special"}`);
          console.log(`  • Size:       ${result.stats.sizeFormatted} (${result.stats.sizeBytes} bytes)`);
          console.log(`  • Created:    ${result.stats.created}`);
          console.log(`  • Modified:   ${result.stats.modified}`);
          console.log(`  • Mode:       ${result.stats.mode}`);
        } else {
          console.log(`❌ Error: ${result.error}`);
        }
        break;
      }
      case "5": {
        const dirPath = await rl.question("\nEnter directory path to list (press enter for current dir): ");
        const target = dirPath.trim() || ".";
        const result = await listDirectoryContents(target);
        if (result.success) {
          console.log(`\n📁 Contents of "${result.directory}":`);
          if (result.entries.length === 0) {
            console.log("   (Directory is empty)");
          } else {
            console.log(
              "   " +
              "Name".padEnd(30) +
              "Type".padEnd(14) +
              "Size"
            );
            console.log("   " + "-".repeat(55));
            for (const item of result.entries) {
              console.log(
                "   " +
                item.name.padEnd(30) +
                item.type.padEnd(14) +
                item.size
              );
            }
          }
        } else {
          console.log(`❌ Error: ${result.error}`);
        }
        break;
      }
      case "6": {
        const input = await rl.question("\nEnter path segments separated by comma (e.g. data, logs, app.log): ");
        const parts = input.split(",").map((s) => s.trim()).filter(Boolean);
        if (parts.length === 0) {
          console.log("⚠️  Please enter at least one segment.");
          break;
        }
        const result = resolveFilePaths(...parts);
        if (result.success) {
          console.log(`✅ Resolved absolute path: ${result.resolved}`);
        } else {
          console.log(`❌ Error: ${result.error}`);
        }
        break;
      }
      case "7":
        stay = false;
        break;
      default:
        console.log("⚠️  Invalid option. Please enter a number between 1 and 7.");
    }
  }
}
