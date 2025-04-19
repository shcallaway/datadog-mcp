#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { exampleTool } from "./tools/example.js";

// Create an MCP server
const server = new McpServer({
  name: "datadog-mcp",
  version: "0.1.0",
});

// Register the example tool using our new Tool class
server.tool(
  exampleTool.name,
  { message: z.string() },
  async (params: { message: string }) => exampleTool.handler(params)
);

// Start server
async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Generic MCP Server running on stdio");
}

runServer().catch((error) => {
  console.error("Fatal error running server:", error);
  process.exit(1);
});
