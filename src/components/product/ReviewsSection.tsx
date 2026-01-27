"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ThumbsUp, CheckCircle, ChevronDown } from "lucide-react";
import { ReviewData } from "@/data/menuData";

interface ReviewsSectionProps {
  reviews: ReviewData;
  productName: string;
}

const sortOptions = [
  { value: "helpful", label: "Most Helpful" },
  { value: "recent", label: "Most Recent" },
  { value: "highest", label: "Highest Rated" },
] as const;

export default function ReviewsSection({ reviews, productName }: ReviewsSectionProps) {
  const [sortBy, setSortBy] = useState<"helpful" | "recent" | "highest">("helpful");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const [showAll, setShowAll] = useState(false);

  const sortedReviews = [...reviews.featured].sort((a, b) => {
    switch (sortBy) {
      case "helpful":
        return b.helpful - a.helpful;
      case "recent":
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case "highest":
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  const displayedReviews = showAll ? sortedReviews : sortedReviews.slice(0, 3);

  const getPercentage = (count: number) => {
    return Math.round((count / reviews.count) * 100);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="py-12">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        <div className="lg:w-1/3">
          <h3 className="text-2xl font-bold text-[var(--yume-charcoal)] mb-6 font-header">
            Customer Reviews
          </h3>

          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-5xl font-bold text-[var(--yume-charcoal)] font-header">
              {reviews.rating.toFixed(1)}
            </span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={20}
                  className={`${
                    star <= Math.round(reviews.rating)
                      ? "fill-[var(--yume-gold)] text-[var(--yume-gold)]"
                      : "text-[var(--yume-miso)]"
                  }`}
                />
              ))}
            </div>
          </div>
          <p className="text-sm text-[var(--yume-miso)] mb-6 font-body">
            Based on {reviews.count} reviews
          </p>

          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = reviews.breakdown[stars as keyof typeof reviews.breakdown];
              const percentage = getPercentage(count);
              return (
                <div key={stars} className="flex items-center gap-3">
                  <span className="text-sm text-[var(--yume-charcoal)] w-8 font-body">
                    {stars} ★
                  </span>
                  <div className="flex-1 h-3 bg-[var(--yume-cream)] overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${percentage}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.1 * (5 - stars) }}
                      className="h-full bg-[var(--yume-gold)]"
                    />
                  </div>
                  <span className="text-sm text-[var(--yume-miso)] w-12 text-right font-body">
                    {percentage}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:w-2/3">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-[var(--yume-miso)] font-body">Sort by:</span>
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="bg-[var(--yume-cream)] border border-[var(--yume-miso)]/20 px-3 py-2 pr-8 text-sm text-[var(--yume-charcoal)] font-body cursor-pointer hover:bg-[var(--yume-cream)]/80 transition-colors flex items-center gap-2 min-w-[140px] justify-between"
                >
                  <span>{sortOptions.find(o => o.value === sortBy)?.label}</span>
                  <ChevronDown size={14} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 right-0 mt-1 bg-[var(--yume-warm-white)] border border-[var(--yume-miso)]/20 shadow-lg z-20"
                    >
                      {sortOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => { setSortBy(option.value); setIsDropdownOpen(false); }}
                          className={`w-full px-3 py-2 text-sm text-left font-body transition-colors ${
                            sortBy === option.value
                              ? 'bg-[var(--yume-vermillion)] text-[var(--yume-warm-white)]'
                              : 'text-[var(--yume-charcoal)] hover:bg-[var(--yume-cream)]'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {displayedReviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-[var(--yume-cream)]/50 p-6"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-[var(--yume-charcoal)] font-body">
                        {review.author}
                      </span>
                      {review.verified && (
                        <span className="inline-flex items-center gap-1 text-xs text-[var(--yume-nori)]">
                          <CheckCircle size={12} />
                          Verified
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={14}
                            className={`${
                              star <= review.rating
                                ? "fill-[var(--yume-gold)] text-[var(--yume-gold)]"
                                : "text-[var(--yume-miso)]"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-[var(--yume-miso)]">
                        {formatDate(review.date)}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-[var(--yume-charcoal)] mb-4 font-body leading-relaxed">
                  {review.text}
                </p>

                <div className="flex items-center gap-4 text-sm">
                  <button className="inline-flex items-center gap-1 text-[var(--yume-miso)] hover:text-[var(--yume-charcoal)] transition-colors font-body">
                    <ThumbsUp size={14} />
                    Helpful ({review.helpful})
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {reviews.featured.length > 3 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="mt-6 w-full py-3 border border-[var(--yume-charcoal)] text-[var(--yume-charcoal)] font-medium hover:bg-[var(--yume-charcoal)] hover:text-[var(--yume-warm-white)] transition-colors font-body flex items-center justify-center gap-2"
            >
              {showAll ? "Show Less" : "Show All Reviews"}
              <ChevronDown
                size={18}
                className={`transition-transform ${showAll ? "rotate-180" : ""}`}
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}