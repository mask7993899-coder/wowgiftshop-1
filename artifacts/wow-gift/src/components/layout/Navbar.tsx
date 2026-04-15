import { Link } from "wouter";
import { ShoppingCart, Menu, Heart, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";

export function Navbar() {
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary sparkle" />
            <span className="font-serif text-2xl font-bold text-gradient">WOW Gift</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">Home</Link>
            <Link href="/shop" className="text-sm font-medium hover:text-primary transition-colors">Shop All</Link>
            <Link href="/customize" className="text-sm font-medium hover:text-primary transition-colors">Customization Lab</Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="hidden sm:inline-flex rounded-full text-muted-foreground hover:text-primary">
            <Search className="h-5 w-5" />
          </Button>
          
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

          <Button variant="ghost" size="icon" className="md:hidden rounded-full">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
