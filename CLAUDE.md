# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Build & Development
- **Build TypeScript**: `npm run build` - Compiles TypeScript from src/ to dist/, sets execute permissions on dist/index.js
- **Development server**: `npm run dev` or `wrangler dev` - Runs Cloudflare Workers development server on port 8788
- **Deploy to Cloudflare**: `npm run deploy` or `wrangler deploy` - Deploys to production at gtm-mcp.filamentanalytics.com

### Code Quality
- **Lint**: `npm run lint` - Runs ESLint on all .ts files in src/
- **Fix linting issues**: `npm run lint:fix` - Auto-fixes ESLint issues where possible

### Type Generation
- **Generate Cloudflare types**: `npm run cf-typegen` - Updates worker-configuration.d.ts with latest Cloudflare Workers types

## Architecture

This is an MCP (Model Context Protocol) server for Google Tag Manager, deployed as a Cloudflare Worker with OAuth authentication. The architecture follows:

### Core Components

1. **MCP Server** (`src/index.ts`): Main entry point extending McpAgent, integrates with Cloudflare Workers OAuth Provider for authentication flow

2. **Tools System** (`src/tools/`): Each file exports tool actions for different GTM resources:
   - Account, container, workspace, version management
   - Tags, triggers, variables, templates
   - Clients, zones, transformations (for server containers)
   - Built-in variables, folders, user permissions
   - All tools are registered through `src/tools/index.ts`

3. **Schema Definitions** (`src/schemas/`): Zod schemas for validating GTM API entities and tool parameters

4. **Utilities** (`src/utils/`):
   - `getTagManagerClient.ts`: Creates authenticated Google Tag Manager API client
   - `paginationUtils.ts`: Handles paginated API responses
   - `apisHandler.ts`: Routes for main page, privacy, and terms
   - OAuth and authorization utilities for Cloudflare Workers

### Cloudflare Worker Configuration

- **Durable Objects**: Uses GoogleTagManagerMCPServer class for stateful MCP connections
- **KV Namespace**: OAUTH_KV for storing OAuth tokens
- **Custom Domain**: Deployed at gtm-mcp.filamentanalytics.com
- **Compatibility**: Node.js compatibility mode enabled

### Tool Pattern

Each tool module follows a consistent pattern:
1. Defines multiple tool handlers (list, get, create, update, delete operations)
2. Uses Zod schemas for input validation
3. Calls Google Tag Manager API v2 through authenticated client
4. Returns structured responses to MCP clients

The server supports remote MCP connections and can be integrated with Claude Desktop or other MCP-compatible clients using the mcp-remote package.
