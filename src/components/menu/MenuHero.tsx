"use client";

import { motion } from "framer-motion";

export default function MenuHero() {
  return (
    <section className="relative pt-28 pb-12 bg-[var(--yume-charcoal)] overflow-hidden">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "url('/bg\\'s/circlesBG0.svg')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-12 h-[1px] bg-[var(--yume-gold)]" />
            <span className="text-[var(--yume-gold)] font-japanese text-2xl">
              品
            </span>
            <div className="w-12 h-[1px] bg-[var(--yume-gold)]" />
          </div>

          <h1 className="text-4xl lg:text-6xl font-bold text-[var(--yume-warm-white)] mb-4 font-header">
            Our <span className="text-[var(--yume-vermillion)]">Menu</span>
          </h1>

          <p className="text-lg text-[var(--yume-warm-white)]/70 max-w-2xl mx-auto font-body">
            Choose your perfect bowl and customize it to your taste
          </p>

          <p className="text-sm text-[var(--yume-warm-white)]/50 mt-4 font-japanese">
            メニュー
          </p>
        </motion.div>
      </div>
    </section>
  );
}