import { InfoPageLayout } from "@/components/layout/InfoPageLayout";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = { title: "Help Center", description: "Find answers about MessageLab accounts, Android device pairing, SMS campaigns, and common issues.", alternates: { canonical: `${siteConfig.url}/help` }, robots: { index: true, follow: true } };

export default function HelpPage() {
  return (
    <InfoPageLayout
      title="Help Center"
      contentKey="help_center"
      defaultContent={`
        <h2>Getting Started</h2>
        <ul>
          <li><strong>How do I create an account?</strong> Click "Get Started Free" and fill out the registration form.</li>
          <li><strong>How do I connect my device?</strong> Go to Devices, click "Connect Device", and scan the QR code.</li>
          <li><strong>How do I send my first SMS?</strong> Go to Messages, click "New Campaign", and follow the prompts.</li>
        </ul>

        <h2>Common Issues</h2>
        <ul>
          <li><strong>Device shows as offline:</strong> Ensure the app is running and has internet access.</li>
          <li><strong>SMS not sending:</strong> Check SIM card, balance, and SMS permissions.</li>
          <li><strong>Forgot password:</strong> Use the "Forgot password" link on the login page.</li>
        </ul>

        <h2>Still Need Help?</h2>
        <p>Visit our <a href="/support">support page</a> or email us at <a href="mailto:support@messagelab.tech">support@messagelab.tech</a>.</p>
      `}
    />
  );
}