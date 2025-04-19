import { Tool, ToolSchema } from "../tool.js";

interface ExampleToolParams {
  message: string;
}

class ExampleTool extends Tool<ExampleToolParams> {
  constructor() {
    const schema: ToolSchema = {
      type: "object",
      properties: {
        message: {
          type: "string",
          description: "The message to be processed",
          required: true,
        },
      },
      required: ["message"],
    };

    super("example_tool", "An example tool that processes a message", schema, {
      message: "",
    });
  }

  async handler(params: ExampleToolParams): Promise<any> {
    return {
      content: [
        { type: "text" as const, text: `Received message: ${params.message}` },
      ],
    };
  }
}

export const exampleTool = new ExampleTool();
