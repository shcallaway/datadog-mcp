#!/bin/sh

# Path to Claude config
CLAUDE_DESKTOP_CONFIG="$HOME/Library/Application Support/Claude/claude_desktop_config.json"
PARTIAL_CONFIG="claude.json"

echo "Installing MCP server for Claude Desktop..."

# Check if config file exists
if [ ! -f "$CLAUDE_DESKTOP_CONFIG" ]; then
    echo "Claude Desktop config file not found at: $CLAUDE_DESKTOP_CONFIG"
    exit 1
fi

# Check if claude.json exists
if [ ! -f "$PARTIAL_CONFIG" ]; then
    echo "Partial config file not found at: $PARTIAL_CONFIG"
    exit 1
fi

# Prompt for MCP server name
printf "Enter MCP server name (default: datadog-mcp): "
read SERVER_NAME
SERVER_NAME=${SERVER_NAME:-datadog-mcp}

echo "Using server name: $SERVER_NAME"

# Create temp file in same directory as config
TMP_FILE="$(dirname "$CLAUDE_DESKTOP_CONFIG")/tmp.json"

# Update config
jq --arg name "$SERVER_NAME" '.mcpServers[$name] = input' "$CLAUDE_DESKTOP_CONFIG" "$PARTIAL_CONFIG" >"$TMP_FILE"

# Check if jq command succeeded
if [ $? -ne 0 ]; then
    echo "Failed to update Claude config file"
    rm -f "$TMP_FILE"
    exit 1
fi

# Move temp file to config location
mv "$TMP_FILE" "$CLAUDE_DESKTOP_CONFIG"

echo "Successfully installed MCP server for Claude Desktop"
