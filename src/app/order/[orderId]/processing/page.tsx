"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, CheckCircle, XCircle, RefreshCw } from "lucide-react";

interface ProcessingPageProps {
  params: Promise<{ orderId: string }>;
}

export default function OrderProcessingPage({ params }: ProcessingPageProps) {
  const router = useRouter();
  const [orderId, setOrderId] = useState<string>("");
  const [status, setStatus] = useState<"checking" | "confirmed" | "failed">("checking");
  const [attempts, setAttempts] = useState(0);
  const maxAttempts = 30;

  useEffect(() => {
    params.then(p => setOrderId(p.orderId));
  }, [params]);

  useEffect(() => {
    if (!orderId) return;

    const checkOrderStatus = async () => {
      try {
        const response = await fetch(`/api/orders?orderId=${orderId}`);
        
        if (!response.ok) {
          if (attempts >= maxAttempts) {
            setStatus("failed");
            return;
          }
          setAttempts(prev => prev + 1);
          return;
        }

        const order = await response.json();

        if (order.paymentStatus === "PAID" && order.status === "CONFIRMED") {
          setStatus("confirmed");
          setTimeout(() => {
            router.push(`/order/${orderId}/confirmation`);
          }, 1500);
        } else if (order.paymentStatus === "FAILED" || order.status === "CANCELLED") {
          setStatus("failed");
        } else {
          if (attempts >= maxAttempts) {
            router.push(`/order/${orderId}/confirmation`);
          } else {
            setAttempts(prev => prev + 1);
          }
        }
      } catch (error) {
        console.error("Error checking order status:", error);
        if (attempts >= maxAttempts) {
          setStatus("failed");
        } else {
          setAttempts(prev => prev + 1);
        }
      }
    };

    const interval = setInterval(checkOrderStatus, 2000);
    checkOrderStatus();

    return () => clearInterval(interval);
  }, [orderId, attempts, router]);

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
                animate={{ width: `${(attempts / maxAttempts) * 100}%` }}
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
                  setAttempts(0);
                }}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-[var(--yume-vermillion)] text-white font-bold font-body hover:bg-[var(--yume-charcoal)] transition-colors"
              >
                <RefreshCw size={18} />
                Try Again
              </button>
              <button
                onClick={() => router.push(`/order/${orderId}/confirmation`)}
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
