"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tag, X, Check, Loader2 } from "lucide-react";

interface PromoCodeInputProps {
  appliedCode: string | null;
  discount: number;
  onApply: (code: string) => Promise<{ valid: boolean; discount: number; message: string }>;
  onRemove: () => void;
}

export default function PromoCodeInput({
  appliedCode,
  discount,
  onApply,
  onRemove,
}: PromoCodeInputProps) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isOpen, setIsOpen] = useState(!!appliedCode);

  const handleApply = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await onApply(code.toUpperCase());
      if (result.valid) {
        setSuccess(result.message);
        setCode("");
      } else {
        setError(result.message);
      }
    } catch {
      setError("Failed to apply promo code");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    onRemove();
    setSuccess("");
    setIsOpen(false);
  };

  if (appliedCode) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between p-3 bg-[var(--yume-nori)]/10 border border-[var(--yume-nori)]/30"
      >
        <div className="flex items-center gap-2">
          <Check size={16} className="text-[var(--yume-nori)]" />
          <div>
            <span className="font-bold text-[var(--yume-nori)] font-body">{appliedCode}</span>
            <span className="text-sm text-[var(--yume-nori)] ml-2 font-body">
              -EUR {discount.toFixed(2)} off
            </span>
          </div>
        </div>
        <button
          onClick={handleRemove}
          className="p-1 hover:bg-[var(--yume-nori)]/20 rounded transition-colors"
          aria-label="Remove promo code"
        >
          <X size={16} className="text-[var(--yume-nori)]" />
        </button>
      </motion.div>
    );
  }

  return (
    <div>
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 text-[var(--yume-vermillion)] hover:text-[var(--yume-vermillion)]/80 transition-colors font-body text-sm"
        >
          <Tag size={16} />
          Have a promo code?
        </button>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === "Enter" && handleApply()}
                  placeholder="Enter code"
                  className="w-full px-3 py-2 border border-[var(--yume-cream)] bg-[var(--yume-warm-white)] font-body text-sm focus:outline-none focus:border-[var(--yume-vermillion)]"
                />
              </div>
              <button
                onClick={handleApply}
                disabled={loading || !code.trim()}
                className="px-4 py-2 bg-[var(--yume-charcoal)] text-white text-sm font-bold hover:bg-[var(--yume-nori)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-body flex items-center gap-2"
              >
                {loading ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  "Apply"
                )}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="px-2 text-[var(--yume-miso)] hover:text-[var(--yume-charcoal)] transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-2 text-sm text-red-500 font-body"
              >
                {error}
              </motion.p>
            )}
            {success && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-2 text-sm text-[var(--yume-nori)] font-body"
              >
                {success}
              </motion.p>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}