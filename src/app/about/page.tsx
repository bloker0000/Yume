import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Story | Yume Ramen Amsterdam",
  description: "Learn about Yume Ramen's journey bringing authentic Japanese ramen to Amsterdam",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[var(--yume-warm-white)]">
      <Navigation variant="dark" />
      
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-[var(--yume-charcoal)] mb-8">
            Our Story
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-[var(--yume-charcoal)]/80 mb-6">
              Yume (夢) means &quot;dream&quot; in Japanese, and that&apos;s exactly what this ramen shop represents - 
              a dream of bringing authentic, soul-warming Japanese ramen to the heart of Amsterdam.
            </p>
            
            <p className="text-lg text-[var(--yume-charcoal)]/70 mb-6">
              Founded by passionate ramen enthusiasts who spent years perfecting their craft in Tokyo&apos;s 
              legendary ramen districts, Yume Ramen combines traditional techniques with the finest local 
              and imported ingredients.
            </p>
            
            <p className="text-lg text-[var(--yume-charcoal)]/70 mb-6">
              Every bowl tells a story. From our 48-hour slow-simmered tonkotsu broth to our hand-pulled 
              noodles made fresh daily, we honor the centuries-old traditions while embracing modern 
              innovation.
            </p>
            
            <p className="text-lg text-[var(--yume-charcoal)]/70">
              Join us on this culinary journey. Whether you&apos;re a ramen veteran or trying it for the first 
              time, we&apos;re here to create moments of comfort, connection, and pure deliciousness.
            </p>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
}
