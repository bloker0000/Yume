"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Calendar, ChevronDown } from "lucide-react";

interface DeliveryTimeSelectorProps {
  deliveryTime: "asap" | "scheduled";
  scheduledDate: string;
  scheduledTime: string;
  onDeliveryTimeChange: (type: "asap" | "scheduled") => void;
  onScheduledDateChange: (date: string) => void;
  onScheduledTimeChange: (time: string) => void;
}

const TIME_SLOTS = [
  "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00"
];

export default function DeliveryTimeSelector({
  deliveryTime,
  scheduledDate,
  scheduledTime,
  onDeliveryTimeChange,
  onScheduledDateChange,
  onScheduledTimeChange,
}: DeliveryTimeSelectorProps) {
  const [availableDates, setAvailableDates] = useState<{ value: string; label: string }[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isTimeOpen, setIsTimeOpen] = useState(false);
  const dateRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dates: { value: string; label: string }[] = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const value = date.toISOString().split("T")[0];
      const label = i === 0 ? "Today" : i === 1 ? "Tomorrow" : date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
      dates.push({ value, label });
    }

    setAvailableDates(dates);
    if (!scheduledDate) {
      onScheduledDateChange(dates[0].value);
    }
  }, []);

  useEffect(() => {
    const now = new Date();
    const isToday = scheduledDate === new Date().toISOString().split("T")[0];
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    const filtered = TIME_SLOTS.filter((slot) => {
      if (!isToday) return true;
      const [hour, minute] = slot.split(":").map(Number);
      const slotMinutes = hour * 60 + minute;
      const currentMinutes = currentHour * 60 + currentMinute + 45;
      return slotMinutes > currentMinutes;
    });

    setAvailableTimes(filtered);
    if (filtered.length > 0 && (!scheduledTime || !filtered.includes(scheduledTime))) {
      onScheduledTimeChange(filtered[0]);
    }
  }, [scheduledDate]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dateRef.current && !dateRef.current.contains(event.target as Node)) {
        setIsDateOpen(false);
      }
      if (timeRef.current && !timeRef.current.contains(event.target as Node)) {
        setIsTimeOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatTime = (time: string) => {
    const [hour, minute] = time.split(":");
    const h = parseInt(hour);
    const ampm = h >= 12 ? "PM" : "AM";
    const hour12 = h % 12 || 12;
    return `${hour12}:${minute} ${ampm}`;
  };

  const getDateLabel = () => {
    const date = availableDates.find((d) => d.value === scheduledDate);
    return date?.label || "Select date";
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-[var(--yume-charcoal)] mb-4 font-header">
        When should we deliver?
      </h2>

      <div className="space-y-3">
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => onDeliveryTimeChange("asap")}
          className={`w-full flex items-center gap-4 p-4 border-2 transition-all text-left ${
            deliveryTime === "asap"
              ? "border-[var(--yume-vermillion)] bg-[var(--yume-vermillion)]/5"
              : "border-[var(--yume-cream)] hover:border-[var(--yume-miso)]"
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              deliveryTime === "asap" ? "border-[var(--yume-vermillion)]" : "border-[var(--yume-miso)]"
            }`}
          >
            {deliveryTime === "asap" && <div className="w-3 h-3 rounded-full bg-[var(--yume-vermillion)]" />}
          </div>
          <div className="flex-1">
            <p className="font-bold text-[var(--yume-charcoal)] font-body">ASAP</p>
            <p className="text-sm text-[var(--yume-miso)] font-body flex items-center gap-1">
              <Clock size={14} />
              25-35 minutes
            </p>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => onDeliveryTimeChange("scheduled")}
          className={`w-full flex items-center gap-4 p-4 border-2 transition-all text-left ${
            deliveryTime === "scheduled"
              ? "border-[var(--yume-vermillion)] bg-[var(--yume-vermillion)]/5"
              : "border-[var(--yume-cream)] hover:border-[var(--yume-miso)]"
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              deliveryTime === "scheduled" ? "border-[var(--yume-vermillion)]" : "border-[var(--yume-miso)]"
            }`}
          >
            {deliveryTime === "scheduled" && <div className="w-3 h-3 rounded-full bg-[var(--yume-vermillion)]" />}
          </div>
          <div className="flex-1">
            <p className="font-bold text-[var(--yume-charcoal)] font-body">Schedule for later</p>
            <p className="text-sm text-[var(--yume-miso)] font-body flex items-center gap-1">
              <Calendar size={14} />
              Choose a time that works for you
            </p>
          </div>
        </motion.button>
      </div>

      <AnimatePresence>
        {deliveryTime === "scheduled" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 grid grid-cols-2 gap-4"
          >
            <div ref={dateRef} className="relative">
              <label className="block text-sm font-medium text-[var(--yume-charcoal)] mb-2 font-body">
                Date
              </label>
              <button
                onClick={() => setIsDateOpen(!isDateOpen)}
                className="w-full flex items-center justify-between px-4 py-3 bg-[var(--yume-warm-white)] border border-[var(--yume-cream)] font-body text-[var(--yume-charcoal)] hover:border-[var(--yume-miso)] transition-all"
              >
                <span>{getDateLabel()}</span>
                <ChevronDown size={18} className={`transition-transform ${isDateOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {isDateOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="absolute top-full left-0 right-0 mt-1 bg-[var(--yume-warm-white)] border border-[var(--yume-cream)] shadow-lg z-20 max-h-48 overflow-auto"
                  >
                    {availableDates.map((date) => (
                      <button
                        key={date.value}
                        onClick={() => {
                          onScheduledDateChange(date.value);
                          setIsDateOpen(false);
                        }}
                        className={`w-full px-4 py-2 text-left font-body text-sm transition-colors ${
                          scheduledDate === date.value
                            ? "bg-[var(--yume-vermillion)] text-[var(--yume-warm-white)]"
                            : "text-[var(--yume-charcoal)] hover:bg-[var(--yume-cream)]"
                        }`}
                      >
                        {date.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div ref={timeRef} className="relative">
              <label className="block text-sm font-medium text-[var(--yume-charcoal)] mb-2 font-body">
                Time
              </label>
              <button
                onClick={() => setIsTimeOpen(!isTimeOpen)}
                className="w-full flex items-center justify-between px-4 py-3 bg-[var(--yume-warm-white)] border border-[var(--yume-cream)] font-body text-[var(--yume-charcoal)] hover:border-[var(--yume-miso)] transition-all"
              >
                <span>{scheduledTime ? formatTime(scheduledTime) : "Select time"}</span>
                <ChevronDown size={18} className={`transition-transform ${isTimeOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {isTimeOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="absolute top-full left-0 right-0 mt-1 bg-[var(--yume-warm-white)] border border-[var(--yume-cream)] shadow-lg z-20 max-h-48 overflow-auto"
                  >
                    {availableTimes.length === 0 ? (
                      <p className="px-4 py-2 text-sm text-[var(--yume-miso)] font-body">No available times for today</p>
                    ) : (
                      availableTimes.map((time) => (
                        <button
                          key={time}
                          onClick={() => {
                            onScheduledTimeChange(time);
                            setIsTimeOpen(false);
                          }}
                          className={`w-full px-4 py-2 text-left font-body text-sm transition-colors ${
                            scheduledTime === time
                              ? "bg-[var(--yume-vermillion)] text-[var(--yume-warm-white)]"
                              : "text-[var(--yume-charcoal)] hover:bg-[var(--yume-cream)]"
                          }`}
                        >
                          {formatTime(time)}
                        </button>
                      ))
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}