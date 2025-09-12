import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold bg-gradient-rainbow bg-clip-text text-transparent">
              Baby Souk
            </h3>
            <p className="text-background/80">
              Your trusted partner in providing the best products for your little ones.
              Quality, safety, and love in every product.
            </p>
          </div>

          {/* New Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-baby-pink">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/contact" className="hover:text-baby-pink transition-colors text-background/80">Contact Us</Link></li>
              <li><Link to="/terms" className="hover:text-baby-pink transition-colors text-background/80">Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="hover:text-baby-pink transition-colors text-background/80">Privacy Policy</Link></li>
              <li><Link to="/shipping" className="hover:text-baby-pink transition-colors text-background/80">Shipping & Delivery Policy</Link></li>
              <li><Link to="/returns" className="hover:text-baby-pink transition-colors text-background/80">Return & Refund Policy</Link></li>
              <li><Link to="/cancellation" className="hover:text-baby-pink transition-colors text-background/80">Cancellation & Refund Policy</Link></li>
              <li><Link to="/faq" className="hover:text-baby-pink transition-colors text-background/80">FAQ</Link></li>
              <li><a href="/sitemap.xml" className="hover:text-baby-pink transition-colors text-background/80">Sitemap</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-baby-yellow">Get in Touch</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-baby-pink mt-0.5 flex-shrink-0" />
                <span className="text-background/80 text-sm">
                  C.P Complex, Agastiamuzhi,<br />
                  Mukkam, Kerala 673572
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-baby-blue flex-shrink-0" />
                <span className="text-background/80">7907943740</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-baby-green flex-shrink-0" />
                <span className="text-background/80">info@babysouk.in</span>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-baby-orange mt-0.5 flex-shrink-0" />
                <div className="text-background/80 text-sm">
                  <div>Mon - Sat: 9:00 AM - 8:00 PM</div>
                  <div>Sunday: 10:00 AM - 6:00 PM</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-background/20 mt-8 pt-8 text-center">
          <p className="text-background/60 text-sm">
            © 2024 Baby Souk. All rights reserved. Made with 💜 for your little ones.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;