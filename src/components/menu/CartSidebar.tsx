"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X, Minus, Plus, ShoppingBag, Trash2, ChevronUp, Clock, ChevronRight, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { toppings, brothRichness, noodleFirmness, spiceLevels } from "@/data/menuData";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const router = useRouter();
  const { items, removeItem, updateQuantity, subtotal, deliveryFee, total } = useCart();

  const freeDeliveryThreshold = 25;
  const amountUntilFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);

  const getToppingNames = (toppingIds: string[]) => {
    return toppingIds
      .map((id) => toppings.find((t) => t.id === id)?.name)
      .filter(Boolean)
      .join(", ");
  };

  const getCustomizationSummary = (customization: typeof items[0]["customization"]) => {
    if (!customization) return null;
    const parts: string[] = [];
    
    if (customization.brothRichness) {
      const broth = brothRichness.find(b => b.id === customization.brothRichness);
      if (broth && broth.id !== "medium") parts.push(`${broth.name} broth`);
    }
    if (customization.noodleFirmness) {
      const noodle = noodleFirmness.find(n => n.id === customization.noodleFirmness);
      if (noodle && noodle.id !== "medium") parts.push(`${noodle.name} noodles`);
    }
    if (customization.spiceLevel !== undefined && customization.spiceLevel > 0) {
      const spice = spiceLevels.find(s => s.id === customization.spiceLevel);
      if (spice) parts.push(spice.name);
    }
    
    return parts.length > 0 ? parts.join(", ") : null;
  };

  const handleCheckout = () => {
    onClose();
    router.push("/checkout");
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
            className="fixed inset-0 bg-[var(--yume-charcoal)]/80 backdrop-blur-sm z-[60] lg:hidden"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full sm:max-w-md bg-[var(--yume-warm-white)] shadow-2xl z-[70] flex flex-col"
          >
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[var(--yume-vermillion)]" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[var(--yume-vermillion)]" />

            <div className="flex items-center justify-between p-4 border-b border-[var(--yume-cream)]">
              <div className="flex items-center gap-3">
                <ShoppingBag className="text-[var(--yume-vermillion)]" size={24} />
                <div>
                  <h2 className="text-lg font-bold text-[var(--yume-charcoal)] font-header">
                    Your Order
                  </h2>
                  <p className="text-sm text-[var(--yume-miso)] font-body">
                    {items.length} {items.length === 1 ? "item" : "items"}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-3 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-[var(--yume-cream)] transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {amountUntilFreeDelivery > 0 && items.length > 0 && (
              <div className="px-4 py-3 bg-[var(--yume-cream)]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex-1 h-2 bg-[var(--yume-warm-white)] overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (subtotal / freeDeliveryThreshold) * 100)}%` }}
                      className="h-full bg-[var(--yume-vermillion)]"
                    />
                  </div>
                </div>
                <p className="text-sm text-[var(--yume-charcoal)] font-body">
                  Add <span className="font-bold text-[var(--yume-vermillion)]">€{amountUntilFreeDelivery.toFixed(2)}</span> more for free delivery!
                </p>
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-32 h-32 mb-6">
                    <Image
                      src="/emptycart illustration.png"
                      alt="Empty cart"
                      width={128}
                      height={128}
                      className="object-contain"
                    />
                  </div>
                  <h3 className="text-lg font-bold text-[var(--yume-charcoal)] mb-2 font-header">
                    Your cart is empty
                  </h3>
                  <p className="text-[var(--yume-miso)] font-body mb-4">
                    Add some delicious ramen to get started!
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      router.push('/menu');
                    }}
                    className="px-6 py-2 bg-[var(--yume-charcoal)] text-[var(--yume-warm-white)] font-medium hover:bg-[var(--yume-vermillion)] transition-colors font-body"
                  >
                    Browse Menu
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => {
                    const itemDetails = item.menuItem;
                    const customSummary = getCustomizationSummary(item.customization);

                    return (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        className="bg-[var(--yume-cream)]"
                      >
                        <Link
                          href={`/menu/${itemDetails.slug}`}
                          onClick={() => {
                            if (item.customization) {
                              sessionStorage.setItem(
                                `yume-preview-customization-${itemDetails.slug}`,
                                JSON.stringify(item.customization)
                              );
                            }
                            onClose();
                          }}
                          className="flex gap-3 p-3 hover:bg-[var(--yume-cream)]/80 transition-colors group"
                        >
                          <div className="relative w-20 h-20 flex-shrink-0">
                            <Image
                              src={itemDetails.image}
                              alt={itemDetails.name}
                              fill
                              className="object-cover"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div className="flex items-center gap-1">
                                  <h4 className="font-medium text-[var(--yume-charcoal)] font-header text-sm group-hover:text-[var(--yume-vermillion)] transition-colors">
                                    {itemDetails.name}
                                  </h4>
                                  <ChevronRight size={14} className="text-[var(--yume-miso)] opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <p className="text-xs text-[var(--yume-miso)] font-japanese">
                                  {itemDetails.japanese}
                                </p>
                              </div>
                            </div>

                            {item.customization && (
                              <div className="mt-1 text-xs text-[var(--yume-miso)] font-body space-y-0.5">
                                {customSummary && (
                                  <p>{customSummary}</p>
                                )}
                                {item.customization.toppings && item.customization.toppings.length > 0 && (
                                  <p>+ {getToppingNames(item.customization.toppings)}</p>
                                )}
                                {item.customization.specialInstructions && (
                                  <p className="italic truncate">"{item.customization.specialInstructions}"</p>
                                )}
                              </div>
                            )}
                          </div>
                        </Link>

                        <div className="flex items-center justify-between px-3 pb-3">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center border border-[var(--yume-warm-white)]">
                              <button
                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                className="p-2 min-w-[40px] min-h-[40px] flex items-center justify-center hover:bg-[var(--yume-warm-white)] transition-colors"
                              >
                                <Minus size={16} />
                              </button>
                              <span className="w-10 text-center text-sm font-medium">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-2 min-w-[40px] min-h-[40px] flex items-center justify-center hover:bg-[var(--yume-warm-white)] transition-colors"
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="p-2 min-w-[40px] min-h-[40px] flex items-center justify-center text-[var(--yume-miso)] hover:text-[var(--yume-vermillion)] transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                          <p className="font-bold text-[var(--yume-vermillion)] font-header">
                            €{item.totalPrice.toFixed(2)}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-[var(--yume-cream)] p-4 pb-safe bg-[var(--yume-warm-white)]">
                <div className="flex items-center gap-4 mb-4 p-3 bg-[var(--yume-cream)]">
                  <Clock size={18} className="text-[var(--yume-miso)]" />
                  <div>
                    <p className="text-sm font-medium text-[var(--yume-charcoal)] font-body">
                      Estimated delivery
                    </p>
                    <p className="text-xs text-[var(--yume-miso)] font-body">
                      25-35 minutes
                    </p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm font-body">
                    <span className="text-[var(--yume-miso)]">Subtotal</span>
                    <span className="text-[var(--yume-charcoal)]">€{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-body">
                    <span className="text-[var(--yume-miso)]">Delivery</span>
                    <span className={deliveryFee === 0 ? "text-green-600" : "text-[var(--yume-charcoal)]"}>
                      {deliveryFee === 0 ? "Free" : `€${deliveryFee.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="h-px bg-[var(--yume-cream)] my-2" />
                  <div className="flex justify-between text-lg font-bold font-header">
                    <span className="text-[var(--yume-charcoal)]">Total</span>
                    <span className="text-[var(--yume-vermillion)]">€{total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full py-4 min-h-[56px] bg-[var(--yume-charcoal)] text-[var(--yume-warm-white)] font-medium hover:bg-[var(--yume-vermillion)] transition-colors font-body flex items-center justify-center gap-2"
                >
                  Checkout
                  <ArrowRight size={18} />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function FloatingCartButton({ onClick }: { onClick: () => void }) {
  const { items, total } = useCart();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  if (items.length === 0) return null;

  return (
    <motion.button
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      onClick={onClick}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 lg:hidden flex items-center gap-4 px-6 py-4 min-h-[56px] bg-[var(--yume-charcoal)] text-[var(--yume-warm-white)] shadow-2xl mb-safe"
    >
      <div className="relative">
        <ShoppingBag size={24} />
        <span className="absolute -top-2 -right-2 w-5 h-5 bg-[var(--yume-vermillion)] text-xs font-bold flex items-center justify-center">
          {totalItems}
        </span>
      </div>
      <div className="text-left">
        <p className="text-sm font-body">View Order</p>
        <p className="font-bold font-header">€{total.toFixed(2)}</p>
      </div>
      <ChevronUp size={20} />
    </motion.button>
  );
}