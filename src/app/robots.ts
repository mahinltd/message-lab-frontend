import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

const disallow = ["/dashboard", "/admin", "/login", "/register", "/verify-email", "/resend-verification", "/forgot-password", "/reset-password", "/_next/", "/api/"];
const aiAndSearchBots = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "Googlebot", "Google-Extended", "PerplexityBot", "ClaudeBot", "anthropic-ai", "Applebot", "Bingbot"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow },
      ...aiAndSearchBots.map((userAgent) => ({ userAgent, allow: "/", disallow })),
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}