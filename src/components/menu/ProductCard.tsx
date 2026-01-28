"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Star, Flame, Clock, Leaf, Plus, Sparkles, ChevronRight } from "lucide-react";
import { MenuItem } from "@/data/menuData";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  item: MenuItem;
  onCustomize: (item: MenuItem) => void;
}

export default function ProductCard({ item, onCustomize }: ProductCardProps) {
  const { addItem } = useCart();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (item.customizable) {
      onCustomize(item);
    } else {
      addItem(item, 1);
    }
  };

  const renderSpiceLevel = () => {
    if (item.spicy === 0) return null;
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(item.spicy)].map((_, i) => (
          <Flame
            key={i}
            size={12}
            className="text-[var(--yume-vermillion)] fill-[var(--yume-vermillion)]"
          />
        ))}
      </div>
    );
  };

  return (
    <Link href={`/menu/${item.slug}`}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="group relative bg-[var(--yume-warm-white)] border border-[var(--yume-cream)] hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
      >
        <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-[var(--yume-vermillion)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
        <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-[var(--yume-vermillion)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

        <div className="relative h-40 sm:h-48 w-full overflow-hidden">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--yume-charcoal)]/60 to-transparent" />

          <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-10">
            {item.bestseller && (
              <span className="px-2 py-1 bg-[var(--yume-gold)] text-[var(--yume-charcoal)] text-xs font-bold uppercase font-body">
                Best Seller
              </span>
            )}
            {item.isNew && (
              <span className="px-2 py-1 bg-[var(--yume-vermillion)] text-[var(--yume-warm-white)] text-xs font-bold uppercase font-body flex items-center gap-1">
                <Sparkles size={10} />
                New
              </span>
            )}
            {item.vegetarian && (
              <span className="px-2 py-1 bg-green-600 text-white text-xs font-bold uppercase font-body flex items-center gap-1">
                <Leaf size={10} />
              </span>
            )}
          </div>

          <div className="absolute bottom-3 left-3 right-3 z-10">
            <p className="text-[var(--yume-warm-white)]/80 font-japanese text-sm mb-1">
              {item.japanese}
            </p>
            <h3 className="text-xl font-bold text-[var(--yume-warm-white)] font-header">
              {item.name}
            </h3>
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <span className="text-xl sm:text-2xl font-bold text-[var(--yume-vermillion)] font-header">
              €{item.price.toFixed(2)}
            </span>
            <div className="flex items-center gap-3">
              {renderSpiceLevel()}
              <div className="flex items-center gap-1">
                <Star
                  size={14}
                  className="text-[var(--yume-gold)] fill-[var(--yume-gold)]"
                />
                <span className="text-sm font-medium text-[var(--yume-charcoal)]">
                  {item.rating}
                </span>
                <span className="text-xs text-[var(--yume-miso)]">
                  ({item.reviewCount})
                </span>
              </div>
            </div>
          </div>

          <p className="text-sm text-[var(--yume-ink)] mb-3 sm:mb-4 line-clamp-2 font-body">
            {item.description}
          </p>

          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center gap-1 text-[var(--yume-miso)]">
              <Clock size={14} />
              <span className="text-xs font-body">{item.prepTime} min</span>
            </div>
            <span className="text-xs text-[var(--yume-miso)] font-body">
              {item.calories} cal
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleQuickAdd}
              className="flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-3 min-h-[48px] bg-[var(--yume-charcoal)] text-[var(--yume-warm-white)] text-sm font-medium hover:bg-[var(--yume-vermillion)] transition-colors font-body active:scale-95"
            >
              <Plus size={16} />
              <span className="hidden xs:inline">{item.customizable ? "Customize" : "Add to Order"}</span>
              <span className="xs:hidden">{item.customizable ? "Add" : "Add"}</span>
            </button>
            <span
              className="flex items-center justify-center px-3 py-3 min-h-[48px] min-w-[48px] border border-[var(--yume-charcoal)] text-[var(--yume-charcoal)] text-sm font-medium group-hover:bg-[var(--yume-charcoal)] group-hover:text-[var(--yume-warm-white)] transition-colors"
            >
              <ChevronRight size={18} />
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}