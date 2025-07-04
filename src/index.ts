#!/usr/bin/env node

import * as fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import dotenv from "dotenv";

import { StockpulseMcpProxy } from "./StockpulseMcpProxy.js";

// The .env file is loaded if it exists
// Real environment variables win over .env file.
const realEnvironmentVariables = { ...process.env }

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (fs.existsSync(path.resolve(__dirname, "../.env"))) {
    const parsed = dotenv.parse(fs.readFileSync(path.resolve(__dirname, "../.env"), { encoding: "utf8" }))

    Object.keys(parsed).forEach(function (key) {
        process.env[key] = realEnvironmentVariables[key] ?? parsed[key]
    })
}

async function main() {
    // skip ['node', 'index.js']
    const args = process.argv.slice(2);

    let username = process.env.STOCKPULSE_API_USER;
    let password = process.env.STOCKPULSE_API_PASSWORD;

    args.forEach(arg => {
        const [key, value] = arg.split('=');

        if (key === '--username') {
            username = value;
        }
        if (key === '--password') {
            password = value;
        }
    });

    const config = {
        mcpServerUri: new URL("https://mcp.stockpulse.ai/mcp/sse"),
        headers: {} as Record<string, string>,
    };

    if (username && password) {
        const credentials = `${username}:${password}`;

        config.headers.Authorization = "Basic " + Buffer.from(credentials).toString('base64');
    }

    const server = new StockpulseMcpProxy(config);
    await server.start();
}

main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});
