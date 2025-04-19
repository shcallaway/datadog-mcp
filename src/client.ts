import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const main = async () => {
  const transport = new StdioClientTransport({
    command: "node",
    args: ["server.js"],
  });

  const client = new Client({
    name: "client",
    version: "0.1.0",
  });

  await client.connect(transport);

  // // List prompts
  // const prompts = await client.listPrompts();

  // // Get a prompt
  // const prompt = await client.getPrompt({
  //   name: "search_logs",
  //   arguments: {
  //     query: "status:error",
  //   },
  // });

  // // List resources
  // const resources = await client.listResources();

  // // Read a resource
  // const resource = await client.readResource({
  //   uri: "file:///example.txt",
  // });

  // Call a tool
  const result = await client.callTool({
    name: "search_logs",
    arguments: {
      query: "status:error",
    },
  });

  console.log(result);
};

main();
