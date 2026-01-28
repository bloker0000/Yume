"use client";

import { motion } from "framer-motion";
import { Truck, Store, Clock } from "lucide-react";

interface OrderTypeSelectorProps {
  orderType: "delivery" | "pickup";
  onOrderTypeChange: (type: "delivery" | "pickup") => void;
}

export default function OrderTypeSelector({ orderType, onOrderTypeChange }: OrderTypeSelectorProps) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-[var(--yume-charcoal)] mb-4 font-header">
        How would you like to receive your order?
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onOrderTypeChange("delivery")}
          className={`relative p-6 border-2 transition-all ${
            orderType === "delivery"
              ? "border-[var(--yume-vermillion)] bg-[var(--yume-vermillion)]/5"
              : "border-[var(--yume-cream)] hover:border-[var(--yume-miso)]"
          }`}
        >
          {orderType === "delivery" && (
            <div className="absolute top-2 right-2 w-3 h-3 bg-[var(--yume-vermillion)] rounded-full" />
          )}
          <Truck
            size={32}
            className={orderType === "delivery" ? "text-[var(--yume-vermillion)]" : "text-[var(--yume-miso)]"}
          />
          <h3 className="mt-3 font-bold text-[var(--yume-charcoal)] font-header">Delivery</h3>
          <div className="flex items-center gap-1 mt-2 text-sm text-[var(--yume-miso)]">
            <Clock size={14} />
            <span className="font-body">25-35 mins</span>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onOrderTypeChange("pickup")}
          className={`relative p-6 border-2 transition-all ${
            orderType === "pickup"
              ? "border-[var(--yume-vermillion)] bg-[var(--yume-vermillion)]/5"
              : "border-[var(--yume-cream)] hover:border-[var(--yume-miso)]"
          }`}
        >
          {orderType === "pickup" && (
            <div className="absolute top-2 right-2 w-3 h-3 bg-[var(--yume-vermillion)] rounded-full" />
          )}
          <Store
            size={32}
            className={orderType === "pickup" ? "text-[var(--yume-vermillion)]" : "text-[var(--yume-miso)]"}
          />
          <h3 className="mt-3 font-bold text-[var(--yume-charcoal)] font-header">Pickup</h3>
          <div className="flex items-center gap-1 mt-2 text-sm text-[var(--yume-miso)]">
            <Clock size={14} />
            <span className="font-body">15-20 mins</span>
          </div>
        </motion.button>
      </div>

      {orderType === "pickup" && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-4 p-4 bg-[var(--yume-cream)]/50"
        >
          <p className="text-sm text-[var(--yume-charcoal)] font-body">
            <span className="font-bold">Pickup Location:</span>
          </p>
          <p className="text-sm text-[var(--yume-miso)] font-body mt-1">
            Yume Ramen - 123 Noodle Street
            <br />
            Amsterdam, 1012 AB
          </p>
        </motion.div>
      )}
    </div>
  );
}