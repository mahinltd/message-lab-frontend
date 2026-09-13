import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { CTASection } from "@/components/landing/CTASection";
import { fetchContent, fetchPlans } from "@/lib/server/content";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { BRAND_NAME } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Personal SMS Gateway",
  description: `Turn your own Android phone and SIM into a personal SMS gateway with ${BRAND_NAME}.`,
  alternates: { canonical: siteConfig.url },
  robots: { index: true, follow: true },
};

export default async function HomePage() {
  const [content, plans] = await Promise.all([fetchContent(), fetchPlans()]);
  const heroDescription = content.hero.hero_subtitle?.body || `${BRAND_NAME} turns your own Android phone into a personal SMS gateway.`;
  const offers = plans.map((plan) => ({ "@type": "Offer", name: plan.displayName, price: String(plan.priceMonthly), priceCurrency: plan.currency || "BDT" }));
  const howToSteps = ["Create an account", "Install the Android app", "Pair the phone via QR code or 6-digit code", "Send and receive SMS through the web dashboard"];
  const structuredData = [
    { "@context": "https://schema.org", "@type": "Organization", "@id": `${siteConfig.url}/#organization`, name: BRAND_NAME, url: siteConfig.url, logo: `${siteConfig.url}/branding/MessageLab-logo.png`, sameAs: [content.footer.footer_social_facebook?.body].filter(Boolean), contactPoint: { "@type": "ContactPoint", email: content.footer.footer_support_email?.body || "support@messagelab.tech", contactType: "customer support" } },
    { "@context": "https://schema.org", "@type": "WebSite", "@id": `${siteConfig.url}/#website`, name: BRAND_NAME, url: siteConfig.url, description: heroDescription, publisher: { "@id": `${siteConfig.url}/#organization` } },
    { "@context": "https://schema.org", "@type": "WebPage", "@id": `${siteConfig.url}/#webpage`, name: `${BRAND_NAME} personal SMS gateway`, url: siteConfig.url, description: heroDescription, isPartOf: { "@id": `${siteConfig.url}/#website` }, about: { "@id": `${siteConfig.url}/#organization` } },
    { "@context": "https://schema.org", "@type": "SoftwareApplication", name: BRAND_NAME, applicationCategory: "BusinessApplication", operatingSystem: "Android", description: heroDescription, offers },
    { "@context": "https://schema.org", "@type": "Service", name: `${BRAND_NAME} Android SMS gateway`, serviceType: "Android SMS gateway", description: heroDescription, provider: { "@id": `${siteConfig.url}/#organization` } },
    { "@context": "https://schema.org", "@type": "HowTo", name: `How ${BRAND_NAME} works`, step: howToSteps.map((name) => ({ "@type": "HowToStep", name })) },
  ];
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <HeroSection content={content} />
      <FeaturesSection content={content} />
      <HowItWorksSection content={content} />
      <PricingSection content={content} plans={plans} />
      <CTASection content={content} />
    </>
  );
}