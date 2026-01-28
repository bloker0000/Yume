import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "Yume Ramen | Authentic Japanese Ramen",
  description: "Experience the art of authentic Japanese ramen. Fresh ingredients, rich broths, and traditional recipes delivered to your door.",
  keywords: ["ramen", "japanese food", "noodles", "delivery", "restaurant"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased" suppressHydrationWarning>
        <div className="noise-overlay" />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
