"use client";

import { useState, useEffect, use } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Star, Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

interface FeedbackPageProps {
  params: Promise<{ orderId: string }>;
}

export default function FeedbackPage({ params }: FeedbackPageProps) {
  const { orderId } = use(params);
  const searchParams = useSearchParams();
  const initialRating = parseInt(searchParams.get("rating") || "0");

  const [rating, setRating] = useState(initialRating);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const response = await fetch(`/api/orders/${orderId}/feedback`);
        if (response.ok) {
          const data = await response.json();
          setOrderNumber(data.orderNumber);
        }
      } catch {
        console.error("Failed to fetch order info");
      }
    }
    fetchOrder();
  }, [orderId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/orders/${orderId}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit feedback");
      }

      setSubmitted(true);
    } catch {
      setError("Failed to submit feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[var(--yume-warm-white)] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 bg-[var(--yume-nori)] rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--yume-charcoal)] mb-4 font-header">
            Thank You!
          </h1>
          <p className="text-[var(--yume-miso)] font-body mb-6">
            Your feedback helps us keep making delicious ramen. We appreciate you taking the time!
          </p>
          <div className="bg-[var(--yume-gold)]/20 p-4 rounded-lg mb-6">
            <p className="text-sm font-medium text-[var(--yume-charcoal)]">
              Use code <span className="font-bold text-[var(--yume-vermillion)]">THANKS10</span> for 10% off your next order!
            </p>
          </div>
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--yume-vermillion)] text-white font-bold hover:bg-[var(--yume-vermillion)]/90 transition-colors font-body"
          >
            Order Again
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--yume-warm-white)]">
      <header className="bg-white border-b border-[var(--yume-cream)]">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-center">
          <Link href="/" className="text-2xl font-bold text-[var(--yume-vermillion)] font-header">
            YUME
          </Link>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl font-bold text-[var(--yume-charcoal)] mb-2 font-header">
            How Was Your Meal?
          </h1>
          {orderNumber && (
            <p className="text-sm text-[var(--yume-miso)] font-body">
              Order {orderNumber}
            </p>
          )}
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="bg-white border border-[var(--yume-cream)] p-6"
        >
          <div className="mb-6">
            <label className="block text-sm font-medium text-[var(--yume-charcoal)] mb-4 text-center font-body">
              Rate your experience
            </label>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  onMouseEnter={() => setHoveredRating(value)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-2 transition-transform hover:scale-110"
                >
                  <Star
                    size={36}
                    className={`transition-colors ${
                      value <= (hoveredRating || rating)
                        ? "text-[var(--yume-gold)] fill-[var(--yume-gold)]"
                        : "text-[var(--yume-cream)]"
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-center text-sm text-[var(--yume-miso)] mt-2 font-body">
                {rating === 5 && "Excellent!"}
                {rating === 4 && "Great!"}
                {rating === 3 && "Good"}
                {rating === 2 && "Fair"}
                {rating === 1 && "Poor"}
              </p>
            )}
          </div>

          <div className="mb-6">
            <label
              htmlFor="comment"
              className="block text-sm font-medium text-[var(--yume-charcoal)] mb-2 font-body"
            >
              Tell us more (optional)
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              placeholder="What did you love? What can we improve?"
              className="w-full px-4 py-3 border border-[var(--yume-cream)] bg-[var(--yume-warm-white)] focus:outline-none focus:ring-2 focus:ring-[var(--yume-vermillion)] focus:border-transparent font-body resize-none"
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle size={18} />
              <span className="text-sm font-body">{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[var(--yume-vermillion)] text-white font-bold hover:bg-[var(--yume-vermillion)]/90 transition-colors font-body flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send size={18} />
                Submit Feedback
              </>
            )}
          </button>
        </motion.form>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center text-xs text-[var(--yume-miso)] mt-6 font-body"
        >
          Your feedback helps us improve. Thank you!
        </motion.p>
      </main>
    </div>
  );
}