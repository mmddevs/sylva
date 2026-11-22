import type { Metadata, Viewport } from "next";
import { Geist_Mono, Hanken_Grotesk, Newsreader } from "next/font/google";
import { AppToaster } from "@/components/app-toaster";
import { ThemeColor } from "@/components/theme/theme-color";
import { PointerHalo } from "@/components/motion/pointer";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { themeScript } from "@/lib/theme-script";
import { SITE } from "@/lib/site";
import "./globals.css";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
});

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
});

// latin-ext pour le « Œ » des colonnes du footer ; pas préchargée (sous la ligne de flottaison).
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext"],
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} - Atelier de paysage`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: SITE.studio,
    title: `${SITE.name} - Atelier de paysage`,
    description: SITE.description,
    images: [{ url: SITE.ogImage.src, width: 1200, height: 630, alt: SITE.ogImage.alt }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} - Atelier de paysage`,
    description: SITE.description,
    images: [SITE.ogImage.src],
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
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
      suppressHydrationWarning
      className={`${newsreader.variable} ${hanken.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <noscript>
          <style>{`[data-shown=false],[data-shown=false] .reveal-word{opacity:1!important;transform:none!important;clip-path:none!important}`}</style>
        </noscript>
      </head>
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="fixed top-3 left-3 z-80 -translate-y-20 rounded-full bg-primary px-4 py-2.5 text-sm text-primary-foreground transition-transform duration-(--duration-ui) ease-out focus-visible:translate-y-[env(safe-area-inset-top)]"
        >
          {SITE.skipLink}
        </a>
        <SiteNav />
        {children}
        <SiteFooter />
        <div aria-hidden className="grain" />
        <PointerHalo />
        <AppToaster />
        <ThemeColor />
      </body>
    </html>
  );
}
