"use client";

import dynamic from "next/dynamic";
import { useCart } from "@/context/CartContext";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import FeaturedMenu from "@/components/FeaturedMenu";

const About = dynamic(() => import("@/components/About"), {
  loading: () => <div className="min-h-[600px] bg-[var(--yume-charcoal)]" />,
});

const Testimonials = dynamic(() => import("@/components/Testimonials"), {
  loading: () => <div className="min-h-[600px] bg-[var(--yume-cream)]" />,
});

const CallToAction = dynamic(() => import("@/components/CallToAction"), {
  loading: () => <div className="min-h-[400px] bg-[var(--yume-vermillion)]" />,
});

const Footer = dynamic(() => import("@/components/Footer"), {
  loading: () => <div className="min-h-[300px] bg-[var(--yume-cream)]" />,
});

const CartSidebar = dynamic(() => import("@/components/menu/CartSidebar"), {
  ssr: false,
});

export default function Home() {
  const { isCartOpen, setIsCartOpen } = useCart();
  
  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <FeaturedMenu />
      <About />
      <Testimonials />
      <CallToAction />
      <Footer />
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </main>
  );
}
