import { MapPin, Phone, Mail, Clock, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-playful-foreground text-playful-background py-12 border-t-8 border-playful-primary mt-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Company Info */}
          <div className="space-y-4 animate-float">
            <h3 className="text-3xl font-bold text-playful-primary">
              Baby Souk
            </h3>
            <p className="text-playful-background/80">
              Your trusted partner in providing the best products for your little ones.
              Quality, safety, and love in every product.
            </p>
          </div>

          {/* New Quick Links */}
          <div>
            <h4 className="text-xl font-bold mb-4 text-playful-secondary">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link to="/contact" className="hover:text-playful-primary transition-transform hover:translate-x-1 inline-block">Contact Us</Link></li>
              <li><Link to="/terms" className="hover:text-playful-primary transition-transform hover:translate-x-1 inline-block">Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="hover:text-playful-primary transition-transform hover:translate-x-1 inline-block">Privacy Policy</Link></li>
              <li><Link to="/shipping" className="hover:text-playful-primary transition-transform hover:translate-x-1 inline-block">Shipping</Link></li>
              <li><Link to="/returns" className="hover:text-playful-primary transition-transform hover:translate-x-1 inline-block">Returns</Link></li>
              <li><Link to="/faq" className="hover:text-playful-primary transition-transform hover:translate-x-1 inline-block">FAQ</Link></li>
              <li><a href="/sitemap.xml" className="hover:text-playful-primary transition-transform hover:translate-x-1 inline-block">Sitemap</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xl font-bold mb-4 text-playful-accent">Get in Touch</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3 hover:animate-shake">
                <MapPin className="h-6 w-6 text-playful-primary mt-1 flex-shrink-0" />
                <span className="text-playful-background/80">
                  C.P Complex, Agastiamuzhi,<br />
                  Mukkam, Kerala 673572
                </span>
              </div>
              <div className="flex items-center gap-3 hover:animate-shake">
                <Phone className="h-6 w-6 text-playful-secondary flex-shrink-0" />
                <span className="text-playful-background/80">7907943740</span>
              </div>
              <div className="flex items-center gap-3 hover:animate-shake">
                <Mail className="h-6 w-6 text-playful-accent flex-shrink-0" />
                <span className="text-playful-background/80">info@babysouk.in</span>
              </div>
              <div className="flex items-start gap-3 hover:animate-shake">
                <Clock className="h-6 w-6 text-playful-primary mt-1 flex-shrink-0" />
                <div className="text-playful-background/80">
                  <div>Mon - Sat: 9 AM - 8 PM</div>
                  <div>Sunday: 10 AM - 6 PM</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-playful-background/20 mt-12 pt-8 text-center">
          <p className="text-playful-background/70">
            © {new Date().getFullYear()} Baby Souk. All rights reserved.
          </p>
          <p className="text-playful-background/70 text-sm mt-2">
            Designed & Developed by <a href="https://itsmekhan.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-playful-primary">itsmekhan.com</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;