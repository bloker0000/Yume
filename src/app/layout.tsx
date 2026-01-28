import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";

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
    <html lang="en">
      <body className="antialiased" suppressHydrationWarning>
        <CartProvider>
          <div className="noise-overlay" />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
