"use client";

import { useParams, notFound } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, Clock, Users, Flame } from "lucide-react";
import { getMenuItemBySlug, getRelatedProducts, categories, menuItems } from "@/data/menuData";
import { useCart } from "@/context/CartContext";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CartSidebar, { FloatingCartButton } from "@/components/menu/CartSidebar";
import {
  ProductImageGallery,
  CustomizationPanel,
  NutritionFacts,
  IngredientList,
  ReviewsSection,
  PairingCards,
  StickyAddToCart,
  Breadcrumb,
} from "@/components/product";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const item = getMenuItemBySlug(slug);
  const { isCartOpen, setIsCartOpen } = useCart();
  const [initialCustomization, setInitialCustomization] = useState<any>(null);
  const [currentCustomization, setCurrentCustomization] = useState<{
    quantity: number;
    toppingsPrice: number;
  }>({ quantity: 1, toppingsPrice: 0 });

  useEffect(() => {
    const stored = sessionStorage.getItem(`yume-preview-customization-${slug}`);
    if (stored) {
      try {
        setInitialCustomization(JSON.parse(stored));
        sessionStorage.removeItem(`yume-preview-customization-${slug}`);
      } catch (e) {
        console.error('Failed to parse customization', e);
      }
    }
  }, [slug]);

  if (!item) {
    notFound();
  }

  const relatedProducts = getRelatedProducts(item);
  const categoryName = categories.find((c) => c.id === item.category)?.name || item.category;
  
  const sameCategoryItems = menuItems
    .filter((i) => i.category === item.category && i.id !== item.id)
    .slice(0, 4);

  return (
    <main className="min-h-screen bg-[var(--yume-warm-white)]">
      <Navigation variant="dark" />

      <div className="pt-20 lg:pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <Breadcrumb
            items={[
              { label: "Menu", href: "/menu" },
              { label: categoryName, href: `/menu?category=${item.category}` },
              { label: item.name },
            ]}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ProductImageGallery
                images={item.images}
                name={item.name}
                badges={{
                  bestseller: item.bestseller,
                  isNew: item.isNew,
                  vegetarian: item.vegetarian,
                  spicy: item.spicy,
                }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-col"
            >
              <div className="mb-4 sm:mb-6">
                <p className="text-[var(--yume-gold)] font-japanese text-lg sm:text-xl mb-2">
                  {item.japanese}
                </p>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--yume-charcoal)] mb-3 sm:mb-4 font-header">
                  {item.name}
                </h1>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={18}
                        className={`${
                          star <= Math.round(item.rating)
                            ? "fill-[var(--yume-gold)] text-[var(--yume-gold)]"
                            : "text-[var(--yume-miso)]"
                        }`}
                      />
                    ))}
                    <span className="ml-1 text-sm font-medium text-[var(--yume-charcoal)]">
                      {item.rating}
                    </span>
                  </div>
                  <span className="text-sm text-[var(--yume-miso)]">
                    ({item.reviewCount} reviews)
                  </span>
                </div>

                <p className="text-2xl sm:text-3xl font-bold text-[var(--yume-vermillion)] mb-3 sm:mb-4 font-header">
                  €{item.price.toFixed(2)}
                </p>

                <p className="text-[var(--yume-charcoal)] mb-4 sm:mb-6 font-body leading-relaxed text-sm sm:text-base">
                  {item.description}
                </p>

                <div className="flex flex-wrap gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="flex items-center gap-2 text-sm text-[var(--yume-miso)]">
                    <Clock size={16} />
                    <span>{item.prepTime} mins prep</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[var(--yume-miso)]">
                    <Users size={16} />
                    <span>Serves {item.serves}</span>
                  </div>
                  {item.spicy > 0 && (
                    <div className="flex items-center gap-2 text-sm text-[var(--yume-vermillion)]">
                      <Flame size={16} />
                      <span>
                        {item.spicy === 1 ? "Mild" : item.spicy === 2 ? "Medium" : "Hot"}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-[var(--yume-miso)]">
                    <span>{item.calories} cal</span>
                  </div>
                </div>
              </div>

              <div className="border border-[var(--yume-cream)] mb-6">
                <CustomizationPanel 
                  item={item} 
                  initialCustomization={initialCustomization}
                  onCustomizationChange={setCurrentCustomization}
                />
              </div>

              <NutritionFacts
                nutrition={item.nutrition}
                allergens={item.allergens}
                vegetarian={item.vegetarian}
                vegan={item.vegan}
                glutenFree={item.glutenFree}
              />
            </motion.div>
          </div>
        </div>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative mx-4 sm:mx-0"
          >
            <div className="absolute -top-4 -left-4 w-16 h-16 border-t-2 border-l-2 border-[var(--yume-gold)]" />
            <div className="absolute -bottom-4 -right-4 w-16 h-16 border-b-2 border-r-2 border-[var(--yume-gold)]" />

            <div className="bg-[var(--yume-cream)]/30 p-8 lg:p-12">
              <h2 className="text-2xl lg:text-3xl font-bold text-[var(--yume-charcoal)] mb-2 font-header">
                The Story
              </h2>
              <p className="text-[var(--yume-gold)] font-japanese mb-6">物語</p>

              <div className="prose prose-lg max-w-none">
                {item.longDescription.split("\n\n").map((paragraph, index) => (
                  <p
                    key={index}
                    className="text-[var(--yume-charcoal)] font-body leading-relaxed mb-4 last:mb-0"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <IngredientList ingredients={item.ingredients} />
          </motion.div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PairingCards items={relatedProducts} />
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[var(--yume-cream)]">
          <ReviewsSection reviews={item.reviews} productName={item.name} />
        </section>

        {sameCategoryItems.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-[var(--yume-cream)]">
            <PairingCards items={sameCategoryItems} title="You Might Also Like" />
          </section>
        )}
      </div>

      <Footer />

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <FloatingCartButton onClick={() => setIsCartOpen(true)} />
      <StickyAddToCart 
        item={item} 
        currentQuantity={currentCustomization.quantity}
        toppingsPrice={currentCustomization.toppingsPrice}
      />
    </main>
  );
}