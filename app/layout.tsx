import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { MAIN_CONTENT_ID, SkipLink } from "@/components/layout/skip-link";
import { MotionProvider } from "@/components/motion/motion-provider";
import { site } from "@/content/site";
import { homeOpenGraph } from "@/lib/seo";
import { siteUrl } from "@/lib/site-url";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  // Base des adresses complètes (aperçus de liens, adresse canonique) : voir lib/site-url.ts.
  metadataBase: siteUrl,
  title: {
    default: site.title,
    // Titre des autres pages, ex. « Page introuvable · Erhan Aslan ».
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.contact.linkedin }],
  creator: site.name,
  // Adresse de référence de la page d'accueil (évite les doublons pour Google).
  alternates: { canonical: "/" },
  // Aperçu quand le lien est partagé ; l'image est dessinée par app/opengraph-image.tsx.
  openGraph: homeOpenGraph,
  // X (Twitter) reprend l'image de l'aperçu Open Graph.
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
  // Pas de liens automatiques sur des numéros ou adresses (Safari iOS).
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  themeColor: "#043a2c",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body>
        <MotionProvider>
          <SkipLink />
          <SiteHeader />
          {/* Reçoit le focus via le lien d'évitement (voir components/layout/skip-link.tsx). */}
          <main id={MAIN_CONTENT_ID} className="outline-none">
            {children}
          </main>
          <SiteFooter />
        </MotionProvider>
      </body>
    </html>
  );
}
