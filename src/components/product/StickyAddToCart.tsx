"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Check, ShoppingCart } from "lucide-react";
import { MenuItem } from "@/data/menuData";
import { useCart } from "@/context/CartContext";

interface StickyAddToCartProps {
  item: MenuItem;
  showAfterScroll?: number;
}

export default function StickyAddToCart({
  item,
  showAfterScroll = 400,
}: StickyAddToCartProps) {
  const { addItem } = useCart();
  const [isVisible, setIsVisible] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > showAfterScroll);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showAfterScroll]);

  const handleAddToCart = () => {
    addItem(item, quantity);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      setQuantity(1);
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
          <div className="bg-[var(--yume-warm-white)] border-t border-[var(--yume-cream)] shadow-lg px-4 py-3 safe-area-bottom">
            <div className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[var(--yume-charcoal)] truncate font-header text-sm">
                  {item.name}
                </p>
                <p className="text-[var(--yume-vermillion)] font-bold font-header">
                  €{(item.price * quantity).toFixed(2)}
                </p>
              </div>

              <div className="flex items-center border border-[var(--yume-cream)]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-[var(--yume-cream)] transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="w-8 text-center font-bold text-[var(--yume-charcoal)] font-header text-sm">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-[var(--yume-cream)] transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>

              <motion.button
                onClick={handleAddToCart}
                className={`px-4 py-3 font-medium transition-colors font-body text-sm flex items-center gap-2 ${
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