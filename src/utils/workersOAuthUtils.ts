// workers-oauth-utils.ts

import type {
  ClientInfo,
  AuthRequest,
} from "@cloudflare/workers-oauth-provider"; // Adjust path if necessary

const COOKIE_NAME = "mcp-approved-clients";
const ONE_YEAR_IN_SECONDS = 31536000;

/**
 * Decodes a URL-safe base64 string back to its original data.
 * @param encoded - The URL-safe base64 encoded string.
 * @returns The original data.
 */
function decodeState<T = any>(encoded: string): T {
  try {
    const jsonString = atob(encoded);
    return JSON.parse(jsonString);
  } catch (e) {
    console.error("Error decoding state:", e);
    throw new Error("Could not decode state");
  }
}

/**
 * Imports a secret key string for HMAC-SHA256 signing.
 * @param secret - The raw secret key string.
 * @returns A promise resolving to the CryptoKey object.
 */
async function importKey(secret: string): Promise<CryptoKey> {
  if (!secret) {
    throw new Error(
      "COOKIE_SECRET is not defined. A secret key is required for signing cookies.",
    );
  }
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false, // not extractable
    ["sign", "verify"], // key usages
  );
}

/**
 * Signs data using HMAC-SHA256.
 * @param key - The CryptoKey for signing.
 * @param data - The string data to sign.
 * @returns A promise resolving to the signature as a hex string.
 */
async function signData(key: CryptoKey, data: string): Promise<string> {
  const enc = new TextEncoder();
  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    enc.encode(data),
  );
  // Convert ArrayBuffer to hex string
  return Array.from(new Uint8Array(signatureBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Verifies an HMAC-SHA256 signature.
 * @param key - The CryptoKey for verification.
 * @param signatureHex - The signature to verify (hex string).
 * @param data - The original data that was signed.
 * @returns A promise resolving to true if the signature is valid, false otherwise.
 */
async function verifySignature(
  key: CryptoKey,
  signatureHex: string,
  data: string,
): Promise<boolean> {
  const enc = new TextEncoder();
  try {
    // Convert hex signature back to ArrayBuffer
    const signatureBytes = new Uint8Array(
      signatureHex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)),
    );
    return await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes.buffer,
      enc.encode(data),
    );
  } catch (e) {
    // Handle errors during hex parsing or verification
    console.error("Error verifying signature:", e);
    return false;
  }
}

/**
 * Parses the signed cookie and verifies its integrity.
 * @param cookieHeader - The value of the Cookie header from the request.
 * @param secret - The secret key used for signing.
 * @returns A promise resolving to the list of approved client IDs if the cookie is valid, otherwise null.
 */
async function getApprovedClientsFromCookie(
  cookieHeader: string | null,
  secret: string,
): Promise<string[] | null> {
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(";").map((c) => c.trim());
  const targetCookie = cookies.find((c) => c.startsWith(`${COOKIE_NAME}=`));

  if (!targetCookie) return null;

  const cookieValue = targetCookie.substring(COOKIE_NAME.length + 1);
  const parts = cookieValue.split(".");

  if (parts.length !== 2) {
    console.warn("Invalid cookie format received.");
    return null; // Invalid format
  }

  const [signatureHex, base64Payload] = parts;
  const payload = atob(base64Payload); // Assuming payload is base64 encoded JSON string

  const key = await importKey(secret);
  const isValid = await verifySignature(key, signatureHex, payload);

  if (!isValid) {
    console.warn("Cookie signature verification failed.");
    return null; // Signature invalid
  }

  try {
    const approvedClients = JSON.parse(payload);
    if (!Array.isArray(approvedClients)) {
      console.warn("Cookie payload is not an array.");
      return null; // Payload isn't an array
    }
    // Ensure all elements are strings
    if (!approvedClients.every((item) => typeof item === "string")) {
      console.warn("Cookie payload contains non-string elements.");
      return null;
    }
    return approvedClients as string[];
  } catch (e) {
    console.error("Error parsing cookie payload:", e);
    return null; // JSON parsing failed
  }
}

