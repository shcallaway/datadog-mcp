import { z } from "zod";
import { Tool } from "../tool.js";
import { Octokit } from "@octokit/rest";
import type { RestEndpointMethodTypes } from "@octokit/rest";

const schema = z.object({
  owner: z.string().default("shcallaway"),
  repo: z.string().default("agi-house-hackathon-sample-server"),
  per_page: z.number().optional().default(30),
  page: z.number().optional().default(1),
});

type Commit =
  RestEndpointMethodTypes["repos"]["listCommits"]["response"]["data"][0];

class GetCommitsTool extends Tool<typeof schema> {
  private octokit: Octokit;

  constructor() {
    super(
      "get_commits",
      "Fetches the most recent commits from a GitHub repository",
      schema
    );
    this.octokit = new Octokit();
  }

  handler = async (params: z.infer<typeof schema>) => {
    try {
      const response = await this.octokit.repos.listCommits({
        owner: params.owner,
        repo: params.repo,
        per_page: params.per_page,
        page: params.page,
      });

      const commits = response.data.map((commit: Commit) => ({
        sha: commit.sha,
        message: commit.commit.message,
        author: commit.commit.author?.name || "Unknown",
        date: commit.commit.author?.date,
        url: commit.html_url,
      }));

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(commits, null, 2),
          },
        ],
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch commits: ${error.message}`);
      }
      throw new Error("Failed to fetch commits: Unknown error");
    }
  };
}

export const tool = new GetCommitsTool();
