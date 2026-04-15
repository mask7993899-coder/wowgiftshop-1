import { Link } from "wouter";
import { Heart, Instagram, Facebook, MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-card/30 backdrop-blur-xl mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-primary" />
              <span className="font-serif text-2xl font-bold text-gradient">WOW Gift</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Create. Customize. Celebrate. Turn your memories into beautiful gifts that last a lifetime.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors neon-border">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors neon-border">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4 text-foreground">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/shop" className="text-muted-foreground hover:text-primary transition-colors">Shop All Gifts</Link></li>
              <li><Link href="/customize" className="text-muted-foreground hover:text-primary transition-colors">Customization Lab</Link></li>
              <li><Link href="/cart" className="text-muted-foreground hover:text-primary transition-colors">Your Cart</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4 text-foreground">Categories</h3>
            <ul className="space-y-2">
              <li><Link href="/shop?category=photo-frames" className="text-muted-foreground hover:text-primary transition-colors">Photo Frames</Link></li>
              <li><Link href="/shop?category=led-lamps" className="text-muted-foreground hover:text-primary transition-colors">LED Lamps</Link></li>
              <li><Link href="/shop?category=mugs" className="text-muted-foreground hover:text-primary transition-colors">Custom Mugs</Link></li>
              <li><Link href="/shop?category=couple-gifts" className="text-muted-foreground hover:text-primary transition-colors">Couple Gifts</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4 text-foreground">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0" />
                <span className="text-muted-foreground text-sm">Ravinder Nagar Colony<br />Nalgonda, Telangana, India</span>
              </li>
              <li className="flex gap-3 items-center">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <span className="text-muted-foreground text-sm">08919848394</span>
              </li>
              <li className="flex gap-3 items-center">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <span className="text-muted-foreground text-sm">hello@wowgift.in</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border/40 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} WOW Gift. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Shipping Info</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
