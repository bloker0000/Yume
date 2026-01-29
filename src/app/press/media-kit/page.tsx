"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CartSidebar from "@/components/menu/CartSidebar";
import { useCart } from "@/context/CartContext";
import { 
  Download, Copy, Check, X, ChevronDown, ZoomIn, ExternalLink, Mail, Phone, Clock,
  FileText, Palette, Image as ImageIcon, BookOpen, UtensilsCrossed, Newspaper,
  MessageSquare, Package, Trash2, ChevronLeft, ChevronRight, Info, Sparkles, Quote, Calendar
} from "lucide-react";
import { SeigaihaPattern } from "@/components/JapanesePatterns";

const logoAssets = [
  { id: "logo-primary", name: "Primary Logo", filename: "yume-logo-primary", formats: ["svg", "png"], preview: "/logoDark.svg" },
  { id: "logo-white", name: "White Version", filename: "yume-logo-white", formats: ["svg", "png"], preview: "/logoLight.svg" },
  { id: "logo-dark", name: "Dark Version", filename: "yume-logo-dark", formats: ["svg", "png"], preview: "/logoDark.svg" },
  { id: "logo-icon", name: "Icon Only", filename: "yume-icon", formats: ["svg", "png"], preview: "/logo.svg" },
];

const brandColors = [
  { name: "Vermillion", japanese: "朱色", hex: "#D64933", rgb: "214, 73, 51", cmyk: "0, 66, 76, 16", pantone: "1795 C", usage: "Primary brand color, CTAs, accents" },
  { name: "Gold", japanese: "金色", hex: "#C9A962", rgb: "201, 169, 98", cmyk: "0, 16, 51, 21", pantone: "465 C", usage: "Secondary accent, highlights" },
  { name: "Charcoal", japanese: "墨色", hex: "#1A1A1A", rgb: "26, 26, 26", cmyk: "0, 0, 0, 90", pantone: "Black 6 C", usage: "Primary text, dark backgrounds" },
  { name: "Ink", japanese: "濃墨", hex: "#2D2D2D", rgb: "45, 45, 45", cmyk: "0, 0, 0, 82", pantone: "Black 4 C", usage: "Secondary dark, cards" },
  { name: "Cream", japanese: "生成り", hex: "#F5E6D3", rgb: "245, 230, 211", cmyk: "0, 6, 14, 4", pantone: "7527 C", usage: "Warm backgrounds" },
  { name: "Warm White", japanese: "白練", hex: "#FAF7F2", rgb: "250, 247, 242", cmyk: "0, 1, 3, 2", pantone: "7499 C", usage: "Main background" },
  { name: "Miso", japanese: "味噌色", hex: "#8B7355", rgb: "139, 115, 85", cmyk: "0, 17, 39, 45", pantone: "7531 C", usage: "Muted text, captions" },
  { name: "Nori", japanese: "海苔色", hex: "#2F4538", rgb: "47, 69, 56", cmyk: "32, 0, 19, 73", pantone: "560 C", usage: "Accent green" },
];

const photographs = [
  { id: "tonkotsu-hero", name: "Tonkotsu Hero Shot", category: "food", file: "/items/Tonkotsu.jpg", size: "4.2 MB", dimensions: "4000x2667" },
  { id: "tonkotsu-detail", name: "Tonkotsu Detail", category: "food", file: "/items/Tonkotsu2.jpg", size: "3.8 MB", dimensions: "4000x2667" },
  { id: "miso-hero", name: "Spicy Miso Hero", category: "food", file: "/items/spicyMiso.jpg", size: "4.0 MB", dimensions: "4000x2667" },
  { id: "shoyu-hero", name: "Shoyu Hero", category: "food", file: "/items/shoyu.jpg", size: "3.9 MB", dimensions: "4000x2667" },
  { id: "tantanmen-hero", name: "Tantanmen Hero", category: "food", file: "/items/tantanmen.jpg", size: "4.1 MB", dimensions: "4000x2667" },
  { id: "gyoza-platter", name: "Gyoza Platter", category: "food", file: "/items/gyoza.jpg", size: "3.2 MB", dimensions: "4000x2667" },
  { id: "karaage", name: "Chicken Karaage", category: "food", file: "/items/karaage.jpg", size: "3.0 MB", dimensions: "4000x2667" },
  { id: "edamame", name: "Edamame", category: "food", file: "/items/edamame.jpg", size: "2.8 MB", dimensions: "4000x2667" },
  { id: "takoyaki", name: "Takoyaki", category: "food", file: "/items/takoyaki.jpg", size: "3.1 MB", dimensions: "4000x2667" },
  { id: "mochi", name: "Mochi Ice Cream", category: "food", file: "/items/mochiIceCream.jpg", size: "2.5 MB", dimensions: "4000x2667" },
  { id: "matcha", name: "Matcha Cheesecake", category: "food", file: "/items/matchaCheescake.jpg", size: "2.9 MB", dimensions: "4000x2667" },
  { id: "green-tea", name: "Green Tea", category: "food", file: "/items/GreenTea.jpg", size: "2.2 MB", dimensions: "4000x2667" },
  { id: "chef-takeshi", name: "Chef Takeshi", category: "team", file: "/ourStory/TakeshiYamamoto.jpg", size: "3.8 MB", dimensions: "3000x4000" },
  { id: "chef-eiko", name: "Chef Eiko", category: "team", file: "/ourStory/eikoMizuki.jpg", size: "3.6 MB", dimensions: "3000x4000" },
  { id: "chef-kenji", name: "Chef Kenji", category: "team", file: "/ourStory/KenjiNakamura.jpg", size: "3.5 MB", dimensions: "3000x4000" },
  { id: "broth-making", name: "Broth Making", category: "interior", file: "/ourStory/broth.jpg", size: "4.5 MB", dimensions: "5000x3333" },
  { id: "training", name: "Training", category: "interior", file: "/ourStory/theTraining.jpg", size: "4.0 MB", dimensions: "5000x3333" },
];

const factSheetData = {
  companyOverview: {
    short: "Yume Ramen brings authentic Japanese ramen to Rotterdam, crafted with 48-hour simmered broths and traditional techniques learned in Tokyo.",
    medium: "Yume Ramen brings authentic Japanese ramen to Rotterdam, combining centuries-old techniques with locally-sourced Dutch ingredients. Founded in 2022, our team trained under master ramen chefs in Tokyo. Every bowl features our signature 48-hour simmered tonkotsu broth, hand-pulled noodles, and carefully curated toppings.",
    long: "Yume Ramen brings authentic Japanese ramen to Rotterdam, combining centuries-old techniques with locally-sourced Dutch ingredients. Founded in 2022 by a team passionate about Japanese culinary traditions, our journey began with a life-changing bowl of ramen in a tiny Tokyo alley.\n\nToday, every bowl we serve carries the spirit of that journey. Our signature 48-hour simmered tonkotsu broth, hand-pulled noodles made fresh daily, and carefully curated toppings honor the craft while embracing the best local Dutch ingredients.\n\nWith a growing delivery radius serving greater Rotterdam, Yume Ramen has been recognized with the Best Ramen 2025 award from Rotterdam Food Awards."
  },
  keyFacts: [
    { label: "Founded", value: "2022" },
    { label: "Location", value: "Rotterdam, NL" },
    { label: "Delivery Range", value: "15km radius" },
    { label: "Broth Time", value: "48 hours" },
    { label: "Daily Noodles", value: "500+ portions" },
    { label: "Rating", value: "4.9 stars" },
    { label: "Bowls Served", value: "10,000+" },
  ],
  founderQuotes: [
    { quote: "Ramen is not just food, it is emotion in a bowl. We pour our heart into every serving.", attribution: "Takeshi Yamamoto, Head Chef" },
    { quote: "The 48-hour broth is not just tradition, it is the soul of authentic tonkotsu.", attribution: "Yume Ramen Philosophy" },
  ]
};

