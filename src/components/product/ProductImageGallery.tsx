"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ZoomIn, Flame } from "lucide-react";

interface ProductImageGalleryProps {
  images: string[];
  name: string;
  badges?: {
    bestseller?: boolean;
    isNew?: boolean;
    vegetarian?: boolean;
    spicy?: number;
  };
}

export default function ProductImageGallery({
  images,
  name,
  badges,
}: ProductImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative">
      <div className="relative aspect-square lg:aspect-[4/3] overflow-hidden bg-[var(--yume-cream)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative w-full h-full"
          >
            <Image
              src={images[currentIndex]}
              alt={`${name} - Image ${currentIndex + 1}`}
              fill
              className={`object-cover transition-transform duration-500 ${
                isZoomed ? "scale-150 cursor-zoom-out" : "cursor-zoom-in"
              }`}
              onClick={() => setIsZoomed(!isZoomed)}
              priority={currentIndex === 0}
            />
          </motion.div>
        </AnimatePresence>

        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {badges?.bestseller && (
            <span className="px-3 py-1 bg-[var(--yume-gold)] text-[var(--yume-charcoal)] text-xs font-bold uppercase tracking-wide">
              Bestseller
            </span>
          )}
          {badges?.isNew && (
            <span className="px-3 py-1 bg-[var(--yume-vermillion)] text-[var(--yume-warm-white)] text-xs font-bold uppercase tracking-wide">
              New
            </span>
          )}
          {badges?.vegetarian && (
            <span className="px-3 py-1 bg-[var(--yume-nori)] text-[var(--yume-warm-white)] text-xs font-bold uppercase tracking-wide">
              Vegetarian
            </span>
          )}
          {badges?.spicy !== undefined && badges.spicy > 0 && (
            <span className="px-3 py-1 bg-[var(--yume-charcoal)]/80 text-[var(--yume-vermillion)] text-xs font-bold flex items-center gap-0.5">
              {Array.from({ length: badges.spicy }).map((_, i) => (
                <Flame key={i} size={14} className="fill-[var(--yume-vermillion)]" />
              ))}
            </span>
          )}
        </div>

        <button
          onClick={() => setIsZoomed(!isZoomed)}
          className="absolute top-4 right-4 p-2 bg-[var(--yume-charcoal)]/80 text-[var(--yume-warm-white)] hover:bg-[var(--yume-charcoal)] transition-colors z-10"
        >
          <ZoomIn size={20} />
        </button>

        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-[var(--yume-charcoal)]/80 text-[var(--yume-warm-white)] hover:bg-[var(--yume-charcoal)] transition-colors z-10"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-[var(--yume-charcoal)]/80 text-[var(--yume-warm-white)] hover:bg-[var(--yume-charcoal)] transition-colors z-10"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--yume-charcoal)]/60 to-transparent pointer-events-none" />
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 mt-4 px-4">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`relative w-20 h-20 overflow-hidden transition-all ${
                currentIndex === idx
                  ? "ring-2 ring-[var(--yume-vermillion)]"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={img}
                alt={`${name} thumbnail ${idx + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {images.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all ${
                currentIndex === idx
                  ? "bg-[var(--yume-vermillion)] w-6"
                  : "bg-[var(--yume-miso)]"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}