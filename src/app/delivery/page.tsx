"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CartSidebar from "@/components/menu/CartSidebar";
import { useCart } from "@/context/CartContext";
import { Truck, Clock, MapPin, Euro, Package, ThermometerSun, ShoppingBag, CheckCircle, AlertCircle } from "lucide-react";
import { CirclePattern } from "@/components/JapanesePatterns";

const deliveryZones = [
  { zone: "Zone A (0-3km)", areas: "Rotterdam Centrum, Kralingen, Delfshaven", time: "20-30 min", fee: "Free (orders €25+)" },
  { zone: "Zone B (3-6km)", areas: "Hillegersberg, Charlois, Feijenoord", time: "30-40 min", fee: "€2.50" },
  { zone: "Zone C (6-10km)", areas: "Capelle, Schiedam, Barendrecht", time: "40-50 min", fee: "€4.50" }
];

const deliveryInfo = [
  { icon: Clock, title: "Operating Hours", description: "Daily 11:30 - 22:00 (23:00 Fri-Sat)" },
  { icon: Euro, title: "Minimum Order", description: "€15 for delivery, no minimum for pickup" },
  { icon: Package, title: "Packaging", description: "Eco-friendly containers that keep your ramen hot" },
  { icon: ThermometerSun, title: "Temperature", description: "Broth and noodles packed separately for perfect texture" }
];

const orderSteps = [
  { step: 1, title: "Browse Menu", description: "Choose from our selection of authentic ramen and sides" },
  { step: 2, title: "Customize", description: "Adjust broth, noodles, spice level and add toppings" },
  { step: 3, title: "Checkout", description: "Enter delivery details and pay securely" },
  { step: 4, title: "Track & Enjoy", description: "Follow your order and enjoy fresh ramen at home" }
];

const packagingTips = [
  "Broth and noodles are packed separately - combine just before eating",
  "Toppings are arranged in separate compartments to stay fresh",
  "Microwave safe if you need to reheat (remove lid first)",
  "Best enjoyed within 30 minutes of delivery for optimal taste"
];

export default function DeliveryPage() {
  const { isCartOpen, setIsCartOpen } = useCart();

  return (
    <main className="min-h-screen bg-[var(--yume-warm-white)]">
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <Navigation variant="light" />

      <section className="relative pt-32 pb-20 bg-[var(--yume-charcoal)] overflow-hidden">
        <CirclePattern className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] text-[var(--yume-warm-white)] opacity-5" />
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.05 }} className="absolute top-10 right-10 text-[12rem] font-bold text-[var(--yume-warm-white)] font-japanese leading-none">配達</motion.div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-12 h-[1px] bg-[var(--yume-gold)]" />
              <span className="text-[var(--yume-gold)] font-japanese text-2xl">配送</span>
              <div className="w-12 h-[1px] bg-[var(--yume-gold)]" />
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-[var(--yume-warm-white)] mb-6 font-header">Delivery<br /><span className="text-[var(--yume-vermillion)]">Information</span></h1>
            <p className="text-lg text-[var(--yume-warm-white)]/80 max-w-2xl mx-auto font-body">Hot, fresh ramen delivered to your door. Here&apos;s everything you need to know.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-[var(--yume-cream)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[var(--yume-charcoal)] mb-4 font-header">Delivery Basics</h2>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {deliveryInfo.map((info, index) => (
              <motion.div key={info.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="text-center p-6 bg-[var(--yume-warm-white)]">
                <div className="w-14 h-14 bg-[var(--yume-vermillion)] flex items-center justify-center mx-auto mb-4">
                  <info.icon size={28} className="text-[var(--yume-warm-white)]" />
                </div>
                <h3 className="text-lg font-bold text-[var(--yume-charcoal)] mb-2 font-header">{info.title}</h3>
                <p className="text-sm text-[var(--yume-miso)] font-body">{info.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[var(--yume-warm-white)]">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[var(--yume-charcoal)] mb-4 font-header">Delivery Zones & Fees</h2>
          </motion.div>
          <div className="space-y-4">
            {deliveryZones.map((zone, index) => (
              <motion.div key={zone.zone} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="p-6 bg-[var(--yume-cream)] flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[var(--yume-charcoal)] flex items-center justify-center flex-shrink-0">
                    <MapPin size={20} className="text-[var(--yume-warm-white)]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[var(--yume-charcoal)] font-header">{zone.zone}</h3>
                    <p className="text-sm text-[var(--yume-miso)] font-body">{zone.areas}</p>
                  </div>
                </div>
                <div className="flex items-center gap-8 md:text-right">
                  <div>
                    <p className="text-sm text-[var(--yume-miso)] font-body">Est. Time</p>
                    <p className="font-bold text-[var(--yume-charcoal)]">{zone.time}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[var(--yume-miso)] font-body">Delivery Fee</p>
                    <p className="font-bold text-[var(--yume-vermillion)]">{zone.fee}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center text-sm text-[var(--yume-miso)] mt-6 font-body">
            <AlertCircle size={14} className="inline mr-1" />Not in our delivery area? Try pickup or check back soon as we expand!
          </motion.p>
        </div>
      </section>

      <section className="py-20 bg-[var(--yume-cream)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[var(--yume-charcoal)] mb-4 font-header">How It Works</h2>
          </motion.div>
          <div className="grid md:grid-cols-4 gap-8">
            {orderSteps.map((item, index) => (
              <motion.div key={item.step} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="text-center">
                <div className="w-16 h-16 bg-[var(--yume-vermillion)] flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-[var(--yume-warm-white)] font-header">{item.step}</div>
                <h3 className="text-lg font-bold text-[var(--yume-charcoal)] mb-2 font-header">{item.title}</h3>
                <p className="text-sm text-[var(--yume-miso)] font-body">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[var(--yume-warm-white)]">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[var(--yume-charcoal)] mb-4 font-header">Packaging Tips</h2>
            <p className="text-[var(--yume-miso)] font-body">Get the best experience from your delivered ramen</p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-4">
            {packagingTips.map((tip, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="flex items-start gap-3 p-4 bg-[var(--yume-cream)]">
                <CheckCircle size={20} className="text-[var(--yume-vermillion)] flex-shrink-0 mt-0.5" />
                <p className="text-[var(--yume-ink)] font-body">{tip}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[var(--yume-charcoal)]">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl lg:text-4xl font-bold text-[var(--yume-warm-white)] mb-4 font-header">Ready to Order?</h2>
            <p className="text-[var(--yume-warm-white)]/80 mb-8 font-body">Fresh, authentic ramen is just a few clicks away.</p>
            <Link href="/menu" className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--yume-vermillion)] text-[var(--yume-warm-white)] font-medium hover:bg-[var(--yume-gold)] transition-colors font-body">
              <ShoppingBag size={18} />Order Now
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}