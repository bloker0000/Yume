import type { Metadata, Viewport } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-quicksand",
});

export const metadata: Metadata = {
  title: "Yume Ramen | Authentic Japanese Ramen",
  description: "Experience the art of authentic Japanese ramen. Fresh ingredients, rich broths, and traditional recipes delivered to your door.",
  keywords: ["ramen", "japanese food", "noodles", "delivery", "restaurant"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={quicksand.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preload" as="image" href="/items/Tonkotsu.jpg" />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <CartProvider>
          <div className="noise-overlay" />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
