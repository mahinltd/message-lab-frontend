import { fetchContent, fetchPlans } from "@/lib/server/content";

export const revalidate = 60;

export async function GET() {
  const [content, plans] = await Promise.all([fetchContent(), fetchPlans()]);
  const help = content.pages.help_center?.body || "Visit /help for account, device pairing, and SMS guidance.";
  const features = content.features.map((feature) => `- ${feature.title || "Feature"}: ${feature.body || ""}`);
  const body = [`# MessagesLab`, ``, content.hero.hero_subtitle?.body || "MessagesLab turns a user's own Android phone into a personal SMS gateway.", ``, `## Features`, ...features, ``, `## How it works`, `1. Create an account`, `2. Install the MessagesLab Android app`, `3. Pair your phone via QR code or 6-digit code`, `4. Send and receive SMS through the web dashboard`, ``, `## Questions`, `Q: How do I connect a device?`, `A: Open Devices in the dashboard, choose Connect Device, and scan the QR code or enter the pairing code.`, ``, `Q: Where do messages come from?`, `A: SMS is sent and received through the user's paired Android phone and its SIM.`, ``, `## Pricing`, ...plans.map((plan) => `| ${plan.displayName} | ${plan.priceMonthly} ${plan.currency}/month | ${plan.description || ""} |`), ``, `## Help content`, help, ``, `## Policies`, `- /privacy`, `- /terms`, `- /anti-spam`, ``, `Contact: ${content.footer.footer_support_email?.body || "support@messagelab.tech"}`].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}