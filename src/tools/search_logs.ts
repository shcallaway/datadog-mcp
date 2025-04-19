import { Tool } from "../tool.js";
import { client, v2 } from "@datadog/datadog-api-client";
import { schema } from "../schemas/search_logs.js";
import { z } from "zod";

class SearchLogsTool extends Tool<typeof schema> {
  private client: v2.LogsApi;

  constructor() {
    super(
      "search_logs",
      "Search logs in Datadog using various filters and parameters",
      schema
    );

    // Initialize the Datadog API client
    const configuration = client.createConfiguration({
      authMethods: {
        apiKeyAuth: process.env.DD_API_KEY,
        appKeyAuth: process.env.DD_APP_KEY,
      },
    });

    // Set the Datadog host if it's provided
    if (process.env.DD_HOST) {
      configuration.setServerVariables({
        site: process.env.DD_HOST,
      });
    }

    this.client = new v2.LogsApi(configuration);
  }

  private buildQuery(params: z.infer<typeof schema>): string {
    let query = params.query;

    // Add filters to the query if provided
    if (params.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value) {
          query += ` AND ${key}:${value}`;
        }
      });
    }

    return query;
  }

  handler = async (params: z.infer<typeof schema>): Promise<any> => {
    try {
      const response = await this.client.listLogsGet({
        filterQuery: this.buildQuery(params),
        filterFrom: params.start_time ? new Date(params.start_time) : undefined,
        filterTo: params.end_time ? new Date(params.end_time) : undefined,
        sort: (params.sort_by as v2.LogsSort) ?? undefined,
        pageLimit: params.page_size ?? undefined,
        pageCursor: params.page_cursor ?? undefined,
      });

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response, null, 2),
          },
        ],
      };
    } catch (error: unknown) {
      return {
        content: [
          {
            type: "text",
            text: `Error searching logs: ${
              error instanceof Error ? error.message : String(error)
            }`,
          },
        ],
      };
    }
  };
}

export const tool = new SearchLogsTool();
