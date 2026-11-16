/**
 * Reusable validation and formatting utilities for Node Core Easy Kit Demo.
 */

/**
 * Checks whether a value is a non-empty string.
 * @param {unknown} value
 * @returns {boolean}
 */
export function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

/**
 * Validates that a string is a valid file or directory path.
 * @param {unknown} filePath
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateFilePath(filePath) {
  if (typeof filePath !== "string" || filePath.trim() === "") {
    return { valid: false, error: "File path must be a non-empty string." };
  }
  return { valid: true };
}

/**
 * Validates a numeric menu option against min and max bounds.
 * @param {string|number} input
 * @param {number} min
 * @param {number} max
 * @returns {{ valid: boolean, value?: number, error?: string }}
 */
export function validateMenuChoice(input, min, max) {
  const trimmed = String(input).trim();
  if (trimmed === "") {
    return { valid: false, error: "Input cannot be empty." };
  }
  const parsed = Number(trimmed);
  if (!Number.isInteger(parsed)) {
    return { valid: false, error: `Please enter a whole number between ${min} and ${max}.` };
  }
  if (parsed < min || parsed > max) {
    return { valid: false, error: `Selection out of range (${min}-${max}).` };
  }
  return { valid: true, value: parsed };
}

/**
 * Attempts to parse a JSON string, returning safe status and result.
 * @param {string} text
 * @returns {{ valid: boolean, data?: unknown, error?: string }}
 */
export function validateJsonString(text) {
  if (typeof text !== "string" || text.trim() === "") {
    return { valid: false, error: "Input is empty or not a string." };
  }
  try {
    const data = JSON.parse(text);
    return { valid: true, data };
  } catch (err) {
    return { valid: false, error: err.message };
  }
}

/**
 * Formats a byte number into a human-readable string (KB, MB, GB).
 * @param {number} bytes
 * @returns {string}
 */
export function formatBytes(bytes) {
  if (typeof bytes !== "number" || Number.isNaN(bytes) || bytes < 0) {
    return "0 B";
  }
  if (bytes === 0) return "0 B";

  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const unitIndex = Math.min(i, units.length - 1);
  const value = bytes / Math.pow(1024, unitIndex);
  return `${value.toFixed(2)} ${units[unitIndex]}`;
}

/**
 * Formats uptime in seconds into days, hours, minutes, and seconds.
 * @param {number} seconds
 * @returns {string}
 */
export function formatUptime(seconds) {
  if (typeof seconds !== "number" || seconds < 0 || !Number.isFinite(seconds)) {
    return "0s";
  }
  const sec = Math.floor(seconds);
  const days = Math.floor(sec / 86400);
  const hours = Math.floor((sec % 86400) / 3600);
  const minutes = Math.floor((sec % 3600) / 60);
  const remSeconds = sec % 60;

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  parts.push(`${remSeconds}s`);

  return parts.join(" ");
}
