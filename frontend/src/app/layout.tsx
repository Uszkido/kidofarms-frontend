import type { Metadata } from "next";
import { playfair, outfit } from "@/lib/fonts";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kido Farms Network | Farm Fresh. Delivered.",
  description: "Nigeria's most trusted digital farm marketplace. 100% organic produce from verified farmers delivered to your table. Founded 2020, Jos, Plateau State.",
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
      </head>
      <body className="antialiased flex flex-col min-h-screen relative">
        <Providers>
          <ThemeHub>
            <Suspense fallback={null}>
              <ReferralTracker />
            </Suspense>
            <main className="flex-grow">{children}</main>
            <FloatingSupport />
          </ThemeHub>
        </Providers>
      </body>
    </html>
  );
}
