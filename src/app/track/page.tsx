"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Search,
  Package,
  Phone,
  AlertCircle,
  Loader2,
  ArrowLeft,
} from "lucide-react";

export default function TrackOrderPage() {
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!orderNumber.trim()) {
      setError("Please enter your order number");
      return;
    }

    if (!phone.trim()) {
      setError("Please enter your phone number");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `/api/orders/tracking?orderNumber=${encodeURIComponent(orderNumber.trim())}&phone=${encodeURIComponent(phone.trim())}`
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Order not found");
      }

      sessionStorage.setItem(`track-phone-${orderNumber.trim().toUpperCase()}`, phone.trim());
      router.push(`/track/${orderNumber.trim().toUpperCase()}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to find order");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--yume-warm-white)]">
      <header className="bg-white border-b border-[var(--yume-cream)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-bold text-[var(--yume-vermillion)] font-header">
                YUME
              </span>
            </Link>
            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-[var(--yume-miso)] hover:text-[var(--yume-charcoal)] font-body"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Back to Home</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 sm:px-6 py-8 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[var(--yume-vermillion)] flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <Package size={32} className="text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--yume-charcoal)] mb-2 font-header">
            Track Your Order
          </h1>
          <p className="text-sm sm:text-base text-[var(--yume-miso)] font-body">
            Enter your order details to see real-time tracking
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-[var(--yume-cream)] p-4 sm:p-6"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="orderNumber"
                className="block text-sm font-medium text-[var(--yume-charcoal)] mb-2 font-body"
              >
                Order Number
              </label>
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--yume-miso)]"
                />
                <input
                  type="text"
                  id="orderNumber"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                  placeholder="YUM-XXXXXXXX-XXXX"
                  className="w-full pl-10 pr-4 py-3 min-h-[48px] text-base border border-[var(--yume-cream)] bg-[var(--yume-warm-white)] focus:outline-none focus:ring-2 focus:ring-[var(--yume-vermillion)] focus:border-transparent font-body"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-[var(--yume-charcoal)] mb-2 font-body"
              >
                Phone Number
              </label>
              <div className="relative">
                <Phone
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--yume-miso)]"
                />
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+31 6 12345678"
                  className="w-full pl-10 pr-4 py-3 min-h-[48px] text-base border border-[var(--yume-cream)] bg-[var(--yume-warm-white)] focus:outline-none focus:ring-2 focus:ring-[var(--yume-vermillion)] focus:border-transparent font-body"
                />
              </div>
              <p className="text-xs text-[var(--yume-miso)] mt-1 font-body">
                Enter the phone number you used when placing the order
              </p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 text-sm font-body"
              >
                <AlertCircle size={18} />
                <span>{error}</span>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 min-h-[56px] bg-[var(--yume-charcoal)] text-white font-bold hover:bg-[var(--yume-vermillion)] transition-colors font-body flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Finding your order...
                </>
              ) : (
                <>
                  Track Order
                  <Search size={18} />
                </>
              )}
            </button>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-[var(--yume-miso)] font-body mb-4">
            Can&apos;t find your order confirmation email?
          </p>
          <Link
            href="/contact"
            className="text-[var(--yume-vermillion)] font-medium hover:underline font-body"
          >
            Contact our support team
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 p-4 bg-[var(--yume-cream)]/50 text-center"
        >
          <p className="text-xs text-[var(--yume-miso)] font-body">
            Tip: Check your email or SMS for your order confirmation with the tracking link.
          </p>
        </motion.div>
      </main>
    </div>
  );
}