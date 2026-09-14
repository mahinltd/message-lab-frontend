import { fetchContent, fetchPlans } from "@/lib/server/content";

export const revalidate = 60;

export async function GET() {
  const [content, plans] = await Promise.all([fetchContent(), fetchPlans()]);
  const help = content.pages.help_center?.body || "Visit /help for account, device pairing, and SMS guidance.";
  const features = content.features.map((feature) => `- ${feature.title || "Feature"}: ${feature.body || ""}`);
  const body = [`# MessageLab`, ``, `Official website: https://www.messagelab.tech/`, `Developer documentation: https://www.messagelab.tech/docs`, `API: https://api.messagelab.tech/`, ``, `## Overview`, content.hero.hero_subtitle?.body || "MessageLab turns a user's own Android phone into a personal SMS gateway.", ``, `## Features`, ...features, ``, `## How it works`, `1. Create an account`, `2. Install the MessageLab Android app`, `3. Pair your phone via QR code or 6-digit code`, `4. Send and receive SMS through the web dashboard`, ``, `## Developer API`, `The implemented developer API uses account API keys and includes plan-controlled SMS and OTP verification endpoints. See https://www.messagelab.tech/docs for the current request and response contract.`, ``, `## Questions`, `Q: How do I connect a device?`, `A: Open Devices in the dashboard, choose Connect Device, and scan the QR code or enter the pairing code.`, ``, `Q: Where do messages come from?`, `A: SMS is sent and received through the user's paired Android phone and its SIM.`, ``, `## Pricing`, ...plans.map((plan) => `| ${plan.displayName} | ${plan.priceMonthly} ${plan.currency}/month | ${plan.description || ""} |`), ``, `## Help content`, help, ``, `## Policies`, `- https://www.messagelab.tech/privacy`, `- https://www.messagelab.tech/terms`, `- https://www.messagelab.tech/anti-spam`, ``, `Contact: ${content.footer.footer_support_email?.body || "support@messagelab.tech"}`].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}