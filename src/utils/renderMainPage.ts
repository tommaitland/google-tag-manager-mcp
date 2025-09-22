export const renderMainPage = () => {
	return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="noindex,nofollow" />
    <title>Filament MCP Server for Google Tag Manager</title>
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
              margin: 0;
              color: var(--text-primary);
              background: var(--background);
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
              max-width: 800px;
              margin: 20px auto;
              padding: 40px 48px 20px;
              flex: 1;
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

           main {
              flex: 1;
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

          h2 {
              color: var(--text-primary);
              font-size: 1.5rem;
              font-weight: 600;
              margin-top: 40px;
              margin-bottom: 16px;
          }

          h3 {
              color: var(--text-primary);
              font-size: 1.125rem;
              font-weight: 500;
              margin-top: 24px;
              margin-bottom: 12px;
          }

          p {
              color: var(--text-secondary);
              margin-bottom: 16px;
          }

          ul {
              padding-left: 20px;
              margin-bottom: 16px;
          }

          li {
              margin-bottom: 8px;
              color: var(--text-secondary);
          }

          hr {
              border: none;
              height: 1px;
              background-color: var(--border);
              margin: 40px 0;
          }

          code {
              background-color: var(--bg-light);
              padding: 2px 6px;
              border-radius: 4px;
              font-family: 'Geist Mono', monospace;
              font-size: 0.9em;
              color: var(--text-primary);
          }

          pre {
              background-color: var(--bg-light);
              padding: 16px;
              border-radius: 8px;
              overflow-x: auto;
              margin: 16px 0;
          }

          pre code {
              background-color: transparent;
              padding: 0;
              font-family: 'Geist Mono', monospace;
          }

          a {
              color: var(--primary);
              text-decoration: none;
              transition: color 0.2s;
          }

          a:hover {
              color: var(--primary-dark);
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

          .setup-steps {
              margin: 32px 0;
          }

          .step {
              display: flex;
              gap: 20px;
              margin-bottom: 32px;
              padding: 24px;
              background: var(--bg-light);
              border-radius: 0.5rem;
              border: 1px solid var(--border);
          }

          .step-number {
              flex-shrink: 0;
              width: 32px;
              height: 32px;
              background: var(--primary);
              color: var(--primary-foreground);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: 600;
              font-size: 0.9rem;
          }

          .step-content {
              flex: 1;
          }

          .step-content h3 {
              margin: 0 0 8px 0;
              font-size: 1.125rem;
              font-weight: 600;
              color: var(--text-primary);
          }

          .step-content p {
              margin: 0 0 12px 0;
              color: var(--text-secondary);
          }

          .config-tool {
              background: var(--card);
              border: 1px solid var(--border);
              border-radius: 0.5rem;
              padding: 20px;
              margin-top: 16px;
          }

          .config-tool label {
              display: block;
              font-weight: 500;
              margin-bottom: 8px;
              color: var(--text-primary);
          }

          .config-tool textarea {
              width: 100%;
              min-height: 120px;
              padding: 12px;
              border: 1px solid var(--border);
              border-radius: 0.375rem;
              font-family: 'Geist Mono', monospace;
              font-size: 0.875rem;
              resize: vertical;
              margin-bottom: 12px;
              background: var(--bg-light);
              box-sizing: border-box;
          }

          .config-tool textarea:focus {
              outline: none;
              border-color: var(--primary);
              box-shadow: 0 0 0 3px rgba(100, 32, 62, 0.1);
          }

          .config-tool button {
              background: var(--primary);
              color: var(--primary-foreground);
              border: none;
              padding: 10px 20px;
              border-radius: 0.375rem;
              font-weight: 500;
              cursor: pointer;
              transition: all 0.2s ease;
              margin-right: 8px;
          }

          .config-tool button:hover {
              background: var(--burgundy-12);
              transform: translateY(-1px);
          }

          #outputSection {
              margin-top: 20px;
              padding-top: 20px;
              border-top: 1px solid var(--border);
          }

          #newConfig {
              background: var(--card);
              border: 2px solid var(--primary);
          }
    </style>
    </head>
    <body>
      <a href="https://filamentanalytics.com?utm_source=gtm-mcp&utm_medium=banner&utm_campaign=mcp-server" target="_blank" class="banner">
        This tool is hosted by Filament - data analytics for non-technical teams
      </a>
      <div class="container">
        <main>
          <div class="logo-container">
            <a href="https://filamentanalytics.com?utm_source=gtm-mcp&utm_medium=logo&utm_campaign=mcp-server" target="_blank">
              <img src="https://filamentanalytics.com/filament-mono.svg" alt="Filament Analytics" class="logo" style="width: 150px">
            </a>
          </div>

        <h1>MCP Server for Google Tag Manager</h1>

        <p class="subtitle">
        A remote MCP server with Google OAuth authentication, providing seamless access to the Google Tag Manager API.
        </p>

        <h2>Quick Setup Guide</h2>

        <div class="setup-steps">
          <div class="step">
            <div class="step-number">1</div>
            <div class="step-content">
              <h3>Install Node.js</h3>
              <p>Download and install Node.js v18 or higher from <a href="https://nodejs.org/en/download" target="_blank">nodejs.org</a></p>
            </div>
          </div>

          <div class="step">
            <div class="step-number">2</div>
            <div class="step-content">
              <h3>Open Claude Desktop Configuration</h3>
              <p>In Claude Desktop, go to <strong>Settings → Developer → Edit Config</strong></p>
            </div>
          </div>

          <div class="step">
            <div class="step-number">3</div>
            <div class="step-content">
              <h3>Update Your Configuration</h3>
              <p>Use the tool below to automatically add our MCP server to your existing configuration:</p>

              <div class="config-tool">
                <label for="currentConfig">Paste your current Claude Desktop config:</label>
                <textarea id="currentConfig" placeholder='Paste your current config here, or leave empty if you don\'t have one yet...'></textarea>

                <button onclick="generateConfig()">Generate Updated Config</button>

                <div id="outputSection" style="display: none;">
                  <label for="newConfig">Copy this updated config back to Claude Desktop:</label>
                  <textarea id="newConfig" readonly></textarea>
                  <button onclick="copyConfig()">Copy to Clipboard</button>
                </div>
              </div>
            </div>
          </div>

          <div class="step">
            <div class="step-number">4</div>
            <div class="step-content">
              <h3>Restart & Authenticate</h3>
              <p>Restart Claude Desktop. A browser window will open for Google OAuth authentication. Complete the flow to grant access to your Google Tag Manager account.</p>
            </div>
          </div>
        </div>

        <h3>Manual Configuration (Advanced)</h3>
        <p>If you prefer to manually edit your config, add this to your <code>mcpServers</code> section:</p>
        <pre><code>"google-tag-manager-mcp-server": {
  "command": "npx",
  "args": [
    "-y",
    "mcp-remote",
    "https://gtm-mcp.filamentanalytics.com/sse"
  ]
}</code></pre>

        <h3>Troubleshooting</h3>

        <p>
        <strong>Clearing Authentication Issues:</strong>
        </p>
        <p>
        If you encounter persistent authentication issues, <a href="https://github.com/geelen/mcp-remote#readme">mcp-remote</a> stores credentials in <code>~/.mcp-auth</code>.
        Clear this directory to reset:
        </p>

        <pre><code>rm -rf ~/.mcp-auth</code></pre>

        <p>Then restart your MCP client to re-authenticate.</p>

        </main>

        <footer>
        <div class="footer-links">
          <a href="https://filamentanalytics.com/privacy" target="_blank">Privacy Policy</a>
          <a href="https://filamentanalytics.com/terms" target="_blank">Terms of Service</a>
        </div>
        <div class="attribution">
          This is a hosted fork of the <a href="https://github.com/stape-io/google-tag-manager-mcp-server" target="_blank">Stape.ai MCP server</a> for Google Tag Manager.
          <br>
          Thank you to the team at <a href="https://stape.io" target="_blank">Stape.ai</a> for building this excellent tool!
        </div>
        <div>© 2025 Filament Analytics. All rights reserved.</div>
        </footer>
      </div>

      <script>
        function generateConfig() {
          const currentConfigText = document.getElementById('currentConfig').value.trim();

          let currentConfig;
          try {
            currentConfig = currentConfigText ? JSON.parse(currentConfigText) : {};
          } catch (e) {
            alert('Invalid JSON in current config. Please check your syntax and try again.');
            return;
          }

          // Ensure mcpServers exists
          if (!currentConfig.mcpServers) {
            currentConfig.mcpServers = {};
          }

          // Add our MCP server
          currentConfig.mcpServers['google-tag-manager-mcp-server'] = {
            command: 'npx',
            args: [
              '-y',
              'mcp-remote',
              'https://gtm-mcp.filamentanalytics.com/sse'
            ]
          };

          // Display the result
          const newConfigText = JSON.stringify(currentConfig, null, 2);
          document.getElementById('newConfig').value = newConfigText;
          document.getElementById('outputSection').style.display = 'block';

          // Scroll to output
          document.getElementById('outputSection').scrollIntoView({ behavior: 'smooth' });
        }

        function copyConfig() {
          const newConfig = document.getElementById('newConfig');
          newConfig.select();
          newConfig.setSelectionRange(0, 99999); // For mobile devices

          try {
            document.execCommand('copy');
            const button = event.target;
            const originalText = button.textContent;
            button.textContent = 'Copied!';
            button.style.background = 'var(--burgundy-12)';
            setTimeout(() => {
              button.textContent = originalText;
              button.style.background = '';
            }, 2000);
          } catch (err) {
            alert('Failed to copy to clipboard. Please select all text and copy manually.');
          }
        }

        // Auto-resize textareas
        document.addEventListener('DOMContentLoaded', function() {
          const textareas = document.querySelectorAll('textarea');
          textareas.forEach(textarea => {
            textarea.addEventListener('input', function() {
              this.style.height = 'auto';
              this.style.height = Math.max(120, this.scrollHeight) + 'px';
            });
          });
        });
      </script>
    </body>
    </html>
  `;
};
