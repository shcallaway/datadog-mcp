import { z } from "zod";
import { ToolCallback } from "@modelcontextprotocol/sdk/server/mcp";

abstract class Tool<T extends z.ZodObject<any>> {
  name: string;
  description: string;
  schema: T;

  constructor(name: string, description: string, schema: T) {
    this.name = name;
    this.description = description;
    this.schema = schema;
  }

  abstract handler: ToolCallback<T["shape"]>;
}

export { Tool };
