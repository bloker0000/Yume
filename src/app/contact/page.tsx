import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Metadata } from "next";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us | Yume Ramen Amsterdam",
  description: "Get in touch with Yume Ramen Amsterdam - location, hours, and contact information",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[var(--yume-warm-white)]">
      <Navigation variant="dark" />
      
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-[var(--yume-charcoal)] mb-8">
            Contact Us
          </h1>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-[var(--yume-charcoal)] mb-6">
                Visit Our Restaurant
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <MapPin className="text-[var(--yume-vermillion)] flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-[var(--yume-charcoal)] mb-1">Location</h3>
                    <p className="text-[var(--yume-charcoal)]/70">
                      123 Ramen Street<br />
                      1012 AB Amsterdam<br />
                      Netherlands
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Clock className="text-[var(--yume-vermillion)] flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-[var(--yume-charcoal)] mb-1">Hours</h3>
                    <p className="text-[var(--yume-charcoal)]/70">
                      Monday - Friday: 11:30 AM - 10:00 PM<br />
                      Saturday - Sunday: 12:00 PM - 11:00 PM
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Phone className="text-[var(--yume-vermillion)] flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-[var(--yume-charcoal)] mb-1">Phone</h3>
                    <a 
                      href="tel:+31201234567" 
                      className="text-[var(--yume-charcoal)]/70 hover:text-[var(--yume-vermillion)] transition-colors"
                    >
                      +31 20 123 4567
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Mail className="text-[var(--yume-vermillion)] flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-[var(--yume-charcoal)] mb-1">Email</h3>
                    <a 
                      href="mailto:hello@yumeramen.nl" 
                      className="text-[var(--yume-charcoal)]/70 hover:text-[var(--yume-vermillion)] transition-colors"
                    >
                      hello@yumeramen.nl
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-[var(--yume-charcoal)] mb-6">
                Find Us
              </h2>
              <div className="w-full h-96 bg-[var(--yume-charcoal)]/10 rounded-lg flex items-center justify-center">
                <p className="text-[var(--yume-charcoal)]/50">Map placeholder</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
}
