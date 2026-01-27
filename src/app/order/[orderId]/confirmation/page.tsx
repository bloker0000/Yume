"use client";

import { useState, useEffect, use } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  CheckCircle, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  CreditCard,
  Store,
  Truck,
  ChefHat,
  Package,
  Home,
  ArrowRight,
  Copy,
  Check,
  AlertCircle,
  Loader2
} from "lucide-react";

interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: string;
  customizations: string | null;
  menuItem: {
    id: number;
    name: string;
    image: string | null;
  } | null;
}

interface StatusHistoryEntry {
  id: number;
  status: string;
  note: string | null;
  createdAt: string;
}

interface OrderData {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  orderType: string;
  customerFirstName: string;
  customerLastName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryStreet: string | null;
  deliveryApartment: string | null;
  deliveryCity: string | null;
  deliveryPostalCode: string | null;
  deliveryInstructions: string | null;
  deliveryTimeType: string;
  scheduledDate: string | null;
  scheduledTime: string | null;
  estimatedTime: number | null;
  subtotal: string;
  deliveryFee: string;
  discount: string;
  tax: string;
  total: string;
  createdAt: string;
  items: OrderItem[];
  statusHistory: StatusHistoryEntry[];
}

const STATUS_MAP: Record<string, number> = {
  PENDING: 0,
  CONFIRMED: 1,
  PREPARING: 2,
  READY: 3,
  OUT_FOR_DELIVERY: 3,
  DELIVERED: 4,
  PICKED_UP: 4,
};

const ORDER_STEPS = [
  { id: "confirmed", label: "Order Confirmed", icon: CheckCircle },
  { id: "preparing", label: "Preparing", icon: ChefHat },
  { id: "ready", label: "Ready", icon: Package },
  { id: "delivered", label: "Delivered", icon: Home },
];

const PICKUP_STEPS = [
  { id: "confirmed", label: "Order Confirmed", icon: CheckCircle },
  { id: "preparing", label: "Preparing", icon: ChefHat },
  { id: "ready", label: "Ready for Pickup", icon: Store },
];

