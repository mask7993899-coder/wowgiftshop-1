import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ShoppingCart, Menu, X, Heart, Search, User, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop All" },
  { href: "/customize", label: "Customization Lab" },
  { href: "/track-order", label: "Track Order" },
];

export function Navbar() {
  const { totalItems } = useCart();
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
              <Heart className="h-6 w-6 text-primary sparkle" />
              <span className="font-serif text-2xl font-bold text-gradient">WOW Gift</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    location === link.href
                      ? "text-primary"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/admin">
              <Button variant="ghost" size="icon" className="hidden sm:inline-flex rounded-full text-muted-foreground hover:text-primary">
                <User className="h-5 w-5" />
              </Button>
            </Link>

            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative rounded-full text-muted-foreground hover:text-primary">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-full text-muted-foreground hover:text-primary"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <nav
            className="absolute top-16 left-0 right-0 bg-background/95 border-b border-border/60 shadow-2xl backdrop-blur-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <ul className="divide-y divide-border/40">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-6 py-4 text-base font-medium transition-colors ${
                      location === link.href
                        ? "text-primary bg-primary/5"
                        : "text-foreground hover:text-primary hover:bg-primary/5"
                    }`}
                  >
                    {link.label}
                    {link.href === "/track-order" && (
                      <Package className="h-4 w-4 ml-auto text-primary/60" />
                    )}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-6 py-4 text-base font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
                >
                  Admin
                  <User className="h-4 w-4 ml-auto text-primary/60" />
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </>
  );
}
