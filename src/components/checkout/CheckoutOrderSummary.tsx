"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ChevronDown, ChevronUp, Edit2 } from "lucide-react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  customizations?: {
    spiceLevel?: string;
    protein?: string;
    extras?: string[];
    specialInstructions?: string;
  };
}

interface CheckoutOrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  promoCode: string;
  onPromoApply: (code: string) => Promise<{ valid: boolean; discount: number; message: string }>;
  onRemovePromo: () => void;
  onQuantityChange: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  orderType: "delivery" | "pickup";
}

export default function CheckoutOrderSummary({
  items,
  subtotal,
  deliveryFee,
  discount,
  promoCode,
  onPromoApply,
  onRemovePromo,
  onQuantityChange,
  onRemoveItem,
  orderType,
}: CheckoutOrderSummaryProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [promoInput, setPromoInput] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");

  const tax = (subtotal - discount) * 0.09;
  const total = subtotal + (orderType === "delivery" ? deliveryFee : 0) + tax - discount;

  const handleApplyPromo = async () => {
    if (!promoInput.trim()) return;
    setPromoLoading(true);
    setPromoError("");
    setPromoSuccess("");
    
    try {
      const result = await onPromoApply(promoInput.toUpperCase());
      if (result.valid) {
        setPromoSuccess(result.message);
        setPromoInput("");
      } else {
        setPromoError(result.message);
      }
    } catch {
      setPromoError("Failed to apply promo code");
    } finally {
      setPromoLoading(false);
    }
  };

  return (
    <div className="bg-white border border-[var(--yume-cream)] sticky top-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 border-b border-[var(--yume-cream)] lg:cursor-default"
      >
        <h2 className="text-lg font-bold text-[var(--yume-charcoal)] font-header">
          Order Summary
        </h2>
        <div className="flex items-center gap-2 lg:hidden">
          <span className="text-[var(--yume-vermillion)] font-bold font-body">
            EUR {total.toFixed(2)}
          </span>
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-4 max-h-[300px] overflow-y-auto">
              {items.length === 0 ? (
                <p className="text-center text-[var(--yume-miso)] py-8 font-body">
                  Your cart is empty
                </p>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    className="flex gap-3 pb-4 border-b border-[var(--yume-cream)] last:border-0"
                  >
                    <div className="relative w-16 h-16 flex-shrink-0 bg-[var(--yume-cream)]">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-bold text-[var(--yume-charcoal)] text-sm truncate font-body">
                            {item.name}
                          </h3>
                          {item.customizations && (
                            <div className="text-xs text-[var(--yume-miso)] mt-0.5 space-y-0.5 font-body">
                              {item.customizations.spiceLevel && (
                                <p>Spice: {item.customizations.spiceLevel}</p>
                              )}
                              {item.customizations.protein && (
                                <p>Protein: {item.customizations.protein}</p>
                              )}
                              {item.customizations.extras && item.customizations.extras.length > 0 && (
                                <p>+{item.customizations.extras.length} extras</p>
                              )}
                            </div>
                          )}
                        </div>
                        <Link
                          href={`/menu/${item.id}`}
                          className="text-[var(--yume-miso)] hover:text-[var(--yume-vermillion)] transition-colors"
                        >
                          <Edit2 size={14} />
                        </Link>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1 bg-[var(--yume-cream)] rounded-full">
                          <button
                            onClick={() => onQuantityChange(item.id, Math.max(0, item.quantity - 1))}
                            className="w-6 h-6 flex items-center justify-center hover:bg-[var(--yume-miso)]/10 rounded-full transition-colors"
                          >
                            {item.quantity === 1 ? <Trash2 size={12} className="text-red-500" /> : <Minus size={12} />}
                          </button>
                          <span className="w-6 text-center text-sm font-bold text-[var(--yume-charcoal)] font-body">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onQuantityChange(item.id, item.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center hover:bg-[var(--yume-miso)]/10 rounded-full transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <span className="font-bold text-[var(--yume-charcoal)] text-sm font-body">
                          EUR {(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            <div className="p-4 border-t border-[var(--yume-cream)] space-y-3">
              {!promoCode ? (
                <div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                      placeholder="Promo code"
                      className="flex-1 px-3 py-2 border border-[var(--yume-cream)] bg-[var(--yume-warm-white)] text-sm focus:outline-none focus:border-[var(--yume-vermillion)] font-body"
                    />
                    <button
                      onClick={handleApplyPromo}
                      disabled={promoLoading || !promoInput.trim()}
                      className="px-4 py-2 bg-[var(--yume-charcoal)] text-white text-sm font-bold hover:bg-[var(--yume-nori)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-body"
                    >
                      {promoLoading ? "..." : "Apply"}
                    </button>
                  </div>
                  {promoError && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-1 text-xs text-red-500 font-body"
                    >
                      {promoError}
                    </motion.p>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-between bg-[var(--yume-nori)]/10 p-2 rounded">
                  <div>
                    <span className="text-sm font-bold text-[var(--yume-nori)] font-body">{promoCode}</span>
                    {promoSuccess && (
                      <p className="text-xs text-[var(--yume-nori)] font-body">{promoSuccess}</p>
                    )}
                  </div>
                  <button
                    onClick={onRemovePromo}
                    className="text-xs text-[var(--yume-miso)] hover:text-red-500 transition-colors font-body"
                  >
                    Remove
                  </button>
                </div>
              )}

              <div className="space-y-2 text-sm font-body">
                <div className="flex justify-between text-[var(--yume-miso)]">
                  <span>Subtotal</span>
                  <span>EUR {subtotal.toFixed(2)}</span>
                </div>
                {orderType === "delivery" && (
                  <div className="flex justify-between text-[var(--yume-miso)]">
                    <span>Delivery</span>
                    <span>{deliveryFee > 0 ? `EUR ${deliveryFee.toFixed(2)}` : "Free"}</span>
                  </div>
                )}
                {discount > 0 && (
                  <div className="flex justify-between text-[var(--yume-nori)]">
                    <span>Discount</span>
                    <span>-EUR {discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[var(--yume-miso)]">
                  <span>Tax (9%)</span>
                  <span>EUR {tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[var(--yume-cream)] flex justify-between items-center">
                <span className="font-bold text-[var(--yume-charcoal)] font-body">Total</span>
                <span className="text-xl font-bold text-[var(--yume-vermillion)] font-body">
                  EUR {total.toFixed(2)}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}