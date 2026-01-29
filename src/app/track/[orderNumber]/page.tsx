"use client";

import { useState, useEffect, use, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  ChefHat,
  Package,
  Truck,
  Home,
  Star,
  Share2,
  Copy,
  Check,
  AlertCircle,
  Loader2,
  RefreshCw,
  Navigation,
  Bike,
  MessageCircle,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Send,
  Gift,
} from "lucide-react";

interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: string;
  menuItem: {
    id: number;
    name: string;
    image: string | null;
  } | null;
}

interface Driver {
  id: string;
  name: string;
  photo: string;
  phone: string;
  vehicle: string;
  vehicleColor: string;
  licensePlate: string;
  rating: number;
  totalDeliveries: number;
}

interface TimelineEvent {
  status: string;
  label: string;
  time: string;
  completed: boolean;
  active: boolean;
}

interface TrackingData {
  order: {
    id: string;
    orderNumber: string;
    status: string;
    orderType: string;
    customerFirstName: string;
    customerLastName: string;
    customerPhone: string;
    deliveryStreet: string | null;
    deliveryCity: string | null;
    deliveryPostalCode: string | null;
    deliveryInstructions: string | null;
    subtotal: string;
    deliveryFee: string;
    discount: string;
    tax: string;
    total: string;
    createdAt: string;
    items: OrderItem[];
  };
  tracking: {
    status: string;
    statusMessage: string;
    estimatedMinutes: number;
    estimatedDeliveryTime: string;
    progress: number;
    timeline: TimelineEvent[];
    driver: Driver | null;
    driverLocation: { lat: number; lng: number } | null;
    restaurantLocation: { lat: number; lng: number; address: string };
    deliveryLocation: { lat: number; lng: number; address: string };
  };
}

const STATUS_ICONS: Record<string, typeof CheckCircle> = {
  PENDING: Clock,
  CONFIRMED: CheckCircle,
  PREPARING: ChefHat,
  READY: Package,
  OUT_FOR_DELIVERY: Truck,
  DELIVERED: Home,
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "text-[var(--yume-miso)]",
  CONFIRMED: "text-blue-500",
  PREPARING: "text-orange-500",
  READY: "text-purple-500",
  OUT_FOR_DELIVERY: "text-[var(--yume-vermillion)]",
  DELIVERED: "text-[var(--yume-nori)]",
};

