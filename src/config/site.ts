import { BRAND_NAME } from "@/lib/brand";

const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_FRONTEND_URL || "https://messagelab.tech";
const siteUrl = configuredSiteUrl.replace("https://messagelab.tech", "https://www.messagelab.tech");

export const siteConfig = {
  name: BRAND_NAME,
  description:
    "Turn your Android phone into a personal SMS gateway. Send, receive, and manage SMS through your own device.",
  url: siteUrl,
  apiURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1",
  links: {
    login: "/login",
    register: "/register",
    dashboard: "/dashboard",
    pricing: "/#pricing",
    admin: "/admin",
  },
} as const;
