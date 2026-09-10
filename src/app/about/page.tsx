import { InfoPageLayout } from "@/components/layout/InfoPageLayout";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = { title: "About Us", description: "Learn how MessagesLab gives users control of SMS through their own Android phone and SIM.", alternates: { canonical: `${siteConfig.url}/about` }, robots: { index: true, follow: true } };

export default function AboutPage() {
  return (
    <InfoPageLayout
      title="About Messages Lab"
      contentKey="about_page"
      defaultContent={`
        <h2>Our Mission</h2>
        <p>Messages Lab is a complete product-as-a-service platform that transforms any Android smartphone into a personal SMS gateway. We believe in giving users full control over their SMS infrastructure by letting them use their own device and SIM card.</p>

        <h2>Why We Built This</h2>
        <p>Traditional SMS services are expensive, opaque, and often unreliable. We created Messages Lab to provide a transparent, affordable, and user-friendly alternative that puts control back in the hands of the user.</p>

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