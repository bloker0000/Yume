import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[var(--yume-warm-white)]">
      <Navigation variant="dark" />

      <div className="pt-32 pb-20">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <p className="text-8xl mb-6">🍜</p>
          <h1 className="text-4xl font-bold text-[var(--yume-charcoal)] mb-4 font-header">
            Oops! This dish got away
          </h1>
          <p className="text-[var(--yume-gold)] font-japanese text-xl mb-4">
            見つかりません
          </p>
          <p className="text-[var(--yume-miso)] mb-8 font-body">
            The menu item you&apos;re looking for doesn&apos;t exist or has been removed from our menu.
          </p>
          <Link
            href="/menu"
            className="inline-block px-8 py-4 bg-[var(--yume-charcoal)] text-[var(--yume-warm-white)] font-medium hover:bg-[var(--yume-vermillion)] transition-colors font-body"
          >
            Back to Menu
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  );
}