"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Navigation, Check, AlertCircle, Info } from "lucide-react";

export interface DeliveryAddress {
  street: string;
  apartment: string;
  city: string;
  postalCode: string;
  instructions: string;
}

interface DeliveryAddressFormProps {
  address: DeliveryAddress;
  onAddressChange: (address: DeliveryAddress) => void;
  onValidationChange: (isValid: boolean) => void;
  onDeliveryFeeChange: (fee: number) => void;
}

interface FieldError {
  street?: string;
  city?: string;
  postalCode?: string;
}

const DELIVERY_ZONES = [
  { prefix: "1011", fee: 0, name: "Central Amsterdam" },
  { prefix: "1012", fee: 0, name: "Central Amsterdam" },
  { prefix: "1013", fee: 2.5, name: "Jordaan" },
  { prefix: "1014", fee: 2.5, name: "West" },
  { prefix: "1015", fee: 2.5, name: "Oud-West" },
  { prefix: "1016", fee: 2.5, name: "Oud-West" },
  { prefix: "1017", fee: 3.5, name: "De Pijp" },
  { prefix: "1018", fee: 3.5, name: "Oost" },
  { prefix: "1019", fee: 3.5, name: "Oost" },
  { prefix: "102", fee: 4.5, name: "Extended Zone" },
  { prefix: "103", fee: 4.5, name: "Extended Zone" },
  { prefix: "104", fee: 5.5, name: "Outer Zone" },
  { prefix: "105", fee: 5.5, name: "Outer Zone" },
];

