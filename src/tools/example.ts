import { z } from "zod";

// Example schema
export const ExampleSchema = z.object({
  message: z.string(),
});

// Example tool handler
export async function handleExampleTool(args: unknown) {
  const parsed = ExampleSchema.safeParse(args);
  if (!parsed.success) {
    throw new Error(`Invalid arguments for example_tool: ${parsed.error}`);
  }
  return {
    content: [
      { type: "text", text: `Received message: ${parsed.data.message}` },
    ],
  };
}
