"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CartSidebar from "@/components/menu/CartSidebar";
import { useCart } from "@/context/CartContext";
import { 
  Briefcase, 
  Heart, 
  Users, 
  Clock, 
  MapPin,
  ChefHat,
  Utensils,
  Truck,
  Headphones,
  ChevronDown,
  ChevronUp,
  Send,
  Star,
  Coffee,
  Gift,
  TrendingUp
} from "lucide-react";
import { CirclePattern } from "@/components/JapanesePatterns";

const benefits = [
  { icon: Coffee, title: "Free Ramen", description: "Unlimited ramen during shifts and family discounts" },
  { icon: TrendingUp, title: "Growth Path", description: "Clear career progression from trainee to management" },
  { icon: Clock, title: "Flexible Hours", description: "Work schedules that respect your life outside work" },
  { icon: Gift, title: "Team Events", description: "Monthly team dinners and annual trips to Japan" },
  { icon: Heart, title: "Health Benefits", description: "Comprehensive health insurance for full-time staff" },
  { icon: Users, title: "Great Team", description: "Join a passionate, supportive family of ramen lovers" }
];

const openPositions = [
  {
    id: 1, title: "Ramen Chef", japanese: "ラーメン職人", type: "Full-time", location: "Rotterdam",
    description: "Join our kitchen team and master the art of authentic Japanese ramen.",
    requirements: ["2+ years kitchen experience", "Passion for Japanese food", "Team player", "Available evenings/weekends"],
    icon: ChefHat
  },
  {
    id: 2, title: "Kitchen Assistant", japanese: "調理補助", type: "Part-time / Full-time", location: "Rotterdam",
    description: "Support our kitchen with prep work and maintain our high quality standards.",
    requirements: ["Food handling certification", "Basic cooking skills", "Attention to detail", "Flexible schedule"],
    icon: Utensils
  },
  {
    id: 3, title: "Delivery Driver", japanese: "配達員", type: "Part-time", location: "Rotterdam Area",
    description: "Deliver hot, fresh ramen to customers with care and punctuality.",
    requirements: ["Valid driver's license", "Own reliable vehicle", "Smartphone", "Knowledge of Rotterdam area"],
    icon: Truck
  },
  {
    id: 4, title: "Customer Service", japanese: "カスタマーサービス", type: "Part-time", location: "Remote / Rotterdam",
    description: "Help customers with orders and ensure every interaction reflects Yume hospitality.",
    requirements: ["Dutch and English fluency", "Customer service experience", "Problem-solving mindset"],
    icon: Headphones
  }
];

const values = [
  { japanese: "情熱", english: "Passion", description: "We pour our heart into every bowl" },
  { japanese: "誠実", english: "Integrity", description: "Honest ingredients, honest work" },
  { japanese: "成長", english: "Growth", description: "Always learning, always improving" },
  { japanese: "家族", english: "Family", description: "We take care of each other" }
];

