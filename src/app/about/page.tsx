import { InfoPageLayout } from "@/components/layout/InfoPageLayout";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = { title: "About MessageLab", description: "Learn how MessageLab gives users control of SMS through their own Android phone and SIM.", alternates: { canonical: `${siteConfig.url}/about` }, robots: { index: true, follow: true } };

export default function AboutPage() {
  return (
    <InfoPageLayout
      title="About MessageLab"
      contentKey="about_page"
      defaultContent={`
        <h2>Our Mission</h2>
        <p>MessageLab is a platform that transforms an Android smartphone into a personal SMS gateway. It gives users control over their SMS infrastructure by letting them use their own device and SIM card.</p>

        <h2>Why We Built This</h2>
        <p>Traditional SMS services can be expensive, opaque, and unreliable. MessageLab provides a transparent, user-controlled alternative that keeps the phone and SIM in the user&apos;s hands.</p>

        <h2>Our Values</h2>
        <ul>
          <li><strong>Transparency:</strong> No hidden fees, no black-box systems</li>
          <li><strong>Security:</strong> End-to-end protection for all communications</li>
          <li><strong>Simplicity:</strong> Powerful features that anyone can use</li>
          <li><strong>Ownership:</strong> Your phone, your SIM, your messages</li>
        </ul>
      `}
    />
  );
}