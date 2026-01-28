"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ShoppingBag, Minus, Plus, Trash2, Edit2, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import {
  CheckoutProgress,
  OrderTypeSelector,
  ContactForm,
  DeliveryAddressForm,
  DeliveryTimeSelector,
  PaymentMethodSelector,
} from "@/components/checkout";
import type { ContactInfo } from "@/components/checkout/ContactForm";
import type { DeliveryAddress } from "@/components/checkout/DeliveryAddressForm";
import type { PaymentInfo } from "@/components/checkout/PaymentMethodSelector";

const CHECKOUT_STEPS = [
  { id: 1, title: "Details" },
  { id: 2, title: "Payment" },
  { id: 3, title: "Review" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, updateQuantity, clearCart } = useCart();

  const [step, setStep] = useState(1);
  const [orderType, setOrderType] = useState<"delivery" | "pickup">("delivery");
  
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  
  const [address, setAddress] = useState<DeliveryAddress>({
    street: "",
    apartment: "",
    city: "",
    postalCode: "",
    instructions: "",
  });
  
  const [deliveryTimeType, setDeliveryTimeType] = useState<"asap" | "scheduled">("asap");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    method: "card",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
    cardName: "",
  });
  
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [promoData, setPromoData] = useState<{
    id: number;
    discountType: string;
    discountValue: number;
    freeDelivery: boolean;
  } | null>(null);
  const [discount, setDiscount] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(3.5);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [orderSummaryExpanded, setOrderSummaryExpanded] = useState(true);

  const [contactValid, setContactValid] = useState(false);
  const [addressValid, setAddressValid] = useState(false);
  const [paymentValid, setPaymentValid] = useState(false);

  useEffect(() => {
    if (items.length === 0) {
      router.push("/menu");
    }
  }, [items, router]);

  const tax = useMemo(() => (subtotal - discount) * 0.09, [subtotal, discount]);
  const total = useMemo(() => {
    const deliveryCost = orderType === "delivery" ? deliveryFee : 0;
    return subtotal + deliveryCost + tax - discount;
  }, [subtotal, deliveryFee, tax, discount, orderType]);

  const handleDeliveryFeeChange = (fee: number) => {
    setDeliveryFee(fee);
  };

  const handlePromoApply = async (code: string): Promise<{ valid: boolean; discount: number; message: string }> => {
    try {
      const response = await fetch("/api/promo-codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, orderTotal: subtotal }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { valid: false, discount: 0, message: data.error || "Invalid promo code" };
      }

      setPromoCode(code);
      setPromoData(data.promoCode);
      
      if (data.promoCode.freeDelivery) {
        setDeliveryFee(0);
        setDiscount(0);
        return { valid: true, discount: 0, message: "Free delivery on this order!" };
      }
      
      const discountAmount = data.discountAmount;
      setDiscount(discountAmount);
      
      const typeLabel = data.promoCode.discountType === "PERCENT" ? "%" : "EUR";
      const valueLabel = data.promoCode.discountType === "PERCENT" 
        ? `${data.promoCode.discountValue}% off` 
        : `EUR ${data.promoCode.discountValue.toFixed(2)} off`;
      
      return { valid: true, discount: discountAmount, message: `${valueLabel} your order!` };
    } catch {
      return { valid: false, discount: 0, message: "Failed to apply promo code" };
    }
  };

  const handleRemovePromo = () => {
    setPromoCode(null);
    setPromoData(null);
    setDiscount(0);
    setDeliveryFee(3.5);
  };

  const canProceedToStep2 = contactValid && (orderType === "pickup" || addressValid);
  const canProceedToStep3 = canProceedToStep2 && paymentValid;

  const handleNextStep = () => {
    if (step === 1 && canProceedToStep2) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (step === 2 && canProceedToStep3) {
      setStep(3);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    setOrderError(null);

    try {
      const orderData = {
        orderType: orderType.toUpperCase(),
        customerFirstName: contactInfo.firstName,
        customerLastName: contactInfo.lastName,
        customerEmail: contactInfo.email,
        customerPhone: contactInfo.phone,
        deliveryStreet: orderType === "delivery" ? address.street : null,
        deliveryApartment: orderType === "delivery" ? address.apartment : null,
        deliveryCity: orderType === "delivery" ? address.city : null,
        deliveryPostalCode: orderType === "delivery" ? address.postalCode : null,
        deliveryInstructions: orderType === "delivery" ? address.instructions : null,
        deliveryTimeType: deliveryTimeType.toUpperCase(),
        scheduledDate: deliveryTimeType === "scheduled" ? scheduledDate : null,
        scheduledTime: deliveryTimeType === "scheduled" ? scheduledTime : null,
        promoCode: promoCode || undefined,
        paymentMethod: paymentInfo.method,
        items: items.map((item) => ({
          menuItemId: item.menuItem.id,
          name: item.menuItem.name,
          price: item.totalPrice / item.quantity,
          quantity: item.quantity,
          specialInstructions: item.customization?.specialInstructions,
          toppings: item.customization?.toppings,
        })),
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create order");
      }

      if (data.paymentUrl) {
        clearCart();
        window.location.href = data.paymentUrl;
      } else {
        clearCart();
        router.push(`/order/${data.order.id}/confirmation`);
      }
    } catch (error) {
      console.error("Order error:", error);
      setOrderError(error instanceof Error ? error.message : "Failed to place order. Please try again.");
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--yume-warm-white)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--yume-vermillion)]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--yume-warm-white)]">
      <header className="bg-white border-b border-[var(--yume-cream)] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <Link
              href="/menu"
              className="flex items-center gap-2 text-[var(--yume-charcoal)] hover:text-[var(--yume-vermillion)] transition-colors font-body p-2 -ml-2 min-h-[44px]"
            >
              <ArrowLeft size={20} />
              <span className="hidden sm:inline">Back to Menu</span>
            </Link>
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-bold text-[var(--yume-vermillion)] font-header">YUME</span>
            </Link>
            <div className="w-16 sm:w-24" />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-32 lg:pb-8">
        <CheckoutProgress currentStep={step} steps={CHECKOUT_STEPS} />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <div className="bg-white border border-[var(--yume-cream)] p-4 sm:p-6">
                    <OrderTypeSelector orderType={orderType} onOrderTypeChange={setOrderType} />
                  </div>

                  <div className="bg-white border border-[var(--yume-cream)] p-4 sm:p-6">
                    <ContactForm
                      contactInfo={contactInfo}
                      onContactInfoChange={setContactInfo}
                      onValidationChange={setContactValid}
                    />
                  </div>

                  {orderType === "delivery" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-white border border-[var(--yume-cream)] p-4 sm:p-6"
                    >
                      <DeliveryAddressForm
                        address={address}
                        onAddressChange={setAddress}
                        onValidationChange={setAddressValid}
                        onDeliveryFeeChange={handleDeliveryFeeChange}
                      />
                    </motion.div>
                  )}

                  <div className="bg-white border border-[var(--yume-cream)] p-4 sm:p-6">
                    <DeliveryTimeSelector
                      deliveryTime={deliveryTimeType}
                      scheduledDate={scheduledDate}
                      scheduledTime={scheduledTime}
                      onDeliveryTimeChange={setDeliveryTimeType}
                      onScheduledDateChange={setScheduledDate}
                      onScheduledTimeChange={setScheduledTime}
                    />
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white border border-[var(--yume-cream)] p-4 sm:p-6"
                >
                  <PaymentMethodSelector
                    paymentInfo={paymentInfo}
                    onPaymentInfoChange={setPaymentInfo}
                    onValidationChange={setPaymentValid}
                    orderType={orderType}
                  />
                  <button
                    onClick={() => setStep(1)}
                    className="mt-4 text-[var(--yume-miso)] hover:text-[var(--yume-charcoal)] transition-colors font-body text-sm flex items-center gap-1 p-2 -ml-2 min-h-[44px]"
                  >
                    <ArrowLeft size={14} />
                    Back to Details
                  </button>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white border border-[var(--yume-cream)] p-4 sm:p-6"
                >
                  <h2 className="text-lg sm:text-xl font-bold text-[var(--yume-charcoal)] mb-4 sm:mb-6 font-header">
                    Review Your Order
                  </h2>
                  <div className="space-y-4">
                    <div className="p-4 bg-[var(--yume-cream)]/30 border border-[var(--yume-cream)]">
                      <h3 className="font-bold text-[var(--yume-charcoal)] mb-2 font-body">
                        {orderType === "delivery" ? "Delivery" : "Pickup"} Details
                      </h3>
                      <p className="text-sm text-[var(--yume-miso)] font-body">
                        {contactInfo.firstName} {contactInfo.lastName}
                      </p>
                      <p className="text-sm text-[var(--yume-miso)] font-body">{contactInfo.email}</p>
                      <p className="text-sm text-[var(--yume-miso)] font-body">{contactInfo.phone}</p>
                      {orderType === "delivery" && (
                        <p className="text-sm text-[var(--yume-miso)] mt-2 font-body">
                          {address.street}{address.apartment && ", " + address.apartment}
                          <br />
                          {address.postalCode} {address.city}
                        </p>
                      )}
                      {orderType === "pickup" && (
                        <p className="text-sm text-[var(--yume-miso)] mt-2 font-body">
                          Pickup at: Yume Ramen, Westerstraat 52, Amsterdam
                        </p>
                      )}
                    </div>
                    <div className="p-4 bg-[var(--yume-cream)]/30 border border-[var(--yume-cream)]">
                      <h3 className="font-bold text-[var(--yume-charcoal)] mb-2 font-body">
                        {orderType === "delivery" ? "Delivery" : "Pickup"} Time
                      </h3>
                      <p className="text-sm text-[var(--yume-miso)] font-body">
                        {deliveryTimeType === "asap"
                          ? "ASAP (" + (orderType === "delivery" ? "25-35" : "15-20") + " mins)"
                          : scheduledDate + " at " + scheduledTime}
                      </p>
                    </div>
                    <div className="p-4 bg-[var(--yume-cream)]/30 border border-[var(--yume-cream)]">
                      <h3 className="font-bold text-[var(--yume-charcoal)] mb-2 font-body">Payment Method</h3>
                      <p className="text-sm text-[var(--yume-miso)] font-body">
                        {paymentInfo.method === "card" && "Card ending in " + paymentInfo.cardNumber.slice(-4)}
                        {paymentInfo.method === "ideal" && "iDEAL Bank Transfer"}
                        {paymentInfo.method === "cash" && "Cash on Delivery"}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 mt-6">
                    <button
                      onClick={() => setStep(2)}
                      className="flex-1 py-3 min-h-[48px] border-2 border-[var(--yume-charcoal)] text-[var(--yume-charcoal)] font-bold hover:bg-[var(--yume-charcoal)] hover:text-white transition-colors font-body"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setStep(1)}
                      className="text-[var(--yume-miso)] hover:text-[var(--yume-charcoal)] transition-colors font-body text-sm px-4 py-3 min-h-[48px]"
                    >
                      Edit Details
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white border border-[var(--yume-cream)] sticky top-24">
              <button
                onClick={() => setOrderSummaryExpanded(!orderSummaryExpanded)}
                className="w-full flex items-center justify-between p-4 min-h-[56px] border-b border-[var(--yume-cream)] lg:cursor-default"
              >
                <div className="flex items-center gap-2">
                  <ShoppingBag size={20} className="text-[var(--yume-vermillion)]" />
                  <h2 className="text-base sm:text-lg font-bold text-[var(--yume-charcoal)] font-header">Order Summary</h2>
                </div>
                <div className="flex items-center gap-2 lg:hidden">
                  <span className="text-[var(--yume-vermillion)] font-bold font-body text-sm sm:text-base">EUR {total.toFixed(2)}</span>
                  {orderSummaryExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </button>

              <AnimatePresence>
                {orderSummaryExpanded && (
                  <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                    <div className="p-4 max-h-[300px] overflow-y-auto space-y-3">
                      {items.map((item) => (
                        <div key={item.id} className="flex gap-3 pb-3 border-b border-[var(--yume-cream)] last:border-0">
                          <div className="relative w-16 h-16 flex-shrink-0 bg-[var(--yume-cream)]">
                            <Image src={item.menuItem.image} alt={item.menuItem.name} fill className="object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="font-bold text-[var(--yume-charcoal)] text-sm truncate font-body">{item.menuItem.name}</h3>
                              <Link
                                href={"/menu/" + item.menuItem.id}
                                className="text-[var(--yume-miso)] hover:text-[var(--yume-vermillion)] transition-colors flex-shrink-0"
                              >
                                <Edit2 size={14} />
                              </Link>
                            </div>
                            {item.customization && (
                              <div className="text-xs text-[var(--yume-miso)] mt-0.5 space-y-0.5 font-body">
                                {item.customization.spiceLevel !== undefined && <p>Spice: Level {item.customization.spiceLevel}</p>}
                                {item.customization.toppings && item.customization.toppings.length > 0 && (
                                  <p>+{item.customization.toppings.length} extras</p>
                                )}
                              </div>
                            )}
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-1 bg-[var(--yume-cream)] rounded-full">
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="w-6 h-6 flex items-center justify-center hover:bg-[var(--yume-miso)]/10 rounded-full transition-colors"
                                >
                                  {item.quantity === 1 ? <Trash2 size={12} className="text-red-500" /> : <Minus size={12} />}
                                </button>
                                <span className="w-6 text-center text-sm font-bold text-[var(--yume-charcoal)] font-body">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="w-6 h-6 flex items-center justify-center hover:bg-[var(--yume-miso)]/10 rounded-full transition-colors"
                                >
                                  <Plus size={12} />
                                </button>
                              </div>
                              <span className="font-bold text-[var(--yume-charcoal)] text-sm font-body">EUR {item.totalPrice.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 border-t border-[var(--yume-cream)]">
                      {!promoCode ? (
                        <div className="mb-4">
                          <PromoInput onApply={handlePromoApply} />
                        </div>
                      ) : (
                        <div className="mb-4 flex items-center justify-between bg-[var(--yume-nori)]/10 p-2 rounded">
                          <span className="text-sm font-bold text-[var(--yume-nori)] font-body">{promoCode}</span>
                          <button onClick={handleRemovePromo} className="text-xs text-[var(--yume-miso)] hover:text-red-500 transition-colors font-body">
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
                            <span>{deliveryFee > 0 ? "EUR " + deliveryFee.toFixed(2) : "Free"}</span>
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

                      <div className="pt-3 mt-3 border-t border-[var(--yume-cream)] flex justify-between items-center">
                        <span className="font-bold text-[var(--yume-charcoal)] font-body">Total</span>
                        <span className="text-xl font-bold text-[var(--yume-vermillion)] font-body">EUR {total.toFixed(2)}</span>
                      </div>

                      {orderError && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm font-body">
                          {orderError}
                        </div>
                      )}

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={step === 3 ? handlePlaceOrder : handleNextStep}
                        disabled={isProcessing || (step === 1 && !canProceedToStep2) || (step === 2 && !paymentValid)}
                        className="w-full mt-4 py-4 min-h-[56px] bg-[var(--yume-vermillion)] text-white font-bold text-base sm:text-lg hover:bg-[var(--yume-vermillion)]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-body flex items-center justify-center gap-2"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="animate-spin" size={20} />
                            Processing...
                          </>
                        ) : step === 3 ? (
                          "Place Order - EUR " + total.toFixed(2)
                        ) : step === 2 ? (
                          "Review Order"
                        ) : (
                          "Continue to Payment"
                        )}
                      </motion.button>

                      <p className="mt-3 text-xs text-center text-[var(--yume-miso)] font-body">
                        By placing your order, you agree to our Terms of Service and Privacy Policy.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PromoInput({ onApply }: { onApply: (code: string) => Promise<{ valid: boolean; discount: number; message: string }> }) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleApply = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setError("");
    const result = await onApply(code.toUpperCase());
    if (!result.valid) {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === "Enter" && handleApply()}
          placeholder="Promo code"
          className="flex-1 px-3 py-2 border border-[var(--yume-cream)] bg-[var(--yume-warm-white)] text-sm focus:outline-none focus:border-[var(--yume-vermillion)] font-body"
        />
        <button
          onClick={handleApply}
          disabled={loading || !code.trim()}
          className="px-4 py-2 bg-[var(--yume-charcoal)] text-white text-sm font-bold hover:bg-[var(--yume-nori)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-body"
        >
          {loading ? "..." : "Apply"}
        </button>
      </div>
      {error && <p className="mt-1 text-xs text-red-500 font-body">{error}</p>}
    </div>
  );
}