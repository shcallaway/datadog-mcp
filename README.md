# Generic MCP Server

A generic Model Context Protocol (MCP) server scaffold that can be extended with custom tools and functionality.

## Installation

1. Clone this repository:

```bash
git clone <your-repo-url>
cd <repo-directory>
```

2. Install dependencies:

```bash
pnpm install
```

3. Build the project:

```bash
pnpm run build
```

## Setting up with Claude Desktop

To use this MCP server with Claude Desktop, you need to add it to Claude's configuration file. Edit `~/Library/Application Support/Claude/claude_desktop_config.json`:

1. Open the configuration file:

```bash
open ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

2. Add the following configuration to the `mcpServers` object:

```json
{
  "mcpServers": {
    "datadog-mcp": {
      "command": "node",
      "args": ["/absolute/path/to/your/dist/index.js"],
      "env": {
        "DD_API_KEY": "your_api_key",
        "DD_APP_KEY": "your_app_key",
        "DD_HOST": "https://api.datadoghq.eu",
        "NODE_ENV": "production"
      },
      "disabled": false,
      "alwaysAllow": true
    }
  }
}
```

Make sure to:

1. Replace `/absolute/path/to/your` with the actual absolute path to your project's `dist` directory
2. Set your Datadog API key in `DD_API_KEY`
3. Set your Datadog application key in `DD_APP_KEY`
4. Adjust the `DD_HOST` if you're using a different Datadog region

Note: Keep your API keys secure and never commit them to version control.

## Development

### Project Structure

- `index.ts`: Main server file containing the MCP server implementation
- `tsconfig.json`: TypeScript configuration
- `package.json`: Project dependencies and scripts

### Adding New Tools

1. Define your tool's schema using Zod:

```typescript
const MyToolSchema = z.object({
  // your tool's parameters
});
```

2. Add your tool to the `ListToolsRequestSchema` handler:

```typescript
{
  name: "my_tool",
  description: "Description of what your tool does",
  inputSchema: zodToJsonSchema(MyToolSchema) as ToolInput,
}
```

3. Implement your tool in the `CallToolRequestSchema` handler:

```typescript
case "my_tool": {
  const parsed = MyToolSchema.safeParse(args);
  if (!parsed.success) {
    throw new Error(`Invalid arguments for my_tool: ${parsed.error}`);
  }
  // Your tool's implementation
  return {
    content: [{ type: "text", text: "Your tool's response" }],
  };
}
```

## Scripts

- `pnpm run build`: Build the TypeScript project
- `pnpm run prepare`: Run build before publishing
- `pnpm run watch`: Watch for changes and rebuild

## Dependencies

- `@modelcontextprotocol/sdk`: MCP server SDK
- `zod`: Schema validation
- `zod-to-json-schema`: Convert Zod schemas to JSON Schema
- TypeScript and related development tools

## License

MIT
