"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, Check, AlertCircle } from "lucide-react";

export interface ContactInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface ContactFormProps {
  contactInfo: ContactInfo;
  onContactInfoChange: (info: ContactInfo) => void;
  onValidationChange: (isValid: boolean) => void;
}

interface FieldError {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

export default function ContactForm({ contactInfo, onContactInfoChange, onValidationChange }: ContactFormProps) {
  const [errors, setErrors] = useState<FieldError>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [saveForLater, setSaveForLater] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("yume-contact-info");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        onContactInfoChange(parsed);
        setSaveForLater(true);
      } catch (e) {
        console.error("Failed to load saved contact info");
      }
    }
  }, []);

  useEffect(() => {
    if (saveForLater && contactInfo.email) {
      localStorage.setItem("yume-contact-info", JSON.stringify(contactInfo));
    }
  }, [contactInfo, saveForLater]);

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePhone = (phone: string) => {
    const cleaned = phone.replace(/\D/g, "");
    return cleaned.length >= 9 && cleaned.length <= 15;
  };

  const formatPhone = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 10)}`;
  };

  const validateField = (name: string, value: string) => {
    const newErrors = { ...errors };

    switch (name) {
      case "firstName":
        if (!value.trim()) newErrors.firstName = "First name is required";
        else delete newErrors.firstName;
        break;
      case "lastName":
        if (!value.trim()) newErrors.lastName = "Last name is required";
        else delete newErrors.lastName;
        break;
      case "email":
        if (!value.trim()) newErrors.email = "Email is required";
        else if (!validateEmail(value)) newErrors.email = "Please enter a valid email address";
        else delete newErrors.email;
        break;
      case "phone":
        if (!value.trim()) newErrors.phone = "Phone number is required";
        else if (!validatePhone(value)) newErrors.phone = "Please enter a valid phone number";
        else delete newErrors.phone;
        break;
    }

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0 && 
      contactInfo.firstName && contactInfo.lastName && contactInfo.email && contactInfo.phone;
    onValidationChange(!!isValid);
  };

  const handleChange = (name: keyof ContactInfo, value: string) => {
    const newValue = name === "phone" ? formatPhone(value) : value;
    onContactInfoChange({ ...contactInfo, [name]: newValue });
    if (touched[name]) {
      validateField(name, newValue);
    }
  };

  const handleBlur = (name: string) => {
    setTouched({ ...touched, [name]: true });
    validateField(name, contactInfo[name as keyof ContactInfo]);
  };

  const inputClass = (field: keyof FieldError) =>
    `w-full px-4 py-3 bg-[var(--yume-warm-white)] border transition-all font-body text-[var(--yume-charcoal)] focus:outline-none focus:ring-2 ${
      errors[field]
        ? "border-red-400 focus:ring-red-200"
        : touched[field] && !errors[field] && contactInfo[field]
        ? "border-[var(--yume-nori)] focus:ring-[var(--yume-nori)]/20"
        : "border-[var(--yume-cream)] focus:ring-[var(--yume-vermillion)]/20 focus:border-[var(--yume-vermillion)]"
    }`;

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-[var(--yume-charcoal)] mb-4 font-header">
        Contact Information
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--yume-charcoal)] mb-2 font-body">
            First Name <span className="text-[var(--yume-vermillion)]">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={contactInfo.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              onBlur={() => handleBlur("firstName")}
              placeholder="John"
              className={inputClass("firstName")}
            />
            {touched.firstName && !errors.firstName && contactInfo.firstName && (
              <Check size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--yume-nori)]" />
            )}
          </div>
          {errors.firstName && touched.firstName && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 text-sm text-red-500 font-body flex items-center gap-1"
            >
              <AlertCircle size={14} />
              {errors.firstName}
            </motion.p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--yume-charcoal)] mb-2 font-body">
            Last Name <span className="text-[var(--yume-vermillion)]">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={contactInfo.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              onBlur={() => handleBlur("lastName")}
              placeholder="Doe"
              className={inputClass("lastName")}
            />
            {touched.lastName && !errors.lastName && contactInfo.lastName && (
              <Check size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--yume-nori)]" />
            )}
          </div>
          {errors.lastName && touched.lastName && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 text-sm text-red-500 font-body flex items-center gap-1"
            >
              <AlertCircle size={14} />
              {errors.lastName}
            </motion.p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--yume-charcoal)] mb-2 font-body">
            Email Address <span className="text-[var(--yume-vermillion)]">*</span>
          </label>
          <div className="relative">
            <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--yume-miso)]" />
            <input
              type="email"
              value={contactInfo.email}
              onChange={(e) => handleChange("email", e.target.value)}
              onBlur={() => handleBlur("email")}
              placeholder="john@example.com"
              className={`${inputClass("email")} pl-10`}
            />
            {touched.email && !errors.email && contactInfo.email && (
              <Check size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--yume-nori)]" />
            )}
          </div>
          {errors.email && touched.email && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 text-sm text-red-500 font-body flex items-center gap-1"
            >
              <AlertCircle size={14} />
              {errors.email}
            </motion.p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--yume-charcoal)] mb-2 font-body">
            Phone Number <span className="text-[var(--yume-vermillion)]">*</span>
          </label>
          <div className="relative">
            <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--yume-miso)]" />
            <input
              type="tel"
              value={contactInfo.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              onBlur={() => handleBlur("phone")}
              placeholder="06 1234 5678"
              className={`${inputClass("phone")} pl-10`}
            />
            {touched.phone && !errors.phone && contactInfo.phone && (
              <Check size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--yume-nori)]" />
            )}
          </div>
          {errors.phone && touched.phone && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 text-sm text-red-500 font-body flex items-center gap-1"
            >
              <AlertCircle size={14} />
              {errors.phone}
            </motion.p>
          )}
        </div>
      </div>

      <label className="flex items-center gap-2 mt-4 cursor-pointer">
        <input
          type="checkbox"
          checked={saveForLater}
          onChange={(e) => setSaveForLater(e.target.checked)}
          className="w-4 h-4 accent-[var(--yume-vermillion)]"
        />
        <span className="text-sm text-[var(--yume-miso)] font-body">Save my information for next time</span>
      </label>
    </div>
  );
}