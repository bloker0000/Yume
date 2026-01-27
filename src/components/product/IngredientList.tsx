"use client";

import { motion } from "framer-motion";

interface IngredientListProps {
  ingredients: string[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export default function IngredientList({ ingredients }: IngredientListProps) {
  return (
    <div>
      <h3 className="text-lg font-bold text-[var(--yume-charcoal)] mb-4 font-header">
        Ingredients <span className="font-japanese text-[var(--yume-gold)]">材料</span>
      </h3>
      
      <motion.div
        className="flex flex-wrap gap-2"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {ingredients.map((ingredient, index) => (
          <motion.span
            key={index}
            variants={itemVariants}
            className="px-3 py-2 bg-[var(--yume-cream)] text-[var(--yume-charcoal)] text-sm font-medium hover:bg-[var(--yume-charcoal)] hover:text-[var(--yume-warm-white)] transition-colors cursor-default"
          >
            {ingredient}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
}