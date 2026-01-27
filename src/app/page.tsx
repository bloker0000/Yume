"use client";

import { useCart } from "@/context/CartContext";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import FeaturedMenu from "@/components/FeaturedMenu";
import About from "@/components/About";
import Testimonials from "@/components/Testimonials";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";
import CartSidebar from "@/components/menu/CartSidebar";

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
