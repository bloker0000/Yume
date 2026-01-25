"use client";

import { motion } from "framer-motion";
import { Smartphone, ChefHat, Bike, Utensils, ChevronRight } from "lucide-react";

const steps = [
  {
    icon: Smartphone,
    number: "01",
    japanese: "選ぶ",
    title: "Browse & Choose",
    description: "Explore our menu and select your favorite ramen bowl and sides",
  },
  {
    icon: ChefHat,
    number: "02",
    japanese: "作る",
    title: "We Prepare",
    description: "Our chefs craft your order fresh using traditional techniques",
  },
  {
    icon: Bike,
    number: "03",
    japanese: "届ける",
    title: "Fast Delivery",
    description: "Your hot ramen is on its way within 30 minutes",
  },
  {
    icon: Utensils,
    number: "04",
    japanese: "楽しむ",
    title: "Enjoy",
    description: "Savor every spoonful of authentic Japanese ramen",
  },
];

export default function HowItWorks() {
  return (
    <section className="relative py-24 lg:py-32 bg-[var(--yume-warm-white)] overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.03 }}
        viewport={{ once: true }}
        className="absolute inset-0 flex items-center justify-center text-[40rem] font-bold text-[var(--yume-charcoal)] font-japanese"
      >
        麺
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="text-[var(--yume-gold)] font-japanese text-3xl">
              方
            </span>
          </div>

          <h2 className="text-4xl lg:text-6xl font-bold text-[var(--yume-charcoal)] mb-4 font-header">
            How It
            <span className="text-[var(--yume-vermillion)]"> Works</span>
          </h2>

          <p className="text-lg text-[var(--yume-miso)] max-w-2xl mx-auto font-body">
            From our kitchen to your table in four simple steps
          </p>
        </motion.div>

        <div className="relative">
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--yume-vermillion)]/20 to-transparent -translate-y-1/2" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="relative group"
              >
                <div className="bg-[var(--yume-cream)] p-8 h-full border border-transparent hover:border-[var(--yume-vermillion)]/20 transition-all duration-500 relative overflow-hidden">
                  <div className="absolute top-0 right-0 text-6xl font-bold text-[var(--yume-vermillion)]/5 font-header">
                    {step.number}
                  </div>

                  <div className="absolute top-4 right-4 text-2xl text-[var(--yume-miso)]/30 font-japanese">
                    {step.japanese}
                  </div>

                  <div className="relative z-10">
                    <motion.div
                      className="w-16 h-16 bg-[var(--yume-vermillion)] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
                      whileHover={{ rotate: 5 }}
                    >
                      <step.icon
                        size={28}
                        className="text-[var(--yume-warm-white)]"
                      />
                    </motion.div>

                    <h3 className="text-xl font-bold text-[var(--yume-charcoal)] mb-3 font-header">
                      {step.title}
                    </h3>

                    <p className="text-[var(--yume-miso)] leading-relaxed font-body">
                      {step.description}
                    </p>
                  </div>

                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 z-20">
                      <ChevronRight size={24} className="text-[var(--yume-vermillion)]" />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}