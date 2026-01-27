"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
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
  Check
} from "lucide-react";

interface OrderData {
  orderId: string;
  items: Array<{
    id: string;
    menuItem: {
      id: string;
      name: string;
      price: number;
      image: string;
    };
    quantity: number;
    totalPrice: number;
    customization?: {
      spiceLevel?: number;
      toppings?: string[];
    };
  }>;
  orderType: "delivery" | "pickup";
  contactInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  addressInfo: {
    street: string;
    apartment?: string;
    city: string;
    postalCode: string;
  } | null;
  deliveryTime: {
    type: "asap" | "scheduled";
    date?: string;
    time?: string;
  };
  paymentInfo: {
    method: "card" | "ideal" | "cash";
  };
  subtotal: number;
  deliveryFee: number;
  discount: number;
  tax: number;
  total: number;
  createdAt: string;
}

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
  const router = useRouter();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [copied, setCopied] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const savedOrder = sessionStorage.getItem("lastOrder");
    if (savedOrder) {
      const parsed = JSON.parse(savedOrder);
      if (parsed.orderId === orderId) {
        setOrder(parsed);
      } else {
        router.push("/");
      }
    } else {
      router.push("/");
    }
  }, [orderId, router]);

  useEffect(() => {
    if (!order) return;

    const timer1 = setTimeout(() => setCurrentStep(1), 3000);
    const timer2 = setTimeout(() => setCurrentStep(2), 8000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [order]);

  const copyOrderId = () => {
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-[var(--yume-warm-white)] flex items-center justify-center">
        <div className="animate-pulse text-[var(--yume-miso)]">Loading order...</div>
      </div>
    );
  }

  const steps = order.orderType === "delivery" ? ORDER_STEPS : PICKUP_STEPS;
  const estimatedTime = order.deliveryTime.type === "asap"
    ? order.orderType === "delivery" ? "25-35 minutes" : "15-20 minutes"
    : `${order.deliveryTime.date} at ${order.deliveryTime.time}`;

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
            Thank you for your order, {order.contactInfo.firstName}!
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-4 flex items-center justify-center gap-2"
          >
            <span className="text-sm text-[var(--yume-miso)] font-body">Order ID:</span>
            <span className="font-bold text-[var(--yume-charcoal)] font-body">{orderId}</span>
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
              Estimated {order.orderType === "delivery" ? "Delivery" : "Pickup"}: {estimatedTime}
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
              {order.orderType === "delivery" ? (
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
                {order.orderType === "delivery" && order.addressInfo ? (
                  <div>
                    <p className="text-[var(--yume-charcoal)]">
                      {order.addressInfo.street}
                      {order.addressInfo.apartment && `, ${order.addressInfo.apartment}`}
                    </p>
                    <p className="text-[var(--yume-miso)]">
                      {order.addressInfo.postalCode} {order.addressInfo.city}
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
                <span className="text-[var(--yume-charcoal)]">{order.contactInfo.phone}</span>
              </div>

              <div className="flex items-center gap-2">
                <Mail size={16} className="text-[var(--yume-miso)]" />
                <span className="text-[var(--yume-charcoal)]">{order.contactInfo.email}</span>
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
              <p className="text-[var(--yume-charcoal)]">
                {order.paymentInfo.method === "card" && "Credit/Debit Card"}
                {order.paymentInfo.method === "ideal" && "iDEAL Bank Transfer"}
                {order.paymentInfo.method === "cash" && "Cash on Delivery"}
              </p>
              <p className="text-[var(--yume-nori)] font-bold">
                {order.paymentInfo.method === "cash" ? "Pay on delivery" : "Paid"}
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
                <div className="relative w-16 h-16 flex-shrink-0 bg-[var(--yume-cream)]">
                  <Image
                    src={item.menuItem.image}
                    alt={item.menuItem.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-bold text-[var(--yume-charcoal)] text-sm font-body">
                      {item.menuItem.name}
                    </h3>
                    <span className="font-bold text-[var(--yume-charcoal)] text-sm font-body">
                      EUR {item.totalPrice.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--yume-miso)] font-body">Qty: {item.quantity}</p>
                  {item.customization && (
                    <div className="text-xs text-[var(--yume-miso)] font-body">
                      {item.customization.spiceLevel !== undefined && (
                        <span>Spice Level {item.customization.spiceLevel}</span>
                      )}
                      {item.customization.toppings && item.customization.toppings.length > 0 && (
                        <span> +{item.customization.toppings.length} extras</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-[var(--yume-cream)] pt-4 space-y-2 text-sm font-body">
            <div className="flex justify-between text-[var(--yume-miso)]">
              <span>Subtotal</span>
              <span>EUR {order.subtotal.toFixed(2)}</span>
            </div>
            {order.orderType === "delivery" && (
              <div className="flex justify-between text-[var(--yume-miso)]">
                <span>Delivery</span>
                <span>{order.deliveryFee > 0 ? `EUR ${order.deliveryFee.toFixed(2)}` : "Free"}</span>
              </div>
            )}
            {order.discount > 0 && (
              <div className="flex justify-between text-[var(--yume-nori)]">
                <span>Discount</span>
                <span>-EUR {order.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-[var(--yume-miso)]">
              <span>Tax (9%)</span>
              <span>EUR {order.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-[var(--yume-charcoal)] pt-2 border-t border-[var(--yume-cream)]">
              <span>Total</span>
              <span className="text-[var(--yume-vermillion)]">EUR {order.total.toFixed(2)}</span>
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
            A confirmation email has been sent to {order.contactInfo.email}
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