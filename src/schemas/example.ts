import { z } from "zod";

// Define the example schema for the example tool
export const schema = z.object({
  message: z.string().describe("The message to be processed"),
});
