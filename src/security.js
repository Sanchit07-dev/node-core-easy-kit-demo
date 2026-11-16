/**
 * Module 3: Security Utilities
 *
 * Demonstrates secure cryptographic hash operations, integrating with
 * `node-core-easy-kit`'s `readText()` for file integrity verification.
 *
 * NOTE ON PACKAGE CAPABILITIES:
 * `node-core-easy-kit` (v1.0.1) focuses strictly on core modules (fs, path, process, timers)
 * and does not export crypto utilities directly. To provide a complete, robust utility
 * while strictly following package inspection rules, cryptographic algorithms are
 * implemented via Node.js's built-in `node:crypto`, perfectly complementing the toolkit
 * by reading files through `node-core-easy-kit`'s `readText`.
 *
 * Security Principle:
 * Never persists or logs raw passwords or sensitive user tokens.
 */

import { createHash, timingSafeEqual } from "node:crypto";
import { readText, resolvePath } from "node-core-easy-kit";
import { isNonEmptyString, validateFilePath } from "./utils/validators.js";

/**
 * Computes the SHA-256 hash of a string.
 *
 * @param {string} text - Input text to hash
 * @returns {string} Hex-encoded SHA-256 digest
 * @throws {TypeError} If text is not a string
 */
export function generateSha256(text) {
  if (typeof text !== "string") {
    throw new TypeError("Input must be a string.");
  }
  return createHash("sha256").update(text, "utf8").digest("hex");
}

/**
 * Computes the SHA-256 hash of a file's contents.
 * Integrates directly with node-core-easy-kit's readText() to retrieve file content.
 *
 * @param {string} filePath - Path to file
 * @returns {Promise<{ success: boolean, hash?: string, path?: string, error?: string }>}
 */
export async function generateFileChecksum(filePath) {
  const validation = validateFilePath(filePath);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  try {
    const absolutePath = resolvePath(filePath);
    // Read file using node-core-easy-kit's readText
    const content = await readText(filePath);
    const hash = generateSha256(content);
    return { success: true, hash, path: absolutePath };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Compares two SHA-256 hashes using constant-time comparison to prevent timing attacks.
 *
 * @param {string} hashA - First hex hash string
 * @param {string} hashB - Second hex hash string
 * @returns {boolean} True if hashes match exactly
 */
export function compareHashes(hashA, hashB) {
  if (typeof hashA !== "string" || typeof hashB !== "string") {
    return false;
  }

  const cleanA = hashA.trim().toLowerCase();
  const cleanB = hashB.trim().toLowerCase();

  // If lengths differ, timingSafeEqual would throw a RangeError
  if (cleanA.length !== cleanB.length) {
    return false;
  }

  try {
    const bufA = Buffer.from(cleanA, "utf8");
    const bufB = Buffer.from(cleanB, "utf8");
    return timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

/**
 * Interactive Security Menu
 * @param {import("node:readline/promises").Interface} rl
 */
export async function runSecurityMenu(rl) {
  let stay = true;
  while (stay) {
    console.log("\n========================================");
    console.log("          SECURITY UTILITIES            ");
    console.log("========================================");
    console.log("1. Generate SHA-256 Hash for Text");
    console.log("2. Generate File Checksum (via readText)");
    console.log("3. Compare Two Hashes (Timing-Safe)");
    console.log("4. Return to Main Menu");
    console.log("========================================");

    const answer = await rl.question("Select an option (1-4): ");
    const choice = answer.trim();

    switch (choice) {
      case "1": {
        const text = await rl.question("\nEnter text to hash with SHA-256: ");
        if (!text) {
          console.log("⚠️  Input text cannot be empty.");
          break;
        }
        const hash = generateSha256(text);
        console.log(`\n🔑 SHA-256 Digest:`);
        console.log(`   ${hash}`);
        break;
      }
      case "2": {
        const filePath = await rl.question("\nEnter file path to verify (e.g. examples/sample.json): ");
        if (!filePath.trim()) {
          console.log("⚠️  File path cannot be empty.");
          break;
        }
        console.log("Reading file via node-core-easy-kit: readText()...");
        const result = await generateFileChecksum(filePath.trim());
        if (result.success) {
          console.log(`✅ File Checksum Generated!`);
          console.log(`   File: ${result.path}`);
          console.log(`   SHA-256: ${result.hash}`);
        } else {
          console.log(`❌ Error: ${result.error}`);
        }
        break;
      }
      case "3": {
        const hashA = await rl.question("\nEnter first hash: ");
        const hashB = await rl.question("Enter second hash: ");
        if (!hashA.trim() || !hashB.trim()) {
          console.log("⚠️  Both hashes must be provided.");
          break;
        }
        const matches = compareHashes(hashA, hashB);
        if (matches) {
          console.log("✅ Hashes match exactly! (Verified with constant-time equality)");
        } else {
          console.log("❌ Hashes do NOT match.");
        }
        break;
      }
      case "4":
        stay = false;
        break;
      default:
        console.log("⚠️  Invalid option. Please enter a number between 1 and 4.");
    }
  }
}
