"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, AlertTriangle, Leaf, Wheat } from "lucide-react";
import { NutritionInfo } from "@/data/menuData";

interface NutritionFactsProps {
  nutrition: NutritionInfo;
  allergens: string[];
  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
}

const allergenIcons: { [key: string]: string } = {
  Gluten: "🌾",
  Egg: "🥚",
  Dairy: "🥛",
  Soy: "🫘",
  Fish: "🐟",
  Shellfish: "🦐",
  Peanuts: "🥜",
  "Tree Nuts": "🌰",
  Sesame: "🌱",
};

export default function NutritionFacts({
  nutrition,
  allergens,
  vegetarian,
  vegan,
  glutenFree,
}: NutritionFactsProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-[var(--yume-cream)]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-[var(--yume-cream)] transition-colors"
      >
        <span className="font-bold text-[var(--yume-charcoal)] font-body">
          Nutritional Information
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={20} className="text-[var(--yume-miso)]" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 space-y-6">
              <div className="flex flex-wrap gap-2">
                {vegetarian && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-[var(--yume-nori)] text-[var(--yume-warm-white)] text-xs font-medium">
                    <Leaf size={14} />
                    Vegetarian
                  </span>
                )}
                {vegan && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-[var(--yume-nori)] text-[var(--yume-warm-white)] text-xs font-medium">
                    <Leaf size={14} />
                    Vegan
                  </span>
                )}
                {glutenFree && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-[var(--yume-gold)] text-[var(--yume-charcoal)] text-xs font-medium">
                    <Wheat size={14} />
                    Gluten-Free
                  </span>
                )}
              </div>

              <div className="bg-[var(--yume-cream)] p-4">
                <h4 className="text-lg font-bold text-[var(--yume-charcoal)] border-b-8 border-[var(--yume-charcoal)] pb-1 mb-2 font-header">
                  Nutrition Facts
                </h4>
                <p className="text-xs text-[var(--yume-miso)] mb-2">Per Serving</p>
                
                <div className="border-t-4 border-[var(--yume-charcoal)] pt-2">
                  <div className="flex justify-between items-baseline border-b border-[var(--yume-miso)] py-1">
                    <span className="text-lg font-bold text-[var(--yume-charcoal)]">Calories</span>
                    <span className="text-lg font-bold text-[var(--yume-charcoal)]">{nutrition.calories}</span>
                  </div>
                  
                  <div className="text-xs text-right text-[var(--yume-miso)] py-1 border-b border-[var(--yume-miso)]">
                    % Daily Value*
                  </div>
                  
                  <div className="flex justify-between border-b border-[var(--yume-miso)] py-1">
                    <span className="font-bold text-[var(--yume-charcoal)]">Total Fat</span>
                    <span className="text-[var(--yume-charcoal)]">{nutrition.fat}g</span>
                  </div>
                  
                  <div className="flex justify-between border-b border-[var(--yume-miso)] py-1">
                    <span className="font-bold text-[var(--yume-charcoal)]">Sodium</span>
                    <span className="text-[var(--yume-charcoal)]">{nutrition.sodium}mg</span>
                  </div>
                  
                  <div className="flex justify-between border-b border-[var(--yume-miso)] py-1">
                    <span className="font-bold text-[var(--yume-charcoal)]">Total Carbs</span>
                    <span className="text-[var(--yume-charcoal)]">{nutrition.carbs}g</span>
                  </div>
                  
                  {nutrition.fiber && (
                    <div className="flex justify-between border-b border-[var(--yume-miso)] py-1 pl-4">
                      <span className="text-[var(--yume-charcoal)]">Dietary Fiber</span>
                      <span className="text-[var(--yume-charcoal)]">{nutrition.fiber}g</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between border-b-4 border-[var(--yume-charcoal)] py-1">
                    <span className="font-bold text-[var(--yume-charcoal)]">Protein</span>
                    <span className="text-[var(--yume-charcoal)]">{nutrition.protein}g</span>
                  </div>
                </div>
                
                <p className="text-xs text-[var(--yume-miso)] mt-2">
                  * Percent Daily Values are based on a 2,000 calorie diet.
                </p>
              </div>

              {allergens.length > 0 && (
                <div className="bg-[var(--yume-vermillion)]/10 p-4 border-l-4 border-[var(--yume-vermillion)]">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle size={18} className="text-[var(--yume-vermillion)]" />
                    <h4 className="font-bold text-[var(--yume-charcoal)] font-body">
                      Contains Allergens
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {allergens.map((allergen) => (
                      <span
                        key={allergen}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-[var(--yume-warm-white)] text-[var(--yume-charcoal)] text-sm font-medium border border-[var(--yume-vermillion)]/30"
                      >
                        <span>{allergenIcons[allergen] || "⚠️"}</span>
                        {allergen}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}