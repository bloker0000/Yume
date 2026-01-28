"use client";

import { motion } from "framer-motion";
import { Instagram, Facebook, MapPin, Phone, Mail, Clock } from "lucide-react";
import Image from "next/image";

const footerLinks = {
  menu: [
    { name: "Tonkotsu Ramen", href: "/menu/tonkotsu-ramen" },
    { name: "Miso Ramen", href: "/menu/spicy-miso-ramen" },
    { name: "Shoyu Ramen", href: "/menu/shoyu-ramen" },
    { name: "Sides & Appetizers", href: "/menu?category=appetizers" },
    { name: "Drinks", href: "/menu?category=drinks" },
  ],
  company: [
    { name: "Our Story", href: "/about" },
    { name: "Careers", href: "/careers" },
    { name: "Press", href: "/press" },
    { name: "Contact", href: "/contact" },
  ],
  support: [
    { name: "FAQ", href: "/faq" },
    { name: "Delivery Info", href: "/delivery" },
    { name: "Allergen Info", href: "/allergens" },
    { name: "Terms & Conditions", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy" },
  ],
};

const socialLinks = [
  { name: "Instagram", icon: Instagram, href: "https://instagram.com" },
  { name: "Facebook", icon: Facebook, href: "https://facebook.com" },
];

export default function Footer() {
  return (
    <footer className="relative bg-[var(--yume-cream)] overflow-hidden">
      <div className="relative z-10 pt-12 sm:pt-16 pb-8 pb-safe">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-12 mb-12 sm:mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="col-span-2 lg:col-span-2"
            >
              <div className="mb-6">
                <Image
                  src="/logo.svg"
                  alt="Yume Ramen"
                  width={140}
                  height={56}
                  className="h-14 w-auto"
                />
              </div>

              <p className="text-[var(--yume-ink)] mb-6 max-w-sm leading-relaxed font-body">
                Bringing the authentic taste of Japanese ramen to the Netherlands.
                Every bowl is a journey to Japan.
              </p>

              <div className="space-y-3">
                <a
                  href="tel:+31612345678"
                  className="flex items-center gap-3 text-base text-[var(--yume-ink)] hover:text-[var(--yume-vermillion)] transition-colors font-body"
                >
                  <Phone size={18} />
                  <span>+31 6 12345678</span>
                </a>
                <a
                  href="mailto:hello@yumeramen.nl"
                  className="flex items-center gap-3 text-base text-[var(--yume-ink)] hover:text-[var(--yume-vermillion)] transition-colors font-body"
                >
                  <Mail size={18} />
                  <span>hello@yumeramen.nl</span>
                </a>
                <div className="flex items-center gap-3 text-base text-[var(--yume-ink)] font-body">
                  <MapPin size={18} />
                  <span>Rotterdam, Netherlands</span>
                </div>
                <div className="flex items-center gap-3 text-base text-[var(--yume-ink)] font-body">
                  <Clock size={18} />
                  <span>Daily: 11:00 - 22:00</span>
                </div>
              </div>

              <div className="flex gap-3 sm:gap-4 mt-6">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 sm:w-10 sm:h-10 bg-[var(--yume-charcoal)] text-[var(--yume-warm-white)] flex items-center justify-center hover:bg-[var(--yume-vermillion)] transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <social.icon size={18} />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="font-bold text-[var(--yume-charcoal)] mb-6 text-base font-header">
                Menu
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                {footerLinks.menu.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm sm:text-base text-[var(--yume-ink)] hover:text-[var(--yume-vermillion)] transition-colors font-body py-1 inline-block"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="font-bold text-[var(--yume-charcoal)] mb-6 text-base font-header">
                Company
              </h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-base text-[var(--yume-ink)] hover:text-[var(--yume-vermillion)] transition-colors font-body"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="font-bold text-[var(--yume-charcoal)] mb-6 text-base font-header">
                Support
              </h3>
              <ul className="space-y-3">
                {footerLinks.support.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-base text-[var(--yume-ink)] hover:text-[var(--yume-vermillion)] transition-colors font-body"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="pt-8 border-t border-[var(--yume-miso)]/20"
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-base text-[var(--yume-miso)]">
                &copy; {new Date().getFullYear()} Yume Ramen. All rights reserved.
              </p>
              <div className="flex items-center gap-6">
                <span className="text-base text-[var(--yume-miso)] font-body">
                  Made with love in Rotterdam
                </span>
                <span className="text-2xl font-japanese text-[var(--yume-vermillion)]">
                  夢
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}