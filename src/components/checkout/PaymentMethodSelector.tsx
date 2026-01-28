"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, Wallet, Banknote, Check, AlertCircle, Lock, Shield } from "lucide-react";

export interface PaymentInfo {
  method: "card" | "ideal" | "cash";
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  cardName: string;
}

interface PaymentMethodSelectorProps {
  paymentInfo: PaymentInfo;
  onPaymentInfoChange: (info: PaymentInfo) => void;
  onValidationChange: (isValid: boolean) => void;
  orderType: "delivery" | "pickup";
}

interface FieldError {
  cardNumber?: string;
  cardExpiry?: string;
  cardCvc?: string;
  cardName?: string;
}

export default function PaymentMethodSelector({
  paymentInfo,
  onPaymentInfoChange,
  onValidationChange,
  orderType,
}: PaymentMethodSelectorProps) {
  const [errors, setErrors] = useState<FieldError>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [cardType, setCardType] = useState<string | null>(null);

  useEffect(() => {
    if (paymentInfo.method === "ideal" || paymentInfo.method === "cash") {
      onValidationChange(true);
    } else {
      validateAll();
    }
  }, [paymentInfo.method]);

  const detectCardType = (number: string) => {
    const cleaned = number.replace(/\s/g, "");
    if (/^4/.test(cleaned)) return "visa";
    if (/^5[1-5]/.test(cleaned)) return "mastercard";
    if (/^3[47]/.test(cleaned)) return "amex";
    return null;
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(" ") : cleaned;
  };

  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  const validateCardNumber = (number: string) => {
    const cleaned = number.replace(/\s/g, "");
    return cleaned.length >= 13 && cleaned.length <= 19 && /^\d+$/.test(cleaned);
  };

  const validateExpiry = (expiry: string) => {
    const regex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    if (!regex.test(expiry)) return false;
    const [month, year] = expiry.split("/").map(Number);
    const now = new Date();
    const expDate = new Date(2000 + year, month - 1);
    return expDate > now;
  };

  const validateCvc = (cvc: string) => {
    return /^\d{3,4}$/.test(cvc);
  };

  const validateField = (name: string, value: string) => {
    const newErrors = { ...errors };

    switch (name) {
      case "cardNumber":
        if (!value.trim()) newErrors.cardNumber = "Card number is required";
        else if (!validateCardNumber(value)) newErrors.cardNumber = "Please enter a valid card number";
        else delete newErrors.cardNumber;
        break;
      case "cardExpiry":
        if (!value.trim()) newErrors.cardExpiry = "Expiry date is required";
        else if (!validateExpiry(value)) newErrors.cardExpiry = "Invalid expiry date";
        else delete newErrors.cardExpiry;
        break;
      case "cardCvc":
        if (!value.trim()) newErrors.cardCvc = "CVC is required";
        else if (!validateCvc(value)) newErrors.cardCvc = "Invalid CVC";
        else delete newErrors.cardCvc;
        break;
      case "cardName":
        if (!value.trim()) newErrors.cardName = "Name is required";
        else delete newErrors.cardName;
        break;
    }

    setErrors(newErrors);
    return newErrors;
  };

  const validateAll = () => {
    if (paymentInfo.method !== "card") {
      onValidationChange(true);
      return;
    }
    const isValid =
      !errors.cardNumber &&
      !errors.cardExpiry &&
      !errors.cardCvc &&
      !errors.cardName &&
      paymentInfo.cardNumber &&
      paymentInfo.cardExpiry &&
      paymentInfo.cardCvc &&
      paymentInfo.cardName;
    onValidationChange(!!isValid);
  };

  const handleChange = (name: keyof PaymentInfo, value: string) => {
    let newValue = value;
    if (name === "cardNumber") {
      newValue = formatCardNumber(value);
      setCardType(detectCardType(newValue));
    } else if (name === "cardExpiry") {
      newValue = formatExpiry(value);
    } else if (name === "cardCvc") {
      newValue = value.replace(/\D/g, "").slice(0, 4);
    }
    onPaymentInfoChange({ ...paymentInfo, [name]: newValue });
    if (touched[name]) {
      const newErrors = validateField(name, newValue);
      setTimeout(() => validateAll(), 0);
    }
  };

  const handleBlur = (name: string) => {
    setTouched({ ...touched, [name]: true });
    validateField(name, paymentInfo[name as keyof PaymentInfo] as string);
    validateAll();
  };

  const inputClass = (field: keyof FieldError) =>
    `w-full px-4 py-3 bg-[var(--yume-warm-white)] border transition-all font-body text-[var(--yume-charcoal)] focus:outline-none focus:ring-2 ${
      errors[field]
        ? "border-red-400 focus:ring-red-200"
        : touched[field] && !errors[field] && paymentInfo[field]
        ? "border-[var(--yume-nori)] focus:ring-[var(--yume-nori)]/20"
        : "border-[var(--yume-cream)] focus:ring-[var(--yume-vermillion)]/20 focus:border-[var(--yume-vermillion)]"
    }`;

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-[var(--yume-charcoal)] mb-4 font-header">
        Payment Method
      </h2>

      <div className="space-y-3 mb-6">
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => onPaymentInfoChange({ ...paymentInfo, method: "card" })}
          className={`w-full flex items-center gap-4 p-4 border-2 transition-all text-left ${
            paymentInfo.method === "card"
              ? "border-[var(--yume-vermillion)] bg-[var(--yume-vermillion)]/5"
              : "border-[var(--yume-cream)] hover:border-[var(--yume-miso)]"
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              paymentInfo.method === "card" ? "border-[var(--yume-vermillion)]" : "border-[var(--yume-miso)]"
            }`}
          >
            {paymentInfo.method === "card" && <div className="w-3 h-3 rounded-full bg-[var(--yume-vermillion)]" />}
          </div>
          <CreditCard size={24} className={paymentInfo.method === "card" ? "text-[var(--yume-vermillion)]" : "text-[var(--yume-miso)]"} />
          <div className="flex-1">
            <p className="font-bold text-[var(--yume-charcoal)] font-body">Credit / Debit Card</p>
            <p className="text-sm text-[var(--yume-miso)] font-body">Visa, Mastercard, Amex</p>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => onPaymentInfoChange({ ...paymentInfo, method: "ideal" })}
          className={`w-full flex items-center gap-4 p-4 border-2 transition-all text-left ${
            paymentInfo.method === "ideal"
              ? "border-[var(--yume-vermillion)] bg-[var(--yume-vermillion)]/5"
              : "border-[var(--yume-cream)] hover:border-[var(--yume-miso)]"
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              paymentInfo.method === "ideal" ? "border-[var(--yume-vermillion)]" : "border-[var(--yume-miso)]"
            }`}
          >
            {paymentInfo.method === "ideal" && <div className="w-3 h-3 rounded-full bg-[var(--yume-vermillion)]" />}
          </div>
          <Wallet size={24} className={paymentInfo.method === "ideal" ? "text-[var(--yume-vermillion)]" : "text-[var(--yume-miso)]"} />
          <div className="flex-1">
            <p className="font-bold text-[var(--yume-charcoal)] font-body">iDEAL</p>
            <p className="text-sm text-[var(--yume-miso)] font-body">Pay with your bank</p>
          </div>
        </motion.button>

        {orderType === "delivery" && (
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onPaymentInfoChange({ ...paymentInfo, method: "cash" })}
            className={`w-full flex items-center gap-4 p-4 border-2 transition-all text-left ${
              paymentInfo.method === "cash"
                ? "border-[var(--yume-vermillion)] bg-[var(--yume-vermillion)]/5"
                : "border-[var(--yume-cream)] hover:border-[var(--yume-miso)]"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                paymentInfo.method === "cash" ? "border-[var(--yume-vermillion)]" : "border-[var(--yume-miso)]"
              }`}
            >
              {paymentInfo.method === "cash" && <div className="w-3 h-3 rounded-full bg-[var(--yume-vermillion)]" />}
            </div>
            <Banknote size={24} className={paymentInfo.method === "cash" ? "text-[var(--yume-vermillion)]" : "text-[var(--yume-miso)]"} />
            <div className="flex-1">
              <p className="font-bold text-[var(--yume-charcoal)] font-body">Cash on Delivery</p>
              <p className="text-sm text-[var(--yume-miso)] font-body">Pay when you receive your order</p>
            </div>
          </motion.button>
        )}
      </div>

      <AnimatePresence>
        {paymentInfo.method === "card" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4 p-4 bg-[var(--yume-cream)]/30 border border-[var(--yume-cream)]"
          >
            <div>
              <label className="block text-sm font-medium text-[var(--yume-charcoal)] mb-2 font-body">
                Card Number <span className="text-[var(--yume-vermillion)]">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={paymentInfo.cardNumber}
                  onChange={(e) => handleChange("cardNumber", e.target.value)}
                  onBlur={() => handleBlur("cardNumber")}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  className={inputClass("cardNumber")}
                />
                {cardType && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[var(--yume-miso)] uppercase">
                    {cardType}
                  </span>
                )}
              </div>
              {errors.cardNumber && touched.cardNumber && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-1 text-sm text-red-500 font-body flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.cardNumber}
                </motion.p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--yume-charcoal)] mb-2 font-body">
                  Expiry Date <span className="text-[var(--yume-vermillion)]">*</span>
                </label>
                <input
                  type="text"
                  value={paymentInfo.cardExpiry}
                  onChange={(e) => handleChange("cardExpiry", e.target.value)}
                  onBlur={() => handleBlur("cardExpiry")}
                  placeholder="MM/YY"
                  maxLength={5}
                  className={inputClass("cardExpiry")}
                />
                {errors.cardExpiry && touched.cardExpiry && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-1 text-sm text-red-500 font-body flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.cardExpiry}
                  </motion.p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--yume-charcoal)] mb-2 font-body">
                  CVC <span className="text-[var(--yume-vermillion)]">*</span>
                </label>
                <input
                  type="text"
                  value={paymentInfo.cardCvc}
                  onChange={(e) => handleChange("cardCvc", e.target.value)}
                  onBlur={() => handleBlur("cardCvc")}
                  placeholder="123"
                  maxLength={4}
                  className={inputClass("cardCvc")}
                />
                {errors.cardCvc && touched.cardCvc && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-1 text-sm text-red-500 font-body flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.cardCvc}
                  </motion.p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--yume-charcoal)] mb-2 font-body">
                Name on Card <span className="text-[var(--yume-vermillion)]">*</span>
              </label>
              <input
                type="text"
                value={paymentInfo.cardName}
                onChange={(e) => handleChange("cardName", e.target.value)}
                onBlur={() => handleBlur("cardName")}
                placeholder="John Doe"
                className={inputClass("cardName")}
              />
              {errors.cardName && touched.cardName && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-1 text-sm text-red-500 font-body flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.cardName}
                </motion.p>
              )}
            </div>
          </motion.div>
        )}

        {paymentInfo.method === "cash" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 bg-[var(--yume-gold)]/10 border border-[var(--yume-gold)]"
          >
            <p className="text-sm text-[var(--yume-charcoal)] font-body">
              <span className="font-bold">Please have exact change ready.</span> Our delivery drivers carry limited change.
            </p>
          </motion.div>
        )}

        {paymentInfo.method === "ideal" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 bg-[var(--yume-cream)]/50 border border-[var(--yume-cream)]"
          >
            <p className="text-sm text-[var(--yume-charcoal)] font-body">
              You will be redirected to your bank to complete the payment securely.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-6 flex items-center gap-4 text-xs text-[var(--yume-miso)]">
        <div className="flex items-center gap-1">
          <Lock size={14} />
          <span className="font-body">SSL Encrypted</span>
        </div>
        <div className="flex items-center gap-1">
          <Shield size={14} />
          <span className="font-body">Secure Payment</span>
        </div>
      </div>
    </div>
  );
}