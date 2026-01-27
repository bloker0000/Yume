"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { menuItems, MenuItem } from "@/data/menuData";
import { useCart } from "@/context/CartContext";
import MenuHero from "@/components/menu/MenuHero";
import CategoryFilter from "@/components/menu/CategoryFilter";
import ProductCard from "@/components/menu/ProductCard";
import CustomizationModal from "@/components/menu/CustomizationModal";
import CartSidebar, { FloatingCartButton } from "@/components/menu/CartSidebar";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

function fuzzyMatch(text: string, query: string): boolean {
  const textLower = text.toLowerCase();
  const queryLower = query.toLowerCase();
  
  if (textLower.includes(queryLower)) return true;
  
  let queryIndex = 0;
  for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
    if (textLower[i] === queryLower[queryIndex]) {
      queryIndex++;
    }
  }
  return queryIndex === queryLower.length;
}

function MenuContent() {
  const searchParams = useSearchParams();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [showVegetarian, setShowVegetarian] = useState(false);
  const [showSpicy, setShowSpicy] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isCustomizationOpen, setIsCustomizationOpen] = useState(false);
  const { isCartOpen, setIsCartOpen, totalItems } = useCart();

  useEffect(() => {
    const category = searchParams.get('category');
    if (category && ['ramen', 'appetizers', 'drinks', 'desserts'].includes(category)) {
      setActiveCategory(category);
    }
  }, [searchParams]);

  const filteredAndSortedItems = useMemo(() => {
    let filtered = [...menuItems];

    if (activeCategory !== "all") {
      filtered = filtered.filter((item) => item.category === activeCategory);
    }

    if (showVegetarian) {
      filtered = filtered.filter((item) => item.vegetarian);
    }

    if (showSpicy) {
      filtered = filtered.filter((item) => item.spicy > 0);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          fuzzyMatch(item.name, searchQuery) ||
          fuzzyMatch(item.description, searchQuery) ||
          item.japanese.includes(searchQuery)
      );
    }

    switch (sortBy) {
      case "popular":
        filtered.sort((a, b) => {
          const aScore = (a.bestseller ? 100 : 0) + a.rating * 10;
          const bScore = (b.bestseller ? 100 : 0) + b.rating * 10;
          return bScore - aScore;
        });
        break;
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
    }

    return filtered;
  }, [activeCategory, searchQuery, sortBy, showVegetarian, showSpicy]);

  const handleCustomize = (item: MenuItem) => {
    setSelectedItem(item);
    setIsCustomizationOpen(true);
  };

  const handleCloseCustomization = () => {
    setIsCustomizationOpen(false);
    setTimeout(() => setSelectedItem(null), 200);
  };

  return (
    <main className="min-h-screen bg-[var(--yume-warm-white)]">
      <Navigation variant="light" />
      
      <MenuHero />

      <section className="relative">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "url('/bg's/circles2bg1.svg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
        />

        <div className="relative z-10">
          <CategoryFilter
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            showVegetarian={showVegetarian}
            onVegetarianChange={setShowVegetarian}
            showSpicy={showSpicy}
            onSpicyChange={setShowSpicy}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            {filteredAndSortedItems.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-6xl mb-4">🍜</p>
                <h3 className="text-xl font-bold text-[var(--yume-charcoal)] mb-2 font-header">
                  No items found
                </h3>
                <p className="text-[var(--yume-miso)] font-body">
                  Try adjusting your search or filters
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory("all");
                  }}
                  className="mt-4 px-6 py-2 bg-[var(--yume-charcoal)] text-[var(--yume-warm-white)] font-medium hover:bg-[var(--yume-vermillion)] transition-colors font-body"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <p className="text-sm text-[var(--yume-miso)] font-body">
                    Showing <span className="font-bold text-[var(--yume-charcoal)]">{filteredAndSortedItems.length}</span>{" "}
                    {filteredAndSortedItems.length === 1 ? "item" : "items"}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredAndSortedItems.map((item) => (
                    <ProductCard
                      key={item.id}
                      item={item}
                      onCustomize={handleCustomize}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <CustomizationModal
        item={selectedItem}
        isOpen={isCustomizationOpen}
        onClose={handleCloseCustomization}
      />

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      <AnimatePresence>
        <FloatingCartButton onClick={() => setIsCartOpen(true)} />
      </AnimatePresence>

      {totalItems > 0 && (
        <button
          onClick={() => setIsCartOpen(true)}
          className="hidden lg:flex fixed top-1/2 right-0 -translate-y-1/2 z-30 flex-col items-center gap-2 px-4 py-6 bg-[var(--yume-charcoal)] text-[var(--yume-warm-white)] hover:bg-[var(--yume-vermillion)] transition-colors"
          style={{ writingMode: "vertical-rl" }}
        >
          <span className="font-body text-sm">View Cart ({totalItems})</span>
        </button>
      )}

      <Footer />
    </main>
  );
}

export default function MenuPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-[var(--yume-warm-white)]">
        <Navigation variant="light" />
        <div className="flex items-center justify-center h-96">
          <div className="animate-pulse text-[var(--yume-miso)]">Loading menu...</div>
        </div>
        <Footer />
      </main>
    }>
      <MenuContent />
    </Suspense>
  );
}