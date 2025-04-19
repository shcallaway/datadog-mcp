#!/bin/sh

# Path to Claude logs
CLAUDE_DESKTOP_DIR="$HOME/Library/Logs/Claude"

# Prompt for MCP server name
printf "Enter MCP server name (default: datadog-mcp): "
read SERVER_NAME
SERVER_NAME=${SERVER_NAME:-datadog-mcp}

echo "Tailing log file for MCP server: $SERVER_NAME..."

sleep 1

# Function to run on script exit
goodbye() {
    echo "Exiting!"
    exit 0
}

# Set up trap to catch script termination
trap goodbye INT TERM

# Tail the MCP server log file
tail -n 20 -F "$CLAUDE_DESKTOP_DIR/mcp-server-$SERVER_NAME.log"
