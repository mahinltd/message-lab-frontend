import { InfoPageLayout } from "@/components/layout/InfoPageLayout";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = { title: "Anti-Spam Policy", description: "Review the MessagesLab rules against unsolicited bulk messaging, abuse, fraud, and illegal use.", alternates: { canonical: `${siteConfig.url}/anti-spam` }, robots: { index: true, follow: true } };

export default function AntiSpamPage() {
  return (
    <InfoPageLayout
      title="Anti-Spam Policy"
      contentKey="anti_spam_policy"
      defaultContent={`
        <h2>Zero Tolerance for Spam</h2>
        <p>Messages Lab has a strict zero-tolerance policy against spam. We monitor all accounts for abusive behavior.</p>

        <h2>Prohibited Activities</h2>
        <ul>
          <li>Sending unsolicited bulk messages</li>
          <li>Harassment or threatening messages</li>
          <li>Fraudulent or deceptive content</li>
          <li>Illegal content or activities</li>
        </ul>

        <h2>Consequences</h2>
        <p>Accounts found violating this policy will be immediately suspended without refund. Severe cases may be reported to relevant authorities.</p>

        <h2>Reporting Abuse</h2>
        <p>If you receive spam from a Messages Lab user, please report it to <a href="mailto:abuse@messagelab.tech">abuse@messagelab.tech</a>.</p>
      `}
    />
  );
}