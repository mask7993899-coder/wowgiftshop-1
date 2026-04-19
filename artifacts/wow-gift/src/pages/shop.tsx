import { useState } from "react";
import { useListProducts, useListCategories } from "@workspace/api-client-react";
import { Link, useLocation } from "wouter";
import { Search, Filter, Star, ShoppingCart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/lib/cart";
import { useToast } from "@/hooks/use-toast";
const frameImg = "/images/product-1.png";

export default function Shop() {
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState<number | undefined>();
  const { data: products, isLoading: productsLoading } = useListProducts({ categoryId, search: search.trim() || undefined });
  const { data: categories } = useListCategories();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    if (product.customizable) {
      setLocation(`/product/${product.id}`);
      return;
    }
    
    addToCart({
      product,
      quantity: 1,
    });
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-12 min-h-[calc(100vh-4rem)]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gradient mb-4">Our Collection</h1>
          <p className="text-muted-foreground max-w-xl">
            Browse our carefully curated selection of customized gifts. From premium photo frames to glowing neon signs.
          </p>
        </div>
        
        <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search gifts..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-card/50 border-primary/20 focus-visible:border-primary glass-panel"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filter */}
        <aside className="w-full lg:w-64 shrink-0 space-y-8">
          <div className="glass-panel p-6 rounded-2xl">
            <div className="flex items-center gap-2 mb-4 font-serif font-bold text-lg text-white">
              <Filter className="h-5 w-5 text-primary" />
              Categories
            </div>
            <div className="space-y-2">
              <button
                onClick={() => setCategoryId(undefined)}
                className={`w-full text-left px-4 py-2 rounded-xl transition-all ${
                  categoryId === undefined 
                    ? "bg-primary/20 text-primary border border-primary/50 neon-border" 
                    : "text-muted-foreground hover:bg-card/50 hover:text-white"
                }`}
              >
                All Gifts
              </button>
              {categories?.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategoryId(cat.id)}
                  className={`w-full text-left px-4 py-2 rounded-xl transition-all ${
                    categoryId === cat.id 
                      ? "bg-primary/20 text-primary border border-primary/50 neon-border" 
                      : "text-muted-foreground hover:bg-card/50 hover:text-white"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="flex-1">
          {productsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-[4/5] rounded-2xl" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              ))}
            </div>
          ) : products?.length === 0 ? (
            <div className="glass-panel rounded-2xl p-12 flex flex-col items-center justify-center text-center">
              <Search className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-xl font-bold mb-2">No products found</h3>
              <p className="text-muted-foreground mb-6">We couldn't find any gifts matching your search.</p>
              <Button variant="outline" onClick={() => { setSearch(""); setCategoryId(undefined); }} className="border-primary/50">
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products?.map((product) => (
                <Link key={product.id} href={`/product/${product.id}`}>
                  <div className="group glass-panel rounded-2xl p-4 transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(255,105,180,0.15)] hover:-translate-y-2 cursor-pointer h-full flex flex-col relative overflow-hidden">
                    {product.customizable && (
                      <div className="absolute top-6 left-6 z-20 bg-accent text-accent-foreground text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-md">
                        Customizable
                      </div>
                    )}
                    <div className="relative aspect-[4/5] rounded-xl overflow-hidden mb-4 bg-muted/30">
                      <img 
                        src={product.imageUrl || frameImg} 
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                        <Button 
                          className="bg-primary hover:bg-primary/90 text-white rounded-full translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-[0_0_15px_rgba(255,105,180,0.5)]"
                          onClick={(e) => handleAddToCart(e, product)}
                        >
                          {product.customizable ? "Customize Now" : "Add to Cart"}
                          <ShoppingCart className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                      <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1 text-xs font-medium z-20 border border-white/10">
                        <Star className="h-3 w-3 text-accent fill-accent" />
                        {product.rating || 5.0}
                      </div>
                    </div>
                    <div className="mt-auto">
                      <h3 className="text-lg font-medium text-white mb-2 line-clamp-2">{product.name}</h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold text-primary drop-shadow-[0_0_5px_rgba(255,105,180,0.5)]">₹{product.price}</span>
                          {product.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through">₹{product.originalPrice}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