const menuHighlights = [
  { name: "Tonkotsu Classic", japanese: "豚骨ラーメン", description: "Our signature 48-hour pork bone broth, rich and creamy with tender chashu, soft-boiled egg, and fresh negi.", image: "/items/Tonkotsu.jpg" },
  { name: "Spicy Miso Ramen", japanese: "辛味噌ラーメン", description: "Bold red miso meets fiery chili oil, balanced with sweet corn and butter for a warming bowl.", image: "/items/spicyMiso.jpg" },
  { name: "Shoyu Ramen", japanese: "醤油ラーメン", description: "Light yet deeply flavored soy-based broth, clear and aromatic, showcasing pure Japanese tradition.", image: "/items/shoyu.jpg" },
  { name: "Tantanmen", japanese: "担々麺", description: "Sichuan-inspired sesame and chili broth, creamy and spicy with seasoned minced pork.", image: "/items/tantanmen.jpg" },
];

const pressReleases = [
  { date: "January 2026", title: "Yume Ramen Expands Delivery Zone to Greater Rotterdam", description: "Now serving authentic Japanese ramen to more neighborhoods across the region.", fullText: "Rotterdam, January 2026 - Yume Ramen, Rotterdam's award-winning Japanese ramen restaurant, today announced the expansion of its delivery service to cover the greater Rotterdam area." },
  { date: "November 2025", title: "Yume Ramen Wins Best Ramen 2025", description: "Voted the best ramen in Rotterdam by local food critics and customers alike.", fullText: "Rotterdam, November 2025 - Yume Ramen has been honored with the prestigious Best Ramen 2025 award at the Rotterdam Food Awards ceremony." },
  { date: "August 2025", title: "New Seasonal Menu Launch", description: "Introducing limited-time summer specials featuring fresh local ingredients.", fullText: "Rotterdam, August 2025 - Yume Ramen is excited to announce the launch of its summer seasonal menu, featuring lighter broths and fresh local ingredients." },
];

const guidelineSections = [
  { id: "logo", title: "Logo Usage", icon: Sparkles },
  { id: "colors", title: "Color System", icon: Palette },
  { id: "typography", title: "Typography", icon: FileText },
  { id: "photography", title: "Photography", icon: ImageIcon },
  { id: "voice", title: "Voice & Tone", icon: MessageSquare },
  { id: "donts", title: "What Not To Do", icon: X },
];

type SelectedAsset = { id: string; name: string; type: "logo" | "photo"; file?: string };

