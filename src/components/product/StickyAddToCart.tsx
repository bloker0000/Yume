"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Check, ShoppingCart } from "lucide-react";
import { MenuItem } from "@/data/menuData";
import { useCart } from "@/context/CartContext";

interface StickyAddToCartProps {
  item: MenuItem;
  showAfterScroll?: number;
  currentQuantity?: number;
  toppingsPrice?: number;
}

export default function StickyAddToCart({
  item,
  showAfterScroll = 400,
  currentQuantity = 1,
  toppingsPrice = 0,
}: StickyAddToCartProps) {
  const { addItem } = useCart();
  const [isVisible, setIsVisible] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > showAfterScroll);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showAfterScroll]);

  const totalPrice = (item.price + toppingsPrice) * currentQuantity;

  const handleAddToCart = () => {
    addItem(item, currentQuantity);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-40 lg:hidden"
        >
          <div className="bg-[var(--yume-warm-white)] border-t border-[var(--yume-cream)] shadow-lg px-2 py-2">
            <div className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[var(--yume-charcoal)] truncate font-header text-sm">
                  {item.name}
                  {currentQuantity > 1 && (
                    <span className="text-[var(--yume-miso)] font-normal ml-1">x{currentQuantity}</span>
                  )}
                </p>
                <p className="text-[var(--yume-vermillion)] font-bold font-header">
                  €{totalPrice.toFixed(2)}
                </p>
                {toppingsPrice > 0 && (
                  <p className="text-xs text-[var(--yume-miso)] font-body">
                    +€{toppingsPrice.toFixed(2)} extras
                  </p>
                )}
              </div>

              <motion.button
                onClick={handleAddToCart}
                className={`px-4 py-3 min-h-[48px] font-medium transition-colors font-body text-sm flex items-center gap-2 ${
                  isAdded
                    ? "bg-[var(--yume-nori)] text-[var(--yume-warm-white)]"
                    : "bg-[var(--yume-vermillion)] text-[var(--yume-warm-white)]"
                }`}
                whileTap={{ scale: 0.95 }}
              >
                {isAdded ? (
                  <>
                    <Check size={16} />
                    Added!
                  </>
                ) : (
                  <>
                    <ShoppingCart size={16} />
                    Add
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}