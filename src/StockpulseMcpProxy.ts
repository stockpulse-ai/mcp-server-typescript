import * as fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import util from "node:util";

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    CallToolRequestSchema,
    CompleteRequestSchema,
    GetPromptRequestSchema,
    ListPromptsRequestSchema,
    ListResourcesRequestSchema,
    ListResourceTemplatesRequestSchema,
    ListToolsRequestSchema,
    LoggingMessageNotificationSchema,
    ReadResourceRequestSchema,
    ResourceUpdatedNotificationSchema,
    ServerCapabilities,
    SubscribeRequestSchema,
    UnsubscribeRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

export interface StockpulseApiMcpServerConfig {
    mcpServerUri: URL;
    headers: Record<string, string>;
    timeout?: number;
    maxContentLength?: number;
}

export enum LogLevel {
    FATAL = 100,
    ERROR = 200,
    WARN = 300,
    INFO = 400,
    DEBUG = 500,
    TRACE = 600,
}


export class StockpulseMcpProxy {
    private config: StockpulseApiMcpServerConfig;

    constructor(config: StockpulseApiMcpServerConfig) {
        this.config = config;
    }

    getAppVersion(): string|undefined {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);

        const packagePath = path.resolve(__dirname, "../package.json");

        if (!fs.existsSync(packagePath)) {
            return undefined;
        }

        const packageFile = fs.readFileSync(packagePath, "utf8");

        return JSON.parse(packageFile).version;
    }

    async start(): Promise<void> {
        this.log(LogLevel.INFO, `Starting Stockpulse MCP Server (v${this.getAppVersion()})`);

        const sseClient = new Client(
            {
                name: "Stockpulse MCP Server (stdio, typescript)",
                version: this.getAppVersion() ?? "1.0.0",
            },
            {
                capabilities: {},
            },
        );

        const sseAuthorization = this.config.headers.Authorization;

        const sseTransport = new SSEClientTransport(
            this.config.mcpServerUri,
            {
                requestInit: {
                    headers: { Authorization: sseAuthorization }
                },
                eventSourceInit: {
                    async fetch(input: Request | URL | string, init?: RequestInit) {
                        const headers = new Headers(init?.headers || {});
                        headers.set('Authorization', sseAuthorization);
                        return fetch(input, { ...init, headers });
                    },
                },
            }
        );

        await sseClient.connect(sseTransport);

        const serverVersion = sseClient.getServerVersion() as {
            name: string;
            version: string;
        };

        const serverCapabilities = sseClient.getServerCapabilities() as ServerCapabilities;

        const serverInstructions = sseClient.getInstructions();

        const stdioServer = new Server(
            {
                name: serverVersion.name,
                version: serverVersion.version,
            },
            {
                capabilities: serverCapabilities,
                instructions: serverInstructions,
            }
        );

        await stdioServer.connect(new StdioServerTransport());

        if (serverCapabilities?.logging) {
            stdioServer.setNotificationHandler(
                LoggingMessageNotificationSchema,
                async (args) => {
                    return sseClient.notification(args);
                },
            );
            sseClient.setNotificationHandler(
                LoggingMessageNotificationSchema,
                async (args) => {
                    return stdioServer.notification(args);
                },
            );
        }

        if (serverCapabilities?.prompts) {
            stdioServer.setRequestHandler(GetPromptRequestSchema, async (args) => {
                return sseClient.getPrompt(args.params);
            });

            stdioServer.setRequestHandler(ListPromptsRequestSchema, async (args) => {
                return sseClient.listPrompts(args.params);
            });
        }

        if (serverCapabilities?.resources) {
            stdioServer.setRequestHandler(ListResourcesRequestSchema, async (args) => {
                return sseClient.listResources(args.params);
            });

            stdioServer.setRequestHandler(
                ListResourceTemplatesRequestSchema,
                async (args) => {
                    return sseClient.listResourceTemplates(args.params);
                },
            );

            stdioServer.setRequestHandler(ReadResourceRequestSchema, async (args) => {
                return sseClient.readResource(args.params);
            });

            if (serverCapabilities?.resources.subscribe) {
                stdioServer.setNotificationHandler(
                    ResourceUpdatedNotificationSchema,
                    async (args) => {
                        return sseClient.notification(args);
                    },
                );

                stdioServer.setRequestHandler(SubscribeRequestSchema, async (args) => {
                    return sseClient.subscribeResource(args.params);
                });

                stdioServer.setRequestHandler(UnsubscribeRequestSchema, async (args) => {
                    return sseClient.unsubscribeResource(args.params);
                });
            }
        }

        if (serverCapabilities?.tools) {
            stdioServer.setRequestHandler(CallToolRequestSchema, async (args) => {
                return sseClient.callTool(args.params);
            });

            stdioServer.setRequestHandler(ListToolsRequestSchema, async (args) => {
                return sseClient.listTools(args.params);
            });
        }

        stdioServer.setRequestHandler(CompleteRequestSchema, async (args) => {
            return sseClient.complete(args.params);
        });

        this.log(LogLevel.INFO, "Stockpulse MCP Server running on stdio");
    }

    private log(level: LogLevel, ...args: unknown[]): void {
        const logChannel = "app"

        // Example: 2024-09-27T10:00:56.862Z
        const time = new Date().toISOString()

        const message = util.format.apply(this, args)

        // Example: [2024-09-27T10:00:56.862Z] app.INFO: Starting Stockpulse MCP Server
        const logLine = `[${time}] ${logChannel}.${LogLevel[level]}: ${message}`

        // STDOUT is used for transport, log to STDERR
        console.error(logLine);
    }
}
