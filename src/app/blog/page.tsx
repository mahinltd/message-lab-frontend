import { InfoPageLayout } from "@/components/layout/InfoPageLayout";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = { title: "Blog", description: "MessagesLab updates, tutorials, and practical guidance about personal SMS gateways and mobile messaging.", alternates: { canonical: `${siteConfig.url}/blog` }, robots: { index: true, follow: true } };

export default function BlogPage() {
  return (
    <InfoPageLayout
      title="Blog"
      contentKey="blog_page"
      defaultContent={`
        <p>Welcome to the Messages Lab blog. Here we share updates, tutorials, and insights about SMS marketing, mobile technology, and the future of personal communication gateways.</p>

        <h2>Coming Soon</h2>
        <p>We're working on exciting content to help you get the most out of Messages Lab. Check back soon for articles on:</p>
        <ul>
          <li>Best practices for SMS marketing</li>
          <li>Tips for optimizing delivery rates</li>
          <li>Product updates and new features</li>
          <li>Customer success stories</li>
        </ul>
      `}
    />
  );
}