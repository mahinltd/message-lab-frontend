import { InfoPageLayout } from "@/components/layout/InfoPageLayout";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = { title: "Documentation", description: "Read MessageLab documentation for Android device pairing, SMS campaigns, plans, and payments.", alternates: { canonical: `${siteConfig.url}/docs` }, robots: { index: true, follow: true } };

export default function DocsPage() {
  return (
    <InfoPageLayout
      title="Documentation"
      contentKey="documentation"
      defaultContent={`
        <h2>Product Documentation</h2>
        <p>Learn how to connect an Android phone, pair it with your MessageLab account, manage SMS campaigns, review delivery status, and understand plans and payments.</p>

        <h2>User Guides</h2>
        <ul>
          <li>Device setup and pairing</li>
          <li>Campaign management</li>
          <li>Plan features and limits</li>
          <li>Payment processing</li>
        </ul>

        <h2>Developer Access</h2>
        <p>MessageLab also provides a plan-controlled developer API. Account owners can create and revoke API keys from the developer API surface. Plans with API and OTP access enabled can use the versioned OTP endpoints documented in the backend API reference.</p>

        <h3>OTP verification API</h3>
        <ul>
          <li><code>POST /api/v1/otp/verifications</code> creates a verification request and queues an SMS through an active Android gateway.</li>
          <li><code>POST /api/v1/otp/verifications/verify</code> verifies a six-digit code.</li>
          <li><code>POST /api/v1/otp/verifications/:requestId/resend</code> resends a code within configured limits.</li>
          <li><code>GET /api/v1/otp/verifications/:requestId</code> reports verification and linked campaign status.</li>
          <li>Requests require an <code>x-api-key</code> credential and are subject to plan quotas, expiration, attempt limits, and SMS usage limits.</li>
        </ul>
      `}
    />
  );
}