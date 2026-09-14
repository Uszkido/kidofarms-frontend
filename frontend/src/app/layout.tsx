import type { Metadata } from "next";
import { playfair, outfit } from "@/lib/fonts";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kido Farms Network | Farm Fresh. Delivered.",
  description: "Nigeria's most trusted digital farm marketplace. 100% organic produce from verified farmers delivered to your table. Founded 2020, Jos, Plateau State.",
  manifest: '/manifest.webmanifest',
  alternates: { canonical: 'https://kidofarms.vercel.app' },
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
};

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ReferralTracker } from "@/components/ReferralTracker";
import ThemeHub from "@/components/ThemeHub";
import { FloatingSupport } from "@/components/FloatingSupport";
import { Suspense } from "react";
import Script from "next/script";
import { ServiceWorker } from "@/components/ServiceWorker";
import { MobileBottomNav } from "@/components/MobileBottomNav";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${outfit.variable}`}>
      <head>
        <Script id="pushalert-init" strategy="afterInteractive">
          {`
            (function(d, t) {
              var g = d.createElement(t),
              s = d.getElementsByTagName(t)[0];
              g.src = "https://cdn.pushalert.co/integrate_88354.js";
              s.parentNode.insertBefore(g, s);
            }(document, "script"));
          `}
        </Script>
        <Script id="google-translate" strategy="afterInteractive">
          {`
            function googleTranslateElementInit() {
              new google.translate.TranslateElement({
                  pageLanguage: 'en',
                  includedLanguages: 'en,ha,yo,pcm',
                  autoDisplay: false
              }, 'google_translate_element');
            }
          `}
        </Script>
        <Script src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" strategy="afterInteractive" />
      </head>
      <body className="antialiased flex flex-col min-h-screen relative">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-xl focus:bg-secondary focus:px-5 focus:py-3 focus:text-sm focus:font-bold focus:text-primary">Skip to main content</a>
        <div id="google_translate_element" className="hidden opacity-0 pointer-events-none absolute -top-96"></div>
        <Providers>
          <ServiceWorker />
          <ThemeHub>
            <Suspense fallback={null}>
              <ReferralTracker />
            </Suspense>
            <main id="main-content" className="flex-grow pb-16 lg:pb-0">{children}</main>
            <FloatingSupport />
            <MobileBottomNav />
          </ThemeHub>
        </Providers>
      </body>
    </html>
  );
}
