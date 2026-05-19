"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
console.log("⚡ Starting MatrixBlocks Backend API verification test...");
// Spawn Express server process
const serverProcess = (0, child_process_1.spawn)("npx", ["ts-node", path_1.default.join(__dirname, "server.ts")], {
    shell: true,
    stdio: "pipe"
});
let serverReady = false;
serverProcess.stdout.on("data", async (data) => {
    const output = data.toString();
    // Forward server console output with simple prefix
    console.log(`[Server Stdout]: ${output.trim()}`);
    if (output.includes("running on port 5000") && !serverReady) {
        serverReady = true;
        console.log("\n📡 Server is fully booted! Performing fetch to http://localhost:5000/api/models...\n");
        try {
            const response = await fetch("http://localhost:5000/api/models");
            const result = await response.json();
            console.log("====================================================================");
            console.log("✅ VERIFICATION SUCCESS: MatrixBlocks Backend API is fully functional!");
            console.log(`Status Code: ${response.status} ${response.statusText}`);
            console.log(`Available Models Count: ${result.count}`);
            console.log("Models Retrieved:");
            result.models.forEach((m) => {
                console.log(`  - [ID ${m.id}] ${m.name} (${m.category}) - Price: ${m.priceEth} ETH`);
            });
            console.log("====================================================================");
            // Safely kill the server and exit with success code
            serverProcess.kill();
            process.exit(0);
        }
        catch (err) {
            console.error("❌ verification Failed: Error fetching from Express server:", err.message);
            serverProcess.kill();
            process.exit(1);
        }
    }
});
serverProcess.stderr.on("data", (data) => {
    console.error(`[Server Stderr]: ${data.toString().trim()}`);
});
// Safeguard timeout (15s) in case compilation or server boot fails
setTimeout(() => {
    if (!serverReady) {
        console.error("❌ Verification Failed: Server boot timeout (15 seconds reached).");
        serverProcess.kill();
        process.exit(1);
    }
}, 15000);
