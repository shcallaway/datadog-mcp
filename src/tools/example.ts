import { Tool } from "../tool.js";
import { schema, Params } from "../schemas/example.js";

class ExampleTool extends Tool<typeof schema> {
  constructor() {
    super("example_tool", "An example tool that processes a message", schema, {
      message: "",
    });
  }

  async handler(params: Params): Promise<any> {
    return {
      content: [
        { type: "text" as const, text: `Received message: ${params.message}` },
      ],
    };
  }
}

export const tool = new ExampleTool();
