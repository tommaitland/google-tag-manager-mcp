import { OAuthProvider } from "@cloudflare/workers-oauth-provider";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { McpAgent } from "agents/mcp";
import type { McpAgentPropsModel } from "./models/McpAgentModel";
import { tools } from "./tools";
import { apisHandler, getPackageVersion } from "./utils";

export class GoogleTagManagerMCPServer extends McpAgent<
	Env,
	null,
	McpAgentPropsModel
> {
	server = new McpServer({
		name: "google-tag-manager-mcp-server",
		version: getPackageVersion(),
		protocolVersion: "1.0",
		vendor: "filamentanalytics",
		homepage: "https://gtm-mcp.filamentanalytics.com",
	});

	async init() {
		tools.forEach((register) => {
			register(this.server, { props: this.props, env: this.env });
		});
	}
}

export default new OAuthProvider({
	apiRoute: "/sse",
	// @ts-expect-error
	apiHandler: GoogleTagManagerMCPServer.mount("/sse"),
	// @ts-expect-error
	defaultHandler: apisHandler,
	authorizeEndpoint: "/authorize",
	tokenEndpoint: "/token",
	clientRegistrationEndpoint: "/register",
});
