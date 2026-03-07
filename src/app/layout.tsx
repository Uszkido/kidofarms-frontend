import type { Metadata } from "next";
import { playfair, outfit } from "@/lib/fonts";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kido Farms Network | Farm Fresh. Delivered.",
  description: "Nigeria's most trusted digital farm marketplace. 100% organic produce from verified farmers delivered to your table. Founded 2020, Jos, Plateau State.",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${outfit.variable}`}>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
