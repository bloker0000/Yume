"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, Minus, Plus, Check } from "lucide-react";
import {
  MenuItem,
  toppings,
  brothRichness,
  noodleFirmness,
  spiceLevels,
} from "@/data/menuData";
import { useCart, CartItemCustomization } from "@/context/CartContext";

interface CustomizationModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function CustomizationModal({
  item,
  isOpen,
  onClose,
}: CustomizationModalProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedBroth, setSelectedBroth] = useState("medium");
  const [selectedNoodle, setSelectedNoodle] = useState("medium");
  const [selectedSpice, setSelectedSpice] = useState(item?.spicy || 0);
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState("");

  useEffect(() => {
    if (item) {
      setSelectedSpice(item.spicy);
      setQuantity(1);
      setSelectedBroth("medium");
      setSelectedNoodle("medium");
      setSelectedToppings([]);
      setSpecialInstructions("");
    }
  }, [item]);

  if (!item) return null;

  const toppingsPrice = selectedToppings.reduce((total, toppingId) => {
    const topping = toppings.find((t) => t.id === toppingId);
    return total + (topping?.price || 0);
  }, 0);

  const totalPrice = (item.price + toppingsPrice) * quantity;

  const toggleTopping = (toppingId: string) => {
    setSelectedToppings((prev) =>
      prev.includes(toppingId)
        ? prev.filter((id) => id !== toppingId)
        : [...prev, toppingId]
    );
  };

  const handleAddToCart = () => {
    const customization: CartItemCustomization = {
      brothRichness: selectedBroth,
      noodleFirmness: selectedNoodle,
      spiceLevel: selectedSpice,
      toppings: selectedToppings,
      specialInstructions: specialInstructions || undefined,
    };

    addItem(item, quantity, customization, toppingsPrice);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[var(--yume-charcoal)]/80 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 lg:inset-auto lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:w-full lg:max-w-4xl lg:max-h-[90vh] bg-[var(--yume-warm-white)] overflow-hidden z-50 flex flex-col"
          >
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[var(--yume-vermillion)]" />
            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[var(--yume-vermillion)]" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[var(--yume-vermillion)]" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[var(--yume-vermillion)]" />

            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-[var(--yume-charcoal)] text-[var(--yume-warm-white)] hover:bg-[var(--yume-vermillion)] transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col lg:flex-row h-full overflow-hidden">
              <div className="relative h-48 lg:h-auto lg:w-2/5 flex-shrink-0">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[var(--yume-charcoal)]/60 to-transparent" />
                <div className="absolute bottom-4 left-4 lg:bottom-8 lg:left-8">
                  <p className="text-[var(--yume-warm-white)]/80 font-japanese text-lg mb-1">
                    {item.japanese}
                  </p>
                  <h2 className="text-2xl lg:text-3xl font-bold text-[var(--yume-warm-white)] font-header">
                    {item.name}
                  </h2>
                  <p className="text-[var(--yume-warm-white)]/70 text-sm mt-2 max-w-xs font-body">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 lg:p-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-[var(--yume-charcoal)] uppercase tracking-wide mb-3 font-body">
                      Broth Richness <span className="font-japanese text-[var(--yume-miso)]">濃さ</span>
                    </h3>
                    <div className="flex gap-2">
                      {brothRichness.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => setSelectedBroth(option.id)}
                          className={`flex-1 py-3 px-4 text-sm font-medium transition-all ${
                            selectedBroth === option.id
                              ? "bg-[var(--yume-vermillion)] text-[var(--yume-warm-white)]"
                              : "bg-[var(--yume-cream)] text-[var(--yume-charcoal)] hover:bg-[var(--yume-charcoal)] hover:text-[var(--yume-warm-white)]"
                          }`}
                        >
                          <span className="block font-body">{option.name}</span>
                          <span className="block text-xs opacity-70 font-japanese mt-1">
                            {option.japanese}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[var(--yume-charcoal)] uppercase tracking-wide mb-3 font-body">
                      Noodle Firmness <span className="font-japanese text-[var(--yume-miso)]">麺の硬さ</span>
                    </h3>
                    <div className="flex gap-2">
                      {noodleFirmness.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => setSelectedNoodle(option.id)}
                          className={`flex-1 py-3 px-4 text-sm font-medium transition-all ${
                            selectedNoodle === option.id
                              ? "bg-[var(--yume-vermillion)] text-[var(--yume-warm-white)]"
                              : "bg-[var(--yume-cream)] text-[var(--yume-charcoal)] hover:bg-[var(--yume-charcoal)] hover:text-[var(--yume-warm-white)]"
                          }`}
                        >
                          <span className="block font-body">{option.name}</span>
                          <span className="block text-xs opacity-70 font-japanese mt-1">
                            {option.japanese}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[var(--yume-charcoal)] uppercase tracking-wide mb-3 font-body">
                      Spice Level <span className="font-japanese text-[var(--yume-miso)]">辛さ</span>
                    </h3>
                    <div className="flex gap-2">
                      {spiceLevels.map((level) => (
                        <button
                          key={level.id}
                          onClick={() => setSelectedSpice(level.id)}
                          className={`flex-1 py-3 px-4 text-sm font-medium transition-all ${
                            selectedSpice === level.id
                              ? "bg-[var(--yume-vermillion)] text-[var(--yume-warm-white)]"
                              : "bg-[var(--yume-cream)] text-[var(--yume-charcoal)] hover:bg-[var(--yume-charcoal)] hover:text-[var(--yume-warm-white)]"
                          }`}
                        >
                          <span className="block font-body">{level.name}</span>
                          <span className="block text-xs opacity-70 font-japanese mt-1">
                            {level.japanese}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[var(--yume-charcoal)] uppercase tracking-wide mb-3 font-body">
                      Extra Toppings <span className="font-japanese text-[var(--yume-miso)]">トッピング</span>
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {toppings.map((topping) => (
                        <button
                          key={topping.id}
                          onClick={() => toggleTopping(topping.id)}
                          className={`flex items-center justify-between p-3 text-sm transition-all ${
                            selectedToppings.includes(topping.id)
                              ? "bg-[var(--yume-vermillion)] text-[var(--yume-warm-white)]"
                              : "bg-[var(--yume-cream)] text-[var(--yume-charcoal)] hover:bg-[var(--yume-charcoal)] hover:text-[var(--yume-warm-white)]"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-5 h-5 border-2 flex items-center justify-center ${
                                selectedToppings.includes(topping.id)
                                  ? "border-[var(--yume-warm-white)] bg-[var(--yume-warm-white)]"
                                  : "border-current"
                              }`}
                            >
                              {selectedToppings.includes(topping.id) && (
                                <Check size={14} className="text-[var(--yume-vermillion)]" />
                              )}
                            </div>
                            <span className="font-body">{topping.name}</span>
                          </div>
                          <span className="font-medium">
                            {topping.price > 0 ? `+€${topping.price.toFixed(2)}` : "Free"}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[var(--yume-charcoal)] uppercase tracking-wide mb-3 font-body">
                      Special Instructions <span className="text-[var(--yume-miso)]">(optional)</span>
                    </h3>
                    <textarea
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                      placeholder="Any allergies or special requests..."
                      className="w-full p-3 bg-[var(--yume-cream)] border border-transparent focus:border-[var(--yume-vermillion)] focus:outline-none text-[var(--yume-charcoal)] placeholder:text-[var(--yume-miso)] font-body resize-none h-20"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-[var(--yume-cream)] p-4 lg:p-6 bg-[var(--yume-warm-white)]">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-[var(--yume-cream)]">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 hover:bg-[var(--yume-cream)] transition-colors"
                    >
                      <Minus size={18} />
                    </button>
                    <span className="w-12 text-center font-bold text-[var(--yume-charcoal)] font-header">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-3 hover:bg-[var(--yume-cream)] transition-colors"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                  <div>
                    <p className="text-sm text-[var(--yume-miso)] font-body">Total</p>
                    <p className="text-2xl font-bold text-[var(--yume-vermillion)] font-header">
                      €{totalPrice.toFixed(2)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="px-8 py-4 bg-[var(--yume-charcoal)] text-[var(--yume-warm-white)] font-medium hover:bg-[var(--yume-vermillion)] transition-colors font-body"
                >
                  Add to Order
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}