"use client";

import { motion } from "framer-motion";
import { categories } from "@/data/menuData";
import { Search, Leaf, Flame, X } from "lucide-react";

interface CategoryFilterProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  showVegetarian: boolean;
  onVegetarianChange: (show: boolean) => void;
  showSpicy: boolean;
  onSpicyChange: (show: boolean) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

export default function CategoryFilter({
  activeCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  showVegetarian,
  onVegetarianChange,
  showSpicy,
  onSpicyChange,
  sortBy,
  onSortChange,
}: CategoryFilterProps) {
  const hasActiveFilters = showVegetarian || showSpicy || searchQuery;

  const clearAllFilters = () => {
    onSearchChange("");
    onVegetarianChange(false);
    onSpicyChange(false);
    onCategoryChange("all");
    onSortChange("popular");
  };

  return (
    <div className="sticky top-20 z-30 bg-[var(--yume-warm-white)] border-b border-[var(--yume-cream)] shadow-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--yume-miso)]"
              />
              <input
                type="text"
                placeholder="Search menu..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[var(--yume-cream)] border border-transparent focus:border-[var(--yume-vermillion)] focus:outline-none text-[var(--yume-charcoal)] placeholder:text-[var(--yume-miso)] font-body transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--yume-miso)] hover:text-[var(--yume-charcoal)]"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onVegetarianChange(!showVegetarian)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all ${
                  showVegetarian
                    ? "bg-green-600 text-white"
                    : "bg-[var(--yume-cream)] text-[var(--yume-charcoal)] hover:bg-[var(--yume-cream)]/80"
                }`}
              >
                <Leaf size={16} />
                Vegetarian
              </button>

              <button
                onClick={() => onSpicyChange(!showSpicy)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all ${
                  showSpicy
                    ? "bg-[var(--yume-vermillion)] text-white"
                    : "bg-[var(--yume-cream)] text-[var(--yume-charcoal)] hover:bg-[var(--yume-cream)]/80"
                }`}
              >
                <Flame size={16} />
                Spicy
              </button>

              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
                className="px-4 py-2.5 bg-[var(--yume-cream)] text-[var(--yume-charcoal)] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--yume-vermillion)] cursor-pointer font-body"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest</option>
              </select>

              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="px-4 py-2.5 text-sm font-medium text-[var(--yume-vermillion)] hover:bg-[var(--yume-vermillion)]/10 transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={`flex-shrink-0 px-5 py-2 text-sm font-medium transition-all ${
                  activeCategory === category.id
                    ? "bg-[var(--yume-vermillion)] text-[var(--yume-warm-white)]"
                    : "bg-[var(--yume-cream)] text-[var(--yume-charcoal)] hover:bg-[var(--yume-charcoal)] hover:text-[var(--yume-warm-white)]"
                }`}
                whileTap={{ scale: 0.98 }}
              >
                <span className="font-body">{category.name}</span>
                <span className="ml-2 text-xs opacity-70 font-japanese">
                  {category.japanese}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}