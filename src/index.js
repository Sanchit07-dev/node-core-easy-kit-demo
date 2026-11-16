#!/usr/bin/env node

/**
 * Node Core Easy Kit Demo
 *
 * Interactive terminal CLI application demonstrating the real-world usage of
 * the published npm package `node-core-easy-kit`.
 *
 * Author: Sanchit Baviskar
 * License: MIT
 */

import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import process from "node:process";

import { runFileManagerMenu } from "./file-manager.js";
import { runSystemInfoMenu } from "./system-info.js";
import { runSecurityMenu } from "./security.js";
import { runJsonManagerMenu } from "./json-manager.js";
import { runAboutMenu } from "./about.js";
import { validateMenuChoice } from "./utils/validators.js";

/**
 * Prints the main application header.
 */
function printMainMenu() {
  console.log("\n========================================");
  console.log("       NODE CORE EASY KIT DEMO          ");
  console.log("========================================");
  console.log("");
  console.log("1. File Manager");
  console.log("2. System Information");
  console.log("3. Security Utilities");
  console.log("4. JSON Manager");
  console.log("5. About This Package");
  console.log("6. Exit");
  console.log("");
}

/**
 * Main application CLI loop.
 */
export async function main() {
  const rl = readline.createInterface({ input, output });

  // Handle graceful shutdown on Ctrl+C (SIGINT)
  let isClosing = false;
  rl.on("close", () => {
    if (!isClosing) {
      console.log("\n\n👋 Exiting Node Core Easy Kit Demo. Goodbye!\n");
      process.exit(0);
    }
  });

  try {
    let running = true;

    while (running) {
      printMainMenu();
      const answer = await rl.question("Select an option: ");
      const choiceValidation = validateMenuChoice(answer, 1, 6);

      if (!choiceValidation.valid) {
        console.log(`\n⚠️  ${choiceValidation.error}`);
        continue;
      }

      switch (choiceValidation.value) {
        case 1:
          await runFileManagerMenu(rl);
          break;
        case 2:
          await runSystemInfoMenu(rl);
          break;
        case 3:
          await runSecurityMenu(rl);
          break;
        case 4:
          await runJsonManagerMenu(rl);
          break;
        case 5:
          await runAboutMenu(rl);
          break;
        case 6:
          running = false;
          console.log("\nThank you for using Node Core Easy Kit Demo!");
          console.log("Created by Sanchit Baviskar.\n");
          break;
        default:
          console.log("\n⚠️  Invalid option. Please choose between 1 and 6.");
      }
    }
  } catch (err) {
    console.error("\n❌ An unexpected error occurred:", err?.message || err);
  } finally {
    isClosing = true;
    rl.close();
  }
}

// Automatically start when executed directly
if (process.argv[1] && process.argv[1].endsWith("index.js")) {
  main().catch((err) => {
    console.error("Fatal startup error:", err);
    process.exit(1);
  });
}
