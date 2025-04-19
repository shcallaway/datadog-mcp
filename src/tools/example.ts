import { z } from "zod";

// Example tool schema
export const exampleToolSchema = z.object({
  message: z.string(),
});

// Example tool parameters for registration
export const exampleToolParams = {
  message: z.string(),
} as const;

// Example tool handler
export async function handler(
  args: z.infer<typeof exampleToolSchema>,
  extra: any
) {
  return {
    content: [
      { type: "text" as const, text: `Received message: ${args.message}` },
    ],
  };
}
