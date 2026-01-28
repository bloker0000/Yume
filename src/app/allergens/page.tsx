"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CartSidebar from "@/components/menu/CartSidebar";
import { useCart } from "@/context/CartContext";
import { AlertTriangle, Check, X, Info, Phone, Mail, Wheat, Egg, Fish, Milk, TreeDeciduous } from "lucide-react";
import { CirclePattern } from "@/components/JapanesePatterns";

const allergens = [
  { name: "Gluten", icon: Wheat, description: "Found in noodles, soy sauce, miso paste", common: true },
  { name: "Soy", icon: TreeDeciduous, description: "Present in soy sauce, miso, tofu", common: true },
  { name: "Egg", icon: Egg, description: "Soft-boiled eggs, some noodles", common: true },
  { name: "Sesame", icon: TreeDeciduous, description: "Sesame oil, seeds, tahini in tantanmen", common: true },
  { name: "Fish/Shellfish", icon: Fish, description: "Dashi, fish cakes, some broths", common: false },
  { name: "Milk", icon: Milk, description: "Butter in some recipes, creamy broths", common: false }
];

const menuAllergens = [
  { item: "Tonkotsu Ramen", allergens: ["Gluten", "Soy", "Egg", "Sesame"] },
  { item: "Spicy Miso Ramen", allergens: ["Gluten", "Soy", "Egg", "Sesame"] },
  { item: "Shoyu Ramen", allergens: ["Gluten", "Soy", "Egg"] },
  { item: "Tantanmen", allergens: ["Gluten", "Soy", "Sesame", "Egg"] },
  { item: "Vegetable Miso Ramen", allergens: ["Gluten", "Soy", "Sesame"] },
  { item: "Gyoza", allergens: ["Gluten", "Soy", "Sesame"] },
  { item: "Edamame", allergens: ["Soy"] },
  { item: "Karaage", allergens: ["Gluten", "Soy", "Egg"] }
];

const modifications = [
  { request: "Gluten-free", possible: false, notes: "Noodles and soy sauce contain gluten. We can offer rice as a substitute for noodles." },
  { request: "Egg-free", possible: true, notes: "All eggs can be removed from any dish." },
  { request: "Dairy-free", possible: true, notes: "Butter can be omitted. Inform us of any dairy allergies." },
  { request: "Sesame-free", possible: true, notes: "Sesame oil and seeds can be removed from most dishes." },
  { request: "Vegetarian", possible: true, notes: "Vegetable Miso Ramen and several sides available." },
  { request: "Vegan", possible: true, notes: "Vegetable Miso Ramen is fully vegan. Remove egg from other options." }
];

export default function AllergensPage() {
  const { isCartOpen, setIsCartOpen } = useCart();

  return (
    <main className="min-h-screen bg-[var(--yume-warm-white)]">
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <Navigation variant="light" />

      <section className="relative pt-32 pb-20 bg-[var(--yume-charcoal)] overflow-hidden">
        <CirclePattern className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] text-[var(--yume-warm-white)] opacity-5" />
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.05 }} className="absolute top-10 right-10 text-[12rem] font-bold text-[var(--yume-warm-white)] font-japanese leading-none">安全</motion.div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-12 h-[1px] bg-[var(--yume-gold)]" />
              <span className="text-[var(--yume-gold)] font-japanese text-2xl">アレルギー</span>
              <div className="w-12 h-[1px] bg-[var(--yume-gold)]" />
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-[var(--yume-warm-white)] mb-6 font-header">Allergen<br /><span className="text-[var(--yume-vermillion)]">Information</span></h1>
            <p className="text-lg text-[var(--yume-warm-white)]/80 max-w-2xl mx-auto font-body">Your safety is our priority. Here&apos;s everything you need to know about allergens in our food.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-[var(--yume-vermillion)]">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="flex items-center gap-4 text-[var(--yume-warm-white)]">
            <AlertTriangle size={32} />
            <p className="font-body"><strong>Important:</strong> Our kitchen handles all major allergens. Cross-contamination is possible. Always inform us of severe allergies before ordering.</p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[var(--yume-cream)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[var(--yume-charcoal)] mb-4 font-header">Common Allergens</h2>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allergens.map((allergen, index) => (
              <motion.div key={allergen.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="p-6 bg-[var(--yume-warm-white)] flex items-start gap-4">
                <div className={`w-12 h-12 flex items-center justify-center flex-shrink-0 ${allergen.common ? "bg-[var(--yume-vermillion)]" : "bg-[var(--yume-miso)]"}`}>
                  <allergen.icon size={24} className="text-[var(--yume-warm-white)]" />
                </div>
                <div>
                  <h3 className="font-bold text-[var(--yume-charcoal)] font-header">{allergen.name}</h3>
                  <p className="text-sm text-[var(--yume-miso)] font-body">{allergen.description}</p>
                  {allergen.common && <span className="inline-block mt-2 text-xs px-2 py-1 bg-[var(--yume-vermillion)]/10 text-[var(--yume-vermillion)] font-body">Common in our menu</span>}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[var(--yume-warm-white)]">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[var(--yume-charcoal)] mb-4 font-header">Menu Items & Allergens</h2>
          </motion.div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-[var(--yume-charcoal)]">
                  <th className="text-left py-4 font-header text-[var(--yume-charcoal)]">Item</th>
                  <th className="text-left py-4 font-header text-[var(--yume-charcoal)]">Contains</th>
                </tr>
              </thead>
              <tbody>
                {menuAllergens.map((item, index) => (
                  <motion.tr key={item.item} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }} className="border-b border-[var(--yume-cream)]">
                    <td className="py-4 font-medium text-[var(--yume-charcoal)] font-body">{item.item}</td>
                    <td className="py-4">
                      <div className="flex flex-wrap gap-2">
                        {item.allergens.map((a) => (
                          <span key={a} className="text-xs px-2 py-1 bg-[var(--yume-cream)] text-[var(--yume-ink)] font-body">{a}</span>
                        ))}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[var(--yume-cream)]">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[var(--yume-charcoal)] mb-4 font-header">Dietary Modifications</h2>
          </motion.div>
          <div className="space-y-4">
            {modifications.map((mod, index) => (
              <motion.div key={mod.request} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="p-6 bg-[var(--yume-warm-white)] flex items-start gap-4">
                <div className={`w-10 h-10 flex items-center justify-center flex-shrink-0 ${mod.possible ? "bg-green-500" : "bg-[var(--yume-miso)]"}`}>
                  {mod.possible ? <Check size={20} className="text-white" /> : <X size={20} className="text-white" />}
                </div>
                <div>
                  <h3 className="font-bold text-[var(--yume-charcoal)] font-header">{mod.request}</h3>
                  <p className="text-sm text-[var(--yume-miso)] font-body">{mod.notes}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[var(--yume-charcoal)]">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Info size={48} className="mx-auto text-[var(--yume-gold)] mb-6" />
            <h2 className="text-3xl lg:text-4xl font-bold text-[var(--yume-warm-white)] mb-4 font-header">Have Questions?</h2>
            <p className="text-[var(--yume-warm-white)]/80 mb-8 font-body">For specific dietary concerns or severe allergies, please contact us before ordering.</p>
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