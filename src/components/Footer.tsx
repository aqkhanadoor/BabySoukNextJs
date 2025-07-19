import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
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

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-baby-pink">Quick Links</h4>
            <ul className="space-y-2">
              <li><Button variant="link" className="text-background/80 hover:text-baby-pink p-0 h-auto">Home</Button></li>
              <li><Button variant="link" className="text-background/80 hover:text-baby-pink p-0 h-auto">Toys</Button></li>
              <li><Button variant="link" className="text-background/80 hover:text-baby-pink p-0 h-auto">Clothing</Button></li>
              <li><Button variant="link" className="text-background/80 hover:text-baby-pink p-0 h-auto">Baby Care</Button></li>
              <li><Button variant="link" className="text-background/80 hover:text-baby-pink p-0 h-auto">Sale</Button></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-baby-blue">Customer Service</h4>
            <ul className="space-y-2">
              <li><Button variant="link" className="text-background/80 hover:text-baby-blue p-0 h-auto">Contact Us</Button></li>
              <li><Button variant="link" className="text-background/80 hover:text-baby-blue p-0 h-auto">Shipping Info</Button></li>
              <li><Button variant="link" className="text-background/80 hover:text-baby-blue p-0 h-auto">Returns</Button></li>
              <li><Button variant="link" className="text-background/80 hover:text-baby-blue p-0 h-auto">Size Guide</Button></li>
              <li><Button variant="link" className="text-background/80 hover:text-baby-blue p-0 h-auto">FAQs</Button></li>
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