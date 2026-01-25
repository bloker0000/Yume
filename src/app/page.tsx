import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import FeaturedMenu from "@/components/FeaturedMenu";
import About from "@/components/About";
import Testimonials from "@/components/Testimonials";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <FeaturedMenu />
      <About />
      <Testimonials />
      <CallToAction />
      <Footer />
    </main>
  );
}
