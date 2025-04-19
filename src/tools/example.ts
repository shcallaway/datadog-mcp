import { Tool } from "../tool.js";
import { schema } from "../schemas/example.js";
import { z } from "zod";
class ExampleTool extends Tool<typeof schema> {
  constructor() {
    super("example_tool", "An example tool that processes a message", schema);
  }

  handler = async (params: z.infer<typeof schema>): Promise<any> => {
    return {
      content: [
        { type: "text" as const, text: `Received message: ${params.message}` },
      ],
    };
  };
}

export const tool = new ExampleTool();
