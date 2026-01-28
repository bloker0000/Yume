"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Button from "./Button";
import { Star } from "lucide-react";

export default function Hero() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth < 1024;
      setIsMobile(isTouch || isSmallScreen);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[var(--yume-cream)]">
      <div 
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage: "url('/bg\'s/circlesBG0.svg')",
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'left bottom',
          backgroundAttachment: isMobile ? 'scroll' : 'fixed',
        }}
      />
      
      <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-b from-transparent to-[var(--yume-warm-white)] z-10" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 space-y-8"
          >
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--yume-charcoal)] text-[var(--yume-warm-white)]"
              >
                <span className="text-[var(--yume-gold)] font-japanese text-lg">夢</span>
                <span className="text-xs font-bold uppercase tracking-widest font-body">Authentic Japanese Ramen</span>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[0.95] text-[var(--yume-charcoal)] font-header"
              >
                A Bowl of
                <br />
                <span className="text-[var(--yume-vermillion)]">
                  Dreams
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-base lg:text-lg text-[var(--yume-ink)] max-w-md leading-relaxed font-body"
              >
                Experience the art of traditional Japanese ramen. Rich broths,
                hand-pulled noodles, and premium ingredients crafted with passion.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button variant="primary" size="lg" href="/menu" className="w-full sm:w-auto min-h-[48px]">
                Order Now
              </Button>
              <Button variant="outline" size="lg" href="/menu" className="w-full sm:w-auto min-h-[48px]">
                View Menu
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-6"
            >
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} className="text-[var(--yume-gold)] fill-[var(--yume-gold)]" />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-[var(--yume-charcoal)] font-header">4.9</span>
                <span className="text-sm text-[var(--yume-miso)] font-body">from 2,000+ reviews</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-7 relative"
          >
            <div className="relative w-full max-w-2xl mx-auto">
              <div className="absolute -inset-4 bg-[var(--yume-vermillion)]/5 rounded-full blur-3xl" />
              
              <div className="relative aspect-[4/3] w-full">
                <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl border border-[var(--yume-charcoal)]/10">
                  <Image
                    src="/items/Tonkotsu.jpg"
                    alt="Tonkotsu Ramen"
                    fill
                    className="object-cover"
                    style={{ objectPosition: '50% 40%' }}
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--yume-charcoal)]/60 via-transparent to-transparent" />
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4, type: "spring", stiffness: 100 }}
                  className="absolute -bottom-6 right-4 lg:right-8"
                >
                  <div className="relative bg-[var(--yume-charcoal)] p-5 shadow-2xl">
                    <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[var(--yume-vermillion)]" />
                    <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[var(--yume-vermillion)]" />
                    <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[var(--yume-vermillion)]" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[var(--yume-vermillion)]" />
                    
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-[var(--yume-vermillion)] flex items-center justify-center">
                        <span className="text-[var(--yume-warm-white)] text-2xl font-bold font-header">#1</span>
                      </div>
                      <div>
                        <p className="text-[var(--yume-gold)] text-xs font-bold uppercase tracking-widest font-body mb-1">Best Seller</p>
                        <p className="text-lg font-bold text-[var(--yume-warm-white)] font-header">Tonkotsu</p>
                        <p className="text-sm text-[var(--yume-warm-white)]/60 font-japanese">豚骨ラーメン</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.6 }}
                  className="absolute top-4 right-4 bg-[var(--yume-gold)] px-4 py-2 shadow-lg"
                >
                  <p className="text-sm font-bold text-[var(--yume-charcoal)] font-header">€14.99</p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}