export default function CareersPage() {
  const { isCartOpen, setIsCartOpen } = useCart();
  const [expandedJob, setExpandedJob] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-[var(--yume-warm-white)]">
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <Navigation variant="light" />

      <section className="relative pt-32 pb-20 bg-[var(--yume-charcoal)] overflow-hidden">
        <CirclePattern className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] text-[var(--yume-warm-white)] opacity-5" />
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.05 }} className="absolute top-10 right-10 text-[12rem] font-bold text-[var(--yume-warm-white)] font-japanese leading-none">仕事</motion.div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-12 h-[1px] bg-[var(--yume-gold)]" />
              <span className="text-[var(--yume-gold)] font-japanese text-2xl">採用</span>
              <div className="w-12 h-[1px] bg-[var(--yume-gold)]" />
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-[var(--yume-warm-white)] mb-6 font-header">Join Our<br /><span className="text-[var(--yume-vermillion)]">Ramen Family</span></h1>
            <p className="text-lg text-[var(--yume-warm-white)]/80 max-w-2xl mx-auto font-body">Build your career with passion. We seek dedicated individuals who share our love for authentic Japanese ramen.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-[var(--yume-cream)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[var(--yume-charcoal)] mb-4 font-header">Our Values</h2>
          </motion.div>
          <div className="grid md:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div key={value.english} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="text-center p-8 bg-[var(--yume-warm-white)]">
                <span className="text-4xl font-japanese text-[var(--yume-vermillion)] mb-4 block">{value.japanese}</span>
                <h3 className="text-xl font-bold text-[var(--yume-charcoal)] mb-2 font-header">{value.english}</h3>
                <p className="text-sm text-[var(--yume-miso)] font-body">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[var(--yume-warm-white)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[var(--yume-charcoal)] mb-4 font-header">Why Work With Us?</h2>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div key={benefit.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="flex items-start gap-4 p-6 bg-[var(--yume-cream)]">
                <div className="w-12 h-12 bg-[var(--yume-vermillion)] flex items-center justify-center flex-shrink-0">
                  <benefit.icon size={24} className="text-[var(--yume-warm-white)]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[var(--yume-charcoal)] mb-1 font-header">{benefit.title}</h3>
                  <p className="text-sm text-[var(--yume-miso)] font-body">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[var(--yume-cream)]">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[var(--yume-charcoal)] mb-4 font-header">Open Positions</h2>
          </motion.div>
          <div className="space-y-4">
            {openPositions.map((job, index) => (
              <motion.div key={job.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="bg-[var(--yume-warm-white)] border border-[var(--yume-cream)] overflow-hidden">
                <button onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)} className="w-full p-6 flex items-center justify-between text-left hover:bg-[var(--yume-cream)]/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[var(--yume-charcoal)] flex items-center justify-center">
                      <job.icon size={24} className="text-[var(--yume-warm-white)]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-bold text-[var(--yume-charcoal)] font-header">{job.title}</h3>
                        <span className="text-sm text-[var(--yume-gold)] font-japanese">{job.japanese}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-[var(--yume-miso)] font-body mt-1">
                        <span className="flex items-center gap-1"><Briefcase size={14} />{job.type}</span>
                        <span className="flex items-center gap-1"><MapPin size={14} />{job.location}</span>
                      </div>
                    </div>
                  </div>
                  {expandedJob === job.id ? <ChevronUp size={20} className="text-[var(--yume-miso)]" /> : <ChevronDown size={20} className="text-[var(--yume-miso)]" />}
                </button>
                <AnimatePresence>
                  {expandedJob === job.id && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                      <div className="p-6 pt-6 border-t border-[var(--yume-cream)]">
                        <p className="text-[var(--yume-ink)] mb-6 font-body">{job.description}</p>
                        <h4 className="text-sm font-bold text-[var(--yume-charcoal)] mb-3 font-header">Requirements:</h4>
                        <ul className="space-y-2 mb-6">
                          {job.requirements.map((req, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-[var(--yume-miso)] font-body">
                              <Star size={14} className="text-[var(--yume-vermillion)] mt-0.5 flex-shrink-0" />{req}
                            </li>
                          ))}
                        </ul>
                        <a href={`mailto:careers@yumeramen.nl?subject=Application: ${job.title}`} className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--yume-vermillion)] text-[var(--yume-warm-white)] font-medium hover:bg-[var(--yume-charcoal)] transition-colors font-body">
                          <Send size={18} />Apply Now
                        </a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[var(--yume-charcoal)]">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl lg:text-4xl font-bold text-[var(--yume-warm-white)] mb-4 font-header">Don&apos;t See Your Role?</h2>
            <p className="text-[var(--yume-warm-white)]/80 mb-8 font-body">We&apos;re always looking for talented people. Send us your CV!</p>
            <a href="mailto:careers@yumeramen.nl?subject=General Application" className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--yume-vermillion)] text-[var(--yume-warm-white)] font-medium hover:bg-[var(--yume-gold)] transition-colors font-body">
              <Send size={18} />Send Your CV
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}