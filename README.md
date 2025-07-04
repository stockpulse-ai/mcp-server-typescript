# Stockpulse MCP Server ![NPM Version](https://img.shields.io/npm/v/%40stockpulse-ai%2Fmcp-server-typescript) ![ISC licensed](https://img.shields.io/npm/l/%40stockpulse-ai%2Fmcp-server-typescript)

This repository implements a Model Context Protocol (MCP) server for the Stockpulse API, allowing seamless integration and data exchange. It leverages the `@modelcontextprotocol/sdk/server/mcp.js` library for efficient MCP handling.

## Stockpulse.AI

**Stockpulse.AI** empowers users to analyze financial news and community sentiment using advanced artificial intelligence. 🚀

## Overview

This server acts as a bridge between a client implementing the MCP and the Stockpulse API. It facilitates the retrieval and processing of financial data, enabling context-aware interactions.

## Prerequisites

* [Node.js](https://nodejs.org/) (>= 18)
* [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
* [Stockpulse API](https://app.stockpulse.ai/pricing) access

## Installation

### For Claude Desktop Users

To get started, open the Claude menu on your computer and select “Settings…”.
Click on “Developer” in the left-hand bar of the Settings pane, and then click on “Edit Config”.

This will display the configuration file in your file system located at:

- Windows: `%APPDATA%\Claude\claude_desktop_config.json`
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`

Open the configuration file in a text editor. Replace the contents of the file with this:

Replace "STOCKPULSE_API_USER" and "STOCKPULSE_API_PASSWORD" with your username and password.

```json
{
  "mcpServers": {
    "stockpulse-mcp-server": {
      "command": "npx",
      "args": [
        "-y",
        "@stockpulse-ai/mcp-server"
      ],
      "env": {
        "STOCKPULSE_API_USER": "your-stockpulse-login",
        "STOCKPULSE_API_PASSWORD": "your-stockpulse-password"
      }
    }
  }
}
```

Make sure to replace `STOCKPULSE_API_USER` and `STOCKPULSE_API_PASSWORD` with your credentials.

This is what it should look like on Windows:

<img src="https://raw.githubusercontent.com/stockpulse-ai/mcp-server-typescript/refs/tags/1.0.0/docs/claude-desktop-1.gif" />

You will also need [Node.js](https://nodejs.org/) on your computer for this to run properly.
To check if Node is installed, open the command line on your computer.

On macOS, open the Terminal from your Applications folder
On Windows, press Windows + R, type “cmd”, and press Enter
Once in the command line, verify you have Node installed by entering in the following command:

```bash
node --version
```
If you get an error saying “command not found” or “node is not recognized”, go to [nodejs.org](https://nodejs.org/) and 
[download](https://nodejs.org/en/download) Node.

After updating your configuration file, you need to restart Claude for Desktop.
Make sure to exit Claude for Desktop completely.

When you restart, you should see a slider icon in the bottom left corner of the input box:

<img src="https://raw.githubusercontent.com/stockpulse-ai/mcp-server-typescript/refs/tags/v1.0.0/docs/claude-desktop-2.gif" />

## MCP Integration

This server utilizes the [`@modelcontextprotocol/sdk`](https://www.npmjs.com/package/@modelcontextprotocol/sdk)
library to implement the MCP. This allows for standardized communication with MCP-compatible clients.

## Stockpulse API Interaction

The server interacts with the [Stockpulse API](https://app.stockpulse.ai/pricing) to retrieve financial data.
Key functionalities include:

* Fetching news articles.
* Analyzing social media sentiment.
* Retrieving financial data for specific tickers.
