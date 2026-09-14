import { InfoPageLayout } from "@/components/layout/InfoPageLayout";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { MetaViewContent } from "@/components/analytics/MetaViewContent";

export const metadata: Metadata = { title: "Documentation", description: "Read MessageLab documentation for Android device pairing, SMS campaigns, plans, and payments.", alternates: { canonical: `${siteConfig.url}/docs` }, robots: { index: true, follow: true } };

export default function DocsPage() {
  return (
    <>
      <MetaViewContent contentName="developer_documentation" />
      <InfoPageLayout
        title="Documentation"
        contentKey="documentation"
        defaultContent={`
        <p>MessageLab turns an Android phone and its SIM into an SMS gateway. The web dashboard supports device pairing, single and bulk SMS, one-time scheduled campaigns, inbound SMS, delivery status, plans, and payments.</p>

        <h2>Quick Start</h2>
        <ol>
          <li>Create and verify a MessageLab account.</li>
          <li>Install the Android app from the <a href="/download-apk">official download page</a>.</li>
          <li>Open Devices in the dashboard and pair the phone by QR code or pairing code.</li>
          <li>Keep the Android app connected so SMS can use the paired phone and SIM.</li>
        </ol>

        <h2>Developer API</h2>
        <p>API base URL: <code>https://api.messagelab.tech/api/v1</code>. Developer API access and OTP access are controlled by the active plan.</p>

        <h3>Authentication and API keys</h3>
        <p>Create a key from Dashboard → Developer API. Send it in the <code>x-api-key</code> header. Keys are shown in full only once; never put one in browser code, a public repository, or analytics.</p>
        <pre><code>curl https://api.messagelab.tech/api/v1/otp/verifications \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: YOUR_SERVER_SIDE_API_KEY"</code></pre>

        <h3>Create OTP</h3>
        <p><code>POST /otp/verifications</code> requires the <code>otp:create</code> permission and a live paired gateway device.</p>
        <pre><code>{"recipient":"+8801XXXXXXXXX","reference":"checkout-123","metadata":{"purpose":"login"}}</code></pre>
        <p>Returns <code>requestId</code>, <code>expiresAt</code>, and <code>status</code>. The verification code is sent through the paired Android phone and expires after five minutes.</p>

        <h3>Verify OTP</h3>
        <p><code>POST /otp/verifications/verify</code> with <code>otp:verify</code> permission:</p>
        <pre><code>{"requestId":"otp_REQUEST_ID","code":"123456"}</code></pre>
        <p>Codes are six digits. Verification requests expire after five minutes and allow at most five attempts.</p>

        <h3>Resend and status</h3>
        <ul>
          <li><code>POST /otp/verifications/:requestId/resend</code> resends within the configured quota and at most three resends.</li>
          <li><code>GET /otp/verifications/:requestId</code> returns verification status, delivery status, expiry, attempts, and resend count.</li>
        </ul>

        <h2>Examples</h2>
        <p><strong>PowerShell</strong></p>
        <pre><code>$headers = @{ "x-api-key" = $env:MESSAGELAB_API_KEY }
$body = @{ recipient = "+8801XXXXXXXXX"; reference = "login" } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri "https://api.messagelab.tech/api/v1/otp/verifications" -Headers $headers -ContentType "application/json" -Body $body</code></pre>
        <p><strong>Node.js</strong></p>
        <pre><code>const response = await fetch("https://api.messagelab.tech/api/v1/otp/verifications", {
  method: "POST",
  headers: { "Content-Type": "application/json", "x-api-key": process.env.MESSAGELAB_API_KEY },
  body: JSON.stringify({ recipient: "+8801XXXXXXXXX", reference: "login" })
});
const result = await response.json();</code></pre>
        <p><strong>Python</strong></p>
        <pre><code>import os, requests
response = requests.post(
    "https://api.messagelab.tech/api/v1/otp/verifications",
    headers={"x-api-key": os.environ["MESSAGELAB_API_KEY"]},
    json={"recipient": "+8801XXXXXXXXX", "reference": "login"},
)
print(response.json())</code></pre>
        <p><strong>Postman and CMD</strong>: create a POST request to the create endpoint, add <code>x-api-key</code> and <code>Content-Type: application/json</code> headers, then use the JSON body above. In Windows CMD, keep the key in an environment variable and do not paste it into a saved collection.</p>

        <h2>Errors, limits, and security</h2>
        <p>Responses use <code>success</code>, <code>data</code>, and a human-readable <code>message</code>. Common statuses are 400 (validation), 401 (missing or invalid key), 403 (plan or permission), 404 (unknown request), and 429 (quota or rate limit). Daily quotas come from the active plan; a phone is limited to five OTP requests per day, with five verification attempts and three resends per request.</p>
        <p>MessageLab never asks you to publish an API key or OTP. Keep keys server-side, use HTTPS, avoid logging recipient numbers and codes, and do not send secrets, tokens, phone numbers, or message content to analytics.</p>

        <h2>Troubleshooting and FAQ</h2>
        <ul>
          <li><strong>No SMS sent:</strong> confirm a paired device is active and has network access, SIM balance, and SMS permission.</li>
          <li><strong>403 response:</strong> ask an account owner to enable API and OTP access on the plan.</li>
          <li><strong>401 response:</strong> check the server-side <code>x-api-key</code> value and whether the key was revoked.</li>
          <li><strong>OTP expired:</strong> create a new request; codes are valid for five minutes.</li>
          <li><strong>Is there a webhook?</strong> No webhook endpoint is currently enabled. Use the status endpoint.</li>
        </ul>
        <p>For account or device help, visit <a href="/help">Help Center</a> or <a href="/support">Contact Support</a>.</p>
        `}
      />
    </>
  );
}