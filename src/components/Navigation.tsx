"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Button from "./Button";
import { useCart } from "@/context/CartContext";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Menu", href: "/menu" },
  { name: "Track Order", href: "/track" },
  { name: "Our Story", href: "/about" },
  { name: "Contact", href: "/contact" },
];

interface NavigationProps {
  variant?: "dark" | "light";
}

export default function Navigation({ variant = "dark" }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { totalItems, setIsCartOpen } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isLightText = variant === "light" && !isScrolled;

  return (
    <>
      <motion.nav
        initial={{ y: 0, opacity: 1 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-[var(--yume-warm-white)]/95 backdrop-blur-md shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-20">
            <motion.div className="flex-shrink-0">
              <Link href="/" className="flex items-center gap-3 group">
                <Image
                  src={isLightText ? "/logoLight.svg" : "/logoDark.svg"}
                  alt="Yume Ramen"
                  width={120}
                  height={48}
                  className="h-12 w-auto"
                  priority
                />
              </Link>
            </motion.div>

            <div className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
              {navLinks.map((link, index) => (
                <div key={link.name}>
                  <Link
                    href={link.href}
                    className={`relative text-sm font-medium transition-colors duration-300 group ${
                      isLightText
                        ? "text-[var(--yume-warm-white)] hover:text-[var(--yume-gold)]"
                        : "text-[var(--yume-charcoal)] hover:text-[var(--yume-vermillion)]"
                    }`}
                  >
                    {link.name}
                    <span className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${
                      isLightText ? "bg-[var(--yume-gold)]" : "bg-[var(--yume-vermillion)]"
                    }`} />
                  </Link>
                </div>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-4">
              <motion.button
                onClick={() => setIsCartOpen(true)}
                className={`relative p-2 transition-colors ${
                  isLightText
                    ? "text-[var(--yume-warm-white)] hover:text-[var(--yume-gold)]"
                    : "text-[var(--yume-charcoal)] hover:text-[var(--yume-vermillion)]"
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ShoppingBag size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--yume-vermillion)] text-[var(--yume-warm-white)] text-xs flex items-center justify-center rounded-full">
                    {totalItems}
                  </span>
                )}
              </motion.button>
              <Link href="/menu">
                <Button 
                  variant={isLightText ? "outline" : "primary"} 
                  size="sm"
                  className={isLightText ? "border-[var(--yume-warm-white)] text-[var(--yume-warm-white)] hover:bg-[var(--yume-warm-white)] hover:!text-[var(--yume-charcoal)]" : ""}
                  showCorners={false}
                >
                  Order Now
                </Button>
              </Link>
            </div>

            <motion.button
              className={`lg:hidden p-3 min-w-[44px] min-h-[44px] flex items-center justify-center ${
                isLightText ? "text-[var(--yume-warm-white)]" : "text-[var(--yume-charcoal)]"
              }`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileTap={{ scale: 0.9 }}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-[var(--yume-charcoal)]/50 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              className="absolute right-0 top-0 bottom-0 w-[85vw] max-w-sm bg-[var(--yume-warm-white)] shadow-2xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
            >
              <div className="p-8 pt-24 pb-safe">
                <div className="flex flex-col gap-6">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={link.href}
                        className="text-2xl font-medium text-[var(--yume-charcoal)] hover:text-[var(--yume-vermillion)] transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-8 pt-8 border-t border-[var(--yume-cream)]">
                  <Link href="/menu" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="primary" size="lg" className="w-full">
                      Order Now
                    </Button>
                  </Link>
                </div>
                <div className="mt-8 flex items-center gap-4 text-[var(--yume-miso)]">
                  <span className="text-2xl font-japanese">夢</span>
                  <span className="text-sm font-body">Yume - "Dream" in Japanese</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}