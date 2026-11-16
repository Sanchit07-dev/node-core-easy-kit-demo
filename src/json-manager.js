/**
 * Module 4: JSON Manager
 *
 * Demonstrates storing and managing structured JSON configuration data
 * using `node-core-easy-kit`'s `writeText` and `readText` as the foundational I/O layer.
 */

import { readText, writeText, resolvePath } from "node-core-easy-kit";
import { validateFilePath, validateJsonString } from "./utils/validators.js";

/**
 * Creates or overwrites a JSON file with validated JSON content.
 * Leverages node-core-easy-kit's writeText to automatically create missing directories.
 *
 * @param {string} filePath - Target file path
 * @param {object|string} data - Object or valid JSON string
 * @returns {Promise<{ success: boolean, path?: string, error?: string }>}
 */
export async function createJsonFile(filePath, data) {
  const validation = validateFilePath(filePath);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  let jsonString;
  if (typeof data === "string") {
    const parseCheck = validateJsonString(data);
    if (!parseCheck.valid) {
      return { success: false, error: `Invalid JSON payload: ${parseCheck.error}` };
    }
    jsonString = JSON.stringify(parseCheck.data, null, 2);
  } else if (typeof data === "object" && data !== null) {
    try {
      jsonString = JSON.stringify(data, null, 2);
    } catch (err) {
      return { success: false, error: `Cannot stringify object: ${err.message}` };
    }
  } else {
    return { success: false, error: "Data must be an object or valid JSON string." };
  }

  try {
    const savedPath = await writeText(filePath, jsonString);
    return { success: true, path: savedPath };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Reads and parses a JSON file using node-core-easy-kit's readText.
 * Gracefully handles missing files and syntax errors in corrupted JSON files.
 *
 * @param {string} filePath - Path to JSON file
 * @returns {Promise<{ success: boolean, data?: unknown, path?: string, error?: string, rawContent?: string }>}
 */
export async function readJsonFile(filePath) {
  const validation = validateFilePath(filePath);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  try {
    const absolutePath = resolvePath(filePath);
    const rawContent = await readText(filePath);

    try {
      const data = JSON.parse(rawContent);
      return { success: true, data, rawContent, path: absolutePath };
    } catch (parseErr) {
      return {
        success: false,
        error: `JSON syntax error: ${parseErr.message}`,
        rawContent,
        path: absolutePath
      };
    }
  } catch (err) {
    return { success: false, error: err.message, code: err.code };
  }
}

/**
 * Updates a configuration key in an existing JSON file.
 * Supports dot-notated property paths (e.g. "settings.theme").
 *
 * @param {string} filePath - Path to JSON file
 * @param {string} propertyPath - Property name or dot notation
 * @param {unknown} value - New value to set
 * @returns {Promise<{ success: boolean, path?: string, updatedData?: unknown, error?: string }>}
 */
export async function updateJsonConfig(filePath, propertyPath, value) {
  if (typeof propertyPath !== "string" || propertyPath.trim() === "") {
    return { success: false, error: "Property path must be a non-empty string." };
  }

  const readResult = await readJsonFile(filePath);
  if (!readResult.success) {
    return { success: false, error: `Cannot read target file: ${readResult.error}` };
  }

  if (typeof readResult.data !== "object" || readResult.data === null || Array.isArray(readResult.data)) {
    return { success: false, error: "JSON root must be an object to update configuration properties." };
  }

  const data = readResult.data;
  const segments = propertyPath.split(".").map((s) => s.trim()).filter(Boolean);

  if (segments.length === 0) {
    return { success: false, error: "Invalid property path." };
  }

  // Navigate and update
  let current = data;
  for (let i = 0; i < segments.length - 1; i++) {
    const key = segments[i];
    if (typeof current[key] !== "object" || current[key] === null) {
      current[key] = {};
    }
    current = current[key];
  }

  const lastKey = segments[segments.length - 1];
  current[lastKey] = value;

  // Persist back using writeText
  try {
    const serialized = JSON.stringify(data, null, 2);
    const savedPath = await writeText(filePath, serialized);
    return { success: true, path: savedPath, updatedData: data };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Formats a JSON value with indentation for terminal display.
 * @param {unknown} data
 * @returns {string}
 */
export function formatJsonDisplay(data) {
  try {
    return JSON.stringify(data, null, 2);
  } catch {
    return String(data);
  }
}

/**
 * Interactive JSON Manager Menu
 * @param {import("node:readline/promises").Interface} rl
 */
export async function runJsonManagerMenu(rl) {
  let stay = true;
  while (stay) {
    console.log("\n========================================");
    console.log("             JSON MANAGER               ");
    console.log("  (Powered by node-core-easy-kit)       ");
    console.log("========================================");
    console.log("1. Create New JSON File      [writeText]");
    console.log("2. Read & Display JSON File  [readText]");
    console.log("3. Update JSON Configuration [readText + writeText]");
    console.log("4. Validate Raw JSON String");
    console.log("5. Load Sample Config        [examples/sample.json]");
    console.log("6. Return to Main Menu");
    console.log("========================================");

    const answer = await rl.question("Select an option (1-6): ");
    const choice = answer.trim();

    switch (choice) {
      case "1": {
        const filePath = await rl.question("\nEnter target path (e.g. data/config.json): ");
        if (!filePath.trim()) {
          console.log("⚠️  Path cannot be empty.");
          break;
        }
        console.log("Enter valid JSON content (or enter simple key=value pairs, e.g. {\"status\":\"ok\"}):");
        const raw = await rl.question("JSON: ");
        const result = await createJsonFile(filePath.trim(), raw);
        if (result.success) {
          console.log(`✅ JSON file created successfully at: ${result.path}`);
        } else {
          console.log(`❌ Error creating JSON: ${result.error}`);
        }
        break;
      }
      case "2": {
        const filePath = await rl.question("\nEnter JSON file path to read: ");
        if (!filePath.trim()) {
          console.log("⚠️  Path cannot be empty.");
          break;
        }
        console.log("Reading file via node-core-easy-kit: readText()...");
        const result = await readJsonFile(filePath.trim());
        if (result.success) {
          console.log("\n📄 Parsed JSON Content:");
          console.log(formatJsonDisplay(result.data));
        } else {
          console.log(`❌ Error reading JSON: ${result.error}`);
          if (result.rawContent) {
            console.log("\n⚠️  Raw unparsed content in file:");
            console.log(result.rawContent);
          }
        }
        break;
      }
      case "3": {
        const filePath = await rl.question("\nEnter path to existing JSON file: ");
        if (!filePath.trim()) {
          console.log("⚠️  Path cannot be empty.");
          break;
        }
        const propPath = await rl.question("Enter property path to update (e.g., status or settings.theme): ");
        if (!propPath.trim()) {
          console.log("⚠️  Property path cannot be empty.");
          break;
        }
        const valStr = await rl.question("Enter new value: ");
        // Auto parse number/boolean/json if applicable
        let finalValue = valStr;
        if (valStr === "true") finalValue = true;
        else if (valStr === "false") finalValue = false;
        else if (valStr === "null") finalValue = null;
        else if (!isNaN(Number(valStr)) && valStr.trim() !== "") finalValue = Number(valStr);

        console.log("Updating configuration via node-core-easy-kit...");
        const result = await updateJsonConfig(filePath.trim(), propPath.trim(), finalValue);
        if (result.success) {
          console.log("✅ Configuration updated successfully!");
          console.log("\nUpdated JSON state:");
          console.log(formatJsonDisplay(result.updatedData));
        } else {
          console.log(`❌ Error updating configuration: ${result.error}`);
        }
        break;
      }
      case "4": {
        const raw = await rl.question("\nEnter raw JSON string to validate: ");
        const check = validateJsonString(raw);
        if (check.valid) {
          console.log("✅ Valid JSON! Parsed representation:");
          console.log(formatJsonDisplay(check.data));
        } else {
          console.log(`❌ Invalid JSON: ${check.error}`);
        }
        break;
      }
      case "5": {
        console.log("Reading examples/sample.json via node-core-easy-kit...");
        const result = await readJsonFile("examples/sample.json");
        if (result.success) {
          console.log("\n🌟 Sample Configuration (examples/sample.json):");
          console.log(formatJsonDisplay(result.data));
        } else {
          console.log(`❌ Error reading sample: ${result.error}`);
        }
        break;
      }
      case "6":
        stay = false;
        break;
      default:
        console.log("⚠️  Invalid option. Please enter a number between 1 and 6.");
    }
  }
}
