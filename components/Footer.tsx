"use client";

import { MapPin, Phone, Mail, Clock, Heart, Star, Shield, Truck, ArrowRight } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-playful-foreground text-playful-background py-16 border-t-8 border-playful-primary mt-16 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-playful-primary rounded-full animate-pulse"></div>
        <div className="absolute top-20 right-20 w-16 h-16 bg-playful-accent rounded-full animate-bounce"></div>
        <div className="absolute bottom-10 left-1/3 w-12 h-12 bg-playful-secondary rounded-full animate-ping"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-8 mb-12 pb-8 border-b border-playful-background/20">
          <div className="flex items-center gap-2 text-playful-background/80">
            <Shield className="h-6 w-6 text-playful-accent" />
            <span className="text-sm font-medium">Safe & Secure</span>
          </div>
          <div className="flex items-center gap-2 text-playful-background/80">
            <Truck className="h-6 w-6 text-playful-accent" />
            <span className="text-sm font-medium">Fast Delivery</span>
          </div>
          <div className="flex items-center gap-2 text-playful-background/80">
            <Star className="h-6 w-6 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-medium">4.8 Rating</span>
          </div>
          <div className="flex items-center gap-2 text-playful-background/80">
            <Heart className="h-6 w-6 text-red-400 fill-red-400" />
            <span className="text-sm font-medium">1000+ Happy Parents</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Enhanced Company Info */}
          <div className="lg:col-span-1 space-y-6 animate-float">
            <div>
              <h3 className="text-3xl lg:text-4xl font-bold text-playful-primary mb-3 bg-gradient-to-r from-playful-primary via-playful-accent to-playful-secondary bg-clip-text text-transparent">
                Baby Souk
              </h3>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm text-playful-background/70 font-medium">4.8/5 (1000+ reviews)</span>
              </div>
            </div>
            <p className="text-playful-background/85 leading-relaxed text-sm lg:text-base">
              Your trusted partner in providing the best products for your little ones.
              Quality, safety, and love in every product. 💕
            </p>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-playful-background/20">
              <div className="text-center">
                <div className="text-lg font-bold text-playful-accent">500+</div>
                <div className="text-xs text-playful-background/70">Products</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-playful-accent">1000+</div>
                <div className="text-xs text-playful-background/70">Customers</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-playful-accent">4.8★</div>
                <div className="text-xs text-playful-background/70">Rating</div>
              </div>
            </div>
          </div>



          {/* Enhanced Quick Links */}
          <div className="lg:col-span-1">
            <h4 className="text-xl font-bold mb-6 text-playful-secondary flex items-center gap-2">
              <span>📋</span> Help & Support
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
              <Link href="/contact" className="flex items-center gap-3 p-3 rounded-lg hover:bg-playful-background/5 transition-all group">
                <div className="w-8 h-8 rounded-full bg-playful-primary/20 flex items-center justify-center group-hover:bg-playful-primary/30 transition-colors">
                  <Phone className="h-4 w-4 text-playful-primary" />
                </div>
                <span className="group-hover:text-playful-primary transition-colors font-medium">Contact Us</span>
              </Link>

              <Link href="/faq" className="flex items-center gap-3 p-3 rounded-lg hover:bg-playful-background/5 transition-all group">
                <div className="w-8 h-8 rounded-full bg-playful-accent/20 flex items-center justify-center group-hover:bg-playful-accent/30 transition-colors">
                  <span className="text-playful-accent text-sm font-bold">?</span>
                </div>
                <span className="group-hover:text-playful-primary transition-colors font-medium">FAQ</span>
              </Link>

              <Link href="/shipping" className="flex items-center gap-3 p-3 rounded-lg hover:bg-playful-background/5 transition-all group">
                <div className="w-8 h-8 rounded-full bg-playful-secondary/20 flex items-center justify-center group-hover:bg-playful-secondary/30 transition-colors">
                  <Truck className="h-4 w-4 text-playful-secondary" />
                </div>
                <span className="group-hover:text-playful-primary transition-colors font-medium">Shipping Info</span>
              </Link>

              <Link href="/returns" className="flex items-center gap-3 p-3 rounded-lg hover:bg-playful-background/5 transition-all group">
                <div className="w-8 h-8 rounded-full bg-playful-primary/20 flex items-center justify-center group-hover:bg-playful-primary/30 transition-colors">
                  <ArrowRight className="h-4 w-4 text-playful-primary transform rotate-180" />
                </div>
                <span className="group-hover:text-playful-primary transition-colors font-medium">Returns</span>
              </Link>

              <Link href="/terms" className="flex items-center gap-3 p-3 rounded-lg hover:bg-playful-background/5 transition-all group">
                <div className="w-8 h-8 rounded-full bg-playful-accent/20 flex items-center justify-center group-hover:bg-playful-accent/30 transition-colors">
                  <Shield className="h-4 w-4 text-playful-accent" />
                </div>
                <span className="group-hover:text-playful-primary transition-colors font-medium">Terms</span>
              </Link>

              <Link href="/privacy" className="flex items-center gap-3 p-3 rounded-lg hover:bg-playful-background/5 transition-all group">
                <div className="w-8 h-8 rounded-full bg-playful-secondary/20 flex items-center justify-center group-hover:bg-playful-secondary/30 transition-colors">
                  <Shield className="h-4 w-4 text-playful-secondary" />
                </div>
                <span className="group-hover:text-playful-primary transition-colors font-medium">Privacy Policy</span>
              </Link>
            </div>
          </div>

          {/* Enhanced Contact Info */}
          <div>
            <h4 className="text-xl font-bold mb-4 text-playful-accent flex items-center gap-2">
              <span>📱</span> Get in Touch
            </h4>
            <div className="space-y-5">
              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-playful-background/5 transition-colors group">
                <MapPin className="h-6 w-6 text-playful-primary mt-1 flex-shrink-0 group-hover:animate-bounce" />
                <div className="text-playful-background/80">
                  <div className="font-medium mb-1">Visit Our Store</div>
                  <div className="text-sm leading-relaxed">
                    C.P Complex, Agastiamuzhi,<br />
                    Mukkam, Kerala 673572
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-playful-background/5 transition-colors group">
                <Phone className="h-6 w-6 text-playful-secondary flex-shrink-0 group-hover:animate-ring" />
                <div>
                  <div className="font-medium text-playful-background/90">Call Us</div>
                  <a href="tel:7907943740" className="text-playful-background/80 hover:text-playful-accent transition-colors">
                    +91 7907943740
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-playful-background/5 transition-colors group">
                <Mail className="h-6 w-6 text-playful-accent flex-shrink-0 group-hover:animate-pulse" />
                <div>
                  <div className="font-medium text-playful-background/90">Email Us</div>
                  <a href="mailto:info@babysouk.in" className="text-playful-background/80 hover:text-playful-accent transition-colors">
                    info@babysouk.in
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-playful-background/5 transition-colors group">
                <Clock className="h-6 w-6 text-playful-primary mt-1 flex-shrink-0 group-hover:animate-spin" />
                <div className="text-playful-background/80">
                  <div className="font-medium mb-2 text-playful-background/90">Store Hours</div>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Mon - Sat:</span>
                      <span className="text-playful-accent font-medium">9 AM - 8 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday:</span>
                      <span className="text-playful-accent font-medium">10 AM - 6 PM</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Bottom section with CTA */}
        <div className="border-t border-playful-background/20 mt-12 pt-8">
          {/* Call to action bar */}
          <div className="bg-gradient-to-r from-playful-primary/10 to-playful-accent/10 rounded-xl p-6 mb-8 text-center">
            <h5 className="text-lg font-bold text-playful-primary mb-2">Ready to Shop for Your Little One?</h5>
            <p className="text-playful-background/80 text-sm mb-4">Discover our curated collection of safe, quality baby products.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/products"
                className="bg-playful-primary text-white px-6 py-2 rounded-full font-medium hover:bg-playful-primary/90 transition-all hover:scale-105 inline-flex items-center justify-center gap-2"
              >
                🛍️ Shop Now
              </Link>
              <Link
                href="/contact"
                className="border border-playful-primary text-playful-primary px-6 py-2 rounded-full font-medium hover:bg-playful-primary hover:text-white transition-all inline-flex items-center justify-center gap-2"
              >
                💬 Get Help
              </Link>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left flex-1">
              <p className="text-playful-background/70 flex items-center gap-2 justify-center md:justify-start">
                © {new Date().getFullYear()} Baby Souk. Made with <Heart className="h-4 w-4 text-red-400 fill-red-400 animate-pulse" /> for babies
              </p>
              <p className="text-playful-background/60 text-sm mt-1">
                All rights reserved. Licensed baby product retailer.
              </p>
            </div>

            {/* Enhanced Social proof */}
            <div className="flex flex-col sm:flex-row items-center gap-4 text-sm">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-playful-primary/10 px-3 py-1 rounded-full">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-playful-background/80 font-medium">1000+ Happy Families</span>
                </div>
                <div className="flex items-center gap-2 bg-yellow-400/10 px-3 py-1 rounded-full">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-playful-background/80 font-medium">4.8★ Rated</span>
                </div>
              </div>

              {/* Scroll to top button */}
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="bg-playful-accent/20 hover:bg-playful-accent/30 text-playful-accent p-2 rounded-full transition-all hover:scale-110 group"
                title="Scroll to top"
              >
                <ArrowRight className="h-4 w-4 transform -rotate-90 group-hover:animate-bounce" />
              </button>
            </div>
          </div>

          {/* Developer credit */}
          <div className="text-center mt-4 pt-4 border-t border-playful-background/10">
            <p className="text-playful-background/60 text-xs">
              Crafted with expertise by{" "}
              <a
                href="https://itsmekhan.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-playful-primary transition-colors font-medium"
              >
                itsmekhan.com
              </a>
              {" "}• Trusted web development partner
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;