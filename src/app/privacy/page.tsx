import { InfoPageLayout } from "@/components/layout/InfoPageLayout";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = { title: "Privacy Policy", description: "Read how MessagesLab handles account, device, SMS metadata, and usage information.", alternates: { canonical: `${siteConfig.url}/privacy` }, robots: { index: true, follow: true } };

export default function PrivacyPage() {
  return (
    <InfoPageLayout
      title="Privacy Policy"
      contentKey="privacy_policy"
      defaultContent={`
        <h2>1. Introduction</h2>
        <p>At Messages Lab, we take your privacy seriously. This policy explains how we collect, use, and protect your personal information.</p>

        <h2>2. Information We Collect</h2>
        <ul>
          <li>Account information (name, email, mobile number)</li>
          <li>Device information (model, OS version, app version)</li>
          <li>SMS metadata (recipients, timestamps, delivery status)</li>
          <li>Usage data and analytics</li>
        </ul>

        <h2>3. How We Use Your Information</h2>
        <p>We use your information to provide and improve our services, process payments, send important notifications, and ensure security.</p>

        <h2>4. Data Protection</h2>
        <p>All data is encrypted in transit and at rest using industry-standard encryption. We never sell your personal information to third parties.</p>
      `}
    />
  );
}