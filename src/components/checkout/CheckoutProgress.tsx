"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface CheckoutProgressProps {
  currentStep: number;
  steps: { id: number; title: string }[];
}

export default function CheckoutProgress({ currentStep, steps }: CheckoutProgressProps) {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between max-w-2xl mx-auto px-4">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          return (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative w-10 h-10 flex items-center justify-center transition-all duration-300 ${
                    isCompleted
                      ? "bg-[var(--yume-nori)] text-[var(--yume-warm-white)]"
                      : isCurrent
                      ? "bg-[var(--yume-vermillion)] text-[var(--yume-warm-white)]"
                      : "bg-[var(--yume-cream)] text-[var(--yume-miso)]"
                  }`}
                >
                  {isCompleted ? (
                    <Check size={20} strokeWidth={3} />
                  ) : (
                    <span className="text-sm font-bold">{step.id}</span>
                  )}
                </motion.div>
                <span
                  className={`mt-2 text-xs font-body hidden sm:block ${
                    isCurrent ? "text-[var(--yume-charcoal)] font-bold" : "text-[var(--yume-miso)]"
                  }`}
                >
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className="flex-1 mx-2 sm:mx-4">
                  <div className="h-0.5 bg-[var(--yume-cream)] relative overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: isCompleted ? "100%" : "0%" }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0 bg-[var(--yume-nori)]"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const checkoutSteps = [
  { id: 1, title: "Details" },
  { id: 2, title: "Delivery" },
  { id: 3, title: "Payment" },
];