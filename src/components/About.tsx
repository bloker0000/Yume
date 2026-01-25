"use client";

import { motion } from "framer-motion";
import { Utensils, Leaf, Clock, Truck } from "lucide-react";
import { CirclePattern } from "./JapanesePatterns";

const features = [
  {
    icon: Utensils,
    title: "Authentic Recipes",
    japanese: "本格的",
    description: "Traditional recipes passed down through generations of Japanese ramen masters",
  },
  {
    icon: Leaf,
    title: "Fresh Ingredients",
    japanese: "新鮮",
    description: "We source the finest ingredients daily to ensure every bowl is perfect",
  },
  {
    icon: Clock,
    title: "18-Hour Broth",
    japanese: "時間",
    description: "Our signature broth is simmered for 18 hours for maximum depth of flavor",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    japanese: "速達",
    description: "Hot and fresh ramen delivered to your door within 30 minutes",
  },
];

export default function About() {
  return (
    <section className="relative py-24 lg:py-32 bg-[var(--yume-charcoal)] overflow-hidden">
      <CirclePattern className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] text-[var(--yume-warm-white)] opacity-5" />
      
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.05 }}
        viewport={{ once: true }}
        className="absolute top-10 right-10 text-[12rem] font-bold text-[var(--yume-warm-white)] font-japanese leading-none"
      >
        夢
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl lg:text-6xl font-bold text-[var(--yume-warm-white)] mb-6 font-header">
              The Art of
              <br />
              <span className="text-[var(--yume-gold)]">Ramen</span>
            </h2>

            <div className="space-y-6 text-[var(--yume-warm-white)]/80 font-body">
              <p className="text-base leading-relaxed">
                <span className="text-2xl font-japanese text-[var(--yume-vermillion)] mr-2">
                  夢
                </span>
                Yume, meaning &ldquo;dream&rdquo; in Japanese, represents our vision to bring
                authentic Japanese ramen culture to the Netherlands.
              </p>
              <p className="leading-relaxed">
                Every bowl we create is a labor of love, combining centuries-old
                techniques with the freshest local ingredients. From our
                18-hour slow-simmered broths to our hand-pulled noodles, we honor
                the traditions that make ramen a culinary art form.
              </p>
              <p className="leading-relaxed">
                Whether you&apos;re craving the rich, creamy depths of our Tonkotsu or
                the bold, spicy notes of our Tantanmen, we bring the soul of Japan
                directly to your door.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mt-8 flex items-center gap-6"
            >
              <div className="flex -space-x-3">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--yume-vermillion)] to-[var(--yume-gold)] flex items-center justify-center text-[var(--yume-warm-white)] font-bold border-2 border-[var(--yume-charcoal)] font-header"
                  >
                    {["A", "S", "K", "M"][i]}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-[var(--yume-warm-white)] font-medium font-body">
                  10,000+ Happy Customers
                </p>
                <p className="text-base text-[var(--yume-warm-white)]/60 font-body">
                  Join our ramen family today
                </p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 + 0.3 }}
                className="relative bg-[var(--yume-ink)] p-6"
              >
                <div className="absolute top-0 right-0 text-4xl opacity-10 font-japanese text-[var(--yume-warm-white)]">
                  {feature.japanese}
                </div>
                
                <div className="w-12 h-12 bg-[var(--yume-vermillion)] flex items-center justify-center mb-4">
                  <feature.icon size={24} className="text-[var(--yume-warm-white)]" />
                </div>
                
                <h3 className="text-base font-bold text-[var(--yume-warm-white)] mb-2 font-header">
                  {feature.title}
                </h3>
                
                <p className="text-base text-[var(--yume-warm-white)]/70 font-body">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-24 text-center"
        >
          <div className="inline-flex items-center gap-8 px-8 py-4 bg-[var(--yume-ink)] border border-[var(--yume-miso)]/20">
            <div className="text-center">
              <span className="block text-3xl font-bold text-[var(--yume-vermillion)] font-header">
                2019
              </span>
              <span className="text-sm text-[var(--yume-warm-white)]/60 font-body">
                Founded
              </span>
            </div>
            <div className="w-[1px] h-16 bg-[var(--yume-miso)]/20" />
            <div className="text-center">
              <span className="block text-3xl font-bold text-[var(--yume-gold)] font-header">
                50K+
              </span>
              <span className="text-sm text-[var(--yume-warm-white)]/60 font-body">
                Bowls Served
              </span>
            </div>
            <div className="w-[1px] h-16 bg-[var(--yume-miso)]/20" />
            <div className="text-center">
              <span className="block text-3xl font-bold text-[var(--yume-warm-white)] font-header">
                4.9
              </span>
              <span className="text-sm text-[var(--yume-warm-white)]/60 font-body">
                Average Rating
              </span>
            </div>
            <div className="w-[1px] h-16 bg-[var(--yume-miso)]/20" />
            <div className="text-center">
              <span className="block text-3xl font-bold text-[var(--yume-vermillion)] font-header">
                12
              </span>
              <span className="text-sm text-[var(--yume-warm-white)]/60 font-body">
                Signature Bowls
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}