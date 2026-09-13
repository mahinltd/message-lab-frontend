import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { fetchContent } from "@/lib/server/content";

const buildTime = new Date();
const pages = [
  ["/", "weekly", 1],
  ["/download-apk", "monthly", 0.8],
  ["/about", "monthly", 0.7],
  ["/blog", "monthly", 0.7],
  ["/contact", "monthly", 0.6],
  ["/help", "monthly", 0.8],
  ["/docs", "monthly", 0.8],
  ["/status", "monthly", 0.6],
  ["/support", "monthly", 0.7],
  ["/privacy", "yearly", 0.3],
  ["/terms", "yearly", 0.3],
  ["/anti-spam", "yearly", 0.3],
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const content = await fetchContent();
  const lastModified = content.updatedAt ? new Date(content.updatedAt) : buildTime;
  return pages.map(([path, changeFrequency, priority]) => ({
    url: `${siteConfig.url}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}