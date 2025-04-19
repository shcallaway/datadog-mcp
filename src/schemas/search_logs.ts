import { z } from "zod";

export const schema = z.object({
  query: z
    .string()
    .describe(
      "The search query for logs (e.g., 'status:error AND env:production')"
    ),
  start_time: z
    .string()
    .optional()
    .describe("Start time for the log query in ISO8601 format"),
  end_time: z
    .string()
    .optional()
    .describe("End time for the log query in ISO8601 format"),
  sort_by: z
    .enum(["timestamp", "-timestamp"])
    .optional()
    .describe(
      "Sort order for logs (timestamp for ascending, -timestamp for descending)"
    ),
  page_size: z
    .number()
    .min(1)
    .max(1000)
    .optional()
    .describe("Number of logs per page (max: 1000)"),
  page_cursor: z.string().optional().describe("Cursor for pagination"),
  filters: z
    .record(z.string(), z.string().optional())
    .optional()
    .describe("Additional filters for the log search"),
});
