"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Plus, Star } from "lucide-react";
import { MenuItem } from "@/data/menuData";
import { useCart } from "@/context/CartContext";

interface PairingCardsProps {
  items: MenuItem[];
  title?: string;
}

export default function PairingCards({ items, title = "Perfect Pairings" }: PairingCardsProps) {
  const { addItem } = useCart();

  const handleQuickAdd = (item: MenuItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(item, 1);
  };

  if (items.length === 0) return null;

  return (
    <div className="py-8">
      <h3 className="text-2xl font-bold text-[var(--yume-charcoal)] mb-6 font-header">
        {title} <span className="font-japanese text-[var(--yume-gold)]">おすすめ</span>
      </h3>

      <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="flex-shrink-0 w-64"
          >
            <Link href={`/menu/${item.slug}`}>
              <div className="group bg-[var(--yume-warm-white)] border border-[var(--yume-cream)] hover:border-[var(--yume-vermillion)] transition-colors">
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {item.bestseller && (
                    <span className="absolute top-2 left-2 px-2 py-1 bg-[var(--yume-gold)] text-[var(--yume-charcoal)] text-xs font-bold">
                      Bestseller
                    </span>
                  )}
                </div>

                <div className="p-4">
                  <p className="text-xs text-[var(--yume-gold)] font-japanese mb-1">
                    {item.japanese}
                  </p>
                  <h4 className="font-bold text-[var(--yume-charcoal)] mb-1 font-header line-clamp-1">
                    {item.name}
                  </h4>

                  <div className="flex items-center gap-1 mb-2">
                    <Star size={12} className="fill-[var(--yume-gold)] text-[var(--yume-gold)]" />
                    <span className="text-xs text-[var(--yume-charcoal)]">{item.rating}</span>
                    <span className="text-xs text-[var(--yume-miso)]">({item.reviewCount})</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[var(--yume-vermillion)] font-header">
                      €{item.price.toFixed(2)}
                    </span>
                    <button
                      onClick={(e) => handleQuickAdd(item, e)}
                      className="p-2 bg-[var(--yume-charcoal)] text-[var(--yume-warm-white)] hover:bg-[var(--yume-vermillion)] transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}