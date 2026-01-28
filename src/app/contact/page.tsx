"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CartSidebar from "@/components/menu/CartSidebar";
import { useCart } from "@/context/CartContext";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Navigation as NavigationIcon,
  MessageCircle,
  ShoppingBag,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Copy,
  Check,
  Send,
  Instagram,
  Facebook,
  Star,
  Car,
  Train,
  Bike,
  Accessibility,
  Calendar,
  Users,
  Utensils,
  Gift,
  AlertCircle,
  Globe,
  Heart
} from "lucide-react";
import { CirclePattern, SeigaihaPattern } from "@/components/JapanesePatterns";

const businessHours = [
  { day: "Monday", open: "11:30", close: "22:00", isToday: false },
  { day: "Tuesday", open: "11:30", close: "22:00", isToday: false },
  { day: "Wednesday", open: "11:30", close: "22:00", isToday: false },
  { day: "Thursday", open: "11:30", close: "22:00", isToday: false },
  { day: "Friday", open: "11:30", close: "23:00", isToday: false },
  { day: "Saturday", open: "12:00", close: "23:00", isToday: false },
  { day: "Sunday", open: "12:00", close: "21:00", isToday: false },
];

const faqItems = [
  {
    question: "Do you take reservations?",
    answer: "Yes! We accept reservations for parties of 2 or more. For groups larger than 8, please contact us directly to arrange seating.",
    icon: Calendar
  },
  {
    question: "Is there parking available?",
    answer: "Street parking is available nearby, and there's a public parking garage at Q-Park Centrum (5 min walk). We also have plenty of bike racks!",
    icon: Car
  },
  {
    question: "Do you have vegetarian/vegan options?",
    answer: "Absolutely! Our Vegetable Miso Ramen is fully vegan, and we can customize many dishes. Just let your server know about dietary requirements.",
    icon: Utensils
  },
  {
    question: "Can I order for large groups/catering?",
    answer: "Yes! We offer catering for events and large group orders. Contact us at catering@yumeramen.nl or call for custom menu options.",
    icon: Users
  },
  {
    question: "What are your allergen policies?",
    answer: "All our menu items have allergen information available. Common allergens include soy, wheat (gluten), sesame, and shellfish. Ask staff for our allergen guide.",
    icon: AlertCircle
  },
  {
    question: "Do you sell gift cards?",
    answer: "Yes! Digital and physical gift cards are available in any amount. Perfect for the ramen lover in your life!",
    icon: Gift
  }
];

const contactMethods = [
  {
    title: "Visit Us",
    japanese: "来店",
    icon: MapPin,
    primary: "Westerstraat 187",
    secondary: "1015 MA Amsterdam",
    action: "Get Directions",
    actionIcon: NavigationIcon,
    color: "vermillion"
  },
  {
    title: "Call Us",
    japanese: "電話",
    icon: Phone,
    primary: "+31 20 123 4567",
    secondary: "Mon-Sun, during business hours",
    action: "Call Now",
    actionIcon: Phone,
    color: "gold"
  },
  {
    title: "Email Us",
    japanese: "メール",
    icon: Mail,
    primary: "hello@yumeramen.nl",
    secondary: "We reply within 24 hours",
    action: "Send Email",
    actionIcon: Mail,
    color: "nori"
  },
  {
    title: "Order Online",
    japanese: "注文",
    icon: ShoppingBag,
    primary: "Fastest way to ramen!",
    secondary: "30 min delivery average",
    action: "Order Now",
    actionIcon: ChevronRight,
    color: "vermillion"
  }
];

const inquiryTypes = [
  { value: "general", label: "General Inquiry" },
  { value: "catering", label: "Catering / Private Events" },
  { value: "press", label: "Press / Media" },
  { value: "feedback", label: "Feedback / Compliments" },
  { value: "support", label: "Order Support" },
  { value: "careers", label: "Careers / Join Our Team" },
  { value: "partnership", label: "Partnership Opportunities" }
];

