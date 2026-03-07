import type { Metadata } from "next";
import { playfair, outfit } from "@/lib/fonts";
import { CartProvider } from "@/context/CartContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kido Farms & Orchard | Fresh From Our Farms to Your Table",
  description: "Experience the finest artisanal produce, grains, and catfish at Kido Farms. Sustainable, organic, and locally grown.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${outfit.variable}`}>
      <body className="antialiased">
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
