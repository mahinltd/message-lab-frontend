import { InfoPageLayout } from "@/components/layout/InfoPageLayout";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = { title: "Terms of Service", description: "Review the terms that govern use of the MessageLab personal SMS gateway service.", alternates: { canonical: `${siteConfig.url}/terms` }, robots: { index: true, follow: true } };

export default function TermsPage() {
  return (
    <InfoPageLayout
      title="Terms of Service"
      contentKey="terms_of_service"
      defaultContent={`
        <h2>1. Acceptance of Terms</h2>
        <p>By using MessageLab, you agree to these terms. If you don&apos;t agree, please don&apos;t use our service.</p>

        <h2>2. Account Responsibility</h2>
        <p>You are responsible for maintaining the security of your account and all activities that occur under it.</p>

        <h2>3. Acceptable Use</h2>
        <p>You agree not to use MessageLab for spam, harassment, illegal activities, or any other purpose that violates applicable laws.</p>

        <h2>4. Service Availability</h2>
        <p>While we strive for 100% uptime, we cannot guarantee uninterrupted service. We will notify users of planned maintenance in advance.</p>
      `}
    />
  );
}