// --- Exported Functions ---

/**
 * Checks if a given client ID has already been approved by the user,
 * based on a signed cookie.
 *
 * @param request - The incoming Request object to read cookies from.
 * @param clientId - The OAuth client ID to check approval for.
 * @param cookieSecret - The secret key used to sign/verify the approval cookie.
 * @returns A promise resolving to true if the client ID is in the list of approved clients in a valid cookie, false otherwise.
 */
export async function clientIdAlreadyApproved(
  request: Request,
  clientId: string,
  cookieSecret: string,
): Promise<boolean> {
  if (!clientId) return false;
  const cookieHeader = request.headers.get("Cookie");
  const approvedClients = await getApprovedClientsFromCookie(
    cookieHeader,
    cookieSecret,
  );

  return approvedClients?.includes(clientId) ?? false;
}

/**
 * Configuration for the approval dialog
 */
export interface ApprovalDialogOptions {
  /**
   * Client information to display in the approval dialog
   */
  client: ClientInfo | null;
  /**
   * Server information to display in the approval dialog
   */
  server: {
    name: string;
    logo?: string;
    description?: string;
  };
  /**
   * Arbitrary state data to pass through the approval flow
   * Will be encoded in the form and returned when approval is complete
   */
  state: Record<string, any>;
  /**
   * Name of the cookie to use for storing approvals
   * @default "mcp_approved_clients"
   */
  cookieName?: string;
  /**
   * Secret used to sign cookies for verification
   * Can be a string or Uint8Array
   * @default Built-in Uint8Array key
   */
  cookieSecret?: string | Uint8Array;
  /**
   * Cookie domain
   * @default current domain
   */
  cookieDomain?: string;
  /**
   * Cookie path
   * @default "/"
   */
  cookiePath?: string;
  /**
   * Cookie max age in seconds
   * @default 30 days
   */
  cookieMaxAge?: number;
}

/**
 * Renders an approval dialog for OAuth authorization
 * The dialog displays information about the client and server
 * and includes a form to submit approval
 *
 * @param request - The HTTP request
 * @param options - Configuration for the approval dialog
 * @returns A Response containing the HTML approval dialog
 */
