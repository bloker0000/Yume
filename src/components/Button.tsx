"use client";

import { motion } from "framer-motion";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  href?: string;
  cornerColor?: string;
  showCorners?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  href,
  cornerColor = "var(--yume-gold)",
  showCorners = true,
}: ButtonProps) {
  const baseStyles = "relative inline-flex items-center justify-center font-medium transition-all duration-300 overflow-hidden group font-body";
  
  const variants = {
    primary: "bg-[var(--yume-vermillion)] text-[var(--yume-warm-white)] hover:bg-[var(--yume-charcoal)]",
    secondary: "bg-[var(--yume-charcoal)] text-[var(--yume-warm-white)] hover:bg-[var(--yume-vermillion)]",
    outline: "bg-transparent border-2 border-[var(--yume-charcoal)] text-[var(--yume-charcoal)] hover:bg-[var(--yume-charcoal)] hover:text-[var(--yume-warm-white)]",
  };

  const sizes = {
    sm: "px-5 py-2 text-sm",
    md: "px-6 py-2.5 text-base",
    lg: "px-8 py-3 text-lg",
  };

  const combinedStyles = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;
  
  // Outline buttons have a border, so brackets appear more inset visually
  // Adjust non-outline buttons to match
  const cornerInset = variant === "outline" ? "4px" : "6px";

  const content = (
    <>
      {/* Corner Brackets */}
      {showCorners && (
        <>
          <span className="absolute border-t-2 border-l-2 w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" style={{ borderColor: cornerColor, top: cornerInset, left: cornerInset }} />
          <span className="absolute border-t-2 border-r-2 w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" style={{ borderColor: cornerColor, top: cornerInset, right: cornerInset }} />
          <span className="absolute border-b-2 border-l-2 w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" style={{ borderColor: cornerColor, bottom: cornerInset, left: cornerInset }} />
          <span className="absolute border-b-2 border-r-2 w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" style={{ borderColor: cornerColor, bottom: cornerInset, right: cornerInset }} />
        </>
      )}
      
      <span className="relative z-10">{children}</span>
    </>
  );

  if (href) {
    return (
      <motion.a
        href={href}
        className={combinedStyles}
        whileTap={{ scale: 0.98 }}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      className={combinedStyles}
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
    >
      {content}
    </motion.button>
  );
}