export default function ContactPage() {
  const { isCartOpen, setIsCartOpen } = useCart();
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isInquiryDropdownOpen, setIsInquiryDropdownOpen] = useState(false);
  const inquiryDropdownRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    inquiryType: "general",
    subject: "",
    message: "",
    preferredContact: "email"
  });
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showFallbackContact, setShowFallbackContact] = useState(false);

  const { currentDay, isOpen } = useMemo(() => {
    const now = new Date();
    const dayIndex = now.getDay();
    const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1;
    
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinutes;
    
    const todayHours = businessHours[adjustedIndex];
    const [openHour, openMin] = todayHours.open.split(":").map(Number);
    const [closeHour, closeMin] = todayHours.close.split(":").map(Number);
    const openTime = openHour * 60 + openMin;
    const closeTime = closeHour * 60 + closeMin;
    
    return {
      currentDay: adjustedIndex,
      isOpen: currentTime >= openTime && currentTime < closeTime
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (inquiryDropdownRef.current && !inquiryDropdownRef.current.contains(event.target as Node)) {
        setIsInquiryDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("sending");
    setErrorMessage("");
    setShowFallbackContact(false);
    
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setFormStatus("success");
        
        setTimeout(() => {
          setFormStatus("idle");
          setFormData({
            name: "",
            email: "",
            phone: "",
            inquiryType: "general",
            subject: "",
            message: "",
            preferredContact: "email"
          });
        }, 4000);
      } else {
        setFormStatus("error");
        setErrorMessage(data.message || "Something went wrong. Please try again.");
        setShowFallbackContact(data.fallbackContact || false);
      }
    } catch (error) {
      console.error("Network error:", error);
      setFormStatus("error");
      setErrorMessage("Unable to connect. Please check your internet connection or contact us directly at hello@yumeramen.nl");
      setShowFallbackContact(true);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--yume-warm-white)] overflow-x-hidden">
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <Navigation variant="dark" />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: "url('/bg\\'s/circlesBG2.svg')",
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="text-4xl font-japanese text-[var(--yume-gold)]">繋がろう</span>
                <div className="w-12 h-[1px] bg-[var(--yume-gold)]" />
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold text-[var(--yume-charcoal)] font-header mb-6">
                Let&apos;s <span className="text-[var(--yume-vermillion)]">Connect</span>
              </h1>
              
              <p className="text-xl text-[var(--yume-miso)] font-body mb-8 max-w-lg">
                Whether you have a question, feedback, or just want to say hello — we&apos;re here and happy to help.
              </p>

              {/* Live Status */}
              <div className="inline-flex items-center gap-3 px-4 py-3 bg-[var(--yume-charcoal)] mb-8">
                <div className={`w-3 h-3 rounded-full ${isOpen ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
                <span className="text-[var(--yume-warm-white)] font-body">
                  {isOpen ? "Open Now" : "Currently Closed"}
                </span>
                <span className="text-[var(--yume-warm-white)]/60 font-body">
                  • {isOpen ? `Closes at ${businessHours[currentDay].close}` : `Opens at ${businessHours[(currentDay + 1) % 7].open}`}
                </span>
              </div>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <Clock size={18} className="text-[var(--yume-vermillion)]" />
                  <span className="text-sm text-[var(--yume-charcoal)] font-body">Reply within 24h</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star size={18} className="text-[var(--yume-gold)]" />
                  <span className="text-sm text-[var(--yume-charcoal)] font-body">4.9/5 on Google</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart size={18} className="text-[var(--yume-vermillion)]" />
                  <span className="text-sm text-[var(--yume-charcoal)] font-body">10,000+ served</span>
                </div>
              </div>
            </motion.div>

            {/* Right - Contact Cards Grid */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-2 gap-4"
            >
              {contactMethods.map((method, index) => (
                <motion.div
                  key={method.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="group relative bg-[var(--yume-warm-white)] border border-[var(--yume-cream)] p-6 hover:border-[var(--yume-vermillion)] transition-all duration-300 hover:shadow-lg cursor-pointer"
                  onClick={() => {
                    if (method.title === "Visit Us") {
                      window.open("https://maps.google.com/?q=Westerstraat+187+Amsterdam", "_blank");
                    } else if (method.title === "Call Us") {
                      window.location.href = "tel:+31201234567";
                    } else if (method.title === "Email Us") {
                      window.location.href = "mailto:hello@yumeramen.nl";
                    } else if (method.title === "Order Online") {
                      window.location.href = "/menu";
                    }
                  }}
                >
                  {/* Corner Accent */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[var(--yume-vermillion)] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[var(--yume-vermillion)] opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Japanese Character */}
                  <span className="absolute top-2 right-2 text-2xl font-japanese text-[var(--yume-charcoal)]/5 group-hover:text-[var(--yume-vermillion)]/10 transition-colors">
                    {method.japanese}
                  </span>

                  <div className={`w-12 h-12 flex items-center justify-center mb-4 ${
                    method.color === "vermillion" ? "bg-[var(--yume-vermillion)]" :
                    method.color === "gold" ? "bg-[var(--yume-gold)]" :
                    "bg-[var(--yume-nori)]"
                  }`}>
                    <method.icon size={24} className="text-[var(--yume-warm-white)]" />
                  </div>

                  <h3 className="font-bold text-[var(--yume-charcoal)] font-header mb-1">
                    {method.title}
                  </h3>
                  <p className="text-sm font-medium text-[var(--yume-charcoal)] font-body mb-1">
                    {method.primary}
                  </p>
                  <p className="text-xs text-[var(--yume-miso)] font-body mb-4">
                    {method.secondary}
                  </p>

                  <div className="flex items-center gap-1 text-[var(--yume-vermillion)] text-sm font-medium font-body group-hover:gap-2 transition-all">
                    <span>{method.action}</span>
                    <method.actionIcon size={14} />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Interactive Map Section */}
      <section className="relative py-16 bg-[var(--yume-charcoal)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Map */}
            <div className="lg:col-span-2 relative">
              <div className="relative aspect-[16/10] bg-[var(--yume-ink)] overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2435.5!2d4.8825!3d52.3775!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTLCsDIyJzM5LjAiTiA0wrA1Myc1Ny4wIkU!5e0!3m2!1sen!2snl!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0"
                />
                
                {/* Map Overlay */}
                <div className="absolute bottom-4 left-4 bg-[var(--yume-charcoal)] p-4 max-w-xs">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-[var(--yume-vermillion)] flex items-center justify-center">
                      <span className="text-lg font-japanese text-[var(--yume-warm-white)]">夢</span>
                    </div>
                    <div>
                      <p className="text-[var(--yume-warm-white)] font-bold font-header text-sm">Yume Ramen</p>
                      <p className="text-[var(--yume-warm-white)]/60 text-xs font-body">Amsterdam Centrum</p>
                    </div>
                  </div>
                  <a 
                    href="https://maps.google.com/?q=Westerstraat+187+Amsterdam" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[var(--yume-gold)] text-sm font-body hover:underline"
                  >
                    <NavigationIcon size={14} />
                    Open in Google Maps
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </div>

            {/* Location Info Sidebar */}
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-[var(--yume-warm-white)] font-header mb-4">
                  Find Us
                </h3>
                <div className="space-y-4">
                  <div 
                    className="flex items-start gap-3 cursor-pointer group"
                    onClick={() => copyToClipboard("Westerstraat 187, 1015 MA Amsterdam", "address")}
                  >
                    <MapPin size={20} className="text-[var(--yume-vermillion)] flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <p className="text-[var(--yume-warm-white)] font-body">Westerstraat 187</p>
                      <p className="text-[var(--yume-warm-white)]/60 font-body text-sm">1015 MA Amsterdam</p>
                    </div>
                    {copiedText === "address" ? (
                      <Check size={16} className="text-green-500" />
                    ) : (
                      <Copy size={16} className="text-[var(--yume-warm-white)]/40 group-hover:text-[var(--yume-warm-white)]" />
                    )}
                  </div>
                </div>
              </div>

              {/* Getting Here */}
              <div>
                <h4 className="text-sm font-bold text-[var(--yume-gold)] uppercase tracking-wider font-body mb-3">
                  Getting Here
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-[var(--yume-warm-white)]/80 text-sm font-body">
                    <Train size={16} className="text-[var(--yume-vermillion)]" />
                    <span>Central Station - 12 min walk</span>
                  </div>
                  <div className="flex items-center gap-3 text-[var(--yume-warm-white)]/80 text-sm font-body">
                    <div className="w-4 h-4 bg-[var(--yume-vermillion)] flex items-center justify-center text-[10px] text-white font-bold">3</div>
                    <span>Tram 3 - Nieuwe Willemsstraat stop</span>
                  </div>
                  <div className="flex items-center gap-3 text-[var(--yume-warm-white)]/80 text-sm font-body">
                    <Bike size={16} className="text-[var(--yume-vermillion)]" />
                    <span>Bike racks available outside</span>
                  </div>
                  <div className="flex items-center gap-3 text-[var(--yume-warm-white)]/80 text-sm font-body">
                    <Car size={16} className="text-[var(--yume-vermillion)]" />
                    <span>Q-Park Centrum - 5 min walk</span>
                  </div>
                  <div className="flex items-center gap-3 text-[var(--yume-warm-white)]/80 text-sm font-body">
                    <Accessibility size={16} className="text-[var(--yume-vermillion)]" />
                    <span>Wheelchair accessible</span>
                  </div>
                </div>
              </div>

              {/* Neighborhood */}
              <div className="pt-4 border-t border-[var(--yume-warm-white)]/10">
                <h4 className="text-sm font-bold text-[var(--yume-gold)] uppercase tracking-wider font-body mb-3">
                  In the Neighborhood
                </h4>
                <p className="text-[var(--yume-warm-white)]/60 text-sm font-body">
                  Located in the heart of the Jordaan district, near the Anne Frank House and beautiful canal-side walks. Perfect for a pre-dinner stroll!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hours & Contact Form Section */}
      <section className="relative py-24 bg-[var(--yume-warm-white)]">
        <SeigaihaPattern className="absolute top-0 left-0 w-full h-full text-[var(--yume-charcoal)] opacity-[0.02]" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Hours Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-6">
                <Clock size={24} className="text-[var(--yume-vermillion)]" />
                <h2 className="text-3xl font-bold text-[var(--yume-charcoal)] font-header">
                  Opening Hours
                </h2>
              </div>

              <div className="bg-[var(--yume-cream)] p-6">
                <div className="space-y-3">
                  {businessHours.map((schedule, index) => (
                    <div 
                      key={schedule.day}
                      className={`flex items-center justify-between py-3 px-4 transition-colors ${
                        index === currentDay 
                          ? "bg-[var(--yume-vermillion)] text-[var(--yume-warm-white)]" 
                          : "bg-[var(--yume-warm-white)]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {index === currentDay && (
                          <div className="w-2 h-2 bg-[var(--yume-warm-white)] rounded-full animate-pulse" />
                        )}
                        <span className={`font-body font-medium ${index === currentDay ? "" : "text-[var(--yume-charcoal)]"}`}>
                          {schedule.day}
                        </span>
                        {index === currentDay && (
                          <span className="text-xs bg-[var(--yume-warm-white)]/20 px-2 py-0.5 rounded-full">
                            Today
                          </span>
                        )}
                      </div>
                      <span className={`font-body ${index === currentDay ? "" : "text-[var(--yume-miso)]"}`}>
                        {schedule.open} - {schedule.close}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Special Notice */}
                <div className="mt-6 p-4 bg-[var(--yume-gold)]/10 border-l-4 border-[var(--yume-gold)]">
                  <p className="text-sm text-[var(--yume-charcoal)] font-body">
                    <strong>Holiday Hours:</strong> We may have adjusted hours during Dutch national holidays. Check our Instagram for updates!
                  </p>
                </div>
              </div>

              {/* Languages */}
              <div className="mt-8 flex items-center gap-4">
                <Globe size={20} className="text-[var(--yume-miso)]" />
                <div>
                  <p className="text-sm text-[var(--yume-miso)] font-body">We speak:</p>
                  <p className="text-[var(--yume-charcoal)] font-body font-medium">Nederlands • English • 日本語</p>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <MessageCircle size={24} className="text-[var(--yume-vermillion)]" />
                <h2 className="text-3xl font-bold text-[var(--yume-charcoal)] font-header">
                  Send a Message
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Inquiry Type */}
                <div>
                  <label className="block text-sm font-medium text-[var(--yume-charcoal)] font-body mb-2">
                    What can we help you with?
                  </label>
                  <div className="relative" ref={inquiryDropdownRef}>
                    <button
                      type="button"
                      onClick={() => setIsInquiryDropdownOpen(!isInquiryDropdownOpen)}
                      className="w-full px-4 py-3 bg-[var(--yume-cream)] border-0 text-[var(--yume-charcoal)] font-body text-left flex items-center justify-between cursor-pointer hover:bg-[var(--yume-cream)]/80 transition-colors"
                    >
                      <span>{inquiryTypes.find(t => t.value === formData.inquiryType)?.label}</span>
                      <ChevronDown 
                        size={20} 
                        className={`text-[var(--yume-miso)] transition-transform ${isInquiryDropdownOpen ? 'rotate-180' : ''}`}
                      />
                    </button>
                    <AnimatePresence>
                      {isInquiryDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full left-0 right-0 mt-1 bg-[var(--yume-warm-white)] border border-[var(--yume-miso)]/20 shadow-lg z-20 max-h-60 overflow-y-auto"
                        >
                          {inquiryTypes.map((type) => (
                            <button
                              key={type.value}
                              type="button"
                              onClick={() => {
                                setFormData({ ...formData, inquiryType: type.value });
                                setIsInquiryDropdownOpen(false);
                              }}
                              className={`w-full px-4 py-3 text-left font-body transition-colors ${
                                formData.inquiryType === type.value
                                  ? 'bg-[var(--yume-vermillion)] text-[var(--yume-warm-white)]'
                                  : 'text-[var(--yume-charcoal)] hover:bg-[var(--yume-cream)]'
                              }`}
                            >
                              {type.label}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Name & Email Row */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--yume-charcoal)] font-body mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-[var(--yume-cream)] border-0 text-[var(--yume-charcoal)] font-body focus:ring-2 focus:ring-[var(--yume-vermillion)] outline-none placeholder:text-[var(--yume-miso)]"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--yume-charcoal)] font-body mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-[var(--yume-cream)] border-0 text-[var(--yume-charcoal)] font-body focus:ring-2 focus:ring-[var(--yume-vermillion)] outline-none placeholder:text-[var(--yume-miso)]"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                {/* Phone (Optional) */}
                <div>
                  <label className="block text-sm font-medium text-[var(--yume-charcoal)] font-body mb-2">
                    Phone Number <span className="text-[var(--yume-miso)]">(optional)</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-[var(--yume-cream)] border-0 text-[var(--yume-charcoal)] font-body focus:ring-2 focus:ring-[var(--yume-vermillion)] outline-none placeholder:text-[var(--yume-miso)]"
                    placeholder="+31 6 12345678"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-[var(--yume-charcoal)] font-body mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 bg-[var(--yume-cream)] border-0 text-[var(--yume-charcoal)] font-body focus:ring-2 focus:ring-[var(--yume-vermillion)] outline-none placeholder:text-[var(--yume-miso)]"
                    placeholder="How can we help?"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-[var(--yume-charcoal)] font-body mb-2">
                    Your Message *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 bg-[var(--yume-cream)] border-0 text-[var(--yume-charcoal)] font-body focus:ring-2 focus:ring-[var(--yume-vermillion)] outline-none resize-none placeholder:text-[var(--yume-miso)]"
                    placeholder="Tell us more..."
                  />
                  <p className="text-xs text-[var(--yume-miso)] mt-1 font-body">
                    {formData.message.length}/1000 characters
                  </p>
                </div>

                {/* Preferred Contact Method */}
                <div>
                  <label className="block text-sm font-medium text-[var(--yume-charcoal)] font-body mb-3">
                    Preferred Contact Method
                  </label>
                  <div className="flex gap-4">
                    {["email", "phone", "whatsapp"].map((method) => (
                      <label key={method} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="preferredContact"
                          value={method}
                          checked={formData.preferredContact === method}
                          onChange={(e) => setFormData({ ...formData, preferredContact: e.target.value })}
                          className="w-4 h-4 text-[var(--yume-vermillion)] focus:ring-[var(--yume-vermillion)]"
                        />
                        <span className="text-sm text-[var(--yume-charcoal)] font-body capitalize">{method}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={formStatus === "sending" || formStatus === "success"}
                  className={`w-full py-4 font-bold font-body flex items-center justify-center gap-2 transition-all ${
                    formStatus === "success"
                      ? "bg-green-600 text-white"
                      : formStatus === "sending"
                      ? "bg-[var(--yume-miso)] text-white cursor-wait"
                      : formStatus === "error"
                      ? "bg-[var(--yume-vermillion)] text-white hover:bg-[var(--yume-charcoal)]"
                      : "bg-[var(--yume-vermillion)] text-white hover:bg-[var(--yume-charcoal)]"
                  }`}
                >
                  {formStatus === "success" ? (
                    <>
                      <Check size={20} />
                      Message Sent!
                    </>
                  ) : formStatus === "sending" ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Send size={20} />
                      </motion.div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      {formStatus === "error" ? "Try Again" : "Send Message"}
                    </>
                  )}
                </button>

                {/* Error Notification */}
                <AnimatePresence>
                  {formStatus === "error" && errorMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-4 bg-red-50 border border-red-200 rounded-lg"
                    >
                      <div className="flex items-start gap-3">
                        <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                        <div className="flex-1">
                          <p className="text-red-700 font-body text-sm font-medium">
                            {errorMessage}
                          </p>
                          {showFallbackContact && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              <a
                                href="mailto:hello@yumeramen.nl"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-red-200 rounded text-sm text-red-700 hover:bg-red-50 transition-colors"
                              >
                                <Mail size={14} />
                                Email Us
                              </a>
                              <a
                                href="tel:+31201234567"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-red-200 rounded text-sm text-red-700 hover:bg-red-50 transition-colors"
                              >
                                <Phone size={14} />
                                Call Us
                              </a>
                              <button
                                type="button"
                                onClick={() => {
                                  setFormStatus("idle");
                                  setErrorMessage("");
                                  setShowFallbackContact(false);
                                }}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-100 border border-red-200 rounded text-sm text-red-700 hover:bg-red-200 transition-colors"
                              >
                                Dismiss
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Privacy Note */}
                <p className="text-xs text-[var(--yume-miso)] font-body text-center">
                  By submitting this form, you agree to our{" "}
                  <Link href="/privacy" className="underline hover:text-[var(--yume-vermillion)]">Privacy Policy</Link>.
                  We typically respond within 24 hours.
                </p>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative py-24 bg-[var(--yume-cream)]">
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-[var(--yume-vermillion)] font-japanese text-2xl mb-4 block">質問</span>
            <h2 className="text-4xl font-bold text-[var(--yume-charcoal)] font-header mb-4">
              Frequently Asked <span className="text-[var(--yume-vermillion)]">Questions</span>
            </h2>
            <p className="text-[var(--yume-miso)] font-body">
              Quick answers before you reach out
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full bg-[var(--yume-warm-white)] p-5 flex items-center justify-between text-left hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[var(--yume-vermillion)]/10 flex items-center justify-center flex-shrink-0">
                      <item.icon size={20} className="text-[var(--yume-vermillion)]" />
                    </div>
                    <span className="font-medium text-[var(--yume-charcoal)] font-body">
                      {item.question}
                    </span>
                  </div>
                  <ChevronDown 
                    size={20} 
                    className={`text-[var(--yume-miso)] transition-transform ${openFaq === index ? "rotate-180" : ""}`} 
                  />
                </button>
                
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-[var(--yume-warm-white)] px-5 pb-5 pt-0 ml-14">
                        <p className="text-[var(--yume-miso)] font-body">
                          {item.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-8"
          >
            <p className="text-[var(--yume-miso)] font-body">
              Still have questions?{" "}
              <a href="#contact-form" className="text-[var(--yume-vermillion)] font-medium hover:underline">
                Send us a message
              </a>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Social & Follow Section */}
      <section className="relative py-16 bg-[var(--yume-charcoal)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Social Media */}
            <div>
              <h3 className="text-2xl font-bold text-[var(--yume-warm-white)] font-header mb-4">
                Follow Our Journey
              </h3>
              <p className="text-[var(--yume-warm-white)]/70 font-body mb-6">
                Join our ramen-loving community. Share your bowls, get updates, and be the first to know about new menu items!
              </p>
              
              <div className="flex gap-4">
                <a 
                  href="https://instagram.com/yumeramen" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-body hover:opacity-90 transition-opacity"
                >
                  <Instagram size={20} />
                  @yumeramen
                </a>
                <a 
                  href="https://facebook.com/yumeramen" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-6 py-3 bg-blue-600 text-white font-body hover:opacity-90 transition-opacity"
                >
                  <Facebook size={20} />
                  Yume Ramen
                </a>
              </div>

              <p className="text-[var(--yume-warm-white)]/50 text-sm font-body mt-4">
                Tag us with <span className="text-[var(--yume-gold)]">#YumeRamen</span> for a chance to be featured!
              </p>
            </div>

            {/* Order Issue Support */}
            <div className="bg-[var(--yume-ink)] p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[var(--yume-vermillion)] flex items-center justify-center">
                  <AlertCircle size={20} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-[var(--yume-warm-white)] font-header">
                  Problem with Your Order?
                </h3>
              </div>
              <p className="text-[var(--yume-warm-white)]/70 font-body mb-4">
                We want to make it right! For urgent delivery issues, reach us directly:
              </p>
              <div className="space-y-2">
                <a 
                  href="tel:+31201234567"
                  className="flex items-center gap-2 text-[var(--yume-gold)] font-body hover:underline"
                >
                  <Phone size={16} />
                  +31 20 123 4567 (Hotline)
                </a>
                <a 
                  href="mailto:support@yumeramen.nl"
                  className="flex items-center gap-2 text-[var(--yume-gold)] font-body hover:underline"
                >
                  <Mail size={16} />
                  support@yumeramen.nl
                </a>
              </div>
              <p className="text-[var(--yume-warm-white)]/50 text-sm font-body mt-4">
                Include your order number for fastest resolution
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-24 bg-[var(--yume-vermillion)] overflow-hidden">
        <CirclePattern className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] text-[var(--yume-warm-white)] opacity-10" />
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.05 }}
          viewport={{ once: true }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <span className="text-[20rem] font-japanese text-[var(--yume-warm-white)] leading-none">
            繋
          </span>
        </motion.div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--yume-warm-white)] font-header mb-6">
              We Can&apos;t Wait to <span className="text-[var(--yume-gold)]">Hear From You</span>
            </h2>
            <p className="text-xl text-[var(--yume-warm-white)]/80 font-body mb-10 max-w-2xl mx-auto">
              Every conversation starts with hello. Every friendship starts with ramen. 
              Reach out — we&apos;re always happy to connect.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/menu"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[var(--yume-charcoal)] text-[var(--yume-warm-white)] font-bold font-body hover:bg-[var(--yume-warm-white)] hover:text-[var(--yume-charcoal)] transition-colors"
              >
                <ShoppingBag size={18} />
                Order Online
              </Link>
              <a
                href="tel:+31201234567"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-[var(--yume-warm-white)] text-[var(--yume-warm-white)] font-bold font-body hover:bg-[var(--yume-warm-white)] hover:text-[var(--yume-vermillion)] transition-colors"
              >
                <Phone size={18} />
                Call Us Now
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
