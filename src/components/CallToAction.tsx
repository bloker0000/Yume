"use client";

import { motion } from "framer-motion";
import { ArrowRight, Clock, Flame, Award } from "lucide-react";
import Button from "./Button";
import { CirclePattern } from "./JapanesePatterns";
import Image from "next/image";

export default function CallToAction() {
  return (
    <section className="relative py-16 sm:py-24 lg:py-32 bg-[var(--yume-vermillion)] overflow-hidden">
      <CirclePattern className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 text-[var(--yume-warm-white)] opacity-10" />
      <CirclePattern className="absolute bottom-0 left-0 w-48 sm:w-64 h-48 sm:h-64 text-[var(--yume-warm-white)] opacity-10" />

      <div className="absolute inset-0 opacity-10" style={{ filter: 'blur(5px)' }}>
        <Image
          src="/items/Tonkotsu.jpg"
          alt="Ramen"
          fill
          className="object-cover"
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--yume-warm-white)]/20 backdrop-blur-sm text-[var(--yume-warm-white)] mb-8"
          >
            <Award size={18} />
            <span className="text-sm font-medium tracking-wide font-body">
              First order? Get 15% off!
            </span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl lg:text-7xl font-bold text-[var(--yume-warm-white)] mb-6 font-header">
            Ready to Taste
            <br />
            <span className="text-[var(--yume-gold)]">Perfection?</span>
          </h2>

          <p className="text-base sm:text-xl text-[var(--yume-warm-white)]/90 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed font-body">
            Order now and experience the authentic taste of Japanese ramen,
            delivered hot and fresh to your doorstep.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="secondary"
              size="lg"
              cornerColor="var(--yume-charcoal)"
              className="bg-[var(--yume-charcoal)] text-[var(--yume-warm-white)] hover:bg-[var(--yume-warm-white)] hover:text-[var(--yume-charcoal)] px-8"
              href="/menu"
            >
              <span className="flex items-center gap-2">
                Order Now
                <ArrowRight size={18} />
              </span>
            </Button>

            <span className="text-[var(--yume-warm-white)]/60 text-base font-body">or</span>

            <a
              href="/menu"
              className="text-[var(--yume-warm-white)] font-medium underline underline-offset-4 font-body min-h-[44px] inline-flex items-center"
            >
              View our menu first
            </a>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mt-10 sm:mt-12 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 sm:gap-8 text-[var(--yume-warm-white)]/80"
          >
            <div className="flex items-center gap-2">
              <Clock size={20} />
              <span className="text-sm sm:text-base font-body">30 min delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <Flame size={20} />
              <span className="text-sm sm:text-base font-body">Always hot & fresh</span>
            </div>
            <div className="flex items-center gap-2">
              <Award size={20} />
              <span className="text-sm sm:text-base font-body">100% satisfaction</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}