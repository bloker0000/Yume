"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CartSidebar from "@/components/menu/CartSidebar";
import { useCart } from "@/context/CartContext";
import { FileText, Mail } from "lucide-react";
import { CirclePattern } from "@/components/JapanesePatterns";

const sections = [
  {
    title: "1. Acceptance of Terms",
    content: `By accessing or using the Yume Ramen website and services, you agree to be bound by these Terms & Conditions. If you do not agree to these terms, please do not use our services.

These terms apply to all visitors, users, and customers of Yume Ramen. We reserve the right to update these terms at any time, and your continued use of our services constitutes acceptance of any changes.`
  },
  {
    title: "2. Ordering & Payment",
    content: `All orders placed through our website are subject to acceptance and availability. Prices are displayed in Euros and include VAT where applicable.

Payment must be made at the time of ordering through our accepted payment methods: iDEAL, credit cards (Visa, Mastercard, American Express), PayPal, or cash on delivery where available.

We reserve the right to refuse or cancel any order for reasons including but not limited to: product availability, errors in pricing or product information, or suspected fraudulent activity.`
  },
  {
    title: "3. Delivery Terms",
    content: `Delivery times are estimates and may vary depending on order volume, weather conditions, and traffic. We strive to deliver within the estimated timeframe but cannot guarantee exact delivery times.

You are responsible for providing accurate delivery information. We are not liable for delays or failed deliveries due to incorrect addresses or unavailability at the delivery location.

Delivery fees vary by zone and order value. Free delivery may be offered for orders meeting minimum value requirements as displayed at checkout.`
  },
  {
    title: "4. Cancellations & Refunds",
    content: `Orders may be cancelled within 5 minutes of placement by contacting us immediately. Once food preparation has begun, orders cannot be cancelled.

If you receive an incorrect or unsatisfactory order, please contact us within 24 hours. We will offer a replacement or refund at our discretion.

Refunds will be processed to the original payment method within 5-10 business days.`
  },
  {
    title: "5. Food Safety & Allergens",
    content: `We take food safety seriously and follow all applicable Dutch food safety regulations. Our kitchen handles common allergens including gluten, soy, eggs, sesame, fish, and shellfish.

While we take precautions, we cannot guarantee that our food is free from allergens due to shared preparation areas. Customers with severe allergies should contact us before ordering.

Nutritional information is provided as a guide and may vary slightly from actual values.`
  },
  {
    title: "6. Intellectual Property",
    content: `All content on the Yume Ramen website, including text, graphics, logos, images, and software, is the property of Yume Ramen and protected by Dutch and international copyright laws.

You may not reproduce, distribute, modify, or create derivative works from our content without written permission.`
  },
  {
    title: "7. Limitation of Liability",
    content: `Yume Ramen shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our services.

Our total liability for any claim shall not exceed the amount paid by you for the specific order giving rise to the claim.

We are not responsible for any loss or damage resulting from circumstances beyond our reasonable control.`
  },
  {
    title: "8. Privacy",
    content: `Your privacy is important to us. Please review our Privacy Policy, which explains how we collect, use, and protect your personal information.

By using our services, you consent to the collection and use of your information as described in our Privacy Policy.`
  },
  {
    title: "9. Governing Law",
    content: `These Terms & Conditions are governed by the laws of the Netherlands. Any disputes shall be resolved in the courts of Rotterdam, Netherlands.

If any provision of these terms is found to be unenforceable, the remaining provisions shall continue in full force and effect.`
  },
  {
    title: "10. Contact Information",
    content: `For questions about these Terms & Conditions, please contact us:

Yume Ramen B.V.
Westerstraat 187
1015 MA Rotterdam
Netherlands

Email: legal@yumeramen.nl
Phone: +31 20 123 4567`
  }
];

export default function TermsPage() {
  const { isCartOpen, setIsCartOpen } = useCart();

  return (
    <main className="min-h-screen bg-[var(--yume-warm-white)]">
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <Navigation variant="light" />

      <section className="relative pt-32 pb-20 bg-[var(--yume-charcoal)] overflow-hidden">
        <CirclePattern className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] text-[var(--yume-warm-white)] opacity-5" />
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.05 }} className="absolute top-10 right-10 text-[12rem] font-bold text-[var(--yume-warm-white)] font-japanese leading-none">規約</motion.div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-12 h-[1px] bg-[var(--yume-gold)]" />
              <span className="text-[var(--yume-gold)] font-japanese text-2xl">利用規約</span>
              <div className="w-12 h-[1px] bg-[var(--yume-gold)]" />
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-[var(--yume-warm-white)] mb-6 font-header">Terms &<br /><span className="text-[var(--yume-vermillion)]">Conditions</span></h1>
            <p className="text-lg text-[var(--yume-warm-white)]/80 max-w-2xl mx-auto font-body">Last updated: January 2026</p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-[var(--yume-warm-white)]">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="space-y-12">
            {sections.map((section, index) => (
              <motion.div key={section.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }}>
                <h2 className="text-xl font-bold text-[var(--yume-charcoal)] mb-4 font-header">{section.title}</h2>
                <div className="text-[var(--yume-ink)] font-body whitespace-pre-line leading-relaxed">{section.content}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-[var(--yume-cream)]">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <FileText size={32} className="text-[var(--yume-vermillion)]" />
              <div>
                <p className="font-bold text-[var(--yume-charcoal)] font-header">Questions about our terms?</p>
                <p className="text-sm text-[var(--yume-miso)] font-body">We are happy to clarify any points.</p>
              </div>
            </div>
            <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--yume-charcoal)] text-[var(--yume-warm-white)] font-medium hover:bg-[var(--yume-vermillion)] transition-colors font-body">
              <Mail size={18} />Contact Us
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}