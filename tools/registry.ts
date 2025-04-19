import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { ToolSchema } from "@modelcontextprotocol/sdk/types.js";
import { ExampleSchema, handleExampleTool } from "./example.js";

// Type for tool input schema
const ToolInputSchema = ToolSchema.shape.inputSchema;
type ToolInput = z.infer<typeof ToolInputSchema>;

// Define the structure of a tool registration
export interface ToolDefinition {
  name: string;
  description: string;
  schema: z.ZodType;
  handler: (args: unknown) => Promise<any>;
}

// Registry of all available tools
export const toolRegistry: ToolDefinition[] = [
  {
    name: "example_tool",
    description: "An example tool - replace with your own tools",
    schema: ExampleSchema,
    handler: handleExampleTool,
  },
];

// Helper function to get tool definitions in MCP format
export function getMCPToolDefinitions() {
  return toolRegistry.map((tool) => ({
    name: tool.name,
    description: tool.description,
    inputSchema: zodToJsonSchema(tool.schema) as ToolInput,
  }));
}

// Helper function to get a tool handler by name
export function getToolHandler(name: string) {
  const tool = toolRegistry.find((t) => t.name === name);
  if (!tool) {
    throw new Error(`Unknown tool: ${name}`);
  }
  return tool.handler;
}
