/**
 * Module 5: About This Package & Live Diagnostics
 *
 * Provides comprehensive technical details about the `node-core-easy-kit` npm package,
 * its zero-dependency philosophy, architecture, and live verification of all exports.
 */

import { rm } from "node:fs/promises";
import path from "node:path";
import { delay, getRuntimeInfo, resolvePath, writeText, readText } from "node-core-easy-kit";
import { formatJsonDisplay } from "./json-manager.js";

/**
 * Returns package metadata and architectural summary.
 */
export function getPackageMetadata() {
  return {
    packageName: "node-core-easy-kit",
    version: "1.0.1",
    author: "Sanchit Baviskar (GitHub: Sanchit07-dev)",
    license: "MIT",
    npmUrl: "https://www.npmjs.com/package/node-core-easy-kit",
    githubUrl: "https://github.com/Sanchit07-dev/node-core-easy-kit",
    description: "Beginner-friendly utilities demonstrating Node.js core modules (fs, path, process, timers).",
    dependenciesCount: 0,
    coreModulesUsed: [
      "node:fs/promises (readFile, writeFile, mkdir)",
      "node:path (resolve, dirname)",
      "node:process (version, platform, arch, cwd)",
      "node:timers/promises (setTimeout)"
    ],
    exportedFunctions: [
      {
        name: "writeText(filePath, content)",
        returns: "Promise<string> (absolute path)",
        description: "Asynchronously writes text to disk, automatically creating missing parent directories."
      },
      {
        name: "readText(filePath)",
        returns: "Promise<string> (file content)",
        description: "Asynchronously reads UTF-8 text with enriched ENOENT not-found error handling."
      },
      {
        name: "resolvePath(...parts)",
        returns: "string (normalized absolute path)",
        description: "Combines path segments into an absolute path using OS-specific separators."
      },
      {
        name: "getRuntimeInfo()",
        returns: "{ nodeVersion, platform, architecture, workingDirectory }",
        description: "Returns safe environment details without leaking secrets or process.env variables."
      },
      {
        name: "delay(milliseconds)",
        returns: "Promise<void>",
        description: "Non-blocking timer delay using native Promise-based timers with strict type validation."
      }
    ]
  };
}

/**
 * Executes a live health check on all 5 exported functions from node-core-easy-kit.
 * @param {function(string): void} logger
 * @returns {Promise<boolean>}
 */
export async function runLiveDiagnostics(logger = console.log) {
  logger("\n🔍 Running live diagnostic checks for node-core-easy-kit...");

  try {
    // 1. Check getRuntimeInfo()
    logger("  [1/5] Testing getRuntimeInfo()...");
    const info = getRuntimeInfo();
    if (!info.nodeVersion || !info.platform || !info.architecture || !info.workingDirectory) {
      throw new Error("getRuntimeInfo() returned incomplete object.");
    }
    logger(`        ✔ OK: Running Node ${info.nodeVersion} on ${info.platform} (${info.architecture})`);

    // 2. Check resolvePath()
    logger("  [2/5] Testing resolvePath()...");
    const resolved = resolvePath("data", "diagnostic.txt");
    if (typeof resolved !== "string" || !resolved.includes("diagnostic.txt")) {
      throw new Error("resolvePath() failed to normalize path.");
    }
    logger(`        ✔ OK: Resolved path -> ${resolved}`);

    // 3. Check writeText()
    logger("  [3/5] Testing writeText() with automatic parent directory creation...");
    const testContent = `Diagnostic probe created at ${new Date().toISOString()}`;
    const writtenPath = await writeText("data/diagnostics/probe.txt", testContent);
    logger(`        ✔ OK: Wrote file to -> ${writtenPath}`);

    // 4. Check readText()
    logger("  [4/5] Testing readText()...");
    const readBack = await readText(writtenPath);
    if (readBack !== testContent) {
      throw new Error("readText() did not match written content.");
    }
    logger("        ✔ OK: Content verified with byte-level fidelity.");

    // Cleanup diagnostic probe directory
    try {
      await rm(path.dirname(writtenPath), { recursive: true, force: true });
    } catch {
      // Ignore cleanup error
    }

    // 5. Check delay()
    logger("  [5/5] Testing delay(300ms) non-blocking timer...");
    const start = Date.now();
    await delay(300);
    const elapsed = Date.now() - start;
    logger(`        ✔ OK: Resumed after ${elapsed}ms delay.`);

    logger("\n🎉 ALL 5 PACKAGE EXPORTS ARE HEALTHY AND FULLY OPERATIONAL!\n");
    return true;
  } catch (err) {
    logger(`\n❌ Diagnostic failed: ${err.message}\n`);
    return false;
  }
}

/**
 * Interactive About Menu
 * @param {import("node:readline/promises").Interface} rl
 */
export async function runAboutMenu(rl) {
  let stay = true;
  const meta = getPackageMetadata();

  while (stay) {
    console.log("\n========================================");
    console.log("       ABOUT NODE-CORE-EASY-KIT        ");
    console.log("========================================");
    console.log(`Package Name:  ${meta.packageName}`);
    console.log(`Version:       ${meta.version}`);
    console.log(`Author:        ${meta.author}`);
    console.log(`License:       ${meta.license}`);
    console.log(`NPM Registry:  ${meta.npmUrl}`);
    console.log(`GitHub Repo:   ${meta.githubUrl}`);
    console.log("----------------------------------------");
    console.log("Core Node.js Modules Demonstrated:");
    for (const mod of meta.coreModulesUsed) {
      console.log(`  • ${mod}`);
    }
    console.log("----------------------------------------");
    console.log("Exported API Signatures:");
    for (const fn of meta.exportedFunctions) {
      console.log(`  • ${fn.name}`);
      console.log(`    ↳ Return: ${fn.returns}`);
      console.log(`    ↳ Info:   ${fn.description}`);
    }
    console.log("========================================");
    console.log("Options:");
    console.log("1. Run Live Self-Test Diagnostics (All 5 Exports)");
    console.log("2. View Package Architecture in JSON");
    console.log("3. Return to Main Menu");

    const answer = await rl.question("\nSelect an option (1-3): ");
    const choice = answer.trim();

    switch (choice) {
      case "1":
        await runLiveDiagnostics(console.log);
        await rl.question("Press Enter to continue...");
        break;
      case "2":
        console.log("\n--- Architecture Metadata ---");
        console.log(formatJsonDisplay(meta));
        console.log("-----------------------------\n");
        await rl.question("Press Enter to continue...");
        break;
      case "3":
        stay = false;
        break;
      default:
        console.log("⚠️  Invalid option. Please enter 1, 2, or 3.");
    }
  }
}
