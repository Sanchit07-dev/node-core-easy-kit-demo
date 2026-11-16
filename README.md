# Node Core Easy Kit Demo 🚀

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![NPM Package](https://img.shields.io/badge/npm-node--core--easy--kit-red.svg)](https://www.npmjs.com/package/node-core-easy-kit)
[![Tests Passing](https://img.shields.io/badge/tests-28%20passed-success.svg)](tests/integration.test.js)

A production-grade, interactive terminal CLI application developed in modern Node.js (ES Modules) that demonstrates the real-world usage and practical integration of the published npm package **[`node-core-easy-kit`](https://www.npmjs.com/package/node-core-easy-kit)**.

> **Assessment & Architecture Context:**  
> This project is a consumer application built to showcase the real-world value of the independently developed and published npm package [`node-core-easy-kit`](https://github.com/Sanchit07-dev/node-core-easy-kit). Rather than re-inventing native functionality or bundling raw code, this application installs `node-core-easy-kit` as a formal dependency from the npm registry and leverages its exported APIs to deliver a clean CLI experience.

---

## 📑 Table of Contents

1. [Project Overview](#1-project-overview)
2. [Features](#2-features)
3. [Technologies Used](#3-technologies-used)
4. [Installation Instructions](#4-installation-instructions)
5. [How to Run the Project](#5-how-to-run-the-project)
6. [CLI Menus & Example Terminal Output](#6-cli-menus--example-terminal-output)
7. [Project Structure](#7-project-structure)
8. [npm Package Integration Explanation](#8-npm-package-integration-explanation)
9. [Examples of Package Functions Being Used](#9-examples-of-package-functions-being-used)
10. [Testing Instructions](#10-testing-instructions)
11. [Error Handling & Edge Cases](#11-error-handling--edge-cases)
12. [Future Improvements](#12-future-improvements)
13. [Original npm Package Links](#13-original-npm-package-links)
14. [Author & Academic Submission Details](#14-author--academic-submission-details)

---

## 1. Project Overview

Modern Node.js applications frequently require dependable utilities for file I/O, cross-platform path manipulation, non-blocking task pacing, and environment inspection without leaking sensitive process secrets.

The published npm package **`node-core-easy-kit`** provides a beginner-friendly, zero-dependency foundation built on top of Node.js standard libraries (`node:fs/promises`, `node:path`, `node:process`, and `node:timers/promises`).

**Node Core Easy Kit Demo** serves as a complete consumer application that integrates all 5 exported functions from `node-core-easy-kit`:
- `writeText`
- `readText`
- `resolvePath`
- `getRuntimeInfo`
- `delay`

The application wraps these functions within an interactive terminal interface, layered with input validation, diagnostic reporting, structured JSON configuration handling, and timing-safe cryptographic security.

---

## 2. Features

### 🗂️ Module 1: File Manager
- **Create & Write Text Files:** Writes text to disk with automatic parent directory creation via `writeText()`.
- **Read Text Files:** Reads UTF-8 encoded text files via `readText()` with enriched `ENOENT` handling.
- **File Existence Checks:** Safely verifies whether a file or directory exists using `resolvePath()`.
- **Retrieve File Statistics:** Inspects file sizes (formatted into B, KB, MB, GB), creation/modification timestamps, and file permissions.
- **List Directory Contents:** Scans and presents directory contents with item names, types, and formatted sizes.
- **Resolve Path Segments:** Normalizes arbitrary path segments into platform-specific absolute paths via `resolvePath()`.

### 🖥️ Module 2: System Information
- **Runtime Environment:** Displays Node.js version, platform, architecture, and working directory extracted safely through `getRuntimeInfo()`.
- **Operating System Telemetry:** Reports host kernel, operating system release, hostname, and system uptime.
- **Hardware Resources:** Analyzes CPU core count, CPU model, total RAM, free RAM, used RAM, and memory consumption percentage.
- **JSON Telemetry Export:** Provides an option to view or pipe raw system diagnostics in formatted JSON.

### 🔐 Module 3: Security Utilities
- **SHA-256 Hashing:** Generates cryptographic digests for user-specified strings without persisting secrets.
- **File Integrity Verification:** Reads file contents using `node-core-easy-kit`'s `readText()` and computes its SHA-256 checksum.
- **Timing-Safe Hash Comparison:** Uses `crypto.timingSafeEqual` with buffer length matching to prevent side-channel timing attacks.

### ⚙️ Module 4: JSON Manager
- **Create JSON Files:** Validates and formats JSON objects or strings, saving them to disk using `writeText()`.
- **Read JSON Files:** Reads files using `readText()` and safely parses them into JavaScript objects.
- **Update Configuration:** Updates specific properties (including nested dot-notated keys such as `settings.theme`) and persists changes back to disk.
- **Graceful Error Handling:** Catches syntax errors in corrupt JSON files without crashing the application.
- **Sample Config Explorer:** Inspects `examples/sample.json` directly from the CLI.

### ℹ️ Module 5: About This Package & Live Diagnostics
- **Architecture & Metadata:** Displays package version, author details, MIT license, npm registry link, and GitHub repository.
- **Live Self-Test Diagnostics:** Executes real-time probes against all 5 exported package functions (`getRuntimeInfo`, `resolvePath`, `writeText`, `readText`, `delay`), validating live execution and timing.

---

## 3. Technologies Used

- **Runtime:** [Node.js](https://nodejs.org/) (v18.0.0 or higher; tested on v25.9.0)
- **Module System:** JavaScript ES Modules (`"type": "module"`)
- **Package Manager:** `npm` (v11.12.1)
- **Primary Package Dependency:** [`node-core-easy-kit@1.0.1`](https://www.npmjs.com/package/node-core-easy-kit)
- **Node.js Core Modules Utilized:**
  - `node:readline/promises` — Interactive terminal menu navigation
  - `node:process` — Standard I/O streams and process lifecycle
  - `node:crypto` — SHA-256 digests and constant-time comparisons
  - `node:os` — Host architecture and memory diagnostics
  - `node:fs/promises` — Directory reading and metadata inspection
  - `node:path` — File system path utilities
  - `node:test` & `node:assert/strict` — Native test runner and assertion framework

---

## 4. Installation Instructions

Clone the repository and install dependencies using standard `npm`:

```bash
# 1. Clone the repository
git clone https://github.com/Sanchit07-dev/node-core-easy-kit-demo.git

# 2. Enter project directory
cd node-core-easy-kit-demo

# 3. Install dependencies (installs node-core-easy-kit from npm registry)
npm install
```

### Verifying Installed Dependency:
To verify that `node-core-easy-kit` was fetched from the official npm registry:
```bash
npm list node-core-easy-kit
```

---

## 5. How to Run the Project

You can run the interactive CLI application using any of the configured npm scripts:

```bash
# Start the interactive CLI
npm start

# Alternatively, using the demo script
npm run demo

# Direct Node execution
node src/index.js
```

---

## 6. CLI Menus & Example Terminal Output

### Main Menu Interface
```text
========================================
       NODE CORE EASY KIT DEMO          
========================================

1. File Manager
2. System Information
3. Security Utilities
4. JSON Manager
5. About This Package
6. Exit

Select an option: 
```

### Module 1: File Manager Example Output
```text
========================================
             FILE MANAGER               
  (Powered by node-core-easy-kit)       
========================================
1. Create / Write Text File  [writeText]
2. Read Text File            [readText]
3. Check File Existence      [resolvePath]
4. Retrieve File Statistics  [resolvePath]
5. List Directory Contents   [resolvePath]
6. Resolve Path Segments     [resolvePath]
7. Return to Main Menu
========================================
Select an option (1-7): 1

Enter target file path (e.g., data/notes.txt): data/reports/annual.txt
Enter text content to write: Q4 system performance exceeded targets by 24%.
Writing file using node-core-easy-kit: writeText()...
✅ File saved successfully!
   Absolute Path: /Users/sanchitbaviskar07@gmail.com /demo1/data/reports/annual.txt
```

### Module 2: System Information Output
```text
========================================
          SYSTEM INFORMATION            
  (Powered by node-core-easy-kit)       
========================================
 Runtime (node-core-easy-kit):
   • Node.js Version:     v25.9.0
   • Platform:            darwin
   • Architecture:        arm64
   • Working Directory:   /Users/sanchitbaviskar07@gmail.com /demo1

 Operating System & Host:
   • OS Type:             Darwin (27.0.0)
   • Hostname:            Sanchits-MacBook-Pro.local
   • System Uptime:       19d 23h 2m 14s (1724534s)

 Hardware Resources:
   • CPU Model:           Apple M4
   • CPU Core Count:      10 cores
   • Total RAM:           16.00 GB
   • Free RAM:            88.45 MB
   • Used RAM:            15.91 GB (99.5%)
========================================
```

### Module 3: Security Utilities Output
```text
========================================
          SECURITY UTILITIES            
========================================
1. Generate SHA-256 Hash for Text
2. Generate File Checksum (via readText)
3. Compare Two Hashes (Timing-Safe)
4. Return to Main Menu
========================================
Select an option (1-4): 2

Enter file path to verify (e.g. examples/sample.json): examples/sample.json
Reading file via node-core-easy-kit: readText()...
✅ File Checksum Generated!
   File: /Users/sanchitbaviskar07@gmail.com /demo1/examples/sample.json
   SHA-256: 6b9a26f34cf995c1876a9c9df41bce6a9e3e8fd3e80928f136645bfcd8bef805
```

### Module 5: Live Package Diagnostic Output
```text
🔍 Running live diagnostic checks for node-core-easy-kit...
  [1/5] Testing getRuntimeInfo()...
        ✔ OK: Running Node v25.9.0 on darwin (arm64)
  [2/5] Testing resolvePath()...
        ✔ OK: Resolved path -> /Users/sanchitbaviskar07@gmail.com /demo1/data/diagnostic.txt
  [3/5] Testing writeText() with automatic parent directory creation...
        ✔ OK: Wrote file to -> /Users/sanchitbaviskar07@gmail.com /demo1/data/diagnostics/probe.txt
  [4/5] Testing readText()...
        ✔ OK: Content verified with byte-level fidelity.
  [5/5] Testing delay(300ms) non-blocking timer...
        ✔ OK: Resumed after 302ms delay.

🎉 ALL 5 PACKAGE EXPORTS ARE HEALTHY AND FULLY OPERATIONAL!
```

---

## 7. Project Structure

```text
node-core-easy-kit-demo/
│
├── src/
│   ├── index.js              # Application entry point & interactive CLI menu loop
│   ├── file-manager.js       # Module 1: File management powered by writeText, readText, resolvePath
│   ├── system-info.js        # Module 2: System telemetry combining getRuntimeInfo and os metrics
│   ├── security.js           # Module 3: SHA-256 hashing, file checksums & timing-safe equality
│   ├── json-manager.js       # Module 4: JSON creation, parsing, and configuration updates
│   ├── about.js              # Module 5: Package architecture summary & live self-tests
│   └── utils/
│       └── validators.js     # Shared validators (strings, paths, menu ranges, JSON) & formatters
│
├── examples/
│   └── sample.json           # Sample structured configuration used for testing & exploration
│
├── data/
│   └── .gitkeep              # Local directory placeholder for user-generated files
│
├── tests/
│   └── integration.test.js   # 28 integration tests using Node.js built-in test runner
│
├── .gitignore                # Git ignore rules for node_modules, temp files, and logs
├── package.json              # ES Modules configuration, scripts, and package dependency
├── package-lock.json         # Pinned dependency lockfile
└── README.md                 # Project documentation and usage guide
```

---

## 8. npm Package Integration Explanation

In `node-core-easy-kit-demo`, the published library `node-core-easy-kit` is integrated as an external dependency declared in `package.json`:

```json
"dependencies": {
  "node-core-easy-kit": "^1.0.1"
}
```

The application strictly respects the actual exported API surface of `node-core-easy-kit` (version 1.0.1):

| Package Export | Signature | Core Module Demonstrated | Role in Demo Application |
|---|---|---|---|
| `writeText` | `(filePath: string, content: string) => Promise<string>` | `node:fs/promises`, `node:path` | Writes text/JSON files; automatically creates any missing parent directories. |
| `readText` | `(filePath: string) => Promise<string>` | `node:fs/promises` | Reads UTF-8 text; provides clear `ENOENT` error enrichment for missing files. |
| `resolvePath` | `(...parts: string[]) => string` | `node:path` | Resolves cross-platform absolute paths for files and directories. |
| `getRuntimeInfo` | `() => { nodeVersion, platform, architecture, workingDirectory }` | `node:process` | Inspects runtime details without exposing `process.env` secrets. |
| `delay` | `(milliseconds: number) => Promise<void>` | `node:timers/promises` | Non-blocking timer delay with boundary and type validation. |

---

## 9. Examples of Package Functions Being Used

### 1. Writing Text and Creating Directories Automatically
```javascript
import { writeText } from "node-core-easy-kit";

// Automatically creates "data/reports/2026/" if missing
const savedPath = await writeText("data/reports/2026/summary.txt", "Report content");
console.log("Written to:", savedPath);
```

### 2. Reading Text with Enriched ENOENT Handling
```javascript
import { readText } from "node-core-easy-kit";

try {
  const content = await readText("data/config.txt");
  console.log("File content:", content);
} catch (error) {
  if (error.code === "ENOENT") {
    console.error("File does not exist:", error.message);
  }
}
```

### 3. Cross-Platform Path Resolution
```javascript
import { resolvePath } from "node-core-easy-kit";

// Resolves to an absolute OS-normalized path
const absPath = resolvePath("data", "nested", "config.json");
console.log("Absolute path:", absPath);
```

### 4. Safe Runtime Environment Inspection
```javascript
import { getRuntimeInfo } from "node-core-easy-kit";

const runtime = getRuntimeInfo();
console.log(`Node ${runtime.nodeVersion} on ${runtime.platform} (${runtime.architecture})`);
console.log(`Working directory: ${runtime.workingDirectory}`);
```

### 5. Asynchronous Non-blocking Delay
```javascript
import { delay } from "node-core-easy-kit";

console.log("Starting task...");
await delay(500); // 500ms pause using timers/promises
console.log("Task resumed!");
```

---

## 10. Testing Instructions

The project uses the Node.js native test runner (`node:test`) and strict assertion library (`node:assert/strict`).

Run the automated test suite with:

```bash
npm test
```

### Measured Test Results:
```text
✔ Node Core Easy Kit Demo - Comprehensive Integration Tests (320ms)
ℹ tests 28
ℹ suites 7
ℹ pass 28
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
```

### What is Tested:
1. **File Management:** Nested directory creation, UTF-8 file reading, path resolution, file stats, and directory listing.
2. **System Information:** Verification of `getRuntimeInfo()` fields and system report formatting.
3. **Security Utilities:** Exact SHA-256 test vectors, file checksum generation via `readText()`, and constant-time hash comparisons.
4. **JSON Manager:** JSON creation, parsing, nested property updates, and malformed JSON recovery.
5. **Package Self-Diagnostics:** Automated execution of all 5 exported functions (including `delay(300ms)`).
6. **Input Validation & Error Handling:** Non-string inputs, empty paths, out-of-bounds menu selections, and `ENOENT` handling.

---

## 11. Error Handling & Edge Cases

The demo application incorporates proactive defensive programming across all layers:

1. **Input Validation:** Every prompt validates user input using `src/utils/validators.js` before executing underlying I/O.
2. **Missing Files (`ENOENT`):** Custom `ENOENT` errors from `node-core-easy-kit`'s `readText()` are intercepted and displayed informatively rather than crashing.
3. **Invalid JSON:** If a user supplies invalid JSON syntax, `readJsonFile()` traps `SyntaxError` and returns both the diagnostic error message and raw content for debugging.
4. **Non-blocking Process Signals:** Pressing `Ctrl+C` or closing input triggers graceful shutdown via `readline`'s `"close"` event listener.
5. **Timing-Safe Crypto:** Hash comparison uses constant-time buffer comparisons with matching lengths to safeguard against side-channel analysis.

---

## 12. Future Improvements

- **Interactive File Picker:** Terminal-based cursor navigation for selecting files directly from `data/`.
- **JSON Schema Validation:** Integration of JSON schema verification for domain-specific configuration files.
- **Colorized Terminal Output:** Optional ANSI styling for status badges and warning indicators.
- **Batch File Operations:** Multi-file copy and backup workflows built on top of `readText` and `writeText`.

---

## 13. Original npm Package Links

- **NPM Package:** [`node-core-easy-kit`](https://www.npmjs.com/package/node-core-easy-kit)
- **GitHub Repository:** [`https://github.com/Sanchit07-dev/node-core-easy-kit`](https://github.com/Sanchit07-dev/node-core-easy-kit)
- **NPM Version:** `1.0.1`

---

## 14. Author & Academic Submission Details

- **Author:** Sanchit Baviskar
- **GitHub:** [`@Sanchit07-dev`](https://github.com/Sanchit07-dev)
- **Project Name:** `node-core-easy-kit-demo`
- **Assessment Scope:** Software Architecture & Node.js Application Development
- **Declaration:** This consumer application was created to demonstrate the production reusability, predictability, and interface design of the independently published npm package `node-core-easy-kit`.
