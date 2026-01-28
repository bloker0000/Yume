"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Minus, Plus, Check } from "lucide-react";
import {
  MenuItem,
  toppings,
  brothRichness,
  noodleFirmness,
  spiceLevels,
} from "@/data/menuData";
import { useCart, CartItemCustomization } from "@/context/CartContext";

interface CustomizationPanelProps {
  item: MenuItem;
  onAddedToCart?: () => void;
  initialCustomization?: CartItemCustomization;
}

export default function CustomizationPanel({
  item,
  onAddedToCart,
  initialCustomization,
}: CustomizationPanelProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedBroth, setSelectedBroth] = useState(initialCustomization?.brothRichness || "medium");
  const [selectedNoodle, setSelectedNoodle] = useState(initialCustomization?.noodleFirmness || "medium");
  const [selectedSpice, setSelectedSpice] = useState(initialCustomization?.spiceLevel ?? item.spicy ?? 0);
  const [selectedToppings, setSelectedToppings] = useState<string[]>(initialCustomization?.toppings || []);
  const [specialInstructions, setSpecialInstructions] = useState(initialCustomization?.specialInstructions || "");
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    if (initialCustomization) {
      setSelectedBroth(initialCustomization.brothRichness || "medium");
      setSelectedNoodle(initialCustomization.noodleFirmness || "medium");
      setSelectedSpice(initialCustomization.spiceLevel ?? item.spicy ?? 0);
      setSelectedToppings(initialCustomization.toppings || []);
      setSpecialInstructions(initialCustomization.specialInstructions || "");
    } else {
      setSelectedSpice(item.spicy);
      setQuantity(1);
      setSelectedBroth("medium");
      setSelectedNoodle("medium");
      setSelectedToppings([]);
      setSpecialInstructions("");
    }
  }, [item, initialCustomization]);

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

    addItem(item, quantity, item.customizable ? customization : undefined, toppingsPrice);
    setIsAdded(true);
    
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);

    onAddedToCart?.();
  };

  return (
    <div className="bg-[var(--yume-warm-white)] p-4 sm:p-6 lg:p-8">
      <h3 className="text-base sm:text-lg font-bold text-[var(--yume-charcoal)] mb-4 sm:mb-6 font-header">
        Customize Your Order
      </h3>

      {item.customizable && item.category === "ramen" && (
        <div className="space-y-6 mb-8">
          <div>
            <h4 className="text-sm font-bold text-[var(--yume-charcoal)] uppercase tracking-wide mb-3 font-body">
              Broth Richness <span className="font-japanese text-[var(--yume-miso)]">濃さ</span>
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {brothRichness.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSelectedBroth(option.id)}
                  className={`py-3 sm:py-3 px-2 sm:px-4 text-sm font-medium transition-all min-h-[56px] ${
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
            <h4 className="text-sm font-bold text-[var(--yume-charcoal)] uppercase tracking-wide mb-3 font-body">
              Noodle Firmness <span className="font-japanese text-[var(--yume-miso)]">麺の硬さ</span>
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {noodleFirmness.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSelectedNoodle(option.id)}
                  className={`py-3 sm:py-3 px-2 sm:px-4 text-sm font-medium transition-all min-h-[56px] ${
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
            <h4 className="text-sm font-bold text-[var(--yume-charcoal)] uppercase tracking-wide mb-3 font-body">
              Spice Level <span className="font-japanese text-[var(--yume-miso)]">辛さ</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {spiceLevels.map((level) => (
                <button
                  key={level.id}
                  onClick={() => setSelectedSpice(level.id)}
                  className={`py-3 px-2 text-sm font-medium transition-all min-h-[56px] ${
                    selectedSpice === level.id
                      ? "bg-[var(--yume-vermillion)] text-[var(--yume-warm-white)]"
                      : "bg-[var(--yume-cream)] text-[var(--yume-charcoal)] hover:bg-[var(--yume-charcoal)] hover:text-[var(--yume-warm-white)]"
                  }`}
                >
                  <span className="block font-body text-xs">{level.name}</span>
                  <span className="block text-xs opacity-70 font-japanese mt-1">
                    {level.japanese}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-[var(--yume-charcoal)] uppercase tracking-wide mb-3 font-body">
              Extra Toppings <span className="font-japanese text-[var(--yume-miso)]">トッピング</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {toppings.map((topping) => (
                <button
                  key={topping.id}
                  onClick={() => toggleTopping(topping.id)}
                  className={`flex items-center justify-between p-3 min-h-[52px] text-sm transition-all ${
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
        </div>
      )}

      <div className="mb-6">
        <h4 className="text-sm font-bold text-[var(--yume-charcoal)] uppercase tracking-wide mb-3 font-body">
          Special Instructions <span className="text-[var(--yume-miso)]">(optional)</span>
        </h4>
        <textarea
          value={specialInstructions}
          onChange={(e) => setSpecialInstructions(e.target.value)}
          placeholder="Any allergies or special requests..."
          maxLength={200}
          className="w-full p-3 bg-[var(--yume-cream)] border border-transparent focus:border-[var(--yume-vermillion)] focus:outline-none text-[var(--yume-charcoal)] placeholder:text-[var(--yume-miso)] font-body resize-none h-20"
        />
        <p className="text-xs text-[var(--yume-miso)] mt-1 text-right">
          {specialInstructions.length}/200
        </p>
      </div>

      <div className="border-t border-[var(--yume-cream)] pt-4 sm:pt-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center border border-[var(--yume-cream)]">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-3 min-w-[48px] min-h-[48px] flex items-center justify-center hover:bg-[var(--yume-cream)] transition-colors"
            >
              <Minus size={18} />
            </button>
            <span className="w-12 text-center font-bold text-[var(--yume-charcoal)] font-header">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-3 min-w-[48px] min-h-[48px] flex items-center justify-center hover:bg-[var(--yume-cream)] transition-colors"
            >
              <Plus size={18} />
            </button>
          </div>
          <div>
            <p className="text-sm text-[var(--yume-miso)] font-body">Total</p>
            <p className="text-xl sm:text-2xl font-bold text-[var(--yume-vermillion)] font-header">
              €{totalPrice.toFixed(2)}
            </p>
          </div>
        </div>

        <motion.button
          onClick={handleAddToCart}
          className={`w-full mt-4 py-4 min-h-[56px] font-medium transition-colors font-body ${
            isAdded
              ? "bg-[var(--yume-nori)] text-[var(--yume-warm-white)]"
              : "bg-[var(--yume-charcoal)] text-[var(--yume-warm-white)] hover:bg-[var(--yume-vermillion)]"
          }`}
          whileTap={{ scale: 0.98 }}
        >
          {isAdded ? (
            <span className="flex items-center justify-center gap-2">
              <Check size={20} />
              Added to Cart!
            </span>
          ) : (
            "Add to Order"
          )}
        </motion.button>
      </div>
    </div>
  );
}