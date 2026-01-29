"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CartSidebar from "@/components/menu/CartSidebar";
import { useCart } from "@/context/CartContext";
import { 
  ChefHat, 
  Flame, 
  Clock, 
  Award, 
  MapPin, 
  Users, 
  Heart, 
  Leaf,
  Star,
  ArrowRight,
  Play,
  Volume2,
  VolumeX
} from "lucide-react";
import { CirclePattern, SeigaihaPattern, EnsoCircle } from "@/components/JapanesePatterns";

const timelineEvents = [
  {
    year: "2018",
    title: "The Spark",
    japanese: "始まり",
    description: "A life-changing bowl of ramen in a tiny Tokyo alley ignited our passion. That moment of pure culinary magic planted the seed of a dream.",
    image: "/ourStory/theSpark.jpg"
  },
  {
    year: "2019",
    title: "The Training",
    japanese: "修行",
    description: "Two years apprenticing under master ramen chefs in Tokyo's legendary Taishoken and Fuunji shops. Learning the art of the 48-hour broth.",
    image: "/ourStory/theTraining.jpg"
  },
  {
    year: "2021",
    title: "The Journey",
    japanese: "旅",
    description: "From Tokyo to Amsterdam. Bringing centuries of ramen tradition to the heart of the Netherlands, where East meets West.",
    image: "/ourStory/theJourney.jpg"
  },
  {
    year: "2022",
    title: "The Dream",
    japanese: "夢",
    description: "Yume Ramen opens its doors. Every bowl we serve carries the spirit of our journey and the promise of authentic Japanese craftsmanship.",
    image: "/ourStory/theDream.jpg"
  }
];

const philosophyPillars = [
  {
    icon: Flame,
    title: "Tradition",
    japanese: "伝統",
    description: "We honor centuries-old techniques passed down through generations of ramen masters. Our methods haven't changed because perfection is timeless.",
    stats: "48 hours",
    statsLabel: "Broth simmering time"
  },
  {
    icon: Leaf,
    title: "Quality",
    japanese: "品質",
    description: "From locally-sourced Dutch ingredients to imported Japanese specialties, we never compromise. Every component is selected with obsessive care.",
    stats: "100%",
    statsLabel: "Fresh daily ingredients"
  },
  {
    icon: Heart,
    title: "Soul",
    japanese: "魂",
    description: "Ramen isn't just food—it's emotion in a bowl. We pour our heart into every serving, creating moments of comfort and connection.",
    stats: "10,000+",
    statsLabel: "Happy customers served"
  }
];

const teamMembers = [
  {
    name: "Takeshi Yamamoto",
    role: "Head Chef",
    japanese: "山本 武",
    bio: "15 years of ramen mastery. Trained in Tokyo's legendary Taishoken.",
    favorite: "Tonkotsu Classic",
    image: "/ourStory/TakeshiYamamoto.jpg",
    initial: "T"
  },
  {
    name: "Eiko Mizuki",
    role: "Sous Chef",
    japanese: "水木 英光",
    bio: "Master of fusion flavors. Creator of our seasonal specials and signature tare blends.",
    favorite: "Spicy Miso",
    image: "/ourStory/eikoMizuki.jpg",
    initial: "E"
  },
  {
    name: "Kenji Nakamura",
    role: "Noodle Master",
    japanese: "中村 健二",
    bio: "Hand-pulls over 500 portions of noodles daily with precision and love.",
    favorite: "Tantanmen",
    image: "/ourStory/KenjiNakamura.jpg",
    initial: "K"
  }
];

const stats = [
  { number: "48", label: "Hours Broth Time", japanese: "時間" },
  { number: "10K+", label: "Bowls Served", japanese: "杯" },
  { number: "4.9", label: "Star Rating", japanese: "星" },
  { number: "3", label: "Years of Dreams", japanese: "年" }
];

