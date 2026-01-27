"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { SeigaihaPattern } from "./JapanesePatterns";

const testimonials = [
  {
    id: 1,
    name: "Sarah van den Berg",
    location: "Rotterdam",
    rating: 5,
    text: "The Tonkotsu Ramen is absolutely incredible! The broth is so rich and creamy. It tastes exactly like what I had in Tokyo. Best ramen in the Netherlands!",
    avatar: "S",
    favorite: "Tonkotsu Ramen",
  },
  {
    id: 2,
    name: "Michael de Vries",
    location: "Amsterdam",
    rating: 5,
    text: "Fast delivery and the ramen arrived piping hot. The spicy miso is now my go-to comfort food. The attention to detail is amazing.",
    avatar: "M",
    favorite: "Spicy Miso Ramen",
  },
  {
    id: 3,
    name: "Emma Jansen",
    location: "Utrecht",
    rating: 5,
    text: "Finally, authentic Japanese ramen delivered to my door! The tantanmen has the perfect balance of spice and creaminess. Absolutely addictive!",
    avatar: "E",
    favorite: "Tantanmen",
  },
];

export default function Testimonials() {
  return (
    <section className="relative py-24 lg:py-32 bg-[var(--yume-cream)] overflow-hidden">
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: "url('/bg\\'s/snowflakesbg0.svg')",
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-12 h-[1px] bg-[var(--yume-gold)]" />
            <span className="text-[var(--yume-gold)] font-japanese text-2xl">
              声
            </span>
            <div className="w-12 h-[1px] bg-[var(--yume-gold)]" />
          </div>

          <h2 className="text-4xl lg:text-6xl font-bold text-[var(--yume-charcoal)] mb-4 font-header">
            What Our
            <br />
            <span className="text-[var(--yume-vermillion)]">Customers Say</span>
          </h2>

          <p className="text-base text-[var(--yume-miso)] max-w-2xl mx-auto font-body">
            Join thousands of satisfied ramen lovers across the Netherlands
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div className="relative bg-[var(--yume-warm-white)] p-8 h-full shadow-sm border border-[var(--yume-cream)]">
                <Quote
                  size={40}
                  className="absolute top-4 right-4 text-[var(--yume-vermillion)]/10"
                />

                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-[var(--yume-vermillion)] flex items-center justify-center text-[var(--yume-warm-white)] text-xl font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-[var(--yume-charcoal)] font-header">
                      {testimonial.name}
                    </h4>
                    <p className="text-base text-[var(--yume-miso)] font-body">
                      {testimonial.location}
                    </p>
                  </div>
                </div>

                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className="text-[var(--yume-gold)] fill-[var(--yume-gold)]"
                    />
                  ))}
                </div>

                <p className="text-[var(--yume-ink)] leading-relaxed mb-6 font-body">
                  &ldquo;{testimonial.text}&rdquo;
                </p>

                <div className="pt-4 border-t border-[var(--yume-cream)]">
                  <span className="text-base text-[var(--yume-miso)] font-body">
                    Favorite:{" "}
                    <span className="text-[var(--yume-vermillion)] font-medium">
                      {testimonial.favorite}
                    </span>
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <div className="inline-flex items-center gap-4 px-6 py-3 bg-[var(--yume-warm-white)] border border-[var(--yume-miso)]/10">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  className="text-[var(--yume-gold)] fill-[var(--yume-gold)]"
                />
              ))}
            </div>
            <span className="text-[var(--yume-charcoal)] font-medium">
              4.9 out of 5
            </span>
            <span className="text-[var(--yume-miso)]">
              based on 2,000+ reviews
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}