import { InfoPageLayout } from "@/components/layout/InfoPageLayout";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = { title: "Documentation", description: "Read MessagesLab documentation for device pairing, campaign management, plans, and payments.", alternates: { canonical: `${siteConfig.url}/docs` }, robots: { index: true, follow: true } };

export default function DocsPage() {
  return (
    <InfoPageLayout
      title="Documentation"
      contentKey="documentation"
      defaultContent={`
        <h2>API Documentation</h2>
        <p>Complete API documentation is available at <code>/api/docs</code>. Our REST API allows you to integrate Messages Lab into your own applications.</p>

        <h2>User Guides</h2>
        <ul>
          <li>Device setup and pairing</li>
          <li>Campaign management</li>
          <li>Plan features and limits</li>
          <li>Payment processing</li>
        </ul>

        <h2>Integration Examples</h2>
        <p>Check out our GitHub repository for code examples in JavaScript, Python, and more.</p>
      `}
    />
  );
}