export default function AboutPage() {
  const { isCartOpen, setIsCartOpen } = useCart();
  const [activeTimeline, setActiveTimeline] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const timelineIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);
  const textY = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  const startTimelineInterval = (delay = 5000) => {
    if (timelineIntervalRef.current) {
      clearInterval(timelineIntervalRef.current);
    }
    timelineIntervalRef.current = setInterval(() => {
      setActiveTimeline((prev) => (prev + 1) % timelineEvents.length);
    }, delay);
  };

  const handleTimelineClick = (index: number) => {
    setActiveTimeline(index);
    // Reset timer and wait 10 seconds (5 seconds longer) before auto-advancing
    startTimelineInterval(10000);
    // After the first 10-second interval, return to normal 5-second intervals
    setTimeout(() => {
      startTimelineInterval(5000);
    }, 10000);
  };

  useEffect(() => {
    startTimelineInterval(5000);
    return () => {
      if (timelineIntervalRef.current) {
        clearInterval(timelineIntervalRef.current);
      }
    };
  }, []);

  return (
    <main className="min-h-screen bg-[var(--yume-warm-white)] overflow-x-hidden">
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <Navigation variant="light" />
      
      {/* Hero Section - Immersive Opening */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div 
          style={{ scale: heroScale }}
          className="absolute inset-0"
        >
          <Image
            src="/ourStory/broth.jpg"
            alt="Steam rising from ramen"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--yume-charcoal)]/70 via-[var(--yume-charcoal)]/50 to-[var(--yume-charcoal)]/90" />
        </motion.div>

        <motion.div 
          style={{ opacity: heroOpacity, y: textY }}
          className="relative z-10 text-center px-6 max-w-5xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mb-8"
          >
            <span className="text-[12rem] md:text-[16rem] font-japanese text-[var(--yume-gold)] opacity-30 leading-none block">
              夢
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="space-y-6 -mt-24"
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-[var(--yume-warm-white)] font-header">
              Our <span className="text-[var(--yume-vermillion)]">Story</span>
            </h1>
            <p className="text-xl md:text-2xl text-[var(--yume-warm-white)]/80 font-body max-w-2xl mx-auto">
              A bowl of ramen is 10,000 hours of dedication served in 10 minutes of joy
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Opening Quote Section */}
      <section className="relative py-24 lg:py-32 bg-[var(--yume-charcoal)] overflow-hidden">
        <CirclePattern className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] text-[var(--yume-warm-white)] opacity-5" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-16 h-[1px] bg-[var(--yume-gold)]" />
              <span className="text-[var(--yume-gold)] font-japanese text-3xl">物語</span>
              <div className="w-16 h-[1px] bg-[var(--yume-gold)]" />
            </div>

            <blockquote className="text-2xl md:text-4xl text-[var(--yume-warm-white)] font-header leading-relaxed mb-8">
              &ldquo;Every master was once a student. Every bowl carries the weight of a thousand bowls before it.&rdquo;
            </blockquote>

            <p className="text-[var(--yume-gold)] font-body">
              — The philosophy that guides us
            </p>
          </motion.div>
        </div>
      </section>

      {/* Timeline Journey Section */}
      <section className="relative py-24 lg:py-32 bg-[var(--yume-warm-white)] overflow-hidden">
        <SeigaihaPattern className="absolute top-0 left-0 w-full h-full text-[var(--yume-charcoal)] opacity-5" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-[var(--yume-vermillion)] font-japanese text-2xl mb-4 block">旅路</span>
            <h2 className="text-4xl md:text-6xl font-bold text-[var(--yume-charcoal)] font-header mb-4">
              From Tokyo to <span className="text-[var(--yume-vermillion)]">Amsterdam</span>
            </h2>
            <p className="text-lg text-[var(--yume-miso)] font-body max-w-2xl mx-auto">
              The journey of a thousand bowls begins with a single sip
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Timeline Navigation */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              {timelineEvents.map((event, index) => (
                <motion.div
                  key={event.year}
                  className={`relative pl-8 cursor-pointer transition-all duration-500 ${
                    activeTimeline === index ? "opacity-100" : "opacity-40 hover:opacity-70"
                  }`}
                  onClick={() => handleTimelineClick(index)}
                >
                  {/* Timeline Line */}
                  <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[var(--yume-cream)]">
                    <motion.div
                      className="absolute top-0 left-0 w-full bg-[var(--yume-vermillion)]"
                      initial={{ height: "0%" }}
                      animate={{ height: activeTimeline === index ? "100%" : "0%" }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  
                  {/* Timeline Dot */}
                  <div className={`absolute left-[-5px] top-2 w-3 h-3 rounded-full transition-colors duration-300 ${
                    activeTimeline === index ? "bg-[var(--yume-vermillion)]" : "bg-[var(--yume-cream)]"
                  }`} />

                  <div className="pb-8">
                    <div className="flex items-center gap-4 mb-2">
                      <span className="text-3xl font-bold text-[var(--yume-vermillion)] font-header">{event.year}</span>
                      <span className="text-xl text-[var(--yume-gold)] font-japanese">{event.japanese}</span>
                    </div>
                    <h3 className="text-xl font-bold text-[var(--yume-charcoal)] font-header mb-2">{event.title}</h3>
                    <p className="text-[var(--yume-miso)] font-body leading-relaxed">{event.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Timeline Image */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTimeline}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={timelineEvents[activeTimeline].image}
                      alt={timelineEvents[activeTimeline].title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--yume-charcoal)]/60 to-transparent" />
                  </motion.div>
                </AnimatePresence>

                {/* Decorative Frame */}
                <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-[var(--yume-gold)]" />
                <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-[var(--yume-gold)]" />

                {/* Year Badge */}
                <div className="absolute bottom-6 left-6 bg-[var(--yume-vermillion)] px-6 py-3">
                  <span className="text-2xl font-bold text-[var(--yume-warm-white)] font-header">
                    {timelineEvents[activeTimeline].year}
                  </span>
                </div>
              </div>

              {/* Progress Dots */}
              <div className="flex justify-center gap-3 mt-6">
                {timelineEvents.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleTimelineClick(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      activeTimeline === index 
                        ? "bg-[var(--yume-vermillion)] w-8" 
                        : "bg-[var(--yume-cream)] hover:bg-[var(--yume-miso)]"
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-16 bg-[var(--yume-vermillion)] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(255,255,255,0.1) 50px, rgba(255,255,255,0.1) 51px)`,
          }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <span className="text-sm text-[var(--yume-warm-white)]/60 font-japanese block mb-2">
                  {stat.japanese}
                </span>
                <span className="text-4xl md:text-5xl font-bold text-[var(--yume-warm-white)] font-header block mb-1">
                  {stat.number}
                </span>
                <span className="text-sm text-[var(--yume-warm-white)]/80 font-body">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section - Three Pillars */}
      <section className="relative py-24 lg:py-32 bg-[var(--yume-charcoal)] overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.03 }}
          viewport={{ once: true }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[30rem] font-japanese text-[var(--yume-warm-white)] leading-none select-none pointer-events-none"
        >
          道
        </motion.div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-[var(--yume-gold)] font-japanese text-2xl mb-4 block">哲学</span>
            <h2 className="text-4xl md:text-6xl font-bold text-[var(--yume-warm-white)] font-header mb-4">
              Our <span className="text-[var(--yume-gold)]">Philosophy</span>
            </h2>
            <p className="text-lg text-[var(--yume-warm-white)]/70 font-body max-w-2xl mx-auto">
              Three pillars guide everything we do
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {philosophyPillars.map((pillar, index) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="group relative"
              >
                <div className="relative bg-[var(--yume-ink)] p-8 h-full overflow-hidden">
                  {/* Hover Accent */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-[var(--yume-vermillion)] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                  
                  {/* Japanese Background */}
                  <div className="absolute top-4 right-4 text-6xl font-japanese text-[var(--yume-warm-white)]/5 group-hover:text-[var(--yume-vermillion)]/10 transition-colors duration-500">
                    {pillar.japanese}
                  </div>

                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-[var(--yume-vermillion)] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <pillar.icon size={32} className="text-[var(--yume-warm-white)]" />
                    </div>

                    <h3 className="text-2xl font-bold text-[var(--yume-warm-white)] font-header mb-2">
                      {pillar.title}
                    </h3>
                    <span className="text-[var(--yume-gold)] font-japanese text-lg block mb-4">
                      {pillar.japanese}
                    </span>

                    <p className="text-[var(--yume-warm-white)]/70 font-body leading-relaxed mb-6">
                      {pillar.description}
                    </p>

                    <div className="pt-6 border-t border-[var(--yume-warm-white)]/10">
                      <span className="text-3xl font-bold text-[var(--yume-vermillion)] font-header block">
                        {pillar.stats}
                      </span>
                      <span className="text-sm text-[var(--yume-warm-white)]/50 font-body">
                        {pillar.statsLabel}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The Craft Section - Interactive Process */}
      <section className="relative py-24 lg:py-32 bg-[var(--yume-cream)] overflow-hidden">
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: "url('/bg\\'s/circlesBG1.svg')",
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-[var(--yume-vermillion)] font-japanese text-2xl mb-4 block">職人技</span>
            <h2 className="text-4xl md:text-6xl font-bold text-[var(--yume-charcoal)] font-header mb-4">
              The <span className="text-[var(--yume-vermillion)]">Craft</span>
            </h2>
            <p className="text-lg text-[var(--yume-miso)] font-body max-w-2xl mx-auto">
              Every bowl is a symphony of carefully orchestrated elements
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                title: "The Broth", 
                japanese: "出汁", 
                time: "48 hours",
                description: "Pork bones simmered for two days, creating a rich, collagen-laden elixir",
                image: "/items/Tonkotsu.jpg"
              },
              { 
                title: "The Noodles", 
                japanese: "麺", 
                time: "Made fresh daily",
                description: "Hand-pulled with precision, each strand holds the perfect amount of broth",
                image: "/items/shoyu.jpg"
              },
              { 
                title: "The Tare", 
                japanese: "タレ", 
                time: "Secret recipe",
                description: "Our signature seasoning blend, aged and perfected over three generations",
                image: "/items/spicyMiso.jpg"
              },
              { 
                title: "The Toppings", 
                japanese: "具", 
                time: "Prepared daily",
                description: "From chashu to ajitama, each element is treated with respect and care",
                image: "/items/tantanmen.jpg"
              }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative overflow-hidden"
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--yume-charcoal)] via-[var(--yume-charcoal)]/50 to-transparent" />
                  
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <span className="text-4xl font-japanese text-[var(--yume-gold)] opacity-50 absolute top-4 right-4">
                      {item.japanese}
                    </span>
                    
                    <div className="transform transition-transform duration-500 group-hover:translate-y-[-10px]">
                      <span className="text-xs text-[var(--yume-gold)] font-body uppercase tracking-wider">
                        {item.time}
                      </span>
                      <h3 className="text-xl font-bold text-[var(--yume-warm-white)] font-header mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-[var(--yume-warm-white)]/70 font-body opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet The Team Section */}
      <section className="relative py-24 lg:py-32 bg-[var(--yume-warm-white)] overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-[var(--yume-vermillion)] font-japanese text-2xl mb-4 block">仲間</span>
            <h2 className="text-4xl md:text-6xl font-bold text-[var(--yume-charcoal)] font-header mb-4">
              Meet The <span className="text-[var(--yume-vermillion)]">Team</span>
            </h2>
            <p className="text-lg text-[var(--yume-miso)] font-body max-w-2xl mx-auto">
              The passionate people behind every bowl
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="group"
              >
                <div className="relative bg-[var(--yume-cream)] overflow-hidden">
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-[var(--yume-charcoal)]/40 group-hover:bg-[var(--yume-charcoal)]/20 transition-colors duration-500" />
                    
                    {/* Initial Badge */}
                    <div className="absolute top-4 left-4 w-12 h-12 bg-[var(--yume-vermillion)] flex items-center justify-center">
                      <span className="text-xl font-bold text-[var(--yume-warm-white)] font-header">
                        {member.initial}
                      </span>
                    </div>

                    {/* Japanese Name */}
                    <div className="absolute bottom-4 right-4 text-right">
                      <span className="text-2xl font-japanese text-[var(--yume-warm-white)]/80">
                        {member.japanese}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[var(--yume-charcoal)] font-header">
                      {member.name}
                    </h3>
                    <p className="text-[var(--yume-vermillion)] font-body text-sm mb-3">
                      {member.role}
                    </p>
                    <p className="text-[var(--yume-miso)] font-body text-sm mb-4">
                      {member.bio}
                    </p>
                    
                    <div className="pt-4 border-t border-[var(--yume-charcoal)]/10">
                      <span className="text-xs text-[var(--yume-miso)] font-body">Favorite Bowl:</span>
                      <span className="text-sm text-[var(--yume-charcoal)] font-body font-medium ml-2">
                        {member.favorite}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Cultural Bridge Section */}
      <section className="relative py-24 lg:py-32 bg-[var(--yume-charcoal)] overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute left-0 top-0 w-1/2 h-full bg-gradient-to-r from-[var(--yume-vermillion)]/10 to-transparent" />
          <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-[var(--yume-gold)]/10 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-[var(--yume-gold)] font-japanese text-2xl mb-4 block">架け橋</span>
              <h2 className="text-4xl md:text-5xl font-bold text-[var(--yume-warm-white)] font-header mb-6">
                Japan Meets <span className="text-[var(--yume-vermillion)]">Amsterdam</span>
              </h2>

              <div className="space-y-6 text-[var(--yume-warm-white)]/80 font-body">
                <p>
                  We believe in honoring tradition while embracing our new home. Our ramen is authentically Japanese, 
                  yet it carries the spirit of Amsterdam's vibrant food culture.
                </p>
                <p>
                  We source the finest Dutch vegetables from local farms in Noord-Holland, while importing specialty 
                  ingredients directly from Tokyo's Tsukiji market. This fusion creates something unique—ramen that 
                  respects its roots while celebrating where it's served.
                </p>
                <p>
                  Beyond the bowl, we host monthly ramen workshops, sake tasting evenings, and cultural events that 
                  bring our two worlds together. Because food is more than sustenance—it's connection.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <div className="flex items-center gap-3 px-4 py-2 bg-[var(--yume-ink)]">
                  <MapPin size={18} className="text-[var(--yume-vermillion)]" />
                  <span className="text-[var(--yume-warm-white)] font-body text-sm">Local Dutch Farms</span>
                </div>
                <div className="flex items-center gap-3 px-4 py-2 bg-[var(--yume-ink)]">
                  <Award size={18} className="text-[var(--yume-gold)]" />
                  <span className="text-[var(--yume-warm-white)] font-body text-sm">Imported from Japan</span>
                </div>
                <div className="flex items-center gap-3 px-4 py-2 bg-[var(--yume-ink)]">
                  <Users size={18} className="text-[var(--yume-vermillion)]" />
                  <span className="text-[var(--yume-warm-white)] font-body text-sm">Monthly Workshops</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="relative aspect-square overflow-hidden">
                    <Image src="/items/Tonkotsu.jpg" alt="Japanese craftsmanship" fill className="object-cover" />
                    <div className="absolute inset-0 bg-[var(--yume-vermillion)]/20" />
                  </div>
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image src="/items/gyoza.jpg" alt="Fresh ingredients" fill className="object-cover" />
                    <div className="absolute inset-0 bg-[var(--yume-gold)]/20" />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image src="/items/karaage.jpg" alt="Dutch-Japanese fusion" fill className="object-cover" />
                    <div className="absolute inset-0 bg-[var(--yume-gold)]/20" />
                  </div>
                  <div className="relative aspect-square overflow-hidden">
                    <Image src="/items/edamame.jpg" alt="Amsterdam vibes" fill className="object-cover" />
                    <div className="absolute inset-0 bg-[var(--yume-vermillion)]/20" />
                  </div>
                </div>
              </div>

              {/* Floating Japanese Character */}
              <div className="absolute -top-8 -right-8 text-8xl font-japanese text-[var(--yume-gold)]/20">
                縁
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Customer Stories Section */}
      <section className="relative py-24 lg:py-32 bg-[var(--yume-cream)] overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-[var(--yume-vermillion)] font-japanese text-2xl mb-4 block">声</span>
            <h2 className="text-4xl md:text-6xl font-bold text-[var(--yume-charcoal)] font-header mb-4">
              Your Stories, <span className="text-[var(--yume-vermillion)]">Our Joy</span>
            </h2>
            <p className="text-lg text-[var(--yume-miso)] font-body max-w-2xl mx-auto">
              Every bowl creates a memory. Here are some of yours.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "The moment I tasted the tonkotsu, I was transported back to my trip to Osaka. This is the real deal.",
                author: "Anna K.",
                location: "Rotterdam",
                rating: 5
              },
              {
                quote: "I brought my Japanese grandmother here. She said it reminded her of home. That's the highest praise.",
                author: "Yuki V.",
                location: "Amsterdam",
                rating: 5
              },
              {
                quote: "Date night tradition for two years now. The tantanmen never disappoints. Ever.",
                author: "Mark & Lisa",
                location: "Utrecht",
                rating: 5
              }
            ].map((story, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative bg-[var(--yume-warm-white)] p-8"
              >
                {/* Corner Accents */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[var(--yume-vermillion)]" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[var(--yume-vermillion)]" />

                <div className="flex gap-1 mb-4">
                  {[...Array(story.rating)].map((_, i) => (
                    <Star key={i} size={16} className="text-[var(--yume-gold)] fill-[var(--yume-gold)]" />
                  ))}
                </div>

                <blockquote className="text-[var(--yume-charcoal)] font-body leading-relaxed mb-6 italic">
                  &ldquo;{story.quote}&rdquo;
                </blockquote>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[var(--yume-vermillion)] flex items-center justify-center">
                    <span className="text-[var(--yume-warm-white)] font-bold font-header">
                      {story.author.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-[var(--yume-charcoal)] font-header text-sm">{story.author}</p>
                    <p className="text-[var(--yume-miso)] font-body text-xs">{story.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action - Become Part of Our Story */}
      <section className="relative py-24 lg:py-32 bg-[var(--yume-charcoal)] overflow-hidden">
        <CirclePattern className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] text-[var(--yume-warm-white)] opacity-5" />
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.03 }}
          viewport={{ once: true }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <span className="text-[20rem] md:text-[30rem] font-japanese text-[var(--yume-warm-white)] leading-none">
            夢
          </span>
        </motion.div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-bold text-[var(--yume-warm-white)] font-header mb-6">
              Become Part of <span className="text-[var(--yume-gold)]">Our Story</span>
            </h2>
            <p className="text-xl text-[var(--yume-warm-white)]/80 font-body mb-10 max-w-2xl mx-auto">
              Every customer becomes family. Every bowl shared is a chapter written together. 
              We can&apos;t wait to serve you.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/menu"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[var(--yume-vermillion)] text-[var(--yume-warm-white)] font-bold font-body hover:bg-[var(--yume-gold)] hover:text-[var(--yume-charcoal)] transition-colors"
              >
                Order Now
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-[var(--yume-warm-white)] text-[var(--yume-warm-white)] font-bold font-body hover:bg-[var(--yume-warm-white)] hover:text-[var(--yume-charcoal)] transition-colors"
              >
                Visit Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
