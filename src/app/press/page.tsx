"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CartSidebar from "@/components/menu/CartSidebar";
import { useCart } from "@/context/CartContext";
import { Newspaper, Download, Mail, Calendar, ExternalLink, Award, Quote } from "lucide-react";
import { CirclePattern } from "@/components/JapanesePatterns";

const pressReleases = [
  { date: "January 2026", title: "Yume Ramen Expands Delivery Zone to Greater Rotterdam", description: "Now serving authentic Japanese ramen to more neighborhoods across the region." },
  { date: "November 2025", title: "Yume Ramen Wins Best Ramen 2025", description: "Voted the best ramen in Rotterdam by local food critics and customers alike." },
  { date: "August 2025", title: "New Seasonal Menu Launch", description: "Introducing limited-time summer specials featuring fresh local ingredients." },
  { date: "March 2025", title: "Yume Ramen Opens Online Ordering Platform", description: "Making it easier than ever to enjoy authentic ramen at home." }
];

const mediaFeatures = [
  { outlet: "NRC Handelsblad", quote: "The most authentic tonkotsu outside of Japan that we have tasted in the Netherlands.", date: "December 2025" },
  { outlet: "RTL Nieuws", quote: "A taste of Tokyo in the heart of Rotterdam. Yume Ramen sets a new standard.", date: "October 2025" },
  { outlet: "De Telegraaf", quote: "Worth the wait. Every bowl from Yume is a masterpiece of Japanese culinary tradition.", date: "July 2025" }
];

const awards = [
  { year: "2025", title: "Best Ramen Restaurant", organization: "Rotterdam Food Awards" },
  { year: "2025", title: "Excellence in Japanese Cuisine", organization: "Netherlands Culinary Guild" },
  { year: "2024", title: "Best New Restaurant", organization: "Rotterdam Dining Guide" },
  { year: "2024", title: "Customer Choice Award", organization: "TripAdvisor" }
];

export default function PressPage() {
  const { isCartOpen, setIsCartOpen } = useCart();

  return (
    <main className="min-h-screen bg-[var(--yume-warm-white)]">
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <Navigation variant="light" />

      <section className="relative pt-32 pb-20 bg-[var(--yume-charcoal)] overflow-hidden">
        <CirclePattern className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] text-[var(--yume-warm-white)] opacity-5" />
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.05 }} className="absolute top-10 right-10 text-[12rem] font-bold text-[var(--yume-warm-white)] font-japanese leading-none">報道</motion.div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-12 h-[1px] bg-[var(--yume-gold)]" />
              <span className="text-[var(--yume-gold)] font-japanese text-2xl">プレス</span>
              <div className="w-12 h-[1px] bg-[var(--yume-gold)]" />
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-[var(--yume-warm-white)] mb-6 font-header">Press &<br /><span className="text-[var(--yume-vermillion)]">Media</span></h1>
            <p className="text-lg text-[var(--yume-warm-white)]/80 max-w-2xl mx-auto font-body">News, awards, and media coverage about Yume Ramen.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-[var(--yume-cream)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[var(--yume-charcoal)] mb-4 font-header">Awards & Recognition</h2>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {awards.map((award, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="text-center p-6 bg-[var(--yume-warm-white)]">
                <Award size={40} className="mx-auto text-[var(--yume-gold)] mb-4" />
                <span className="text-sm text-[var(--yume-vermillion)] font-bold">{award.year}</span>
                <h3 className="text-lg font-bold text-[var(--yume-charcoal)] mt-2 mb-1 font-header">{award.title}</h3>
                <p className="text-sm text-[var(--yume-miso)] font-body">{award.organization}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[var(--yume-warm-white)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[var(--yume-charcoal)] mb-4 font-header">What They Say</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {mediaFeatures.map((feature, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="relative p-8 bg-[var(--yume-cream)]">
                <Quote size={40} className="absolute top-4 right-4 text-[var(--yume-vermillion)]/10" />
                <p className="text-[var(--yume-ink)] italic mb-6 font-body leading-relaxed">&ldquo;{feature.quote}&rdquo;</p>
                <div className="border-t border-[var(--yume-miso)]/20 pt-4">
                  <p className="font-bold text-[var(--yume-charcoal)] font-header">{feature.outlet}</p>
                  <p className="text-sm text-[var(--yume-miso)] font-body">{feature.date}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[var(--yume-cream)]">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[var(--yume-charcoal)] mb-4 font-header">Press Releases</h2>
          </motion.div>
          <div className="space-y-4">
            {pressReleases.map((release, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="p-6 bg-[var(--yume-warm-white)] flex items-start gap-4">
                <div className="w-12 h-12 bg-[var(--yume-charcoal)] flex items-center justify-center flex-shrink-0">
                  <Newspaper size={24} className="text-[var(--yume-warm-white)]" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-sm text-[var(--yume-miso)] mb-1 font-body">
                    <Calendar size={14} />{release.date}
                  </div>
                  <h3 className="text-lg font-bold text-[var(--yume-charcoal)] mb-2 font-header">{release.title}</h3>
                  <p className="text-[var(--yume-ink)] font-body">{release.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[var(--yume-charcoal)]">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl lg:text-4xl font-bold text-[var(--yume-warm-white)] mb-4 font-header">Media Inquiries</h2>
              <p className="text-[var(--yume-warm-white)]/80 mb-6 font-body">For press inquiries, interviews, or media requests, please contact our press team.</p>
              <a href="mailto:press@yumeramen.nl" className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--yume-vermillion)] text-[var(--yume-warm-white)] font-medium hover:bg-[var(--yume-gold)] transition-colors font-body">
                <Mail size={18} />press@yumeramen.nl
              </a>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="text-center p-8 bg-[var(--yume-ink)]">
              <Download size={40} className="mx-auto text-[var(--yume-gold)] mb-4" />
              <h3 className="text-xl font-bold text-[var(--yume-warm-white)] mb-2 font-header">Press Kit</h3>
              <p className="text-sm text-[var(--yume-warm-white)]/70 mb-4 font-body">Download logos, photos, and brand guidelines.</p>
              <a href="/press-kit.zip" className="inline-flex items-center gap-2 text-[var(--yume-vermillion)] hover:text-[var(--yume-gold)] font-body">
                <Download size={16} />Download Press Kit
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}