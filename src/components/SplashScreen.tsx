"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsComplete(true);
      onComplete();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  // Create grid of tiles - 20 columns x 12 rows
  const cols = 20;
  const rows = 12;
  const tiles = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // Calculate diagonal index (bottom-left to top-right)
      const diagonalIndex = (rows - 1 - row) + col;
      tiles.push({
        row,
        col,
        delay: diagonalIndex * 0.02,
      });
    }
  }

  if (isComplete) return null;

  return (
    <div 
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 100 }}
    >
      {tiles.map((tile, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{
            duration: 0.15,
            delay: tile.delay,
            ease: "easeInOut",
          }}
          className="absolute"
          style={{
            left: `${(tile.col / cols) * 100}%`,
            top: `${(tile.row / rows) * 100}%`,
            width: `${100 / cols}%`,
            height: `${100 / rows}%`,
            backgroundImage: "url('/bg\\'s/scalePattern.svg')",
            backgroundSize: `${cols * 100}% ${rows * 100}%`,
            backgroundPosition: `${-tile.col * 100}% ${-tile.row * 100}%`,
          }}
        />
      ))}
    </div>
  );
}
