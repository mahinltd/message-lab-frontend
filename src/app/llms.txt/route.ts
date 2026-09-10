import { fetchContent, fetchPlans } from "@/lib/server/content";

export const revalidate = 60;

export async function GET() {
  const [content, plans] = await Promise.all([fetchContent(), fetchPlans()]);
  const hero = content.hero.hero_subtitle?.body || "MessagesLab turns a user's own Android phone into a personal SMS gateway.";
  const steps = ["Create an account", "Install the Android app", "Pair the phone via QR code or 6-digit code", "Send and receive SMS from the web dashboard"];
  const body = [`# MessagesLab`, ``, hero, ``, `## How it works`, ...steps.map((step, index) => `${index + 1}. ${step}`), ``, `## Public URLs`, ...["/", "/about", "/blog", "/contact", "/help", "/docs", "/status", "/support", "/privacy", "/terms", "/anti-spam"].map((path) => `- ${path}`), ``, `## Plans`, ...plans.map((plan) => `- ${plan.displayName}: ${plan.priceMonthly} ${plan.currency}/month`), ``, `Contact: ${content.footer.footer_support_email?.body || "support@messagelab.tech"}`].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}