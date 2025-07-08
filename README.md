# Stockpulse MCP Server ![NPM Version](https://img.shields.io/npm/v/%40stockpulse-ai%2Fmcp-server) ![ISC licensed](https://img.shields.io/npm/l/%40stockpulse-ai%2Fmcp-server)

Easily connect real-time financial sentiment from Stockpulse.AI to your apps, bots, and AI tools using the Model Context Protocol (MCP). This server delivers fast, context-aware access to Stockpulse’s powerful data — no scraping or complex setup needed.

## Stockpulse.AI

Stockpulse.AI uses AI to analyze global financial chatter and news from platforms like X, Reddit, YouTube, and more — turning noise into actionable insight. 🚀

## Why should I use this?

**🚀 Plug & play social sentiment** - Get instant access to real-time social media buzz from X, Reddit, TikTok & more — no scraping, no hassle. Ideal for chatbots, trading tools & AI apps. [Learn more »](https://stockpulse.ai/products/)

**🧠 AI-ready & LLM-friendly** - Easily connect Stockpulse’s insights to your assistants or LLMs — perfect for building smarter, context-aware tools. [Use cases »](https://stockpulse.ai/use-cases/)

**📊 Detect hype, avoid traps** - Identify suspicious spikes, pump & dump activity, or insider patterns early — essential for surveillance & compliance teams. [See how »](https://stockpulse.ai/use-cases/surveillance/)

**📈 Over 10 years of data** - Use our rich historical sentiment data for backtesting, analytics, and predictive modeling. [Data insights »](https://stockpulse.ai/products/)

**⚙️ Enterprise-grade, dev-friendly** - Scalable, fast, and secure — trusted by major players like Deutsche Börse, Moody’s, and Refinitiv. Built for performance and reliability. [About us »](https://stockpulse.ai/company/#about-us)

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

<img src="https://raw.githubusercontent.com/stockpulse-ai/mcp-server-typescript/refs/tags/v1.0.0/docs/claude-desktop-1.gif" />

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
