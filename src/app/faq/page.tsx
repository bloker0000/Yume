"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CartSidebar from "@/components/menu/CartSidebar";
import { useCart } from "@/context/CartContext";
import { ChevronDown, ChevronUp, HelpCircle, ShoppingBag, Truck, CreditCard, Utensils, Clock, Phone, Mail } from "lucide-react";
import { CirclePattern } from "@/components/JapanesePatterns";

const faqCategories = [
  {
    name: "Ordering",
    icon: ShoppingBag,
    questions: [
      { q: "How do I place an order?", a: "You can order through our website by browsing the menu, customizing your items, and proceeding to checkout. We accept all major payment methods." },
      { q: "Can I customize my ramen?", a: "Yes! You can customize broth richness, noodle firmness, spice level, and add extra toppings to any ramen dish." },
      { q: "What is the minimum order amount?", a: "Our minimum order for delivery is €15. There is no minimum for pickup orders." },
      { q: "Can I schedule an order in advance?", a: "Currently, we only accept orders for immediate delivery or pickup. Pre-ordering will be available soon." }
    ]
  },
  {
    name: "Delivery",
    icon: Truck,
    questions: [
      { q: "What areas do you deliver to?", a: "We deliver throughout Rotterdam and surrounding areas within a 10km radius. Check our delivery page for specific zones." },
      { q: "How long does delivery take?", a: "Average delivery time is 30-45 minutes. During peak hours, it may take slightly longer." },
      { q: "Is there a delivery fee?", a: "Delivery fee is €2.50 for orders under €25, and free for orders over €25." },
      { q: "What if my order arrives late?", a: "Contact us immediately and we will make it right. Quality and timeliness are our priorities." }
    ]
  },
  {
    name: "Payment",
    icon: CreditCard,
    questions: [
      { q: "What payment methods do you accept?", a: "We accept iDEAL, credit cards (Visa, Mastercard, Amex), PayPal, and cash on delivery." },
      { q: "Is online payment secure?", a: "Yes, all transactions are processed through Mollie, a secure Dutch payment provider with SSL encryption." },
      { q: "Can I pay with cash?", a: "Yes, we accept cash for both delivery and pickup orders. Let us know during checkout." },
      { q: "Do you offer refunds?", a: "If you are unsatisfied with your order, contact us within 24 hours and we will offer a refund or replacement." }
    ]
  },
  {
    name: "Food & Menu",
    icon: Utensils,
    questions: [
      { q: "Do you have vegetarian/vegan options?", a: "Yes! Our Vegetable Miso Ramen is fully vegan. We can also customize many dishes for dietary needs." },
      { q: "Are your dishes gluten-free?", a: "Most ramen contains gluten in noodles and soy sauce. Ask about gluten-free modifications." },
      { q: "What allergens should I be aware of?", a: "Common allergens include soy, wheat, egg, sesame, and shellfish. See our allergen page for details." },
      { q: "How is the broth made?", a: "Our tonkotsu broth is simmered for 18+ hours with pork bones. Miso and shoyu use chicken-based stocks." }
    ]
  },
  {
    name: "Restaurant",
    icon: Clock,
    questions: [
      { q: "Do you have dine-in service?", a: "We are currently delivery and pickup only. Dine-in is coming soon!" },
      { q: "What are your operating hours?", a: "We are open daily from 11:30 AM to 10:00 PM (11:00 PM on weekends)." },
      { q: "Do you offer catering?", a: "Yes! Contact us for catering options for events and large groups." },
      { q: "Can I buy gift cards?", a: "Yes, digital gift cards are available in any amount through our website." }
    ]
  }
];

export default function FAQPage() {
  const { isCartOpen, setIsCartOpen } = useCart();
  const [openCategory, setOpenCategory] = useState<number>(0);
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-[var(--yume-warm-white)]">
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <Navigation variant="light" />

      <section className="relative pt-32 pb-20 bg-[var(--yume-charcoal)] overflow-hidden">
        <CirclePattern className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] text-[var(--yume-warm-white)] opacity-5" />
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.05 }} className="absolute top-10 right-10 text-[12rem] font-bold text-[var(--yume-warm-white)] font-japanese leading-none">質問</motion.div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-12 h-[1px] bg-[var(--yume-gold)]" />
              <span className="text-[var(--yume-gold)] font-japanese text-2xl">FAQ</span>
              <div className="w-12 h-[1px] bg-[var(--yume-gold)]" />
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-[var(--yume-warm-white)] mb-6 font-header">Frequently Asked<br /><span className="text-[var(--yume-vermillion)]">Questions</span></h1>
            <p className="text-lg text-[var(--yume-warm-white)]/80 max-w-2xl mx-auto font-body">Find answers to common questions about ordering, delivery, and our food.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-[var(--yume-warm-white)]">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {faqCategories.map((category, index) => (
              <button key={category.name} onClick={() => { setOpenCategory(index); setOpenQuestion(null); }} className={`flex items-center gap-2 px-4 py-2 transition-colors font-body ${openCategory === index ? "bg-[var(--yume-vermillion)] text-[var(--yume-warm-white)]" : "bg-[var(--yume-cream)] text-[var(--yume-charcoal)] hover:bg-[var(--yume-miso)]/20"}`}>
                <category.icon size={18} />{category.name}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {faqCategories[openCategory].questions.map((item, index) => {
              const key = `${openCategory}-${index}`;
              const isOpen = openQuestion === key;
              return (
                <motion.div key={key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="bg-[var(--yume-cream)] overflow-hidden">
                  <button onClick={() => setOpenQuestion(isOpen ? null : key)} className="w-full p-6 flex items-center justify-between text-left hover:bg-[var(--yume-miso)]/10 transition-colors">
                    <div className="flex items-center gap-4">
                      <HelpCircle size={20} className="text-[var(--yume-vermillion)] flex-shrink-0" />
                      <span className="font-bold text-[var(--yume-charcoal)] font-header">{item.q}</span>
                    </div>
                    {isOpen ? <ChevronUp size={20} className="text-[var(--yume-miso)]" /> : <ChevronDown size={20} className="text-[var(--yume-miso)]" />}
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                        <div className="px-6 pb-6 pt-4 pl-16">
                          <p className="text-[var(--yume-ink)] font-body">{item.a}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[var(--yume-charcoal)]">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl lg:text-4xl font-bold text-[var(--yume-warm-white)] mb-4 font-header">Still Have Questions?</h2>
            <p className="text-[var(--yume-warm-white)]/80 mb-8 font-body">Can&apos;t find what you&apos;re looking for? Our team is here to help.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="tel:+31201234567" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--yume-vermillion)] text-[var(--yume-warm-white)] font-medium hover:bg-[var(--yume-gold)] transition-colors font-body">
                <Phone size={18} />Call Us
              </a>
              <Link href="/contact" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-transparent border border-[var(--yume-warm-white)] text-[var(--yume-warm-white)] font-medium hover:bg-[var(--yume-warm-white)] hover:text-[var(--yume-charcoal)] transition-colors font-body">
                <Mail size={18} />Contact Form
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}