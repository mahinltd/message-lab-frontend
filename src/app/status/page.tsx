import { InfoPageLayout } from "@/components/layout/InfoPageLayout";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = { title: "System Status", description: "Check current MessageLab availability for the web dashboard, API, SMS gateway, and payments.", alternates: { canonical: `${siteConfig.url}/status` }, robots: { index: true, follow: true } };

export default function StatusPage() {
  return (
    <InfoPageLayout
      title="System Status"
      contentKey="system_status"
      defaultContent={`
        <h2>All Systems Operational</h2>
        <p>MessageLab services are running normally.</p>

        <h2>Service Status</h2>
        <ul>
          <li><strong>Web Dashboard:</strong> Operational</li>
          <li><strong>API:</strong> Operational</li>
          <li><strong>SMS Gateway:</strong> Operational</li>
          <li><strong>Payment Processing:</strong> Operational</li>
        </ul>

        <h2>Scheduled Maintenance</h2>
        <p>No maintenance scheduled. We'll announce any planned downtime in advance via email and this page.</p>
      `}
    />
  );
}