export default function TrackingPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = use(params);
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showRefreshSuccess, setShowRefreshSuccess] = useState(false);

  const [reviewRating, setReviewRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewExpanded, setReviewExpanded] = useState(false);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [existingReview, setExistingReview] = useState<{ rating: number; comment: string | null } | null>(null);

  const fetchTracking = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setRefreshing(true);
    }
    
    try {
      const storedPhone = sessionStorage.getItem(`track-phone-${orderNumber}`);
      const url = storedPhone
        ? `/api/orders/tracking?orderNumber=${orderNumber}&phone=${encodeURIComponent(storedPhone)}`
        : `/api/orders/tracking?orderId=${orderNumber}`;

      const response = await fetch(url);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Order not found");
      }

      const data = await response.json();
      setTrackingData(data);
      setLastUpdated(new Date());
      setError(null);
      
      if (isManualRefresh) {
        setShowRefreshSuccess(true);
        setTimeout(() => setShowRefreshSuccess(false), 2000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tracking");
    } finally {
      setLoading(false);
      if (isManualRefresh) {
        setRefreshing(false);
      }
    }
  }, [orderNumber]);

  useEffect(() => {
    fetchTracking();

    const pollInterval = setInterval(fetchTracking, 15000);

    return () => clearInterval(pollInterval);
  }, [fetchTracking]);

  const copyLink = () => {
    const url = `${window.location.origin}/track/${orderNumber}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOrder = async () => {
    const url = `${window.location.origin}/track/${orderNumber}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Track Order ${trackingData?.order.orderNumber}`,
          text: "Track my Yume Ramen order in real-time!",
          url,
        });
      } catch {
        copyLink();
      }
    } else {
      copyLink();
    }
  };

  const fetchExistingReview = useCallback(async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/feedback`);
      if (response.ok) {
        const data = await response.json();
        if (data.hasReview && data.review) {
          setExistingReview({
            rating: data.review.rating,
            comment: data.review.comment,
          });
          setReviewRating(data.review.rating);
          setReviewSubmitted(true);
        }
      }
    } catch {
      console.error("Failed to fetch existing review");
    }
  }, []);

  useEffect(() => {
    if (trackingData?.order.id && trackingData.tracking.status === "DELIVERED") {
      fetchExistingReview(trackingData.order.id);
    }
  }, [trackingData?.order.id, trackingData?.tracking.status, fetchExistingReview]);

  const handleStarClick = (rating: number) => {
    if (reviewSubmitted || existingReview) return;
    setReviewRating(rating);
    setReviewExpanded(true);
    setReviewError(null);
  };

  const handleSubmitReview = async () => {
    if (!trackingData?.order.id || reviewRating === 0) return;

    setReviewSubmitting(true);
    setReviewError(null);

    try {
      const response = await fetch(`/api/orders/${trackingData.order.id}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating: reviewRating,
          comment: reviewComment.trim() || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.alreadyReviewed) {
          setExistingReview({ rating: reviewRating, comment: reviewComment });
          setReviewSubmitted(true);
        } else {
          throw new Error(data.error || "Failed to submit review");
        }
        return;
      }

      setReviewSubmitted(true);
      setExistingReview({ rating: reviewRating, comment: reviewComment || null });
    } catch (err) {
      setReviewError(err instanceof Error ? err.message : "Failed to submit review");
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleSkipReview = () => {
    setReviewExpanded(false);
    setReviewRating(0);
    setReviewComment("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--yume-warm-white)] flex items-center justify-center">
        <div className="text-center">
          <Loader2
            className="animate-spin text-[var(--yume-vermillion)] mx-auto mb-4"
            size={40}
          />
          <p className="text-[var(--yume-miso)] font-body">
            Loading your order...
          </p>
        </div>
      </div>
    );
  }

  if (error || !trackingData) {
    return (
      <div className="min-h-screen bg-[var(--yume-warm-white)] flex flex-col items-center justify-center px-4">
        <AlertCircle size={48} className="text-[var(--yume-vermillion)] mb-4" />
        <h1 className="text-xl font-bold text-[var(--yume-charcoal)] mb-2 font-header">
          Order Not Found
        </h1>
        <p className="text-[var(--yume-miso)] mb-6 font-body text-center max-w-md">
          {error || "We couldn't find your order. Please check your order number or try again."}
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              setLoading(true);
              setError(null);
              fetchTracking();
            }}
            className="px-6 py-3 bg-[var(--yume-vermillion)] text-white font-bold hover:bg-[var(--yume-vermillion)]/90 transition-colors font-body flex items-center gap-2"
          >
            <RefreshCw size={18} />
            Try Again
          </button>
          <Link
            href="/"
            className="px-6 py-3 border-2 border-[var(--yume-charcoal)] text-[var(--yume-charcoal)] font-bold hover:bg-[var(--yume-charcoal)] hover:text-white transition-colors font-body text-center"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const { order, tracking } = trackingData;
  const StatusIcon = STATUS_ICONS[tracking.status] || Clock;
  const isDelivered = tracking.status === "DELIVERED";
  const isOutForDelivery = tracking.status === "OUT_FOR_DELIVERY";

  return (
    <div className="min-h-screen bg-[var(--yume-warm-white)] pb-20 sm:pb-24">
      <header className="bg-white border-b border-[var(--yume-cream)] sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-center h-14 sm:h-16">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-bold text-[var(--yume-vermillion)] font-header">
                YUME
              </span>
            </Link>
            <div className="absolute right-0 flex items-center gap-2">
              <button
                onClick={shareOrder}
                className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-[var(--yume-cream)] transition-colors rounded-full"
                title="Share tracking link"
              >
                {copied ? (
                  <Check size={20} className="text-[var(--yume-nori)]" />
                ) : (
                  <Share2 size={20} className="text-[var(--yume-miso)]" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-2 text-sm text-[var(--yume-miso)] mb-2 font-body">
            <span>Order #{order.orderNumber}</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(order.orderNumber);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="p-1 hover:bg-[var(--yume-cream)] rounded transition-colors"
            >
              {copied ? (
                <Check size={14} className="text-[var(--yume-nori)]" />
              ) : (
                <Copy size={14} />
              )}
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-[var(--yume-cream)] p-4 sm:p-6 mb-6"
        >
          <div className="flex items-center gap-4 mb-4">
            <motion.div
              animate={
                isDelivered
                  ? {}
                  : {
                      scale: [1, 1.1, 1],
                    }
              }
              transition={{
                repeat: Infinity,
                duration: 2,
              }}
              className={`w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center ${
                isDelivered ? "bg-[var(--yume-nori)]" : "bg-[var(--yume-vermillion)]"
              }`}
            >
              <StatusIcon size={28} className="text-white" />
            </motion.div>
            <div className="flex-1">
              <h1 className="text-lg sm:text-xl font-bold text-[var(--yume-charcoal)] font-header">
                {tracking.statusMessage}
              </h1>
              {!isDelivered && (
                <p className="text-sm sm:text-base text-[var(--yume-miso)] font-body">
                  Estimated arrival in{" "}
                  <span className="font-bold text-[var(--yume-vermillion)]">
                    {tracking.estimatedMinutes <= 0
                      ? "a few moments"
                      : `${tracking.estimatedMinutes} min`}
                  </span>
                </p>
              )}
            </div>
          </div>

          <div className="relative">
            <div className="h-2 bg-[var(--yume-cream)] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${tracking.progress}%` }}
                transition={{ duration: 0.5 }}
                className={`h-full ${
                  isDelivered ? "bg-[var(--yume-nori)]" : "bg-[var(--yume-vermillion)]"
                }`}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-[var(--yume-miso)] font-body">
              <span>Order placed</span>
              <span>{isDelivered ? "Delivered!" : "On its way"}</span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--yume-cream)]">
            {lastUpdated && (
              <div className="text-xs text-[var(--yume-miso)] font-body">
                Updated {lastUpdated.toLocaleTimeString()}
              </div>
            )}
            <button
              onClick={() => fetchTracking(true)}
              disabled={refreshing}
              className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-[var(--yume-vermillion)] hover:bg-[var(--yume-cream)] transition-colors rounded disabled:opacity-50 disabled:cursor-not-allowed font-body min-h-[36px]"
            >
              <RefreshCw 
                size={14} 
                className={refreshing ? "animate-spin" : ""}
              />
              {refreshing ? "Refreshing..." : showRefreshSuccess ? (
                <span className="flex items-center gap-1">
                  <Check size={14} className="text-[var(--yume-nori)]" />
                  Updated!
                </span>
              ) : "Refresh"}
            </button>
          </div>
        </motion.div>

        {(isOutForDelivery || tracking.status === "READY") && tracking.driver && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white border border-[var(--yume-cream)] p-4 sm:p-6 mb-6"
          >
            <h2 className="text-sm font-bold text-[var(--yume-miso)] uppercase tracking-wide mb-4 font-body">
              Your Driver
            </h2>

            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-[var(--yume-cream)] flex items-center justify-center overflow-hidden">
                <span className="text-2xl sm:text-3xl font-bold text-[var(--yume-vermillion)] font-header">
                  {tracking.driver.name.charAt(0)}
                </span>
              </div>

              <div className="flex-1">
                <h3 className="font-bold text-[var(--yume-charcoal)] font-header text-base sm:text-lg">
                  {tracking.driver.name}
                </h3>
                <div className="flex items-center gap-2 text-sm text-[var(--yume-miso)] font-body">
                  <div className="flex items-center gap-1">
                    <Star
                      size={14}
                      className="text-[var(--yume-gold)] fill-[var(--yume-gold)]"
                    />
                    <span>{tracking.driver.rating}</span>
                  </div>
                  <span className="w-1 h-1 bg-[var(--yume-miso)] rounded-full" />
                  <span>{tracking.driver.totalDeliveries} deliveries</span>
                </div>
                <div className="flex items-center gap-2 mt-1 text-sm text-[var(--yume-miso)] font-body">
                  {tracking.driver.vehicle === "Scooter" ? (
                    <Navigation size={14} />
                  ) : (
                    <Bike size={14} />
                  )}
                  <span>
                    {tracking.driver.vehicleColor} {tracking.driver.vehicle}
                  </span>
                  {tracking.driver.licensePlate !== "N/A" && (
                    <>
                      <span className="w-1 h-1 bg-[var(--yume-miso)] rounded-full" />
                      <span>{tracking.driver.licensePlate}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <a
                href={`tel:${tracking.driver.phone}`}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 min-h-[48px] bg-[var(--yume-charcoal)] text-white font-medium hover:bg-[var(--yume-vermillion)] transition-colors font-body"
              >
                <Phone size={18} />
                <span className="hidden sm:inline">Call Driver</span>
                <span className="sm:hidden">Call</span>
              </a>
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 min-h-[48px] border-2 border-[var(--yume-charcoal)] text-[var(--yume-charcoal)] font-medium hover:bg-[var(--yume-charcoal)] hover:text-white transition-colors font-body">
                <MessageCircle size={18} />
                <span className="hidden sm:inline">Message</span>
                <span className="sm:hidden">Chat</span>
              </button>
            </div>
          </motion.div>
        )}

        {isOutForDelivery && tracking.driverLocation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white border border-[var(--yume-cream)] overflow-hidden mb-6"
          >
            <div className="relative h-48 sm:h-64 bg-[var(--yume-cream)]">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="relative">
                    <motion.div
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 0, 0.5],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 2,
                      }}
                      className="absolute inset-0 bg-[var(--yume-vermillion)] rounded-full"
                    />
                    <div className="relative w-12 h-12 bg-[var(--yume-vermillion)] rounded-full flex items-center justify-center">
                      <Truck size={24} className="text-white" />
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-[var(--yume-miso)] font-body">
                    Driver is on the way!
                  </p>
                  <p className="text-xs text-[var(--yume-miso)] font-body mt-1">
                    Location: {tracking.driverLocation.lat.toFixed(4)},{" "}
                    {tracking.driverLocation.lng.toFixed(4)}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-[var(--yume-cream)]">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-[var(--yume-vermillion)] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-[var(--yume-charcoal)] font-body">
                    Delivering to
                  </p>
                  <p className="text-sm text-[var(--yume-miso)] font-body">
                    {order.deliveryStreet}, {order.deliveryCity}{" "}
                    {order.deliveryPostalCode}
                  </p>
                  {order.deliveryInstructions && (
                    <p className="text-xs text-[var(--yume-miso)] font-body mt-1">
                      Note: {order.deliveryInstructions}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white border border-[var(--yume-cream)] p-4 sm:p-6 mb-6"
        >
          <h2 className="text-sm font-bold text-[var(--yume-miso)] uppercase tracking-wide mb-4 font-body">
            Order Progress
          </h2>

          <div className="relative">
            {tracking.timeline.map((event, index) => {
              const Icon = STATUS_ICONS[event.status] || Clock;
              const isLast = index === tracking.timeline.length - 1;

              return (
                <div key={event.status} className="flex gap-4 pb-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        event.completed
                          ? "bg-[var(--yume-nori)] text-white"
                          : event.active
                          ? "bg-[var(--yume-vermillion)] text-white"
                          : "bg-[var(--yume-cream)] text-[var(--yume-miso)]"
                      }`}
                    >
                      {event.completed ? (
                        <CheckCircle size={20} />
                      ) : (
                        <Icon size={20} />
                      )}
                    </div>
                    {!isLast && (
                      <div
                        className={`w-0.5 flex-1 mt-2 ${
                          event.completed
                            ? "bg-[var(--yume-nori)]"
                            : "bg-[var(--yume-cream)]"
                        }`}
                      />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <h3
                      className={`font-medium font-body ${
                        event.completed || event.active
                          ? "text-[var(--yume-charcoal)]"
                          : "text-[var(--yume-miso)]"
                      }`}
                    >
                      {event.label}
                    </h3>
                    {(event.completed || event.active) && (
                      <p className="text-xs text-[var(--yume-miso)] font-body mt-0.5">
                        {new Date(event.time).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white border border-[var(--yume-cream)] mb-6 overflow-hidden"
        >
          <button
            onClick={() => setShowOrderDetails(!showOrderDetails)}
            className="w-full flex items-center justify-between p-4 sm:p-6 hover:bg-[var(--yume-cream)]/30 transition-colors"
          >
            <h2 className="text-sm font-bold text-[var(--yume-miso)] uppercase tracking-wide font-body">
              Order Details
            </h2>
            {showOrderDetails ? (
              <ChevronUp size={20} className="text-[var(--yume-miso)]" />
            ) : (
              <ChevronDown size={20} className="text-[var(--yume-miso)]" />
            )}
          </button>

          <AnimatePresence>
            {showOrderDetails && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="px-4 sm:px-6 pb-4 sm:pb-6 border-t border-[var(--yume-cream)]">
                  <div className="space-y-3 py-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-[var(--yume-charcoal)] font-body">
                            {item.quantity}x {item.name}
                          </p>
                        </div>
                        <p className="text-sm font-medium text-[var(--yume-charcoal)] font-body">
                          EUR {(parseFloat(item.price) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-[var(--yume-cream)] pt-4 space-y-2 text-sm font-body">
                    <div className="flex justify-between text-[var(--yume-miso)]">
                      <span>Subtotal</span>
                      <span>EUR {parseFloat(order.subtotal).toFixed(2)}</span>
                    </div>
                    {parseFloat(order.deliveryFee) > 0 && (
                      <div className="flex justify-between text-[var(--yume-miso)]">
                        <span>Delivery</span>
                        <span>EUR {parseFloat(order.deliveryFee).toFixed(2)}</span>
                      </div>
                    )}
                    {parseFloat(order.discount) > 0 && (
                      <div className="flex justify-between text-[var(--yume-nori)]">
                        <span>Discount</span>
                        <span>-EUR {parseFloat(order.discount).toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-[var(--yume-miso)]">
                      <span>Tax</span>
                      <span>EUR {parseFloat(order.tax).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-[var(--yume-charcoal)] pt-2 border-t border-[var(--yume-cream)]">
                      <span>Total</span>
                      <span className="text-[var(--yume-vermillion)]">
                        EUR {parseFloat(order.total).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {isDelivered && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-[var(--yume-nori)]/10 border border-[var(--yume-nori)]/20 p-4 sm:p-6 mb-6 overflow-hidden"
          >
            {reviewSubmitted || existingReview ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-[var(--yume-nori)] rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} className="text-white" />
                </div>
                <h2 className="font-bold text-[var(--yume-charcoal)] font-header text-lg mb-2">
                  Thank You for Your Feedback!
                </h2>
                <p className="text-sm text-[var(--yume-miso)] font-body mb-4">
                  Your rating helps us improve our service.
                </p>
                <div className="flex justify-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={24}
                      className={`${
                        star <= (existingReview?.rating || reviewRating)
                          ? "text-[var(--yume-gold)] fill-[var(--yume-gold)]"
                          : "text-[var(--yume-cream)]"
                      }`}
                    />
                  ))}
                </div>
                {(existingReview?.comment || reviewComment) && (
                  <p className="text-sm text-[var(--yume-miso)] font-body italic">
                    &ldquo;{existingReview?.comment || reviewComment}&rdquo;
                  </p>
                )}
                <div className="mt-6 bg-[var(--yume-gold)]/20 p-4 rounded-lg">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Gift size={18} className="text-[var(--yume-vermillion)]" />
                    <span className="text-sm font-medium text-[var(--yume-charcoal)]">
                      Thanks for reviewing!
                    </span>
                  </div>
                  <p className="text-sm text-[var(--yume-charcoal)]">
                    Use code <span className="font-bold text-[var(--yume-vermillion)]">THANKS10</span> for 10% off your next order!
                  </p>
                </div>
              </motion.div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle size={24} className="text-[var(--yume-nori)]" />
                  <h2 className="font-bold text-[var(--yume-charcoal)] font-header">
                    Order Delivered!
                  </h2>
                </div>
                <p className="text-sm text-[var(--yume-miso)] font-body mb-4">
                  We hope you enjoy your meal! How was your experience?
                </p>
                
                <div className="flex flex-wrap gap-1 sm:gap-2 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleStarClick(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-white transition-all rounded hover:scale-110"
                      aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                    >
                      <Star
                        size={32}
                        className={`transition-colors ${
                          star <= (hoveredRating || reviewRating)
                            ? "text-[var(--yume-gold)] fill-[var(--yume-gold)]"
                            : "text-[var(--yume-cream)] hover:text-[var(--yume-gold)]"
                        }`}
                      />
                    </button>
                  ))}
                </div>

                {reviewRating > 0 && (
                  <p className="text-sm text-[var(--yume-miso)] font-body mb-2">
                    {reviewRating === 5 && "Excellent! We're so glad you enjoyed it!"}
                    {reviewRating === 4 && "Great! Thanks for the positive feedback!"}
                    {reviewRating === 3 && "Good to hear. How can we do better?"}
                    {reviewRating === 2 && "We're sorry. Please tell us what went wrong."}
                    {reviewRating === 1 && "We apologize. Please share your experience."}
                  </p>
                )}

                <AnimatePresence>
                  {reviewExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 space-y-4">
                        <div>
                          <label
                            htmlFor="review-comment"
                            className="block text-sm font-medium text-[var(--yume-charcoal)] mb-2 font-body"
                          >
                            Tell us more (optional)
                          </label>
                          <textarea
                            id="review-comment"
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            rows={3}
                            placeholder="What did you love? What can we improve?"
                            className="w-full px-4 py-3 border border-[var(--yume-cream)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--yume-vermillion)] focus:border-transparent font-body resize-none text-[var(--yume-charcoal)] placeholder:text-[var(--yume-miso)]/50"
                          />
                        </div>

                        {reviewError && (
                          <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                            <AlertCircle size={18} />
                            <span className="text-sm font-body">{reviewError}</span>
                          </div>
                        )}

                        <div className="flex gap-3">
                          <button
                            onClick={handleSubmitReview}
                            disabled={reviewSubmitting || reviewRating === 0}
                            className="flex-1 py-3 bg-[var(--yume-vermillion)] text-white font-bold hover:bg-[var(--yume-vermillion)]/90 transition-colors font-body flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px]"
                          >
                            {reviewSubmitting ? (
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
                          <button
                            onClick={handleSkipReview}
                            disabled={reviewSubmitting}
                            className="px-4 py-3 border-2 border-[var(--yume-miso)]/30 text-[var(--yume-miso)] font-medium hover:border-[var(--yume-charcoal)] hover:text-[var(--yume-charcoal)] transition-colors font-body min-h-[48px]"
                          >
                            Skip
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-center space-y-4"
        >
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/menu"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[48px] bg-[var(--yume-vermillion)] text-white font-bold hover:bg-[var(--yume-vermillion)]/90 transition-colors font-body"
            >
              Order Again
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[48px] border-2 border-[var(--yume-charcoal)] text-[var(--yume-charcoal)] font-bold hover:bg-[var(--yume-charcoal)] hover:text-white transition-colors font-body"
            >
              Back to Home
            </Link>
          </div>
        </motion.div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-[var(--yume-cream)] py-3 px-4 sm:py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <p className="text-xs sm:text-sm text-[var(--yume-miso)] font-body">
            Need help?{" "}
            <a
              href="tel:+31201234567"
              className="text-[var(--yume-vermillion)] hover:underline"
            >
              +31 20 123 4567
            </a>
          </p>
          <button
            onClick={() => fetchTracking(true)}
            className="flex items-center gap-2 text-xs sm:text-sm text-[var(--yume-vermillion)] font-medium font-body hover:underline"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>
      </footer>
    </div>
  );
}