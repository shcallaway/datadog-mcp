import { Tool } from "../tool.js";
import { client, v2 } from "@datadog/datadog-api-client";
import NodeCache from "node-cache";
import { schema } from "../schemas/search_logs.js";
import { z } from "zod";

// Cache configuration (10 minutes TTL)
const cache = new NodeCache({ stdTTL: 600 });

class SearchLogsTool extends Tool<typeof schema> {
  private apiInstance: v2.LogsApi;

  constructor() {
    super(
      "search_logs",
      "Search logs in Datadog using various filters and parameters",
      schema,
      { query: "" }
    );

    // Initialize the Datadog API client
    const configuration = client.createConfiguration();
    this.apiInstance = new v2.LogsApi(configuration);
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

  private getCacheKey(params: z.infer<typeof schema>): string {
    return JSON.stringify({
      query: params.query,
      start_time: params.start_time,
      end_time: params.end_time,
      sort_by: params.sort_by,
      page_size: params.page_size,
      page_cursor: params.page_cursor,
      filters: params.filters,
    });
  }

  async handler(params: z.infer<typeof schema>): Promise<any> {
    try {
      const cacheKey = this.getCacheKey(params);
      const cachedResult = cache.get(cacheKey);

      if (cachedResult) {
        return {
          content: [
            { type: "text" as const, text: "Retrieved from cache:" },
            { type: "json" as const, json: cachedResult },
          ],
        };
      }

      const response = await this.apiInstance.listLogsGet({
        filterQuery: this.buildQuery(params),
        filterFrom: params.start_time ? new Date(params.start_time) : undefined,
        filterTo: params.end_time ? new Date(params.end_time) : undefined,
        sort: params.sort_by as v2.LogsSort,
        pageLimit: params.page_size,
        pageCursor: params.page_cursor,
      });

      // Cache the result
      cache.set(cacheKey, response);

      return {
        content: [
          { type: "text" as const, text: "Log search results:" },
          { type: "json" as const, json: response },
        ],
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Datadog API Error: ${error.message}`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text" as const,
            text: `Error searching logs: ${String(error)}`,
          },
        ],
      };
    }
  }
}

export const tool = new SearchLogsTool();