export default function MediaKitPage() {
  const { isCartOpen, setIsCartOpen } = useCart();
  const [selectedAssets, setSelectedAssets] = useState<SelectedAsset[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeLogoBackground, setActiveLogoBackground] = useState<"light" | "dark" | "pattern">("light");
  const [photoFilter, setPhotoFilter] = useState<"all" | "food" | "interior" | "team">("all");
  const [lightboxPhoto, setLightboxPhoto] = useState<typeof photographs[0] | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [activeGuidelineSection, setActiveGuidelineSection] = useState("logo");
  const [expandedRelease, setExpandedRelease] = useState<number | null>(null);
  const [factSheetLength, setFactSheetLength] = useState<"short" | "medium" | "long">("medium");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const filteredPhotos = photographs.filter(photo => photoFilter === "all" || photo.category === photoFilter);

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleAssetSelection = (asset: SelectedAsset) => {
    setSelectedAssets(prev => {
      const exists = prev.find(a => a.id === asset.id);
      if (exists) return prev.filter(a => a.id !== asset.id);
      return [...prev, asset];
    });
  };

  const isAssetSelected = (id: string) => selectedAssets.some(a => a.id === id);
  const clearSelection = () => setSelectedAssets([]);

  const downloadAsset = (url: string, filename: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openLightbox = (photo: typeof photographs[0]) => {
    const index = filteredPhotos.findIndex(p => p.id === photo.id);
    setLightboxIndex(index);
    setLightboxPhoto(photo);
  };

  const navigateLightbox = (direction: "prev" | "next") => {
    const newIndex = direction === "prev" 
      ? (lightboxIndex - 1 + filteredPhotos.length) % filteredPhotos.length
      : (lightboxIndex + 1) % filteredPhotos.length;
    setLightboxIndex(newIndex);
    setLightboxPhoto(filteredPhotos[newIndex]);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxPhoto) {
        if (e.key === "Escape") setLightboxPhoto(null);
        if (e.key === "ArrowLeft") navigateLightbox("prev");
        if (e.key === "ArrowRight") navigateLightbox("next");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxPhoto, lightboxIndex, filteredPhotos]);

  const sectionRefs = {
    logos: useRef<HTMLElement>(null),
    colors: useRef<HTMLElement>(null),
    photos: useRef<HTMLElement>(null),
    guidelines: useRef<HTMLElement>(null),
    factsheet: useRef<HTMLElement>(null),
    menu: useRef<HTMLElement>(null),
    releases: useRef<HTMLElement>(null),
    contact: useRef<HTMLElement>(null),
  };

  const scrollToSection = (sectionId: keyof typeof sectionRefs) => {
    sectionRefs[sectionId].current?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMobileMenuOpen(false);
  };

  return (
    <main className="min-h-screen bg-[var(--yume-warm-white)]">
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <Navigation variant="light" />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 bg-gradient-to-b from-[var(--yume-charcoal)] via-[var(--yume-ink)] to-[var(--yume-charcoal)] overflow-hidden">
        <SeigaihaPattern className="absolute inset-0 w-full h-full text-[var(--yume-warm-white)] opacity-[0.03]" />
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.08 }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20rem] md:text-[30rem] font-japanese text-[var(--yume-warm-white)] leading-none select-none pointer-events-none">夢</motion.div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center">
            <div className="flex items-center justify-center gap-3 md:gap-4 mb-4 md:mb-6">
              <div className="w-8 md:w-12 h-[1px] bg-[var(--yume-gold)]" />
              <span className="text-[var(--yume-gold)] font-japanese text-xl md:text-2xl">メディアリソース</span>
              <div className="w-8 md:w-12 h-[1px] bg-[var(--yume-gold)]" />
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-[var(--yume-warm-white)] mb-4 md:mb-6 font-header">
              Media Resource<br /><span className="text-[var(--yume-vermillion)]">Center</span>
            </h1>
            
            <p className="text-base md:text-lg text-[var(--yume-warm-white)]/80 max-w-2xl mx-auto mb-8 md:mb-12 font-body px-4">
              Everything you need to tell the Yume Ramen story. Download logos, photos, brand guidelines, and more.
            </p>

            {/* Quick Navigation Pills - Desktop */}
            <div className="hidden md:flex flex-wrap justify-center gap-3 mb-8">
              {[
                { id: "logos", label: "Logos", icon: Sparkles },
                { id: "colors", label: "Colors", icon: Palette },
                { id: "photos", label: "Photos", icon: ImageIcon },
                { id: "guidelines", label: "Guidelines", icon: BookOpen },
                { id: "factsheet", label: "Fact Sheet", icon: FileText },
                { id: "menu", label: "Menu", icon: UtensilsCrossed },
                { id: "releases", label: "Press Releases", icon: Newspaper },
                { id: "contact", label: "Contact", icon: MessageSquare },
              ].map((item) => (
                <motion.button key={item.id} onClick={() => scrollToSection(item.id as keyof typeof sectionRefs)}
                  className="flex items-center gap-2 px-4 py-2 bg-[var(--yume-warm-white)]/10 hover:bg-[var(--yume-warm-white)]/20 text-[var(--yume-warm-white)] text-sm font-medium rounded-full transition-all border border-[var(--yume-warm-white)]/20 hover:border-[var(--yume-gold)]/50"
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <item.icon size={16} />{item.label}
                </motion.button>
              ))}
            </div>

            {/* Mobile Navigation Dropdown */}
            <div className="md:hidden mb-8">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="flex items-center justify-center gap-2 w-full max-w-xs mx-auto px-6 py-3 bg-[var(--yume-warm-white)]/10 text-[var(--yume-warm-white)] font-medium rounded-lg border border-[var(--yume-warm-white)]/20">
                <span>Jump to Section</span>
                <ChevronDown size={20} className={`transition-transform ${mobileMenuOpen ? "rotate-180" : ""}`} />
              </button>
              
              <AnimatePresence>
                {mobileMenuOpen && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                    className="mt-2 mx-auto max-w-xs bg-[var(--yume-ink)] rounded-lg border border-[var(--yume-warm-white)]/10 overflow-hidden">
                    {[
                      { id: "logos", label: "Logos", icon: Sparkles },
                      { id: "colors", label: "Colors", icon: Palette },
                      { id: "photos", label: "Photos", icon: ImageIcon },
                      { id: "guidelines", label: "Guidelines", icon: BookOpen },
                      { id: "factsheet", label: "Fact Sheet", icon: FileText },
                      { id: "menu", label: "Menu", icon: UtensilsCrossed },
                      { id: "releases", label: "Press Releases", icon: Newspaper },
                      { id: "contact", label: "Contact", icon: MessageSquare },
                    ].map((item, index) => (
                      <button key={item.id} onClick={() => scrollToSection(item.id as keyof typeof sectionRefs)}
                        className={`flex items-center gap-3 w-full px-4 py-3 text-left text-[var(--yume-warm-white)] hover:bg-[var(--yume-warm-white)]/10 transition-colors ${index !== 0 ? "border-t border-[var(--yume-warm-white)]/10" : ""}`}>
                        <item.icon size={18} className="text-[var(--yume-gold)]" />{item.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Download All CTA */}
            <motion.a href="/api/press-kit/download-all"
              className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-[var(--yume-vermillion)] text-[var(--yume-warm-white)] font-medium hover:bg-[var(--yume-gold)] hover:text-[var(--yume-charcoal)] transition-all text-sm md:text-base"
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Package size={20} />Download Complete Press Kit<span className="text-xs opacity-70">(~45MB)</span>
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Logo Library Section */}
      <section ref={sectionRefs.logos} className="py-16 md:py-24 bg-[var(--yume-cream)] scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10 md:mb-16">
            <div className="flex items-center justify-center gap-2 text-[var(--yume-vermillion)] mb-3">
              <Sparkles size={20} /><span className="text-sm font-medium uppercase tracking-wider">Brand Identity</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-[var(--yume-charcoal)] mb-3 md:mb-4 font-header">Logo Library</h2>
            <p className="text-[var(--yume-miso)] max-w-xl mx-auto font-body text-sm md:text-base">
              Download our logo in various formats. All logos include proper clear space and are optimized for different use cases.
            </p>
          </motion.div>

          {/* Background Toggle */}
          <div className="flex justify-center mb-8 md:mb-12">
            <div className="inline-flex items-center gap-1 p-1 bg-[var(--yume-warm-white)] rounded-lg shadow-sm">
              <span className="text-sm text-[var(--yume-miso)] px-3 hidden sm:inline">Preview on:</span>
              {(["light", "dark", "pattern"] as const).map((bg) => (
                <button key={bg} onClick={() => setActiveLogoBackground(bg)}
                  className={`px-3 md:px-4 py-2 text-sm font-medium rounded-md transition-all capitalize ${activeLogoBackground === bg ? "bg-[var(--yume-charcoal)] text-[var(--yume-warm-white)]" : "text-[var(--yume-miso)] hover:bg-[var(--yume-cream)]"}`}>
                  {bg}
                </button>
              ))}
            </div>
          </div>

          {/* Logo Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {logoAssets.map((logo, index) => (
              <motion.div key={logo.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}
                className="group relative bg-[var(--yume-warm-white)] rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all">
                <button onClick={() => toggleAssetSelection({ id: logo.id, name: logo.name, type: "logo", file: logo.preview })}
                  className={`absolute top-3 right-3 z-10 w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${isAssetSelected(logo.id) ? "bg-[var(--yume-vermillion)] border-[var(--yume-vermillion)] text-white" : "bg-white/80 border-[var(--yume-miso)]/30 hover:border-[var(--yume-vermillion)]"}`}>
                  {isAssetSelected(logo.id) && <Check size={14} />}
                </button>
                <div className={`relative h-32 md:h-40 flex items-center justify-center p-6 transition-colors ${activeLogoBackground === "light" ? "bg-[var(--yume-warm-white)]" : activeLogoBackground === "dark" ? "bg-[var(--yume-charcoal)]" : "bg-[var(--yume-cream)]"}`}
                  style={activeLogoBackground === "pattern" ? { backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C9A962' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" } : {}}>
                  <Image src={activeLogoBackground === "dark" ? "/logoLight.svg" : logo.preview} alt={logo.name} width={160} height={64} className="max-h-16 w-auto object-contain" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-[var(--yume-charcoal)] mb-3 font-header">{logo.name}</h3>
                  <div className="flex flex-wrap gap-2">
                    {logo.formats.map((format) => (
                      <button key={format} onClick={() => downloadAsset(logo.preview, `${logo.filename}.${format}`)}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-[var(--yume-cream)] hover:bg-[var(--yume-charcoal)] hover:text-[var(--yume-warm-white)] text-[var(--yume-charcoal)] rounded transition-colors uppercase">
                        <Download size={12} />{format}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Logo Usage Tips */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="mt-10 md:mt-12 p-4 md:p-6 bg-[var(--yume-warm-white)] rounded-lg border border-[var(--yume-gold)]/20">
            <div className="flex items-start gap-3">
              <Info size={20} className="text-[var(--yume-gold)] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-[var(--yume-charcoal)] mb-2">Quick Usage Guidelines</h4>
                <ul className="text-sm text-[var(--yume-miso)] space-y-1 font-body">
                  <li>• Maintain clear space equal to the height of the Y around the logo</li>
                  <li>• Use the white version on dark backgrounds, dark version on light</li>
                  <li>• Minimum size: 80px width for digital, 25mm for print</li>
                  <li>• Never stretch, rotate, or add effects to the logo</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Brand Colors Section */}
      <section ref={sectionRefs.colors} className="py-16 md:py-24 bg-[var(--yume-warm-white)] scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10 md:mb-16">
            <div className="flex items-center justify-center gap-2 text-[var(--yume-vermillion)] mb-3">
              <Palette size={20} /><span className="text-sm font-medium uppercase tracking-wider">Color System</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-[var(--yume-charcoal)] mb-3 md:mb-4 font-header">Brand Colors</h2>
            <p className="text-[var(--yume-miso)] max-w-xl mx-auto font-body text-sm md:text-base">
              Our color palette draws inspiration from traditional Japanese aesthetics. Click any value to copy.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {brandColors.map((color, index) => (
              <motion.div key={color.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }}
                className="bg-[var(--yume-cream)] rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all">
                <div className="h-28 md:h-32 relative group cursor-pointer" style={{ backgroundColor: color.hex }}
                  onClick={() => copyToClipboard(color.hex, `${color.name}-hex`)}>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                    <span className="text-white text-sm font-medium flex items-center gap-2">
                      {copiedId === `${color.name}-hex` ? <Check size={16} /> : <Copy size={16} />}
                      {copiedId === `${color.name}-hex` ? "Copied!" : "Click to copy HEX"}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-[var(--yume-charcoal)] font-header">{color.name}</h3>
                    <span className="text-[var(--yume-gold)] font-japanese text-sm">{color.japanese}</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    {[{ label: "HEX", value: color.hex, id: `${color.name}-hex` },
                      { label: "RGB", value: color.rgb, id: `${color.name}-rgb` },
                      { label: "CMYK", value: color.cmyk, id: `${color.name}-cmyk` },
                      { label: "Pantone", value: color.pantone, id: `${color.name}-pantone` },
                    ].map((item) => (
                      <button key={item.id} onClick={() => copyToClipboard(item.value, item.id)}
                        className="flex items-center justify-between w-full px-2 py-1.5 rounded bg-[var(--yume-warm-white)] hover:bg-[var(--yume-charcoal)] hover:text-[var(--yume-warm-white)] transition-colors group">
                        <span className="text-[var(--yume-miso)] group-hover:text-[var(--yume-warm-white)]/70">{item.label}</span>
                        <span className="font-mono flex items-center gap-1">
                          {item.value}
                          {copiedId === item.id ? <Check size={12} className="text-green-500" /> : <Copy size={12} className="opacity-0 group-hover:opacity-100" />}
                        </span>
                      </button>
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-[var(--yume-miso)] italic">{color.usage}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="mt-10 md:mt-12 flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4">
            <span className="text-sm text-[var(--yume-miso)]">Export palette as:</span>
            <div className="flex flex-wrap justify-center gap-2">
              {["CSS Variables", "JSON"].map((format) => (
                <button key={format}
                  onClick={() => copyToClipboard(format === "CSS Variables" ? brandColors.map(c => `--yume-${c.name.toLowerCase().replace(' ', '-')}: ${c.hex};`).join("\n") : JSON.stringify(brandColors.reduce((acc, c) => ({ ...acc, [c.name.toLowerCase().replace(' ', '-')]: c.hex }), {}), null, 2), `export-${format}`)}
                  className="px-4 py-2 text-sm bg-[var(--yume-cream)] hover:bg-[var(--yume-charcoal)] hover:text-[var(--yume-warm-white)] text-[var(--yume-charcoal)] rounded-full transition-colors flex items-center gap-2">
                  <Download size={14} />{format}{copiedId === `export-${format}` && <Check size={14} className="text-green-500" />}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Photography Gallery Section */}
      <section ref={sectionRefs.photos} className="py-16 md:py-24 bg-[var(--yume-cream)] scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10 md:mb-16">
            <div className="flex items-center justify-center gap-2 text-[var(--yume-vermillion)] mb-3">
              <ImageIcon size={20} /><span className="text-sm font-medium uppercase tracking-wider">Photography</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-[var(--yume-charcoal)] mb-3 md:mb-4 font-header">Photo Gallery</h2>
            <p className="text-[var(--yume-miso)] max-w-xl mx-auto font-body text-sm md:text-base">
              High-resolution images of our dishes, team, and restaurant. All photos are free to use with attribution.
            </p>
          </motion.div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
            <div className="flex flex-wrap justify-center gap-2">
              {(["all", "food", "interior", "team"] as const).map((filter) => (
                <button key={filter} onClick={() => setPhotoFilter(filter)}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-all capitalize ${photoFilter === filter ? "bg-[var(--yume-charcoal)] text-[var(--yume-warm-white)]" : "bg-[var(--yume-warm-white)] text-[var(--yume-miso)] hover:bg-[var(--yume-charcoal)] hover:text-[var(--yume-warm-white)]"}`}>
                  {filter === "all" ? "All Photos" : filter}
                  <span className="ml-1 opacity-60">({filter === "all" ? photographs.length : photographs.filter(p => p.category === filter).length})</span>
                </button>
              ))}
            </div>
            <button onClick={() => { filteredPhotos.forEach(photo => { if (!isAssetSelected(photo.id)) toggleAssetSelection({ id: photo.id, name: photo.name, type: "photo", file: photo.file }); }); }}
              className="text-sm text-[var(--yume-vermillion)] hover:text-[var(--yume-charcoal)] flex items-center gap-1">
              <Check size={16} />Select All Visible
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {filteredPhotos.map((photo, index) => (
              <motion.div key={photo.id} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: index * 0.03 }}
                className="group relative aspect-square bg-[var(--yume-warm-white)] rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer"
                onClick={() => openLightbox(photo)}>
                <button onClick={(e) => { e.stopPropagation(); toggleAssetSelection({ id: photo.id, name: photo.name, type: "photo", file: photo.file }); }}
                  className={`absolute top-2 left-2 z-10 w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${isAssetSelected(photo.id) ? "bg-[var(--yume-vermillion)] border-[var(--yume-vermillion)] text-white" : "bg-white/80 border-white/50 opacity-0 group-hover:opacity-100"}`}>
                  {isAssetSelected(photo.id) && <Check size={14} />}
                </button>
                <Image src={photo.file} alt={photo.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3 md:p-4">
                  <p className="text-white text-sm font-medium truncate">{photo.name}</p>
                  <p className="text-white/70 text-xs">{photo.size} • {photo.dimensions}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-white/80 text-xs flex items-center gap-1"><ZoomIn size={12} />Click to preview</span>
                  </div>
                </div>
                <span className="absolute top-2 right-2 px-2 py-1 text-xs font-medium bg-black/50 text-white rounded capitalize">{photo.category}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxPhoto && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4" onClick={() => setLightboxPhoto(null)}>
            <button onClick={() => setLightboxPhoto(null)} className="absolute top-4 right-4 p-2 text-white/80 hover:text-white z-10"><X size={28} /></button>
            <button onClick={(e) => { e.stopPropagation(); navigateLightbox("prev"); }}
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-2 md:p-3 bg-white/10 hover:bg-white/20 rounded-full text-white z-10"><ChevronLeft size={24} /></button>
            <button onClick={(e) => { e.stopPropagation(); navigateLightbox("next"); }}
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-2 md:p-3 bg-white/10 hover:bg-white/20 rounded-full text-white z-10"><ChevronRight size={24} /></button>
            <motion.div key={lightboxPhoto.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-5xl max-h-[80vh] w-full" onClick={(e) => e.stopPropagation()}>
              <Image src={lightboxPhoto.file} alt={lightboxPhoto.name} width={1200} height={800} className="w-full h-auto max-h-[70vh] object-contain" />
              <div className="mt-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-white">
                <div>
                  <h3 className="text-lg font-semibold">{lightboxPhoto.name}</h3>
                  <p className="text-white/60 text-sm">{lightboxPhoto.dimensions} • {lightboxPhoto.size}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => downloadAsset(lightboxPhoto.file, `yume-${lightboxPhoto.id}.jpg`)}
                    className="flex items-center gap-2 px-4 py-2 bg-[var(--yume-vermillion)] hover:bg-[var(--yume-gold)] text-white text-sm font-medium rounded transition-colors">
                    <Download size={16} />Download Original
                  </button>
                  <button onClick={() => copyToClipboard(`Photo: ${lightboxPhoto.name} - Yume Ramen (yuumee.nl)`, `attribution-${lightboxPhoto.id}`)}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded transition-colors">
                    <Copy size={16} />{copiedId === `attribution-${lightboxPhoto.id}` ? "Copied!" : "Copy Attribution"}
                  </button>
                </div>
              </div>
            </motion.div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">{lightboxIndex + 1} / {filteredPhotos.length}</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Brand Guidelines Section */}
      <section ref={sectionRefs.guidelines} className="py-16 md:py-24 bg-[var(--yume-warm-white)] scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10 md:mb-16">
            <div className="flex items-center justify-center gap-2 text-[var(--yume-vermillion)] mb-3">
              <BookOpen size={20} /><span className="text-sm font-medium uppercase tracking-wider">Documentation</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-[var(--yume-charcoal)] mb-3 md:mb-4 font-header">Brand Guidelines</h2>
            <p className="text-[var(--yume-miso)] max-w-xl mx-auto font-body text-sm md:text-base">
              Comprehensive guidelines to ensure consistent brand representation across all media.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-[240px_1fr] gap-6 md:gap-8">
            <div className="md:sticky md:top-24 h-fit">
              <div className="bg-[var(--yume-cream)] rounded-lg p-4 md:p-6">
                <h3 className="font-semibold text-[var(--yume-charcoal)] mb-4 font-header text-sm uppercase tracking-wider">Contents</h3>
                <nav className="space-y-1">
                  {guidelineSections.map((section) => (
                    <button key={section.id} onClick={() => setActiveGuidelineSection(section.id)}
                      className={`flex items-center gap-3 w-full px-3 py-2 text-left text-sm rounded-lg transition-all ${activeGuidelineSection === section.id ? "bg-[var(--yume-charcoal)] text-[var(--yume-warm-white)]" : "text-[var(--yume-miso)] hover:bg-[var(--yume-warm-white)]"}`}>
                      <section.icon size={16} />{section.title}
                    </button>
                  ))}
                </nav>
                <div className="mt-6 pt-6 border-t border-[var(--yume-miso)]/20">
                  <a href="/press-kit/brand-guidelines.pdf"
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-[var(--yume-vermillion)] text-[var(--yume-warm-white)] text-sm font-medium rounded-lg hover:bg-[var(--yume-charcoal)] transition-colors">
                    <Download size={16} />Download PDF
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-[var(--yume-cream)] rounded-lg p-6 md:p-8">
              <AnimatePresence mode="wait">
                <motion.div key={activeGuidelineSection} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                  {activeGuidelineSection === "logo" && (
                    <div className="space-y-6">
                      <h3 className="text-xl md:text-2xl font-bold text-[var(--yume-charcoal)] font-header">Logo Usage</h3>
                      <p className="text-[var(--yume-ink)] font-body">Our logo represents our commitment to authentic Japanese ramen craftsmanship and should always be treated with respect.</p>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="bg-[var(--yume-warm-white)] p-4 rounded-lg">
                          <h4 className="font-semibold text-[var(--yume-charcoal)] mb-3 flex items-center gap-2"><Check size={16} className="text-green-600" />Do</h4>
                          <ul className="text-sm text-[var(--yume-miso)] space-y-2">
                            <li>• Use official logo files only</li><li>• Maintain minimum clear space</li><li>• Use on appropriate backgrounds</li><li>• Scale proportionally</li>
                          </ul>
                        </div>
                        <div className="bg-[var(--yume-warm-white)] p-4 rounded-lg">
                          <h4 className="font-semibold text-[var(--yume-charcoal)] mb-3 flex items-center gap-2"><X size={16} className="text-red-600" />Do Not</h4>
                          <ul className="text-sm text-[var(--yume-miso)] space-y-2">
                            <li>• Stretch or distort the logo</li><li>• Change colors arbitrarily</li><li>• Add shadows or effects</li><li>• Place on busy backgrounds</li>
                          </ul>
                        </div>
                      </div>
                      <div className="bg-[var(--yume-warm-white)] p-4 rounded-lg">
                        <h4 className="font-semibold text-[var(--yume-charcoal)] mb-3">Minimum Clear Space</h4>
                        <p className="text-sm text-[var(--yume-miso)] mb-4">Always maintain clear space around the logo equal to the height of the Y character.</p>
                        <div className="bg-[var(--yume-cream)] p-8 flex items-center justify-center rounded">
                          <div className="relative border-2 border-dashed border-[var(--yume-gold)] p-6">
                            <Image src="/logoDark.svg" alt="Logo with clear space" width={120} height={48} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {activeGuidelineSection === "colors" && (
                    <div className="space-y-6">
                      <h3 className="text-xl md:text-2xl font-bold text-[var(--yume-charcoal)] font-header">Color System</h3>
                      <p className="text-[var(--yume-ink)] font-body">Our palette is inspired by traditional Japanese aesthetics, combining warm earth tones with bold accent colors.</p>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-[var(--yume-charcoal)] mb-3">Primary Colors</h4>
                          <div className="space-y-2">
                            <div className="flex items-center gap-3"><div className="w-12 h-12 rounded" style={{ backgroundColor: "#D64933" }} /><div><p className="font-medium text-[var(--yume-charcoal)]">Vermillion</p><p className="text-xs text-[var(--yume-miso)]">Primary brand, CTAs</p></div></div>
                            <div className="flex items-center gap-3"><div className="w-12 h-12 rounded" style={{ backgroundColor: "#C9A962" }} /><div><p className="font-medium text-[var(--yume-charcoal)]">Gold</p><p className="text-xs text-[var(--yume-miso)]">Accents, highlights</p></div></div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-[var(--yume-charcoal)] mb-3">Approved Combinations</h4>
                          <div className="space-y-2">
                            <div className="h-12 rounded flex overflow-hidden"><div className="flex-1" style={{ backgroundColor: "#1A1A1A" }} /><div className="flex-1" style={{ backgroundColor: "#D64933" }} /></div>
                            <div className="h-12 rounded flex overflow-hidden"><div className="flex-1" style={{ backgroundColor: "#FAF7F2" }} /><div className="flex-1" style={{ backgroundColor: "#C9A962" }} /></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {activeGuidelineSection === "typography" && (
                    <div className="space-y-6">
                      <h3 className="text-xl md:text-2xl font-bold text-[var(--yume-charcoal)] font-header">Typography</h3>
                      <p className="text-[var(--yume-ink)] font-body">Our typography combines a distinctive display font for headlines with a clean, readable body font.</p>
                      <div className="space-y-6">
                        <div className="bg-[var(--yume-warm-white)] p-6 rounded-lg">
                          <h4 className="font-semibold text-[var(--yume-charcoal)] mb-2">Headlines: The Last Shuriken</h4>
                          <p className="text-4xl font-header text-[var(--yume-charcoal)]">The art of authentic ramen</p>
                          <p className="text-sm text-[var(--yume-miso)] mt-2">Used for: Page titles, section headers, hero text</p>
                        </div>
                        <div className="bg-[var(--yume-warm-white)] p-6 rounded-lg">
                          <h4 className="font-semibold text-[var(--yume-charcoal)] mb-2">Body: Quicksand</h4>
                          <p className="text-base font-body text-[var(--yume-charcoal)]">Every bowl we serve carries the spirit of our journey and the promise of authentic Japanese craftsmanship.</p>
                          <p className="text-sm text-[var(--yume-miso)] mt-2">Used for: Body text, descriptions, UI elements</p>
                        </div>
                        <div className="bg-[var(--yume-warm-white)] p-6 rounded-lg">
                          <h4 className="font-semibold text-[var(--yume-charcoal)] mb-2">Japanese Accents</h4>
                          <p className="text-4xl font-japanese text-[var(--yume-gold)]">夢 • 麺 • 味</p>
                          <p className="text-sm text-[var(--yume-miso)] mt-2">Used for: Decorative elements, cultural authenticity markers</p>
                        </div>
                      </div>
                    </div>
                  )}
                  {activeGuidelineSection === "photography" && (
                    <div className="space-y-6">
                      <h3 className="text-xl md:text-2xl font-bold text-[var(--yume-charcoal)] font-header">Photography Style</h3>
                      <p className="text-[var(--yume-ink)] font-body">Our photography captures warmth, authenticity, and craftsmanship. Images should feel inviting and true to our Japanese heritage.</p>
                      <div className="grid sm:grid-cols-3 gap-4">
                        <div className="bg-[var(--yume-warm-white)] p-4 rounded-lg text-center">
                          <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-[var(--yume-vermillion)]/10 flex items-center justify-center"><UtensilsCrossed size={32} className="text-[var(--yume-vermillion)]" /></div>
                          <h4 className="font-semibold text-[var(--yume-charcoal)] mb-1">Warm & Inviting</h4>
                          <p className="text-xs text-[var(--yume-miso)]">Cozy lighting, steam, appetizing presentation</p>
                        </div>
                        <div className="bg-[var(--yume-warm-white)] p-4 rounded-lg text-center">
                          <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-[var(--yume-gold)]/10 flex items-center justify-center"><ImageIcon size={32} className="text-[var(--yume-gold)]" /></div>
                          <h4 className="font-semibold text-[var(--yume-charcoal)] mb-1">Authentic</h4>
                          <p className="text-xs text-[var(--yume-miso)]">Real ingredients, traditional presentation</p>
                        </div>
                        <div className="bg-[var(--yume-warm-white)] p-4 rounded-lg text-center">
                          <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-[var(--yume-vermillion)]/10 flex items-center justify-center"><Sparkles size={32} className="text-[var(--yume-vermillion)]" /></div>
                          <h4 className="font-semibold text-[var(--yume-charcoal)] mb-1">Crafted</h4>
                          <p className="text-xs text-[var(--yume-miso)]">Show the process, skill, and care</p>
                        </div>
                      </div>
                    </div>
                  )}
                  {activeGuidelineSection === "voice" && (
                    <div className="space-y-6">
                      <h3 className="text-xl md:text-2xl font-bold text-[var(--yume-charcoal)] font-header">Voice & Tone</h3>
                      <p className="text-[var(--yume-ink)] font-body">Our brand voice is warm, knowledgeable, and passionate about ramen culture. We speak as craftspeople who respect tradition while welcoming everyone.</p>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="bg-[var(--yume-warm-white)] p-4 rounded-lg">
                          <h4 className="font-semibold text-[var(--yume-charcoal)] mb-3">We Are</h4>
                          <ul className="text-sm text-[var(--yume-miso)] space-y-2"><li>• Passionate but not pretentious</li><li>• Knowledgeable but welcoming</li><li>• Traditional but approachable</li><li>• Artisanal but not exclusive</li></ul>
                        </div>
                        <div className="bg-[var(--yume-warm-white)] p-4 rounded-lg">
                          <h4 className="font-semibold text-[var(--yume-charcoal)] mb-3">We Are Not</h4>
                          <ul className="text-sm text-[var(--yume-miso)] space-y-2"><li>• Elitist or snobbish</li><li>• Casual or fast-food</li><li>• Generic or corporate</li><li>• Overly formal or distant</li></ul>
                        </div>
                      </div>
                    </div>
                  )}
                  {activeGuidelineSection === "donts" && (
                    <div className="space-y-6">
                      <h3 className="text-xl md:text-2xl font-bold text-[var(--yume-charcoal)] font-header">What Not To Do</h3>
                      <p className="text-[var(--yume-ink)] font-body">To maintain brand consistency, please avoid these common mistakes when using Yume Ramen brand assets.</p>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {[{ title: "Do not stretch the logo", desc: "Always maintain original proportions" },
                          { title: "Do not change colors", desc: "Use only approved color variations" },
                          { title: "Do not add effects", desc: "No shadows, gradients, or filters" },
                          { title: "Do not use low contrast", desc: "Ensure logo is always legible" },
                          { title: "Do not rotate the logo", desc: "Keep logo oriented correctly" },
                          { title: "Do not crowd the logo", desc: "Maintain required clear space" },
                        ].map((item, index) => (
                          <div key={index} className="bg-red-50 border border-red-200 p-4 rounded-lg">
                            <h4 className="font-semibold text-red-800 mb-1 flex items-center gap-2"><X size={16} />{item.title}</h4>
                            <p className="text-sm text-red-600">{item.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Fact Sheet Section */}
      <section ref={sectionRefs.factsheet} className="py-16 md:py-24 bg-[var(--yume-cream)] scroll-mt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10 md:mb-16">
            <div className="flex items-center justify-center gap-2 text-[var(--yume-vermillion)] mb-3">
              <FileText size={20} /><span className="text-sm font-medium uppercase tracking-wider">Company Info</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-[var(--yume-charcoal)] mb-3 md:mb-4 font-header">Fact Sheet</h2>
            <p className="text-[var(--yume-miso)] max-w-xl mx-auto font-body text-sm md:text-base">
              Ready-to-use company information and boilerplate text. Click any section to copy.
            </p>
          </motion.div>

          <div className="space-y-6 md:space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-[var(--yume-warm-white)] rounded-lg p-6 md:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <h3 className="text-lg font-bold text-[var(--yume-charcoal)] font-header">Company Overview</h3>
                <div className="flex gap-2">
                  {(["short", "medium", "long"] as const).map((length) => (
                    <button key={length} onClick={() => setFactSheetLength(length)}
                      className={`px-3 py-1 text-xs font-medium rounded-full capitalize transition-all ${factSheetLength === length ? "bg-[var(--yume-charcoal)] text-[var(--yume-warm-white)]" : "bg-[var(--yume-cream)] text-[var(--yume-miso)] hover:bg-[var(--yume-charcoal)] hover:text-[var(--yume-warm-white)]"}`}>
                      {length}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-[var(--yume-ink)] font-body whitespace-pre-line mb-4">{factSheetData.companyOverview[factSheetLength]}</p>
              <button onClick={() => copyToClipboard(factSheetData.companyOverview[factSheetLength], "overview")}
                className="flex items-center gap-2 text-sm text-[var(--yume-vermillion)] hover:text-[var(--yume-charcoal)] transition-colors">
                {copiedId === "overview" ? <Check size={16} /> : <Copy size={16} />}{copiedId === "overview" ? "Copied!" : "Copy text"}
              </button>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-[var(--yume-warm-white)] rounded-lg p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-[var(--yume-charcoal)] font-header">Key Facts & Figures</h3>
                <button onClick={() => copyToClipboard(factSheetData.keyFacts.map(f => `${f.label}: ${f.value}`).join("\n"), "keyfacts")}
                  className="flex items-center gap-2 text-sm text-[var(--yume-vermillion)] hover:text-[var(--yume-charcoal)] transition-colors">
                  {copiedId === "keyfacts" ? <Check size={16} /> : <Copy size={16} />}Copy all
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {factSheetData.keyFacts.map((fact, index) => (
                  <button key={index} onClick={() => copyToClipboard(`${fact.label}: ${fact.value}`, `fact-${index}`)}
                    className="text-left p-4 bg-[var(--yume-cream)] rounded-lg hover:bg-[var(--yume-charcoal)] hover:text-[var(--yume-warm-white)] transition-all group">
                    <p className="text-xs text-[var(--yume-miso)] group-hover:text-[var(--yume-warm-white)]/70 mb-1">{fact.label}</p>
                    <p className="text-lg font-bold text-[var(--yume-charcoal)] group-hover:text-[var(--yume-warm-white)] font-header">{fact.value}</p>
                    {copiedId === `fact-${index}` && <span className="text-xs text-green-500">Copied!</span>}
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-[var(--yume-warm-white)] rounded-lg p-6 md:p-8">
              <h3 className="text-lg font-bold text-[var(--yume-charcoal)] font-header mb-6">Quote Bank</h3>
              <div className="space-y-4">
                {factSheetData.founderQuotes.map((item, index) => (
                  <div key={index} className="relative p-4 md:p-6 bg-[var(--yume-cream)] rounded-lg">
                    <Quote size={24} className="absolute top-4 right-4 text-[var(--yume-gold)]/30" />
                    <p className="text-[var(--yume-ink)] italic mb-3 font-body pr-8">&ldquo;{item.quote}&rdquo;</p>
                    <p className="text-sm text-[var(--yume-miso)]">— {item.attribution}</p>
                    <button onClick={() => copyToClipboard(`"${item.quote}" — ${item.attribution}`, `quote-${index}`)}
                      className="mt-3 flex items-center gap-2 text-sm text-[var(--yume-vermillion)] hover:text-[var(--yume-charcoal)] transition-colors">
                      {copiedId === `quote-${index}` ? <Check size={14} /> : <Copy size={14} />}{copiedId === `quote-${index}` ? "Copied!" : "Copy quote"}
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Menu Assets Section */}
      <section ref={sectionRefs.menu} className="py-16 md:py-24 bg-[var(--yume-warm-white)] scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10 md:mb-16">
            <div className="flex items-center justify-center gap-2 text-[var(--yume-vermillion)] mb-3">
              <UtensilsCrossed size={20} /><span className="text-sm font-medium uppercase tracking-wider">Our Dishes</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-[var(--yume-charcoal)] mb-3 md:mb-4 font-header">Menu Highlights</h2>
            <p className="text-[var(--yume-miso)] max-w-xl mx-auto font-body text-sm md:text-base">
              Signature dishes with descriptions ready for your articles. Click to copy dish information.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {menuHighlights.map((dish, index) => (
              <motion.div key={dish.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}
                className="group bg-[var(--yume-cream)] rounded-lg overflow-hidden flex flex-col sm:flex-row">
                <div className="relative w-full sm:w-40 h-40 sm:h-auto flex-shrink-0">
                  <Image src={dish.image} alt={dish.name} fill className="object-cover" />
                </div>
                <div className="flex-1 p-4 md:p-6">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-[var(--yume-charcoal)] font-header">{dish.name}</h3>
                      <p className="text-[var(--yume-gold)] font-japanese text-sm">{dish.japanese}</p>
                    </div>
                  </div>
                  <p className="text-sm text-[var(--yume-ink)] mb-4 font-body">{dish.description}</p>
                  <button onClick={() => copyToClipboard(`${dish.name} (${dish.japanese})\n${dish.description}`, `dish-${index}`)}
                    className="flex items-center gap-2 text-sm text-[var(--yume-vermillion)] hover:text-[var(--yume-charcoal)] transition-colors">
                    {copiedId === `dish-${index}` ? <Check size={14} /> : <Copy size={14} />}{copiedId === `dish-${index}` ? "Copied!" : "Copy description"}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link href="/menu" className="inline-flex items-center gap-2 text-[var(--yume-vermillion)] hover:text-[var(--yume-charcoal)] font-medium">
              View full menu<ExternalLink size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Press Releases Section */}
      <section ref={sectionRefs.releases} className="py-16 md:py-24 bg-[var(--yume-cream)] scroll-mt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10 md:mb-16">
            <div className="flex items-center justify-center gap-2 text-[var(--yume-vermillion)] mb-3">
              <Newspaper size={20} /><span className="text-sm font-medium uppercase tracking-wider">News</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-[var(--yume-charcoal)] mb-3 md:mb-4 font-header">Press Releases</h2>
            <p className="text-[var(--yume-miso)] max-w-xl mx-auto font-body text-sm md:text-base">Official announcements and news from Yume Ramen.</p>
          </motion.div>

          <div className="space-y-4">
            {pressReleases.map((release, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}
                className="bg-[var(--yume-warm-white)] rounded-lg overflow-hidden">
                <button onClick={() => setExpandedRelease(expandedRelease === index ? null : index)}
                  className="w-full p-4 md:p-6 flex items-start gap-4 text-left hover:bg-[var(--yume-cream)]/50 transition-colors">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-[var(--yume-charcoal)] flex items-center justify-center flex-shrink-0 rounded">
                    <Newspaper size={20} className="text-[var(--yume-warm-white)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-xs md:text-sm text-[var(--yume-miso)] mb-1 font-body"><Calendar size={14} />{release.date}</div>
                    <h3 className="text-base md:text-lg font-bold text-[var(--yume-charcoal)] mb-1 font-header">{release.title}</h3>
                    <p className="text-sm text-[var(--yume-ink)] font-body line-clamp-2">{release.description}</p>
                  </div>
                  <ChevronDown size={20} className={`text-[var(--yume-miso)] flex-shrink-0 transition-transform ${expandedRelease === index ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {expandedRelease === index && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-[var(--yume-cream)]">
                      <div className="p-4 md:p-6 pt-4">
                        <p className="text-sm text-[var(--yume-ink)] font-body mb-4 whitespace-pre-line">{release.fullText}</p>
                        <div className="flex flex-wrap gap-2">
                          <button onClick={() => copyToClipboard(release.fullText, `release-${index}`)}
                            className="flex items-center gap-2 px-4 py-2 text-sm bg-[var(--yume-cream)] hover:bg-[var(--yume-charcoal)] hover:text-[var(--yume-warm-white)] text-[var(--yume-charcoal)] rounded transition-colors">
                            {copiedId === `release-${index}` ? <Check size={14} /> : <Copy size={14} />}Copy text
                          </button>
                          <button className="flex items-center gap-2 px-4 py-2 text-sm bg-[var(--yume-cream)] hover:bg-[var(--yume-charcoal)] hover:text-[var(--yume-warm-white)] text-[var(--yume-charcoal)] rounded transition-colors">
                            <Download size={14} />Download PDF
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section ref={sectionRefs.contact} className="py-16 md:py-24 bg-[var(--yume-charcoal)] scroll-mt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="flex items-center gap-2 text-[var(--yume-gold)] mb-3">
                <MessageSquare size={20} /><span className="text-sm font-medium uppercase tracking-wider">Get in Touch</span>
              </div>
              <h2 className="text-2xl md:text-4xl font-bold text-[var(--yume-warm-white)] mb-4 font-header">Media Inquiries</h2>
              <p className="text-[var(--yume-warm-white)]/80 mb-6 font-body">
                For press inquiries, interviews, or media requests, please contact our press team. We typically respond within 24 hours.
              </p>
              <div className="space-y-4">
                <a href="mailto:press@yuumee.nl" className="flex items-center gap-3 text-[var(--yume-warm-white)] hover:text-[var(--yume-gold)] transition-colors">
                  <div className="w-10 h-10 bg-[var(--yume-vermillion)] flex items-center justify-center rounded"><Mail size={18} /></div>
                  <div><p className="text-sm text-[var(--yume-warm-white)]/60">Email</p><p className="font-medium">press@yuumee.nl</p></div>
                </a>
                <a href="tel:+31612345678" className="flex items-center gap-3 text-[var(--yume-warm-white)] hover:text-[var(--yume-gold)] transition-colors">
                  <div className="w-10 h-10 bg-[var(--yume-vermillion)] flex items-center justify-center rounded"><Phone size={18} /></div>
                  <div><p className="text-sm text-[var(--yume-warm-white)]/60">Phone</p><p className="font-medium">+31 6 12345678</p></div>
                </a>
                <div className="flex items-center gap-3 text-[var(--yume-warm-white)]">
                  <div className="w-10 h-10 bg-[var(--yume-ink)] flex items-center justify-center rounded"><Clock size={18} /></div>
                  <div><p className="text-sm text-[var(--yume-warm-white)]/60">Response Time</p><p className="font-medium">Within 24 hours</p></div>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-[var(--yume-ink)] p-6 md:p-8 rounded-lg">
              <h3 className="text-xl font-bold text-[var(--yume-warm-white)] mb-4 font-header">Request Custom Assets</h3>
              <p className="text-sm text-[var(--yume-warm-white)]/70 mb-6 font-body">Need something specific? We are happy to help with:</p>
              <ul className="space-y-3 mb-6">
                {["Interview scheduling", "Custom photography", "Video content & B-roll", "Chef availability", "Restaurant tours", "Product samples"].map((item, index) => (
                  <li key={index} className="flex items-center gap-3 text-[var(--yume-warm-white)]/80 text-sm"><Check size={16} className="text-[var(--yume-gold)]" />{item}</li>
                ))}
              </ul>
              <a href="mailto:press@yuumee.nl?subject=Media Request"
                className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-[var(--yume-vermillion)] text-[var(--yume-warm-white)] font-medium rounded hover:bg-[var(--yume-gold)] hover:text-[var(--yume-charcoal)] transition-colors">
                <Mail size={18} />Submit Media Request
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Floating Action Bar */}
      <AnimatePresence>
        {selectedAssets.length > 0 && (
          <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-40 p-4 pb-6 md:pb-8 bg-[var(--yume-charcoal)] border-t border-[var(--yume-gold)]/20 shadow-lg safe-area-bottom">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[var(--yume-vermillion)] rounded-full flex items-center justify-center text-white font-bold">{selectedAssets.length}</div>
                <div className="hidden sm:block">
                  <p className="text-[var(--yume-warm-white)] font-medium">{selectedAssets.length} {selectedAssets.length === 1 ? "asset" : "assets"} selected</p>
                  <p className="text-xs text-[var(--yume-warm-white)]/60">{selectedAssets.filter(a => a.type === "photo").length} photos, {selectedAssets.filter(a => a.type === "logo").length} logos</p>
                </div>
              </div>
              <div className="flex items-center gap-2 md:gap-3">
                <button onClick={clearSelection} className="flex items-center gap-2 px-3 md:px-4 py-2 text-[var(--yume-warm-white)]/80 hover:text-[var(--yume-warm-white)] text-sm transition-colors">
                  <Trash2 size={16} /><span className="hidden sm:inline">Clear</span>
                </button>
                <button onClick={() => { selectedAssets.forEach(asset => { if (asset.file) downloadAsset(asset.file, `yume-${asset.id}.${asset.type === "photo" ? "jpg" : "svg"}`); }); }}
                  className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-[var(--yume-vermillion)] text-[var(--yume-warm-white)] font-medium rounded hover:bg-[var(--yume-gold)] hover:text-[var(--yume-charcoal)] transition-colors text-sm md:text-base">
                  <Download size={18} />Download Selected
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}