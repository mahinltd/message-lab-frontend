import { InfoPageLayout } from "@/components/layout/InfoPageLayout";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = { title: "Contact Support", description: "Get help from MessagesLab support with device pairing, SMS sending, account, and service questions.", alternates: { canonical: `${siteConfig.url}/support` }, robots: { index: true, follow: true } };

export default function SupportPage() {
  return (
    <InfoPageLayout
      title="Contact Support"
      contentKey="support_page"
      defaultContent={`
        <h2>How to Get Help</h2>
        <p>Our support team is ready to assist you with any issues or questions.</p>

        <h2>Support Channels</h2>
        <ul>
          <li><strong>Email:</strong> <a href="mailto:support@messagelab.tech">support@messagelab.tech</a></li>
          <li><strong>Response Time:</strong> Within 24 business hours</li>
          <li><strong>Live Chat:</strong> Coming soon</li>
        </ul>

        <h2>Before You Contact Us</h2>
        <p>Please check our <a href="/help">Help Center</a> first — your question may already be answered there.</p>
      `}
    />
  );
}