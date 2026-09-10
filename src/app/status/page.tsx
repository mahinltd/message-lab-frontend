import { InfoPageLayout } from "@/components/layout/InfoPageLayout";

export const metadata = { title: "System Status" };

export default function StatusPage() {
  return (
    <InfoPageLayout
      title="System Status"
      contentKey="system_status"
      defaultContent={`
        <h2>All Systems Operational</h2>
        <p>Messages Lab services are running normally.</p>

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