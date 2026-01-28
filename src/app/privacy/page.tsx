"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CartSidebar from "@/components/menu/CartSidebar";
import { useCart } from "@/context/CartContext";
import { Shield, Mail, Cookie, Database, Lock, Eye, Trash2, UserCheck } from "lucide-react";
import { CirclePattern } from "@/components/JapanesePatterns";

const sections = [
  {
    icon: Database,
    title: "1. Information We Collect",
    content: `We collect information you provide directly to us when you:
- Create an account or place an order
- Subscribe to our newsletter
- Contact us for support
- Participate in surveys or promotions

This may include: name, email address, phone number, delivery address, payment information, and order history.

We also automatically collect certain information when you visit our website, including IP address, browser type, device information, and browsing behavior through cookies and similar technologies.`
  },
  {
    icon: Eye,
    title: "2. How We Use Your Information",
    content: `We use your personal information to:
- Process and deliver your orders
- Send order confirmations and updates
- Respond to your inquiries and provide customer support
- Send promotional communications (with your consent)
- Improve our services and website experience
- Prevent fraud and ensure security
- Comply with legal obligations

We will never sell your personal information to third parties.`
  },
  {
    icon: UserCheck,
    title: "3. Information Sharing",
    content: `We may share your information with:
- Delivery partners to fulfill your orders
- Payment processors to handle transactions
- Service providers who assist our operations
- Legal authorities when required by law

All third parties are bound by confidentiality agreements and may only use your information for the specific purposes we authorize.`
  },
  {
    icon: Cookie,
    title: "4. Cookies & Tracking",
    content: `We use cookies and similar technologies to:
- Remember your preferences and cart contents
- Analyze website traffic and usage patterns
- Personalize your experience
- Enable certain website functionality

You can control cookies through your browser settings. Note that disabling cookies may affect website functionality.

We use Google Analytics for website analytics. You can opt out using Google's browser add-on.`
  },
  {
    icon: Lock,
    title: "5. Data Security",
    content: `We implement appropriate technical and organizational measures to protect your personal information, including:
- SSL encryption for all data transmission
- Secure payment processing through certified providers
- Regular security audits and updates
- Limited access to personal data on a need-to-know basis

While we strive to protect your information, no method of transmission over the internet is 100% secure.`
  },
  {
    icon: Shield,
    title: "6. Your Rights (GDPR)",
    content: `Under the General Data Protection Regulation (GDPR), you have the right to:
- Access your personal data
- Correct inaccurate data
- Request deletion of your data
- Restrict or object to processing
- Data portability
- Withdraw consent at any time

To exercise these rights, contact us at privacy@yuumee.nl. We will respond within 30 days.`
  },
  {
    icon: Trash2,
    title: "7. Data Retention",
    content: `We retain your personal information for as long as necessary to:
- Provide our services to you
- Comply with legal obligations
- Resolve disputes and enforce agreements

Order history is retained for 7 years for tax and legal purposes. You may request deletion of your account at any time, and we will delete data not required for legal compliance.`
  }
];

const dataRights = [
  { right: "Access", description: "Request a copy of your personal data" },
  { right: "Rectification", description: "Correct any inaccurate information" },
  { right: "Erasure", description: "Request deletion of your data" },
  { right: "Portability", description: "Receive your data in a portable format" },
  { right: "Objection", description: "Object to certain processing activities" },
  { right: "Restriction", description: "Limit how we use your data" }
];

export default function PrivacyPage() {
  const { isCartOpen, setIsCartOpen } = useCart();

  return (
    <main className="min-h-screen bg-[var(--yume-warm-white)]">
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <Navigation variant="light" />

      <section className="relative pt-32 pb-20 bg-[var(--yume-charcoal)] overflow-hidden">
        <CirclePattern className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] text-[var(--yume-warm-white)] opacity-5" />
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.05 }} className="absolute top-10 right-10 text-[12rem] font-bold text-[var(--yume-warm-white)] font-japanese leading-none">私的</motion.div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-12 h-[1px] bg-[var(--yume-gold)]" />
              <span className="text-[var(--yume-gold)] font-japanese text-2xl">プライバシー</span>
              <div className="w-12 h-[1px] bg-[var(--yume-gold)]" />
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-[var(--yume-warm-white)] mb-6 font-header">Privacy<br /><span className="text-[var(--yume-vermillion)]">Policy</span></h1>
            <p className="text-lg text-[var(--yume-warm-white)]/80 max-w-2xl mx-auto font-body">Last updated: January 2026</p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-[var(--yume-vermillion)]">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="flex items-center gap-4 text-[var(--yume-warm-white)]">
            <Shield size={32} />
            <p className="font-body">Your privacy matters to us. This policy explains how Yume Ramen B.V. collects, uses, and protects your personal information in compliance with GDPR.</p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[var(--yume-warm-white)]">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="space-y-12">
            {sections.map((section, index) => (
              <motion.div key={section.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }} className="flex gap-6">
                <div className="w-12 h-12 bg-[var(--yume-cream)] flex items-center justify-center flex-shrink-0">
                  <section.icon size={24} className="text-[var(--yume-vermillion)]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[var(--yume-charcoal)] mb-4 font-header">{section.title}</h2>
                  <div className="text-[var(--yume-ink)] font-body whitespace-pre-line leading-relaxed">{section.content}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[var(--yume-cream)]">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--yume-charcoal)] mb-4 font-header">Your Data Rights</h2>
            <p className="text-[var(--yume-miso)] font-body">Under GDPR, you have the following rights:</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dataRights.map((item, index) => (
              <motion.div key={item.right} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="p-4 bg-[var(--yume-warm-white)]">
                <h3 className="font-bold text-[var(--yume-charcoal)] mb-1 font-header">{item.right}</h3>
                <p className="text-sm text-[var(--yume-miso)] font-body">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[var(--yume-charcoal)]">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Mail size={48} className="mx-auto text-[var(--yume-gold)] mb-6" />
            <h2 className="text-3xl lg:text-4xl font-bold text-[var(--yume-warm-white)] mb-4 font-header">Privacy Questions?</h2>
            <p className="text-[var(--yume-warm-white)]/80 mb-4 font-body">For privacy-related inquiries or to exercise your data rights:</p>
            <div className="text-[var(--yume-warm-white)] mb-8 font-body">
              <p>Data Protection Officer</p>
              <p>Yume Ramen B.V.</p>
              <a href="mailto:privacy@yuumee.nl" className="text-[var(--yume-vermillion)] hover:text-[var(--yume-gold)]">privacy@yuumee.nl</a>
            </div>
            <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--yume-vermillion)] text-[var(--yume-warm-white)] font-medium hover:bg-[var(--yume-gold)] transition-colors font-body">
              <Mail size={18} />Contact Us
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}