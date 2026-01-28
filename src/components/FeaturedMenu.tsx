"use client";

import { motion } from "framer-motion";
import { Plus, Star } from "lucide-react";
import Image from "next/image";
import { AsanohaPattern } from "./JapanesePatterns";
import { useState, useEffect } from "react";

const menuItems = [
  {
    id: 1,
    name: "Tonkotsu Ramen",
    japanese: "豚骨ラーメン",
    description: "Rich pork bone broth simmered for 18 hours with chashu, soft-boiled egg, and green onions",
    price: 14.99,
    rating: 4.9,
    bestseller: true,
    spicy: false,
    image: "/items/Tonkotsu.jpg",
  },
  {
    id: 2,
    name: "Spicy Miso Ramen",
    japanese: "辛味噌ラーメン",
    description: "Fermented soybean paste broth with ground pork, corn, butter, and spicy chili oil",
    price: 15.99,
    rating: 4.8,
    bestseller: false,
    spicy: true,
    image: "/items/spicyMiso.jpg",
  },
  {
    id: 3,
    name: "Shoyu Ramen",
    japanese: "醤油ラーメン",
    description: "Classic soy sauce based broth with bamboo shoots, nori, and perfectly cooked noodles",
    price: 13.99,
    rating: 4.7,
    bestseller: false,
    spicy: false,
    image: "/items/shoyu.jpg",
  },
  {
    id: 4,
    name: "Tantanmen",
    japanese: "担々麺",
    description: "Creamy sesame broth with spicy minced pork, bok choy, and aromatic chili crisp",
    price: 16.99,
    rating: 4.9,
    bestseller: true,
    spicy: true,
    image: "/items/tantanmen.jpg",
  },
];

export default function FeaturedMenu() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth < 1024;
      setIsMobile(isTouchDevice || isSmallScreen);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section className="relative py-16 sm:py-24 lg:py-32 bg-[var(--yume-warm-white)] overflow-hidden">
      <div 
        className="absolute inset-0 opacity-20 blur-xkjuy6,hngxl"
        style={{
          backgroundImage: "url('/bg\\'s/circles2bg1.svg')",
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: isMobile ? 'scroll' : 'fixed',
        }}
      />
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-[var(--yume-warm-white)] to-transparent" />


      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-12 h-[1px] bg-[var(--yume-vermillion)]" />
            <span className="text-[var(--yume-vermillion)] font-japanese text-2xl">
              品
            </span>
            <div className="w-12 h-[1px] bg-[var(--yume-vermillion)]" />
          </div>
          
          <h2 className="text-4xl lg:text-6xl font-bold text-[var(--yume-charcoal)] mb-4 font-header">
            Our Signature
            <br />
            <span className="text-[var(--yume-vermillion)]">Ramen</span>
          </h2>
          
          <p className="text-base text-[var(--yume-miso)] max-w-2xl mx-auto font-body">
            Each bowl tells a story of tradition, crafted with passion and the finest ingredients
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="group relative bg-[var(--yume-warm-white)] border border-[var(--yume-cream)] hover:shadow-2xl transition-all duration-500 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-[var(--yume-vermillion)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
              <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-[var(--yume-vermillion)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

              <div className="relative h-64 w-full overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--yume-charcoal)]/60 to-transparent" />
                
                <div className="absolute top-4 right-4 flex gap-2 z-10">
                  {item.bestseller && (
                    <span className="px-3 py-1 bg-[var(--yume-gold)] text-[var(--yume-warm-white)] text-xs font-bold uppercase font-body">
                      Best
                    </span>
                  )}
                  {item.spicy && (
                    <span className="px-3 py-1 bg-[var(--yume-vermillion)] text-[var(--yume-warm-white)] text-xs font-bold uppercase font-body">
                      Spicy
                    </span>
                  )}
                </div>

                <div className="absolute bottom-4 left-4 right-4 z-10">
                  <h3 className="text-2xl font-bold text-[var(--yume-warm-white)] mb-1 font-header">
                    {item.name}
                  </h3>
                  <span className="text-[var(--yume-warm-white)]/80 font-japanese text-lg">
                    {item.japanese}
                  </span>
                </div>
              </div>

              <div className="p-5 sm:p-6 lg:p-8">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-3xl font-bold text-[var(--yume-vermillion)] font-header">
                    €{item.price}
                  </span>
                  <div className="flex items-center gap-2">
                    <Star
                      size={16}
                      className="text-[var(--yume-gold)] fill-[var(--yume-gold)]"
                    />
                    <span className="text-base font-medium text-[var(--yume-charcoal)]">
                      {item.rating}
                    </span>
                  </div>
                </div>

              <p className="text-[var(--yume-ink)] mb-6 leading-relaxed font-body">
                {item.description}
              </p>

              <motion.a
                href="/menu"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full flex items-center justify-center gap-2 px-4 py-4 min-h-[48px] bg-[var(--yume-charcoal)] text-[var(--yume-warm-white)] text-sm font-medium hover:bg-[var(--yume-vermillion)] transition-colors duration-300 font-body"
              >
                <Plus size={16} />
                Add to Order
              </motion.a>
            </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="text-center mt-12"
        >
          <motion.a
            href="/menu"
            className="inline-flex items-center gap-3 text-[var(--yume-charcoal)] font-medium hover:text-[var(--yume-vermillion)] transition-colors group font-body"
            whileHover={{ x: 5 }}
          >
            <span>View Full Menu</span>
            <span className="text-2xl group-hover:translate-x-2 transition-transform">→</span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}