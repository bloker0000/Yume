"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Button from "./Button";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Menu", href: "/menu" },
  { name: "Order", href: "/order" },
  { name: "Our Story", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-[var(--yume-warm-white)]/95 backdrop-blur-md shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <motion.a
              href="/"
              className="flex items-center gap-3 group"
              whileHover={{ scale: 1.02 }}
            >
              <Image
                src="/logo.svg"
                alt="Yume Ramen"
                width={120}
                height={48}
                className="h-12 w-auto"
                priority
              />
            </motion.a>

            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  className="relative text-sm font-medium text-[var(--yume-charcoal)] hover:text-[var(--yume-vermillion)] transition-colors duration-300 group"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--yume-vermillion)] transition-all duration-300 group-hover:w-full" />
                </motion.a>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-4">
              <motion.button
                className="relative p-2 text-[var(--yume-charcoal)] hover:text-[var(--yume-vermillion)] transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ShoppingBag size={20} />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--yume-vermillion)] text-[var(--yume-warm-white)] text-xs flex items-center justify-center rounded-full">
                  0
                </span>
              </motion.button>
              <Button variant="primary" size="sm">
                Order Now
              </Button>
            </div>

            <motion.button
              className="lg:hidden p-2 text-[var(--yume-charcoal)]"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileTap={{ scale: 0.9 }}
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
              className="absolute right-0 top-0 bottom-0 w-80 bg-[var(--yume-warm-white)] shadow-2xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
            >
              <div className="p-8 pt-24">
                <div className="flex flex-col gap-6">
                  {navLinks.map((link, index) => (
                    <motion.a
                      key={link.name}
                      href={link.href}
                      className="text-2xl font-medium text-[var(--yume-charcoal)] hover:text-[var(--yume-vermillion)] transition-colors"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.name}
                    </motion.a>
                  ))}
                </div>
                <div className="mt-8 pt-8 border-t border-[var(--yume-cream)]">
                  <Button variant="primary" size="lg" className="w-full">
                    Order Now
                  </Button>
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