export default function DeliveryAddressForm({
  address,
  onAddressChange,
  onValidationChange,
  onDeliveryFeeChange,
}: DeliveryAddressFormProps) {
  const [errors, setErrors] = useState<FieldError>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isValidatingAddress, setIsValidatingAddress] = useState(false);
  const [deliveryZoneInfo, setDeliveryZoneInfo] = useState<string | null>(null);
  const [isOutsideDeliveryArea, setIsOutsideDeliveryArea] = useState(false);

  const validatePostalCode = (postalCode: string) => {
    const cleaned = postalCode.replace(/\s/g, "").toUpperCase();
    const regex = /^[1-9][0-9]{3}[A-Z]{2}$/;
    return regex.test(cleaned);
  };

  const getDeliveryZone = (postalCode: string) => {
    const cleaned = postalCode.replace(/\s/g, "").toUpperCase();
    for (const zone of DELIVERY_ZONES) {
      if (cleaned.startsWith(zone.prefix)) {
        return zone;
      }
    }
    return null;
  };

  const formatPostalCode = (value: string) => {
    const cleaned = value.replace(/\s/g, "").toUpperCase();
    if (cleaned.length > 4) {
      return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 6)}`;
    }
    return cleaned;
  };

  const validateField = (name: string, value: string) => {
    const newErrors = { ...errors };

    switch (name) {
      case "street":
        if (!value.trim()) newErrors.street = "Street address is required";
        else if (value.trim().length < 5) newErrors.street = "Please enter a complete street address";
        else delete newErrors.street;
        break;
      case "city":
        if (!value.trim()) newErrors.city = "City is required";
        else delete newErrors.city;
        break;
      case "postalCode":
        if (!value.trim()) {
          newErrors.postalCode = "Postal code is required";
          setIsOutsideDeliveryArea(false);
          setDeliveryZoneInfo(null);
        } else if (!validatePostalCode(value)) {
          newErrors.postalCode = "Please enter a valid Dutch postal code (e.g., 1012 AB)";
          setIsOutsideDeliveryArea(false);
          setDeliveryZoneInfo(null);
        } else {
          const zone = getDeliveryZone(value);
          if (!zone) {
            newErrors.postalCode = "Sorry, we don't deliver to this area yet";
            setIsOutsideDeliveryArea(true);
            setDeliveryZoneInfo(null);
            onDeliveryFeeChange(0);
          } else {
            delete newErrors.postalCode;
            setIsOutsideDeliveryArea(false);
            setDeliveryZoneInfo(zone.fee === 0 ? `${zone.name} - Free delivery!` : `${zone.name} - Delivery fee: €${zone.fee.toFixed(2)}`);
            onDeliveryFeeChange(zone.fee);
          }
        }
        break;
    }

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0 && address.street && address.city && address.postalCode && !isOutsideDeliveryArea;
    onValidationChange(!!isValid);
  };

  const handleChange = (name: keyof DeliveryAddress, value: string) => {
    const newValue = name === "postalCode" ? formatPostalCode(value) : value;
    onAddressChange({ ...address, [name]: newValue });
    if (touched[name]) {
      validateField(name, newValue);
    }
  };

  const handleBlur = (name: string) => {
    setTouched({ ...touched, [name]: true });
    validateField(name, address[name as keyof DeliveryAddress]);
  };

  const handleUseCurrentLocation = () => {
    if ("geolocation" in navigator) {
      setIsValidatingAddress(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setTimeout(() => {
            onAddressChange({
              ...address,
              street: "Damrak 1",
              city: "Amsterdam",
              postalCode: "1012 LG",
            });
            setDeliveryZoneInfo("Central Amsterdam - Free delivery!");
            onDeliveryFeeChange(0);
            setIsValidatingAddress(false);
          }, 1000);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setIsValidatingAddress(false);
        }
      );
    }
  };

  const inputClass = (field: keyof FieldError) =>
    `w-full px-4 py-3 min-h-[48px] bg-[var(--yume-warm-white)] border transition-all font-body text-[var(--yume-charcoal)] text-base focus:outline-none focus:ring-2 ${
      errors[field]
        ? "border-red-400 focus:ring-red-200"
        : touched[field] && !errors[field] && address[field]
        ? "border-[var(--yume-nori)] focus:ring-[var(--yume-nori)]/20"
        : "border-[var(--yume-cream)] focus:ring-[var(--yume-vermillion)]/20 focus:border-[var(--yume-vermillion)]"
    }`;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-[var(--yume-charcoal)] font-header">
          Delivery Address
        </h2>
        <button
          onClick={handleUseCurrentLocation}
          disabled={isValidatingAddress}
          className="flex items-center gap-2 text-sm text-[var(--yume-vermillion)] hover:text-[var(--yume-charcoal)] transition-colors font-body disabled:opacity-50"
        >
          <Navigation size={16} />
          {isValidatingAddress ? "Finding location..." : "Use my location"}
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[var(--yume-charcoal)] mb-2 font-body">
            Street Address <span className="text-[var(--yume-vermillion)]">*</span>
          </label>
          <div className="relative">
            <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--yume-miso)]" />
            <input
              type="text"
              value={address.street}
              onChange={(e) => handleChange("street", e.target.value)}
              onBlur={() => handleBlur("street")}
              placeholder="Street name and number"
              className={`${inputClass("street")} pl-10`}
            />
            {touched.street && !errors.street && address.street && (
              <Check size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--yume-nori)]" />
            )}
          </div>
          {errors.street && touched.street && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 text-sm text-red-500 font-body flex items-center gap-1"
            >
              <AlertCircle size={14} />
              {errors.street}
            </motion.p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--yume-charcoal)] mb-2 font-body">
            Apartment, Suite, etc. <span className="text-[var(--yume-miso)]">(optional)</span>
          </label>
          <input
            type="text"
            value={address.apartment}
            onChange={(e) => handleChange("apartment", e.target.value)}
            placeholder="Apt 4B, Floor 2, etc."
            className="w-full px-4 py-3 bg-[var(--yume-warm-white)] border border-[var(--yume-cream)] font-body text-[var(--yume-charcoal)] focus:outline-none focus:ring-2 focus:ring-[var(--yume-vermillion)]/20 focus:border-[var(--yume-vermillion)] transition-all"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--yume-charcoal)] mb-2 font-body">
              City <span className="text-[var(--yume-vermillion)]">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={address.city}
                onChange={(e) => handleChange("city", e.target.value)}
                onBlur={() => handleBlur("city")}
                placeholder="Amsterdam"
                className={inputClass("city")}
              />
              {touched.city && !errors.city && address.city && (
                <Check size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--yume-nori)]" />
              )}
            </div>
            {errors.city && touched.city && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 text-sm text-red-500 font-body flex items-center gap-1"
              >
                <AlertCircle size={14} />
                {errors.city}
              </motion.p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--yume-charcoal)] mb-2 font-body">
              Postal Code <span className="text-[var(--yume-vermillion)]">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={address.postalCode}
                onChange={(e) => handleChange("postalCode", e.target.value)}
                onBlur={() => handleBlur("postalCode")}
                placeholder="1012 AB"
                maxLength={7}
                className={inputClass("postalCode")}
              />
              {touched.postalCode && !errors.postalCode && address.postalCode && !isOutsideDeliveryArea && (
                <Check size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--yume-nori)]" />
              )}
            </div>
            {errors.postalCode && touched.postalCode && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-1 text-sm font-body flex items-center gap-1 ${isOutsideDeliveryArea ? "text-orange-500" : "text-red-500"}`}
              >
                <AlertCircle size={14} />
                {errors.postalCode}
              </motion.p>
            )}
            {deliveryZoneInfo && !errors.postalCode && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 text-sm text-[var(--yume-nori)] font-body flex items-center gap-1"
              >
                <Info size={14} />
                {deliveryZoneInfo}
              </motion.p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--yume-charcoal)] mb-2 font-body">
            Delivery Instructions <span className="text-[var(--yume-miso)]">(optional)</span>
          </label>
          <textarea
            value={address.instructions}
            onChange={(e) => handleChange("instructions", e.target.value)}
            placeholder="Ring doorbell twice, leave at door, gate code, etc."
            rows={2}
            className="w-full px-4 py-3 bg-[var(--yume-warm-white)] border border-[var(--yume-cream)] font-body text-[var(--yume-charcoal)] focus:outline-none focus:ring-2 focus:ring-[var(--yume-vermillion)]/20 focus:border-[var(--yume-vermillion)] transition-all resize-none"
          />
        </div>
      </div>
    </div>
  );
}