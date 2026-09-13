import { InfoPageLayout } from "@/components/layout/InfoPageLayout";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = { title: "Contact Us", description: "Contact the MessageLab team for questions, feedback, support, or business inquiries.", alternates: { canonical: `${siteConfig.url}/contact` }, robots: { index: true, follow: true } };

export default function ContactPage() {
  return (
    <InfoPageLayout
      title="Contact Us"
      contentKey="contact_page"
      defaultContent={`
        <p>We'd love to hear from you! Whether you have a question, feedback, or need support, our team is here to help.</p>

        <h2>Get in Touch</h2>
        <ul>
          <li><strong>General Inquiries:</strong> <a href="mailto:hello@messagelab.tech">hello@messagelab.tech</a></li>
          <li><strong>Support:</strong> <a href="mailto:support@messagelab.tech">support@messagelab.tech</a></li>
          <li><strong>Business Partnerships:</strong> <a href="mailto:partners@messagelab.tech">partners@messagelab.tech</a></li>
        </ul>

        <h2>Response Time</h2>
        <p>We typically respond to all inquiries within 24 business hours. For urgent issues, please include "URGENT" in your subject line.</p>
      `}
    />
  );
}