export default function OrderConfirmationPage({ 
  params 
}: { 
  params: Promise<{ orderId: string }> 
}) {
  const { orderId } = use(params);
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders?id=${orderId}`);
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Order not found");
        }
        const data = await response.json();
        setOrder(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load order");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
    
    const pollInterval = setInterval(fetchOrder, 10000);
    return () => clearInterval(pollInterval);
  }, [orderId]);

  const copyOrderId = () => {
    navigator.clipboard.writeText(order?.orderNumber || orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--yume-warm-white)] flex items-center justify-center">
        <Loader2 className="animate-spin text-[var(--yume-vermillion)]" size={32} />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[var(--yume-warm-white)] flex flex-col items-center justify-center px-4">
        <AlertCircle size={48} className="text-[var(--yume-vermillion)] mb-4" />
        <h1 className="text-xl font-bold text-[var(--yume-charcoal)] mb-2 font-header">
          {error || "Order Not Found"}
        </h1>
        <p className="text-[var(--yume-miso)] mb-6 font-body text-center">
          We couldn&apos;t find your order. Please check your order number or contact support.
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-[var(--yume-vermillion)] text-white font-bold hover:bg-[var(--yume-vermillion)]/90 transition-colors font-body"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  const steps = order.orderType === "DELIVERY" ? ORDER_STEPS : PICKUP_STEPS;
  const currentStep = STATUS_MAP[order.status] ?? 0;
  
  const estimatedTime = order.deliveryTimeType === "ASAP"
    ? order.estimatedTime 
      ? `${order.estimatedTime} minutes` 
      : order.orderType === "DELIVERY" ? "25-35 minutes" : "15-20 minutes"
    : order.scheduledDate && order.scheduledTime 
      ? `${order.scheduledDate} at ${order.scheduledTime}`
      : "Scheduled";

  return (
    <div className="min-h-screen bg-[var(--yume-warm-white)]">
      <header className="bg-white border-b border-[var(--yume-cream)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold text-[var(--yume-vermillion)] font-header">YUME</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
            className="w-20 h-20 bg-[var(--yume-nori)] rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <CheckCircle size={40} className="text-white" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-3xl font-bold text-[var(--yume-charcoal)] mb-2 font-header"
          >
            Order Confirmed!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-[var(--yume-miso)] font-body"
          >
            Thank you for your order, {order.customerFirstName}!
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-4 flex items-center justify-center gap-2"
          >
            <span className="text-sm text-[var(--yume-miso)] font-body">Order ID:</span>
            <span className="font-bold text-[var(--yume-charcoal)] font-body">{order.orderNumber}</span>
            <button
              onClick={copyOrderId}
              className="p-1 hover:bg-[var(--yume-cream)] rounded transition-colors"
            >
              {copied ? (
                <Check size={16} className="text-[var(--yume-nori)]" />
              ) : (
                <Copy size={16} className="text-[var(--yume-miso)]" />
              )}
            </button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white border border-[var(--yume-cream)] p-6 mb-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <Clock size={20} className="text-[var(--yume-vermillion)]" />
            <span className="font-bold text-[var(--yume-charcoal)] font-body">
              Estimated {order.orderType === "DELIVERY" ? "Delivery" : "Pickup"}: {estimatedTime}
            </span>
          </div>

          <div className="relative">
            <div className="absolute top-5 left-0 right-0 h-1 bg-[var(--yume-cream)]" />
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
              transition={{ duration: 0.5 }}
              className="absolute top-5 left-0 h-1 bg-[var(--yume-nori)]"
            />

            <div className="relative flex justify-between">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = index <= currentStep;
                const isCurrent = index === currentStep;

                return (
                  <div key={step.id} className="flex flex-col items-center">
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{
                        scale: isCurrent ? 1.1 : 1,
                        backgroundColor: isActive ? "var(--yume-nori)" : "var(--yume-cream)",
                      }}
                      transition={{ duration: 0.3 }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${
                        isActive ? "text-white" : "text-[var(--yume-miso)]"
                      }`}
                    >
                      <Icon size={20} />
                    </motion.div>
                    <span
                      className={`mt-2 text-xs font-body text-center ${
                        isActive ? "text-[var(--yume-charcoal)] font-bold" : "text-[var(--yume-miso)]"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white border border-[var(--yume-cream)] p-6"
          >
            <h2 className="font-bold text-[var(--yume-charcoal)] mb-4 font-header flex items-center gap-2">
              {order.orderType === "DELIVERY" ? (
                <>
                  <Truck size={18} className="text-[var(--yume-vermillion)]" />
                  Delivery Details
                </>
              ) : (
                <>
                  <Store size={18} className="text-[var(--yume-vermillion)]" />
                  Pickup Details
                </>
              )}
            </h2>

            <div className="space-y-3 text-sm font-body">
              <div className="flex items-start gap-2">
                <MapPin size={16} className="text-[var(--yume-miso)] mt-0.5 flex-shrink-0" />
                {order.orderType === "DELIVERY" && order.deliveryStreet ? (
                  <div>
                    <p className="text-[var(--yume-charcoal)]">
                      {order.deliveryStreet}
                      {order.deliveryApartment && `, ${order.deliveryApartment}`}
                    </p>
                    <p className="text-[var(--yume-miso)]">
                      {order.deliveryPostalCode} {order.deliveryCity}
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-[var(--yume-charcoal)]">Yume Ramen</p>
                    <p className="text-[var(--yume-miso)]">Westerstraat 52, 1015 MN Amsterdam</p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Phone size={16} className="text-[var(--yume-miso)]" />
                <span className="text-[var(--yume-charcoal)]">{order.customerPhone}</span>
              </div>

              <div className="flex items-center gap-2">
                <Mail size={16} className="text-[var(--yume-miso)]" />
                <span className="text-[var(--yume-charcoal)]">{order.customerEmail}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-white border border-[var(--yume-cream)] p-6"
          >
            <h2 className="font-bold text-[var(--yume-charcoal)] mb-4 font-header flex items-center gap-2">
              <CreditCard size={18} className="text-[var(--yume-vermillion)]" />
              Payment
            </h2>

            <div className="space-y-2 text-sm font-body">
              <p className="text-[var(--yume-charcoal)]">Online Payment</p>
              <p className={`font-bold ${order.paymentStatus === "PAID" ? "text-[var(--yume-nori)]" : "text-[var(--yume-vermillion)]"}`}>
                {order.paymentStatus === "PAID" ? "Paid" : order.paymentStatus === "PENDING" ? "Payment Pending" : "Payment " + order.paymentStatus}
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="bg-white border border-[var(--yume-cream)] p-6 mb-6"
        >
          <h2 className="font-bold text-[var(--yume-charcoal)] mb-4 font-header">Order Summary</h2>

          <div className="space-y-3 mb-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-3">
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-bold text-[var(--yume-charcoal)] text-sm font-body">
                      {item.name}
                    </h3>
                    <span className="font-bold text-[var(--yume-charcoal)] text-sm font-body">
                      EUR {(parseFloat(item.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--yume-miso)] font-body">Qty: {item.quantity}</p>
                  {item.customizations && (
                    <div className="text-xs text-[var(--yume-miso)] font-body">
                      {item.customizations}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-[var(--yume-cream)] pt-4 space-y-2 text-sm font-body">
            <div className="flex justify-between text-[var(--yume-miso)]">
              <span>Subtotal</span>
              <span>EUR {parseFloat(order.subtotal).toFixed(2)}</span>
            </div>
            {order.orderType === "DELIVERY" && (
              <div className="flex justify-between text-[var(--yume-miso)]">
                <span>Delivery</span>
                <span>{parseFloat(order.deliveryFee) > 0 ? `EUR ${parseFloat(order.deliveryFee).toFixed(2)}` : "Free"}</span>
              </div>
            )}
            {parseFloat(order.discount) > 0 && (
              <div className="flex justify-between text-[var(--yume-nori)]">
                <span>Discount</span>
                <span>-EUR {parseFloat(order.discount).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-[var(--yume-miso)]">
              <span>Tax (9%)</span>
              <span>EUR {parseFloat(order.tax).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-[var(--yume-charcoal)] pt-2 border-t border-[var(--yume-cream)]">
              <span>Total</span>
              <span className="text-[var(--yume-vermillion)]">EUR {parseFloat(order.total).toFixed(2)}</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="text-center space-y-4"
        >
          <p className="text-sm text-[var(--yume-miso)] font-body">
            A confirmation email has been sent to {order.customerEmail}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/menu"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--yume-vermillion)] text-white font-bold hover:bg-[var(--yume-vermillion)]/90 transition-colors font-body"
            >
              Order More
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-[var(--yume-charcoal)] text-[var(--yume-charcoal)] font-bold hover:bg-[var(--yume-charcoal)] hover:text-white transition-colors font-body"
            >
              Back to Home
            </Link>
          </div>
        </motion.div>
      </main>

      <footer className="mt-12 py-6 border-t border-[var(--yume-cream)]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-sm text-[var(--yume-miso)] font-body">
            Need help? Contact us at{" "}
            <a href="tel:+31201234567" className="text-[var(--yume-vermillion)] hover:underline">
              +31 20 123 4567
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}