export function renderApprovalDialog(
  request: Request,
  options: ApprovalDialogOptions,
): Response {
  const { client, server, state } = options;

  // Encode state for form submission
  const encodedState = btoa(JSON.stringify(state));

  // Sanitize any untrusted content
  const serverName = sanitizeHtml(server.name);
  const clientName = client?.clientName
    ? sanitizeHtml(client.clientName)
    : "Unknown MCP Client";
  const serverDescription = server.description
    ? sanitizeHtml(server.description)
    : "";

  // Safe URLs
  const logoUrl = server.logo ? sanitizeHtml(server.logo) : "";
  const clientUri = client?.clientUri ? sanitizeHtml(client.clientUri) : "";
  const policyUri = client?.policyUri ? sanitizeHtml(client.policyUri) : "";
  const tosUri = client?.tosUri ? sanitizeHtml(client.tosUri) : "";

  // Client contacts
  const contacts =
    client?.contacts && client.contacts.length > 0
      ? sanitizeHtml(client.contacts.join(", "))
      : "";

  // Get redirect URIs
  const redirectUris =
    client?.redirectUris && client.redirectUris.length > 0
      ? client.redirectUris.map((uri) => sanitizeHtml(uri))
      : [];

  // Generate HTML for the approval dialog
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="description" content="Authorization request for ${clientName} to access Google Tag Manager MCP server hosted by Filament Analytics.">
        <title>${clientName} | Authorization Request | Filament Analytics</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Geist+Mono:wght@100..900&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Serif:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap');

          :root {
            /* Filament Color System */
            --burgundy-9: #64203e;
            --burgundy-12: #321222;
            --beige-1: #fdfdfc;
            --beige-2: #f9f9f8;
            --beige-3: #f1f0ef;
            --beige-4: #e9e8e6;
            --beige-5: #e2e0dd;
            --beige-6: #dad7d3;
            --beige-7: #cfcbc7;
            --beige-8: #b9b5b0;
            --beige-9: #8d8681;
            --beige-10: #82807b;
            --beige-11: #63635e;
            --beige-12: #21201c;
            --website-bg: #f8f7f5;
            --website-text: #261b07;
            --website-text-light: #625a4c;
            --website-border: #e3dfd5;
            --website-card: #ffffff;
            --orange: #b12244;

            /* Semantic Colors */
            --primary: var(--burgundy-9);
            --primary-foreground: var(--website-card);
            --text-primary: var(--website-text);
            --text-secondary: var(--website-text-light);
            --border: var(--website-border);
            --bg-light: var(--beige-2);
            --background: var(--website-bg);
            --card: var(--website-card);
          }

          html {
            display: flex;
            flex-direction: column;
            min-height: 100%;
          }

          body {
            display: flex;
            flex-direction: column;
            flex: 1 0 auto;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: var(--text-primary);
            background: var(--background);
            margin: 0;
            padding: 0;
            font-smoothing: antialiased;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            text-rendering: optimizeLegibility;
          }

          .banner {
            background: var(--primary);
            color: var(--primary-foreground);
            padding: 12px 20px;
            text-align: center;
            text-decoration: none;
            display: block;
            font-weight: 500;
            font-size: 0.95rem;
            transition: all 0.2s ease;
            border-bottom: 1px solid var(--border);
          }

          .banner:hover {
            background: var(--burgundy-12);
            text-decoration: none;
            color: var(--primary-foreground);
            transform: translateY(-1px);
          }

          .container {
            display: flex;
            flex-direction: column;
            flex: 1 0 auto;
            max-width: 800px;
            margin: 20px auto;
            padding: 40px 48px 20px;
            background: var(--card);
            border: 1px solid var(--border);
            border-radius: 0.625rem;
          }

          .logo-container {
            display: flex;
            align-items: center;
            gap: 16px;
            margin-bottom: 24px;
          }

          .logo {
            height: 40px;
            width: auto;
          }

          .card {
            background-color: var(--bg-light);
            border-radius: 0.5rem;
            border: 1px solid var(--border);
            padding: 24px;
            margin-top: 20px;
          }

          h1 {
            color: var(--text-primary);
            font-family: 'IBM Plex Serif', serif;
            font-size: 2.5rem;
            font-weight: 400;
            line-height: 1;
            margin: 0 0 12px 0;
          }

          .subtitle {
            color: var(--text-secondary);
            font-size: 1.125rem;
            margin-bottom: 32px;
          }

          .alert {
            margin: 0;
            font-size: 1.5rem;
            font-weight: 600;
            margin: 1rem 0;
            text-align: center;
            color: var(--text-primary);
          }

          .description {
            color: var(--text-secondary);
            margin-bottom: 16px;
          }

          .client-info {
            border: 1px solid var(--border);
            border-radius: 0.375rem;
            background: var(--card);
            padding: 20px;
            margin-bottom: 24px;
          }

          .client-name {
            font-weight: 600;
            font-size: 1.2rem;
            margin: 0 0 0.5rem 0;
            color: var(--text-primary);
          }

          .client-detail {
            display: flex;
            margin-bottom: 12px;
            align-items: baseline;
          }

          .detail-label {
            font-weight: 500;
            min-width: 120px;
            color: var(--text-primary);
          }

          .detail-value {
            font-family: 'Geist Mono', monospace;
            word-break: break-all;
            color: var(--text-secondary);
          }

          .detail-value a {
            color: var(--primary);
            text-decoration: none;
            transition: color 0.2s;
          }

          .detail-value a:hover {
            text-decoration: underline;
          }

          .detail-value.small {
            font-size: 0.875em;
          }

          .actions {
            display: flex;
            justify-content: flex-end;
            gap: 12px;
            margin-top: 32px;
          }

          .button {
            padding: 10px 20px;
            border-radius: 0.375rem;
            font-weight: 500;
            cursor: pointer;
            border: none;
            font-size: 1rem;
            transition: all 0.2s ease;
          }

          .button-primary {
            background: var(--primary);
            color: var(--primary-foreground);
          }

          .button-primary:hover {
            background: var(--burgundy-12);
            transform: translateY(-1px);
          }

          .button-secondary {
            background-color: transparent;
            border: 1px solid var(--border);
            color: var(--text-primary);
          }

          .button-secondary:hover {
            background: var(--bg-light);
          }

          p {
            color: var(--text-secondary);
            margin-bottom: 16px;
          }

          a {
            color: var(--primary);
            text-decoration: none;
            transition: color 0.2s;
          }

          a:hover {
            text-decoration: underline;
          }

          footer {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 16px;
            margin-top: 60px;
            padding-top: 24px;
            border-top: 1px solid var(--border);
            color: var(--text-secondary);
            font-size: 0.875rem;
          }

          .footer-links {
            display: flex;
            gap: 24px;
          }

          .attribution {
            text-align: center;
            max-width: 600px;
            line-height: 1.5;
          }

          /* Responsive adjustments */
          @media (max-width: 640px) {
            .container {
              margin: 1rem auto;
              padding: 24px;
            }

            .card {
              padding: 20px;
            }

            .client-detail {
              flex-direction: column;
            }

            .detail-label {
              min-width: unset;
              margin-bottom: 0.25rem;
            }

            .actions {
              flex-direction: column;
            }

            .button {
              width: 100%;
            }

            h1 {
              font-size: 2rem;
            }

            .footer-links {
              flex-direction: column;
              gap: 12px;
              text-align: center;
            }
          }
        </style>
      </head>
      <body>
        <a href="https://filamentanalytics.com?utm_source=gtm-mcp&utm_medium=banner&utm_campaign=mcp-server-auth" target="_blank" class="banner">
          This tool is hosted by Filament - data analytics for non-technical teams
        </a>
        <div class="container">
          <div class="logo-container">
            <a href="https://filamentanalytics.com?utm_source=gtm-mcp&utm_medium=logo&utm_campaign=mcp-server-auth" target="_blank">
              <img src="https://filamentanalytics.com/filament-mono.svg" alt="Filament Analytics" class="logo" style="width: 150px">
            </a>
          </div>

          <h1>MCP Server Authorization</h1>

          <p class="subtitle">
            A remote MCP server with Google OAuth authentication for the Google Tag Manager API.
          </p>

          <div class="card">

            <h2 class="alert"><strong>${clientName || "A new MCP Client"}</strong> is requesting access</h1>

            <div class="client-info">
              <div class="client-detail">
                <div class="detail-label">Name:</div>
                <div class="detail-value">
                  ${clientName}
                </div>
              </div>

              ${
                clientUri
                  ? `
                <div class="client-detail">
                  <div class="detail-label">Website:</div>
                  <div class="detail-value small">
                    <a href="${clientUri}" target="_blank" rel="noopener noreferrer">
                      ${clientUri}
                    </a>
                  </div>
                </div>
              `
                  : ""
              }

              ${
                policyUri
                  ? `
                <div class="client-detail">
                  <div class="detail-label">Privacy Policy:</div>
                  <div class="detail-value">
                    <a href="${policyUri}" target="_blank" rel="noopener noreferrer">
                      ${policyUri}
                    </a>
                  </div>
                </div>
              `
                  : ""
              }

              ${
                tosUri
                  ? `
                <div class="client-detail">
                  <div class="detail-label">Terms of Service:</div>
                  <div class="detail-value">
                    <a href="${tosUri}" target="_blank" rel="noopener noreferrer">
                      ${tosUri}
                    </a>
                  </div>
                </div>
              `
                  : ""
              }

              ${
                redirectUris.length > 0
                  ? `
                <div class="client-detail">
                  <div class="detail-label">Redirect URIs:</div>
                  <div class="detail-value small">
                    ${redirectUris.map((uri) => `<div>${uri}</div>`).join("")}
                  </div>
                </div>
              `
                  : ""
              }

              ${
                contacts
                  ? `
                <div class="client-detail">
                  <div class="detail-label">Contact:</div>
                  <div class="detail-value">${contacts}</div>
                </div>
              `
                  : ""
              }
            </div>

            <p>This MCP Client is requesting to be authorized to access Google Tag Manager. If you approve, you will be redirected to complete authentication.</p>

            <form method="post" action="${new URL(request.url).pathname}">
              <input type="hidden" name="state" value="${encodedState}">

              <div class="actions">
                <button type="button" class="button button-secondary" onclick="window.history.back()">Cancel</button>
                <button type="submit" class="button button-primary">Approve</button>
              </div>
            </form>
          </div>

          <footer>
            <div class="footer-links">
              <a href="/privacy" target="_blank">Privacy Policy</a>
              <a href="/terms" target="_blank">Terms of Service</a>
            </div>
            <div class="attribution">
              This is a hosted fork of the <a href="https://github.com/stape-io/google-tag-manager-mcp-server" target="_blank">Stape.ai MCP server</a> for Google Tag Manager.
              <br>
              Thank you to the team at <a href="https://stape.io" target="_blank">Stape.ai</a> for building this excellent tool!
            </div>
            <div>© 2025 Filament Analytics. All rights reserved.</div>
          </footer>
        </div>
      </body>
    </html>
  `;

  return new Response(htmlContent, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}

/**
 * Result of parsing the approval form submission.
 */
export interface ParsedApprovalResult {
  /** The original state object passed through the form. */
  state: any;
  /** Headers to set on the redirect response, including the Set-Cookie header. */
  headers: Record<string, string>;
}

/**
 * Parses the form submission from the approval dialog, extracts the state,
 * and generates Set-Cookie headers to mark the client as approved.
 *
 * @param request - The incoming POST Request object containing the form data.
 * @param cookieSecret - The secret key used to sign the approval cookie.
 * @returns A promise resolving to an object containing the parsed state and necessary headers.
 * @throws If the request method is not POST, form data is invalid, or state is missing.
 */
export async function parseRedirectApproval(
  request: Request,
  cookieSecret: string,
): Promise<ParsedApprovalResult> {
  if (request.method !== "POST") {
    throw new Error("Invalid request method. Expected POST.");
  }

  let state: any;
  let clientId: string | undefined;

  try {
    const formData = await request.formData();
    const encodedState = formData.get("state");

    if (typeof encodedState !== "string" || !encodedState) {
      throw new Error("Missing or invalid 'state' in form data.");
    }

    state = decodeState<{ oauthReqInfo?: AuthRequest }>(encodedState); // Decode the state
    clientId = state?.oauthReqInfo?.clientId; // Extract clientId from within the state

    if (!clientId) {
      throw new Error("Could not extract clientId from state object.");
    }
  } catch (e) {
    console.error("Error processing form submission:", e);
    // Rethrow or handle as appropriate, maybe return a specific error response
    throw new Error(
      `Failed to parse approval form: ${e instanceof Error ? e.message : String(e)}`,
    );
  }

  // Get existing approved clients
  const cookieHeader = request.headers.get("Cookie");
  const existingApprovedClients =
    (await getApprovedClientsFromCookie(cookieHeader, cookieSecret)) || [];

  // Add the newly approved client ID (avoid duplicates)
  const updatedApprovedClients = Array.from(
    new Set([...existingApprovedClients, clientId]),
  );

  // Sign the updated list
  const payload = JSON.stringify(updatedApprovedClients);
  const key = await importKey(cookieSecret);
  const signature = await signData(key, payload);
  const newCookieValue = `${signature}.${btoa(payload)}`; // signature.base64(payload)

  // Generate Set-Cookie header
  const headers: Record<string, string> = {
    "Set-Cookie": `${COOKIE_NAME}=${newCookieValue}; HttpOnly; Secure; Path=/; SameSite=Lax; Max-Age=${ONE_YEAR_IN_SECONDS}`,
  };

  return { state, headers };
}

/**
 * Sanitizes HTML content to prevent XSS attacks
 * @param unsafe - The unsafe string that might contain HTML
 * @returns A safe string with HTML special characters escaped
 */
function sanitizeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
