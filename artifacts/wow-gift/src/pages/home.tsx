import { useListProducts, useListCategories } from "@workspace/api-client-react";
import { Link } from "wouter";
import { ArrowRight, Sparkles, Star, ShieldCheck, HeartHandshake, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import heroBg from "@/assets/images/hero-bg.png";
import frameImg from "@/assets/images/product-frame.png";
import mugImg from "@/assets/images/product-mug.png";
import ledImg from "@/assets/images/product-led.png";
import coupleImg from "@/assets/images/product-couple.png";

export default function Home() {
  const { data: featuredProducts, isLoading: productsLoading } = useListProducts({ featured: true });
  const { data: categories, isLoading: categoriesLoading } = useListCategories();

  const categoryImages: Record<string, string> = {
    'photo-frames': frameImg,
    'mugs': mugImg,
    'led-lamps': ledImg,
    'couple-gifts': coupleImg,
  };

  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroBg} 
            alt="Magical gift universe" 
            className="w-full h-full object-cover opacity-60 mix-blend-screen"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>
        
        <div className="container relative z-10 px-4 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium tracking-wide uppercase">Create. Customize. Celebrate.</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150 max-w-4xl">
            Turn Your Memories Into <span className="text-gradient">Beautiful Gifts</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            Step into our magical boutique of personalized treasures. From glowing photo frames to custom couple gifts, we craft emotions into reality.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
            <Link href="/shop">
              <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-primary hover:bg-primary/90 text-white shadow-[0_0_20px_rgba(255,105,180,0.5)] transition-all hover:shadow-[0_0_30px_rgba(255,105,180,0.8)] hover:scale-105">
                Explore Gifts
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/customize">
              <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full border-primary/50 text-white hover:bg-primary/10 glass-panel">
                Customization Lab
              </Button>
            </Link>
          </div>
        </div>

        {/* Floating elements */}
        <img src={frameImg} alt="" className="absolute top-1/4 left-[10%] w-32 h-32 object-cover rounded-xl border border-primary/30 shadow-lg floating hidden lg:block opacity-60 mix-blend-screen blur-[1px]" />
        <img src={mugImg} alt="" className="absolute bottom-1/4 right-[10%] w-40 h-40 object-cover rounded-full border border-secondary/30 shadow-lg floating-delayed hidden lg:block opacity-60 mix-blend-screen blur-[1px]" />
      </section>

      {/* Categories Section */}
      <section className="py-24 container px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4">Shop by Category</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Find the perfect personalized gift for every occasion.</p>
        </div>

        {categoriesLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="aspect-square rounded-2xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories?.map((category) => (
              <Link key={category.id} href={`/shop?category=${category.id}`}>
                <div className="group relative aspect-square rounded-2xl overflow-hidden glass-panel glass-panel-hover cursor-pointer border border-border/50">
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent z-10" />
                  <img 
                    src={categoryImages[category.slug] || frameImg} 
                    alt={category.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors">{category.name}</h3>
                    <p className="text-sm text-gray-300 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                      Explore collection <ArrowRight className="inline h-4 w-4 ml-1" />
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-card/10 border-y border-border/40 relative">
        <div className="container px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4">Trending Now</h2>
              <p className="text-muted-foreground">Our most loved customized gifts this week.</p>
            </div>
            <Link href="/shop" className="hidden md:flex items-center text-primary hover:text-white transition-colors">
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          {productsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-[4/5] rounded-2xl" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts?.slice(0, 4).map((product) => (
                <Link key={product.id} href={`/product/${product.id}`}>
                  <div className="group glass-panel rounded-2xl p-4 transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(255,105,180,0.15)] hover:-translate-y-2 cursor-pointer h-full flex flex-col">
                    <div className="relative aspect-[4/5] rounded-xl overflow-hidden mb-4 bg-muted/30">
                      <img 
                        src={product.imageUrl || frameImg} 
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1 text-xs font-medium">
                        <Star className="h-3 w-3 text-accent fill-accent" />
                        {product.rating || 5.0}
                      </div>
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2 line-clamp-2">{product.name}</h3>
                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-xl font-bold text-primary">₹{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">₹{product.originalPrice}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          
          <div className="mt-8 flex justify-center md:hidden">
            <Link href="/shop">
              <Button variant="outline" className="rounded-full border-primary/50 text-primary">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust & Features */}
      <section className="py-24 container px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-panel p-8 rounded-3xl text-center flex flex-col items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
              <HeartHandshake className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-serif font-bold">Crafted With Love</h3>
            <p className="text-muted-foreground">Every gift is personalized with care and attention to detail to make your moments special.</p>
          </div>
          <div className="glass-panel p-8 rounded-3xl text-center flex flex-col items-center gap-4 border-primary/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
            <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-2 relative z-10 neon-border">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-serif font-bold relative z-10 text-gradient">Premium Quality</h3>
            <p className="text-muted-foreground relative z-10">We use only the finest materials, glass, and LEDs to ensure your gift lasts a lifetime.</p>
          </div>
          <div className="glass-panel p-8 rounded-3xl text-center flex flex-col items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-secondary/10 flex items-center justify-center text-secondary mb-2">
              <Truck className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-serif font-bold">Safe Delivery</h3>
            <p className="text-muted-foreground">Secure packaging and reliable shipping across India. Your precious memories arrive safely.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
