"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ZoomIn, Flame, X } from "lucide-react";

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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [direction, setDirection] = useState(0);
  const thumbnailsRef = useRef<HTMLDivElement>(null);

  const nextImage = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.x > threshold) {
      prevImage();
    } else if (info.offset.x < -threshold) {
      nextImage();
    }
  };

  useEffect(() => {
    if (thumbnailsRef.current) {
      const thumbnail = thumbnailsRef.current.children[currentIndex] as HTMLElement;
      if (thumbnail) {
        thumbnail.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      }
    }
  }, [currentIndex]);

  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isFullscreen]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  return (
    <>
      <div className="relative">
        <div className="relative aspect-square lg:aspect-[4/3] overflow-hidden bg-[var(--yume-cream)]">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
              drag={images.length > 1 ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              className="relative w-full h-full cursor-grab active:cursor-grabbing"
            >
              <Image
                src={images[currentIndex]}
                alt={`${name} - Image ${currentIndex + 1}`}
                fill
                className="object-cover pointer-events-none"
                priority={currentIndex === 0}
                draggable={false}
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
            onClick={() => setIsFullscreen(true)}
            className="absolute top-4 right-4 p-2 bg-[var(--yume-charcoal)]/80 text-[var(--yume-warm-white)] hover:bg-[var(--yume-charcoal)] transition-colors z-10"
            aria-label="View fullscreen"
          >
            <ZoomIn size={20} />
          </button>

          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-[var(--yume-charcoal)]/80 text-[var(--yume-warm-white)] hover:bg-[var(--yume-charcoal)] transition-colors z-10 hidden sm:block"
                aria-label="Previous image"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-[var(--yume-charcoal)]/80 text-[var(--yume-warm-white)] hover:bg-[var(--yume-charcoal)] transition-colors z-10 hidden sm:block"
                aria-label="Next image"
              >
                <ChevronRight size={24} />
              </button>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-2 bg-[var(--yume-charcoal)]/70 rounded-full z-10">
                <span className="text-[var(--yume-warm-white)] text-sm font-body">
                  {currentIndex + 1} / {images.length}
                </span>
              </div>
            </>
          )}

          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[var(--yume-charcoal)]/40 to-transparent pointer-events-none" />
        </div>

        {images.length > 1 && (
          <>
            <div 
              ref={thumbnailsRef}
              className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide px-1 py-1 -mx-1 snap-x snap-mandatory"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => goToImage(idx)}
                  className={`relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 overflow-hidden transition-all snap-center ${
                    currentIndex === idx
                      ? "ring-2 ring-[var(--yume-vermillion)] ring-offset-2"
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

            <div className="flex justify-center gap-1.5 mt-3 sm:hidden">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goToImage(idx)}
                  className={`h-1.5 rounded-full transition-all ${
                    currentIndex === idx
                      ? "bg-[var(--yume-vermillion)] w-6"
                      : "bg-[var(--yume-miso)] w-1.5"
                  }`}
                  aria-label={`Go to image ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex flex-col"
          >
            <div className="flex items-center justify-between p-4">
              <span className="text-white font-body">
                {currentIndex + 1} / {images.length}
              </span>
              <button
                onClick={() => setIsFullscreen(false)}
                className="p-2 text-white hover:bg-white/10 rounded-full transition-colors"
                aria-label="Close fullscreen"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 flex items-center justify-center relative overflow-hidden">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={handleDragEnd}
                  className="absolute inset-4 cursor-grab active:cursor-grabbing"
                >
                  <Image
                    src={images[currentIndex]}
                    alt={`${name} - Image ${currentIndex + 1}`}
                    fill
                    className="object-contain pointer-events-none"
                    draggable={false}
                  />
                </motion.div>
              </AnimatePresence>

              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 text-white hover:bg-white/20 rounded-full transition-colors z-10"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={28} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 text-white hover:bg-white/20 rounded-full transition-colors z-10"
                    aria-label="Next image"
                  >
                    <ChevronRight size={28} />
                  </button>
                </>
              )}
            </div>

            {images.length > 1 && (
              <div className="p-4">
                <div className="flex justify-center gap-2 overflow-x-auto pb-safe">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => goToImage(idx)}
                      className={`relative flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 overflow-hidden transition-all ${
                        currentIndex === idx
                          ? "ring-2 ring-white"
                          : "opacity-50 hover:opacity-100"
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
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}