import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { siteConfig } from "@/config/site";
import { fetchContent } from "@/lib/server/content";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const content = await fetchContent();
  const title = content.hero.hero_title?.title || "Your Personal SMS Gateway";
  const description = content.hero.hero_subtitle?.body || "Turn your Android phone into a personal SMS gateway.";
  return {
    metadataBase: new URL(siteConfig.url),
    title: { default: `${title} | MessagesLab`, template: "%s | MessagesLab" },
    description,
    alternates: { canonical: siteConfig.url },
    icons: {
      icon: [
        { url: "/branding/MessageLab-favicon-32.png", type: "image/png", sizes: "32x32" },
        { url: "/branding/MessageLab-favicon.png", type: "image/png", sizes: "64x64" },
      ],
      shortcut: [{ url: "/branding/MessageLab-favicon-32.png", type: "image/png", sizes: "32x32" }],
      apple: [{ url: "/branding/MessageLab-apple-touch-icon.png", type: "image/png", sizes: "180x180" }],
    },
    openGraph: { type: "website", locale: "en_US", siteName: "MessagesLab", title, description, url: siteConfig.url, images: [{ url: "/branding/MessageLab-logo.png", width: 768, height: 768, alt: "MessagesLab official logo" }] },
    twitter: { card: "summary_large_image", title, description, images: ["/branding/MessageLab-logo.png"] },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        {children}
        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            style: {
              borderRadius: "12px",
            },
          }}
        />
      </body>
    </html>
  );
}