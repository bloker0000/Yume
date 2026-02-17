"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Loader2, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface ProcessingPageProps {
  params: Promise<{ orderId: string }>;
}

export default function OrderProcessingPage({ params }: ProcessingPageProps) {
  const { clearCart } = useCart();
  const [orderId, setOrderId] = useState<string>("");
  const [status, setStatus] = useState<"checking" | "confirmed" | "failed">("checking");
  const [progress, setProgress] = useState(0);
  const attemptsRef = useRef(0);
  const maxAttempts = 30;

  useEffect(() => {
    params.then(p => setOrderId(p.orderId));
  }, [params]);

  // Clear cart when landing on this page (after payment redirect)
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  const handleRedirect = useCallback((id: string) => {
    setProgress(100);
    setTimeout(() => {
      setStatus("confirmed");
      setTimeout(() => {
        window.location.href = `/order/${id}/confirmation`;
      }, 1500);
    }, 500);
  }, []);

  useEffect(() => {
    if (!orderId) return;
    
    let intervalId: NodeJS.Timeout | null = null;
    let cancelled = false;

    const checkOrderStatus = async () => {
      if (cancelled) return;
      
      try {
        const response = await fetch(`/api/orders?orderId=${orderId}`, {
          cache: "no-store",
          headers: { "Cache-Control": "no-cache" },
        });
        
        if (cancelled) return;

        if (!response.ok) {
          if (attemptsRef.current >= maxAttempts) {
            setStatus("failed");
            if (intervalId) clearInterval(intervalId);
            return;
          }
          attemptsRef.current += 1;
          setProgress(prev => Math.min(prev + (100 / maxAttempts), 95));
          return;
        }

        const order = await response.json();
        if (cancelled) return;

        if (order.paymentStatus === "PAID" && order.status === "CONFIRMED") {
          if (intervalId) clearInterval(intervalId);
          cancelled = true;
          handleRedirect(orderId);
        } else if (order.paymentStatus === "FAILED" || order.status === "CANCELLED") {
          if (intervalId) clearInterval(intervalId);
          setStatus("failed");
        } else {
          if (attemptsRef.current >= maxAttempts) {
            if (intervalId) clearInterval(intervalId);
            window.location.href = `/order/${orderId}/confirmation`;
          } else {
            attemptsRef.current += 1;
            setProgress(prev => Math.min(prev + (100 / maxAttempts), 95));
          }
        }
      } catch (error) {
        console.error("Error checking order status:", error);
        if (cancelled) return;
        if (attemptsRef.current >= maxAttempts) {
          if (intervalId) clearInterval(intervalId);
          setStatus("failed");
        } else {
          attemptsRef.current += 1;
          setProgress(prev => Math.min(prev + (100 / maxAttempts), 95));
        }
      }
    };

    intervalId = setInterval(checkOrderStatus, 2000);
    checkOrderStatus();

    return () => {
      cancelled = true;
      if (intervalId) clearInterval(intervalId);
    };
  }, [orderId, handleRedirect]);

  return (
    <div className="min-h-screen bg-[var(--yume-warm-white)] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white border border-[var(--yume-cream)] p-8 text-center"
      >
        {status === "checking" && (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="inline-block mb-6"
            >
              <Loader2 size={64} className="text-[var(--yume-vermillion)]" />
            </motion.div>
            <h1 className="text-2xl font-bold text-[var(--yume-charcoal)] mb-3 font-header">
              Processing Your Payment
            </h1>
            <p className="text-[var(--yume-miso)] font-body mb-6">
              Please wait while we confirm your order...
            </p>
            <div className="w-full bg-[var(--yume-cream)] h-2 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[var(--yume-vermillion)]"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p className="text-xs text-[var(--yume-miso)] mt-2 font-body">
              This usually takes just a few seconds
            </p>
          </>
        )}

        {status === "confirmed" && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="inline-block mb-6"
            >
              <CheckCircle size={64} className="text-green-600" />
            </motion.div>
            <h1 className="text-2xl font-bold text-[var(--yume-charcoal)] mb-3 font-header">
              Payment Confirmed!
            </h1>
            <p className="text-[var(--yume-miso)] font-body">
              Redirecting to your order details...
            </p>
          </>
        )}

        {status === "failed" && (
          <>
            <XCircle size={64} className="text-red-600 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-[var(--yume-charcoal)] mb-3 font-header">
              Payment Processing Issue
            </h1>
            <p className="text-[var(--yume-miso)] font-body mb-6">
              We're having trouble confirming your payment. This might be temporary.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  setStatus("checking");
                  setProgress(0);
                  attemptsRef.current = 0;
                }}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-[var(--yume-vermillion)] text-white font-bold font-body hover:bg-[var(--yume-charcoal)] transition-colors"
              >
                <RefreshCw size={18} />
                Try Again
              </button>
              <button
                onClick={() => { window.location.href = `/order/${orderId}/confirmation`; }}
                className="px-6 py-3 border-2 border-[var(--yume-charcoal)] text-[var(--yume-charcoal)] font-bold font-body hover:bg-[var(--yume-charcoal)] hover:text-white transition-colors"
              >
                View Order Details
              </button>
              <a
                href="tel:+31201234567"
                className="text-sm text-[var(--yume-miso)] hover:text-[var(--yume-vermillion)] font-body"
              >
                Or call us at +31 20 123 4567
              </a>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
