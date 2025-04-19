#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { tool as exampleTool } from "./tools/example.js";
import { tool as searchLogsTool } from "./tools/search_logs.js";
import { Tool } from "./tool.js";
import { z } from "zod";

// Create an MCP server
const server = new McpServer({
  name: "datadog-mcp",
  version: "0.1.0",
});

const registerTool = <T extends z.ZodObject<any>>(tool: Tool<T>) => {
  server.tool(tool.name, tool.schema.shape, async (params: z.infer<T>) =>
    tool.handler(params)
  );
};

registerTool(exampleTool);
registerTool(searchLogsTool);

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
