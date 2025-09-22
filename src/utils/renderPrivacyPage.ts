export const renderPrivacyPage = () => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Privacy Policy - MCP Server for Google Tag Manager | Filament Analytics</title>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-W1P9NYVSXH"></script>
        <script>
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-W1P9NYVSXH');
        </script>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');
            @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Serif:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap');

            :root {
                --burgundy-9: #64203e;
                --burgundy-12: #321222;
                --website-bg: #f8f7f5;
                --website-text: #261b07;
                --website-text-light: #625a4c;
                --website-border: #e3dfd5;
                --website-card: #ffffff;
                --primary: var(--burgundy-9);
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
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
                color: var(--website-text);
                background: var(--website-bg);
            }

            main {
              flex: 1;
            }
            h1 {
                color: var(--website-text);
                font-family: 'IBM Plex Serif', serif;
                font-size: 2.5rem;
                font-weight: 400;
                border-bottom: 3px solid var(--primary);
                padding-bottom: 10px;
            }
            h2 {
                color: var(--website-text);
                margin-top: 30px;
                font-weight: 600;
            }
            h3 {
                color: var(--website-text-light);
            }
            strong {
                color: var(--website-text);
            }
            ul {
                padding-left: 20px;
            }
            li {
                margin-bottom: 8px;
            }
            .highlight {
                background-color: var(--website-card);
                border-left: 4px solid var(--primary);
                padding: 15px;
                margin: 20px 0;
                border-radius: 0.5rem;
                box-shadow: 0 2px 4px 0 rgba(38, 27, 7, 0.06);
            }
            .contact {
                background-color: var(--website-card);
                padding: 20px;
                border-radius: 0.625rem;
                margin-top: 30px;
                border: 1px solid var(--website-border);
                box-shadow: 0 2px 4px 0 rgba(38, 27, 7, 0.06);
            }
            hr {
                border: none;
                height: 1px;
                background-color: var(--website-border);
                margin: 30px 0;
            }
             footer {
                display: flex;
                justify-content: center;
                column-gap: 24px;
                margin-top: 16px;
            }
        </style>
    </head>
    <body>
    <main>
        <h1>Privacy Policy - Filament MCP Server for Google Tag Manager</h1>

        <p><strong>Last updated:</strong> September 22, 2025</p>

        <h2>Overview</h2>
        <p>This privacy policy explains how Errinundra Pty Ltd t/a Filament AI (ABN 29 680 843 814) ("we", "us", "our", "Filament") collects, uses, and protects your personal information when you use the Filament MCP Server for Google Tag Manager (the "Service").</p>

        <p>This privacy policy is specific to the MCP Server service and should be read together with our main Privacy Policy available at <a href="https://filamentanalytics.com/privacy" target="_blank">https://filamentanalytics.com/privacy</a>.</p>

        <p>We are committed to complying with the Privacy Act 1988 (Cth) and the Australian Privacy Principles (APPs). This policy explains how we handle personal information in accordance with Australian privacy law.</p>

        <h2>Data We Process</h2>

        <p>Filament MCP Server for Google Tag Manager processes the following categories of your personal data:</p>

        <h3>Authentication Data</h3>
        <ul>
            <li><strong>OAuth Access Tokens:</strong> We store only OAuth 2.0 access tokens required for Google Tag Manager API authentication</li>
            <li><strong>Google Login ID:</strong> Associated with your authentication session for service access</li>
        </ul>

        <h3>What We Do NOT Collect</h3>
        <ul>
            <li>We do not maintain a user database</li>
            <li>We do not collect, store, or retain any personal information beyond authentication tokens</li>
            <li>We do not store any Tag Manager data, containers, or user content</li>
            <li>No user data or Tag Manager content passes through our service for storage</li>
        </ul>

        <h3>Where Data is Stored</h3>
        <ul>
            <li>OAuth access tokens are securely stored in encrypted cloud storage</li>
            <li>No other user data or information is stored anywhere in our system</li>
            <li>No data is shared with third parties or with other users or tools</li>
        </ul>

        <h3>Legal Basis for Collection and Use</h3>
        <p>Under the Australian Privacy Principles, we collect and use your personal information for the primary purpose of providing the MCP Server service. We only collect information that is reasonably necessary for our functions and activities. The collection and use of authentication data is necessary to provide the service you have requested.</p>

        <h3>How We Use Data</h3>
        <ul>
            <li><strong>Authentication Only:</strong> Access tokens are used exclusively to authenticate API requests between MCP clients and Google Tag Manager</li>
            <li><strong>No Data Processing:</strong> We do not process, analyze, or manipulate any data from Google Tag Manager APIs</li>
            <li><strong>Proxy Function:</strong> We act solely as a pass-through middleware, relaying requests and responses</li>
        </ul>

        <div class="highlight">
            <h2>Google API Compliance and Limited Use Requirements</h2>
            <p><strong>This service complies with <a href="https://developers.google.com/workspace/workspace-api-user-data-developer-policy#limited-use" target="_blank">Google's Limited Use requirements</a> for applications utilizing sensitive API scopes.</strong></p>

            <p><strong>Affirmative Compliance Statement:</strong><br>
            <em>"The use of raw or derived user data received from Workspace APIs will adhere to the Google User Data Policy, including the Limited Use requirements."</em></p>

            <p>Filament MCP Server for Google Tag Manager has access to your Google Tag Manager accounts, containers, workspaces, and items within, so that MCP clients can use the service to interact with these items through our middleware proxy.</p>

            <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 15px 0;">
                <h3 style="color: #856404; margin-top: 0;">AI/ML Model Training Prohibition</h3>
                <p style="color: #856404; margin-bottom: 0;"><strong>Our application does NOT use Google Workspace or Tag Manager user data to train or improve AI/ML models at all.</strong> Specifically:</p>
            </div>

            <ul>
                <li>We do <strong>NOT</strong> use, transfer, or sell user data from Google APIs to create, train, or improve any machine learning or artificial intelligence models (foundational or otherwise)</li>
                <li>We do <strong>NOT</strong> use data for generalized AI/ML model development</li>
                <li>We do <strong>NOT</strong> use data for personalized AI/ML models</li>
                <li>We do <strong>NOT</strong> retain any user data obtained through Google APIs beyond the authentication process</li>
                <li>We do <strong>NOT</strong> use any raw data, aggregated data, anonymized data, or derived data from Google APIs for any AI/ML purposes</li>
                <li>Our service operates as a pure middleware proxy without data retention, processing, or analysis capabilities</li>
                <li>No data is shared with third parties or with other users or tools</li>
                <li>No data is used for any machine learning, artificial intelligence, or algorithmic purposes whatsoever</li>
            </ul>
        </div>

        <h2>Data Sharing</h2>
        <p>We do <strong>NOT</strong>:</p>
        <ul>
            <li>Share user data with third parties</li>
            <li>Sell or transfer any information to external services</li>
            <li>Use data for advertising or marketing purposes</li>
            <li>Retain data for analytics or business intelligence</li>
        </ul>

        <h2>Data Security</h2>
        <ul>
            <li>All data transmission occurs over encrypted HTTPS connections</li>
            <li>OAuth tokens are stored securely in our cloud infrastructure</li>
            <li>We implement industry-standard security practices for token management</li>
        </ul>

        <h2>Data Retention</h2>
        <ul>
            <li><strong>OAuth Tokens:</strong> Personal data will be processed and retained until the purposes of processing are met by the Company</li>
            <li><strong>User Data:</strong> No user data is retained - all GTM data passes through our service without storage</li>
            <li><strong>Logs:</strong> Basic system logs may be retained for up to 30 days for operational purposes only</li>
        </ul>

        <h2>Your Rights Under Australian Privacy Law</h2>
        <p>Under the Australian Privacy Principles, you have the following rights:</p>
        <ul>
            <li><strong>Access:</strong> You can request access to the personal information we hold about you</li>
            <li><strong>Correction:</strong> You can request correction of inaccurate or incomplete information</li>
            <li><strong>Erasure:</strong> You can request deletion of your personal information in certain circumstances</li>
            <li><strong>Revoke Access:</strong> You can revoke access at any time through your Google Account settings</li>
            <li><strong>Complaints:</strong> You can make a complaint to us or to the Office of the Australian Information Commissioner (OAIC)</li>
        </ul>

        <h2>International Data Transfers</h2>
        <p>Your authentication data may be stored on servers located outside Australia (including in the United States through Cloudflare's infrastructure). We ensure that any overseas recipients are subject to privacy protections substantially similar to the Australian Privacy Principles.</p>

        <h2>Children's Privacy</h2>
        <p>Our service is not intended for use by children under 13. We do not knowingly collect personal information from children under 13. If a parent or guardian becomes aware that their child has provided us with personal information, they should contact us and we will delete such information.</p>

        <h2>Changes to This Policy</h2>
        <p>We may update this Privacy Policy occasionally. We will notify users of significant changes by updating the effective date.</p>

        <div class="contact">
            <h2>Contact Information</h2>
            <p>For questions about this Privacy Policy or to exercise your privacy rights, please contact us:</p>
            <p><strong>Email:</strong> team@filamentanalytics.com</p>
            <p><strong>Post:</strong><br>
            Errinundra Pty Ltd t/a Filament AI<br>
            81-83 Campbell Street<br>
            Surry Hills NSW 2010<br>
            Australia</p>
            <p>If you are not satisfied with our response to your privacy concern, you can contact the Office of the Australian Information Commissioner at <a href="https://www.oaic.gov.au" target="_blank">www.oaic.gov.au</a> or 1300 363 992.</p>
        </div>

        <hr>
        <p><strong>Last Updated:</strong> September 22, 2025</p>
      </main>
      <footer>
        <div style="display: flex; gap: 24px; margin-bottom: 16px;">
          <a href="/">Home</a>
          <a href="/privacy" target="_blank">Privacy Policy</a>
          <a href="/terms" target="_blank">Terms of Service</a>
        </div>
        <div style="text-align: center; max-width: 600px; line-height: 1.5; margin-bottom: 16px;">
          This is a hosted fork of the <a href="https://github.com/stape-io/google-tag-manager-mcp-server" target="_blank">Stape.ai MCP server</a> for Google Tag Manager.
          <br>
          Thank you to the team at <a href="https://stape.io" target="_blank">Stape.ai</a> for building this excellent tool!
        </div>
        <div>© 2025 Filament Analytics. All rights reserved.</div>
      </footer>
    </body>
    </html>
  `;
};
