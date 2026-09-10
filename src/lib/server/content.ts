import type { PageContent, PlanConfig } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export interface ServerContent extends PageContent {
  updatedAt?: string;
}

const fallbackContent: ServerContent = {
  hero: {
    hero_badge: { title: "Your Phone. Your SIM. Your Gateway.", body: null },
    hero_title: { title: "Turn Your Android Into a Personal SMS Gateway", body: null },
    hero_subtitle: { title: null, body: "Send, receive, and manage SMS through your own device using the Messages Lab platform." },
    hero_cta_primary: { title: "Get Started Free", body: "/register" },
    hero_cta_secondary: { title: "View Pricing", body: "/pricing" },
  },
  header: {},
  footer: {
    footer_description: { title: null, body: "Turn your Android phone into a personal SMS gateway. Send, receive, and manage SMS through your own device." },
    footer_copyright: { title: null, body: null },
    footer_tagline: { title: null, body: "Made with ❤️ in Bangladesh" },
    footer_social_facebook: { title: null, body: "https://www.facebook.com/tanvir8268" },
    footer_support_email: { title: null, body: "support@messagelab.tech" },
  },
  legal: {},
  pages: {},
  announcement: null,
  features: [],
  pricing: { sectionContent: {}, plans: [] },
};

async function fetchPublic<T>(path: string, fallback: T): Promise<T> {
  try {
    const response = await fetch(`${API_URL}${path}`, { next: { revalidate: 60, tags: ["public-content"] } });
    if (!response.ok) return fallback;
    const payload = await response.json() as { data?: T };
    return payload.data ?? fallback;
  } catch {
    return fallback;
  }
}

export async function fetchContent(): Promise<ServerContent> {
  const content = await fetchPublic<ServerContent>("/public/content", fallbackContent);
  return {
    ...fallbackContent,
    ...content,
    hero: { ...fallbackContent.hero, ...(content?.hero || {}) },
    footer: { ...fallbackContent.footer, ...(content?.footer || {}) },
    pricing: { ...fallbackContent.pricing, ...(content?.pricing || {}) },
  };
}

export async function fetchPlans(): Promise<PlanConfig[]> {
  const content = await fetchContent();
  const plans = await fetchPublic<PlanConfig[] | { plans?: PlanConfig[] }>("/payments/plans", content.pricing.plans);
  return Array.isArray(plans) ? plans : plans.plans || content.pricing.plans;
}

export async function fetchPaymentMethods(): Promise<unknown> {
  return fetchPublic("/public/payment-methods", null);
}

export { fallbackContent };