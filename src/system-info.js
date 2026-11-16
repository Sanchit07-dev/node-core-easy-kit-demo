/**
 * Module 2: System Information
 *
 * Demonstrates integration of `node-core-easy-kit`'s `getRuntimeInfo()` utility,
 * complemented with standard OS-level hardware diagnostics.
 *
 * `getRuntimeInfo()` securely captures runtime details (Node.js version, platform,
 * architecture, and working directory) without leaking sensitive environment variables.
 */

import os from "node:os";
import { getRuntimeInfo } from "node-core-easy-kit";
import { formatBytes, formatUptime } from "./utils/validators.js";

/**
 * Gathers complete system information by combining node-core-easy-kit's
 * safe runtime inspection with hardware-level metrics from node:os.
 *
 * @returns {object} Complete system diagnostics
 */
export function getCompleteSystemInfo() {
  // 1. Core runtime info from node-core-easy-kit
  const runtime = getRuntimeInfo();

  // 2. Hardware and OS information from standard library
  const cpus = os.cpus() || [];
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  const usedMemory = totalMemory - freeMemory;
  const memoryUsagePercent = totalMemory > 0 ? ((usedMemory / totalMemory) * 100).toFixed(1) : "0";
  const uptimeSeconds = os.uptime();

  return {
    // node-core-easy-kit provided fields
    nodeVersion: runtime.nodeVersion,
    platform: runtime.platform,
    architecture: runtime.architecture,
    workingDirectory: runtime.workingDirectory,

    // Extended system metrics
    osType: os.type(),
    osRelease: os.release(),
    hostname: os.hostname(),
    cpuCount: cpus.length,
    cpuModel: cpus.length > 0 ? cpus[0].model.trim() : "Unknown",
    totalMemoryBytes: totalMemory,
    totalMemoryFormatted: formatBytes(totalMemory),
    freeMemoryBytes: freeMemory,
    freeMemoryFormatted: formatBytes(freeMemory),
    usedMemoryBytes: usedMemory,
    usedMemoryFormatted: formatBytes(usedMemory),
    memoryUsagePercent: `${memoryUsagePercent}%`,
    uptimeSeconds,
    uptimeFormatted: formatUptime(uptimeSeconds)
  };
}

/**
 * Formats system information into a structured text report.
 * @param {object} info - System info object
 * @returns {string}
 */
export function formatSystemReport(info = getCompleteSystemInfo()) {
  return [
    "========================================",
    "          SYSTEM INFORMATION            ",
    "  (Powered by node-core-easy-kit)       ",
    "========================================",
    " Runtime (node-core-easy-kit):",
    `   • Node.js Version:     ${info.nodeVersion}`,
    `   • Platform:            ${info.platform}`,
    `   • Architecture:        ${info.architecture}`,
    `   • Working Directory:   ${info.workingDirectory}`,
    "",
    " Operating System & Host:",
    `   • OS Type:             ${info.osType} (${info.osRelease})`,
    `   • Hostname:            ${info.hostname}`,
    `   • System Uptime:       ${info.uptimeFormatted} (${info.uptimeSeconds}s)`,
    "",
    " Hardware Resources:",
    `   • CPU Model:           ${info.cpuModel}`,
    `   • CPU Core Count:      ${info.cpuCount} cores`,
    `   • Total RAM:           ${info.totalMemoryFormatted}`,
    `   • Free RAM:            ${info.freeMemoryFormatted}`,
    `   • Used RAM:            ${info.usedMemoryFormatted} (${info.memoryUsagePercent})`,
    "========================================"
  ].join("\n");
}

/**
 * Interactive System Information Menu
 * @param {import("node:readline/promises").Interface} rl
 */
export async function runSystemInfoMenu(rl) {
  let stay = true;
  while (stay) {
    const info = getCompleteSystemInfo();
    console.log("\n" + formatSystemReport(info));

    console.log("\nOptions:");
    console.log("1. Refresh System Diagnostics");
    console.log("2. View as JSON Output");
    console.log("3. Return to Main Menu");

    const answer = await rl.question("\nSelect an option (1-3): ");
    const choice = answer.trim();

    switch (choice) {
      case "1":
        console.log("Refreshing metrics...");
        break;
      case "2":
        console.log("\n--- Raw JSON Diagnostics ---");
        console.log(JSON.stringify(info, null, 2));
        console.log("----------------------------");
        await rl.question("\nPress Enter to continue...");
        break;
      case "3":
        stay = false;
        break;
      default:
        console.log("⚠️  Invalid option. Please enter 1, 2, or 3.");
    }
  }
}
