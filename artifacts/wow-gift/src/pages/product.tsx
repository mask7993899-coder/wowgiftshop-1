import { useState } from "react";
import { useGetProduct, useListReviews, useCreateReview, getGetProductQueryKey, getListReviewsQueryKey } from "@workspace/api-client-react";
import { useParams, useLocation } from "wouter";
import { ArrowLeft, Star, ShoppingCart, Upload, Type, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/lib/cart";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export default function ProductDetail() {
  const { id } = useParams();
  const productId = parseInt(id || "0", 10);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { addToCart } = useCart();
  const queryClient = useQueryClient();

  const { data: product, isLoading } = useGetProduct(productId, { 
    query: { enabled: !!productId, queryKey: getGetProductQueryKey(productId) } 
  });
  
  const { data: reviews, isLoading: reviewsLoading } = useListReviews({ productId }, {
    query: { enabled: !!productId, queryKey: getListReviewsQueryKey({ productId }) }
  });

  const createReview = useCreateReview();

  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState<string>("");
  const [customText, setCustomText] = useState("");
  const [customImage, setCustomImage] = useState<string>("");
  
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  const handleAddToCart = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (!product) return;

    if (product.customizable && product.sizes?.length && !size) {
      toast({
        title: "Select a size",
        description: "Please select a size before adding to cart",
        variant: "destructive"
      });
      return;
    }

    addToCart({
      product,
      quantity,
      size: size || undefined,
      customText: customText || undefined,
      customImageUrl: customImage || undefined
    });

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleBuyNow = () => {
    if (!product) return;
    
    if (product.customizable && product.sizes?.length && !size) {
      toast({
        title: "Select a size",
        description: "Please select a size before checking out",
        variant: "destructive"
      });
      return;
    }

    addToCart({
      product,
      quantity,
      size: size || undefined,
      customText: customText || undefined,
      customImageUrl: customImage || undefined
    });
    
    setLocation("/cart");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a local blob URL for preview
      const url = URL.createObjectURL(file);
      setCustomImage(url);
    }
  };

  const submitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || reviewRating < 1 || reviewRating > 5) return;

    createReview.mutate({
      data: {
        productId,
        customerName: reviewName,
        rating: reviewRating,
        comment: reviewComment || undefined
      }
    }, {
      onSuccess: () => {
        toast({
          title: "Review submitted",
          description: "Thank you for your feedback!"
        });
        setReviewName("");
        setReviewComment("");
        setReviewRating(5);
        queryClient.invalidateQueries({ queryKey: getListReviewsQueryKey({ productId }) });
      }
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 min-h-screen">
        <Skeleton className="h-8 w-24 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Skeleton className="aspect-square rounded-3xl" />
          <div className="space-y-6">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-24 text-center min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl font-serif font-bold mb-4">Product Not Found</h1>
        <p className="text-muted-foreground mb-8">The magical gift you're looking for doesn't exist.</p>
        <Button onClick={() => setLocation("/shop")} className="bg-primary text-white">Back to Shop</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <button 
        onClick={() => window.history.back()} 
        className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
        {/* Images & Preview */}
        <div className="space-y-6">
          <div className="glass-panel rounded-3xl overflow-hidden aspect-square relative border-primary/20 neon-border p-2">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent z-0 pointer-events-none" />
            <div className="relative w-full h-full rounded-2xl overflow-hidden bg-background/50">
              <img 
                src={product.imageUrl || ""} 
                alt={product.name}
                className="w-full h-full object-cover relative z-10"
              />
              
              {/* Customization Overlay */}
              {product.customizable && (customImage || customText) && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] p-8 animate-in fade-in">
                  {customImage && (
                    <div className="w-48 h-48 rounded-xl overflow-hidden border-2 border-primary shadow-[0_0_20px_rgba(255,105,180,0.5)] mb-4">
                      <img src={customImage} alt="Custom upload" className="w-full h-full object-cover" />
                    </div>
                  )}
                  {customText && (
                    <div className="text-3xl font-serif font-bold text-white text-center drop-shadow-[0_0_10px_rgba(255,105,180,0.8)]">
                      {customText}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {product.customizable && (
              <div className="absolute top-6 left-6 z-30 bg-accent text-accent-foreground text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1">
                <Heart className="h-3 w-3 fill-current" /> Customizable
              </div>
            )}
          </div>
          
          {product.images && product.images.length > 0 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              <button className="shrink-0 w-24 h-24 rounded-xl border-2 border-primary overflow-hidden">
                <img src={product.imageUrl || ""} alt="" className="w-full h-full object-cover" />
              </button>
              {product.images.map((img, i) => (
                <button key={i} className="shrink-0 w-24 h-24 rounded-xl border border-border/50 overflow-hidden hover:border-primary/50 transition-colors">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info & Actions */}
        <div className="flex flex-col">
          <div className="mb-2 flex items-center gap-2">
            <div className="flex items-center text-accent">
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4 fill-current opacity-50" />
            </div>
            <span className="text-muted-foreground text-sm">({product.reviewCount || 0} reviews)</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4 leading-tight">
            {product.name}
          </h1>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl font-bold text-primary drop-shadow-[0_0_8px_rgba(255,105,180,0.4)]">
              ₹{product.price}
            </span>
            {product.originalPrice && (
              <span className="text-xl text-muted-foreground line-through">₹{product.originalPrice}</span>
            )}
            {product.inStock ? (
              <span className="ml-auto bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1 rounded-full text-xs font-medium">In Stock</span>
            ) : (
              <span className="ml-auto bg-destructive/20 text-destructive border border-destructive/30 px-3 py-1 rounded-full text-xs font-medium">Out of Stock</span>
            )}
          </div>

          <p className="text-muted-foreground mb-8 leading-relaxed">
            {product.description || "A magical, personalized gift crafted with love and care to make your special moments unforgettable."}
          </p>

          {/* Customization Form */}
          {product.customizable && (
            <div className="glass-panel p-6 rounded-2xl border-primary/20 mb-8 space-y-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent" />
              <h3 className="font-serif font-bold text-xl flex items-center gap-2">
                <SparklesIcon /> Personalize Your Gift
              </h3>
              
              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-3">
                  <Label>Select Size</Label>
                  <div className="flex flex-wrap gap-3">
                    {product.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSize(s)}
                        className={`px-4 py-2 rounded-xl border transition-all ${
                          size === s 
                            ? "bg-primary text-white border-primary shadow-[0_0_10px_rgba(255,105,180,0.4)]" 
                            : "bg-background/50 border-border/50 text-muted-foreground hover:border-primary/50"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <Label className="flex items-center gap-2"><Type className="h-4 w-4 text-primary" /> Custom Text</Label>
                <Input 
                  placeholder="Enter names, dates, or a short message..." 
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  className="bg-background/50 border-primary/20 focus-visible:border-primary"
                />
              </div>

              <div className="space-y-3">
                <Label className="flex items-center gap-2"><Upload className="h-4 w-4 text-secondary" /> Upload Photo</Label>
                <div className="border-2 border-dashed border-primary/30 rounded-xl p-6 text-center hover:bg-primary/5 hover:border-primary/50 transition-colors cursor-pointer relative">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Upload className="h-6 w-6 text-primary" />
                    <span className="text-sm font-medium">Click or drag an image here</span>
                    <span className="text-xs opacity-70">PNG, JPG up to 10MB</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-auto">
            <div className="flex items-center border border-border/50 rounded-xl glass-panel w-fit shrink-0">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-12 h-12 flex items-center justify-center text-xl font-medium hover:text-primary transition-colors"
              >-</button>
              <div className="w-12 h-12 flex items-center justify-center font-bold">{quantity}</div>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-12 h-12 flex items-center justify-center text-xl font-medium hover:text-primary transition-colors"
              >+</button>
            </div>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="h-12 flex-1 rounded-xl border-primary/50 text-white hover:bg-primary/10 glass-panel"
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
            </Button>
            
            <Button 
              size="lg" 
              className="h-12 flex-1 rounded-xl bg-primary hover:bg-primary/90 text-white shadow-[0_0_20px_rgba(255,105,180,0.4)] hover:shadow-[0_0_30px_rgba(255,105,180,0.6)] hover:scale-[1.02] transition-all"
              onClick={handleBuyNow}
              disabled={!product.inStock}
            >
              Buy Now
            </Button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="border-t border-border/40 pt-16">
        <div className="flex flex-col md:flex-row gap-12">
          <div className="w-full md:w-1/3">
            <h2 className="text-3xl font-serif font-bold mb-4">Customer Reviews</h2>
            <div className="flex items-center gap-4 mb-6">
              <div className="text-5xl font-bold text-white">{product.rating || "5.0"}</div>
              <div className="flex flex-col">
                <div className="flex text-accent">
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current opacity-50" />
                </div>
                <span className="text-muted-foreground text-sm">Based on {product.reviewCount || 0} reviews</span>
              </div>
            </div>
            
            <div className="glass-panel p-6 rounded-2xl">
              <h3 className="font-bold mb-4 text-lg">Write a Review</h3>
              <form onSubmit={submitReview} className="space-y-4">
                <div>
                  <Label>Name</Label>
                  <Input 
                    value={reviewName} 
                    onChange={e => setReviewName(e.target.value)} 
                    placeholder="Your name" 
                    className="bg-background/50 mt-1" 
                    required
                  />
                </div>
                <div>
                  <Label>Rating (1-5)</Label>
                  <Input 
                    type="number" 
                    min="1" 
                    max="5" 
                    value={reviewRating} 
                    onChange={e => setReviewRating(Number(e.target.value))} 
                    className="bg-background/50 mt-1" 
                    required
                  />
                </div>
                <div>
                  <Label>Comment</Label>
                  <textarea 
                    value={reviewComment} 
                    onChange={e => setReviewComment(e.target.value)} 
                    className="w-full h-24 rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 mt-1" 
                    placeholder="Share your experience..."
                  />
                </div>
                <Button type="submit" disabled={createReview.isPending} className="w-full">
                  {createReview.isPending ? "Submitting..." : "Submit Review"}
                </Button>
              </form>
            </div>
          </div>
          
          <div className="w-full md:w-2/3 space-y-6">
            {reviewsLoading ? (
              [1, 2].map(i => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)
            ) : reviews?.length === 0 ? (
              <div className="text-center py-12 border border-border/50 rounded-2xl border-dashed">
                <p className="text-muted-foreground">No reviews yet. Be the first to review this magical gift!</p>
              </div>
            ) : (
              reviews?.map(review => (
                <div key={review.id} className="glass-panel p-6 rounded-2xl relative">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary border border-primary/30">
                      {review.customerName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-white">{review.customerName}</div>
                      <div className="flex text-accent h-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`h-3 w-3 ${i < review.rating ? "fill-current" : "opacity-30"}`} />
                        ))}
                      </div>
                    </div>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : "Recent"}
                    </span>
                  </div>
                  <p className="text-gray-300">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SparklesIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary sparkle">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
    </svg>
  );
}
