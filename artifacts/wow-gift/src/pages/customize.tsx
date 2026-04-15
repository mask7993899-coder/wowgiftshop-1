import { useState, useRef } from "react";
import { Link, useLocation } from "wouter";
import { useListProducts } from "@workspace/api-client-react";
import { Upload, Type, MousePointer2, Save, ShoppingCart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/lib/cart";
import { Skeleton } from "@/components/ui/skeleton";

export default function CustomizeLab() {
  const { data: products, isLoading } = useListProducts({ customizable: true });
  const customizableProducts = products?.filter(p => p.customizable) || [];
  
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [customText, setCustomText] = useState("Your Custom Text");
  const [fontFamily, setFontFamily] = useState("font-serif");
  const [textColor, setTextColor] = useState("#ffffff");
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  
  const previewRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { addToCart } = useCart();
  const [, setLocation] = useLocation();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomImage(url);
    }
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !previewRef.current) return;
    
    const rect = previewRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    
    setPosition({ x, y });
  };

  const activeProduct = customizableProducts.find(p => p.id === selectedProduct) || customizableProducts[0];

  const handleSaveAndAdd = () => {
    if (!activeProduct) return;
    
    addToCart({
      product: activeProduct,
      quantity: 1,
      customText,
      customImageUrl: customImage || undefined,
    });
    
    toast({
      title: "Design Saved!",
      description: "Your customized gift has been added to cart.",
    });
    
    setLocation("/cart");
  };

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/30 text-secondary mb-4">
          <Sparkles className="h-4 w-4" />
          <span className="text-sm font-medium tracking-wide uppercase">Customization Lab</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">Design Your Masterpiece</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Mix, match, and preview your personalized gifts in real-time. Drag your text and images to position them perfectly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Tools Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel p-6 rounded-3xl border-primary/20 space-y-6">
            <h3 className="font-bold text-lg border-b border-border/50 pb-4">1. Select Base Product</h3>
            
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-16 w-full rounded-xl" />
                <Skeleton className="h-16 w-full rounded-xl" />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {customizableProducts.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProduct(p.id)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                      (selectedProduct === p.id || (!selectedProduct && p.id === customizableProducts[0]?.id))
                        ? "bg-primary/20 border-primary text-white neon-border" 
                        : "bg-background/50 border-border/50 text-muted-foreground hover:border-primary/50"
                    }`}
                  >
                    <img src={p.imageUrl || ""} alt="" className="w-12 h-12 object-cover rounded-lg" />
                    <span className="text-xs font-medium text-center line-clamp-1">{p.name}</span>
                  </button>
                ))}
              </div>
            )}

            <h3 className="font-bold text-lg border-b border-border/50 pb-4 pt-4">2. Add Content</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2"><Type className="h-4 w-4 text-primary" /> Custom Text</Label>
                <Input 
                  value={customText} 
                  onChange={(e) => setCustomText(e.target.value)} 
                  className="bg-background/50 border-primary/20 focus-visible:border-primary"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Font Style</Label>
                  <select 
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <option value="font-serif">Serif (Elegant)</option>
                    <option value="font-sans">Sans (Modern)</option>
                    <option value="font-mono">Mono (Tech)</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label>Text Color</Label>
                  <div className="flex gap-2 h-10 items-center">
                    <input 
                      type="color" 
                      value={textColor} 
                      onChange={(e) => setTextColor(e.target.value)}
                      className="h-8 w-8 rounded cursor-pointer bg-transparent border-0 p-0"
                    />
                    <span className="text-sm text-muted-foreground uppercase">{textColor}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <Label className="flex items-center gap-2"><Upload className="h-4 w-4 text-secondary" /> Center Image</Label>
                <div className="border-2 border-dashed border-primary/30 rounded-xl p-4 text-center hover:bg-primary/5 hover:border-primary/50 transition-colors cursor-pointer relative">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center gap-1 text-muted-foreground">
                    <span className="text-sm font-medium">Click to upload photo</span>
                  </div>
                </div>
                {customImage && (
                  <Button variant="ghost" size="sm" onClick={() => setCustomImage(null)} className="w-full text-destructive mt-2">
                    Remove Image
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          <div className="glass-panel p-6 rounded-3xl border-primary/20">
            <div className="flex justify-between items-center mb-4">
              <span className="text-muted-foreground">Base Price:</span>
              <span className="text-xl font-bold text-white">₹{activeProduct?.price || 0}</span>
            </div>
            <Button 
              size="lg" 
              className="w-full h-14 text-lg rounded-xl bg-primary hover:bg-primary/90 text-white shadow-[0_0_20px_rgba(255,105,180,0.4)]"
              onClick={handleSaveAndAdd}
              disabled={!activeProduct}
            >
              <Save className="mr-2 h-5 w-5" /> Save & Add to Cart
            </Button>
          </div>
        </div>

        {/* Live Preview Panel */}
        <div className="lg:col-span-8">
          <div className="glass-panel rounded-3xl p-4 md:p-8 h-full min-h-[600px] flex flex-col relative border-primary/30 shadow-[0_0_30px_rgba(138,43,226,0.15)]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-serif font-bold text-white flex items-center gap-2">
                Live Preview <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              </h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-background/50 px-3 py-1 rounded-full">
                <MousePointer2 className="h-4 w-4" /> Drag text to position
              </div>
            </div>
            
            <div 
              ref={previewRef}
              className="flex-1 relative rounded-2xl overflow-hidden bg-black/40 border border-white/5 cursor-crosshair"
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {/* Base Product Image */}
              {activeProduct ? (
                <img 
                  src={activeProduct.imageUrl || ""} 
                  alt="Base product" 
                  className="w-full h-full object-contain p-8 opacity-80"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  Select a product to start customizing
                </div>
              )}
              
              {/* Uploaded Image Overlay */}
              {customImage && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 max-w-[300px] aspect-square rounded-2xl overflow-hidden border-4 border-white/20 shadow-[0_0_30px_rgba(255,105,180,0.3)] z-10 pointer-events-none">
                  <img src={customImage} alt="Custom" className="w-full h-full object-cover" />
                </div>
              )}
              
              {/* Draggable Text Overlay */}
              {customText && (
                <div 
                  className="absolute cursor-move z-20 select-none hover:border-2 hover:border-dashed hover:border-primary/50 p-2 rounded transform -translate-x-1/2 -translate-y-1/2"
                  style={{ 
                    left: `${position.x}%`, 
                    top: `${position.y}%`,
                    transition: isDragging ? 'none' : 'all 0.1s ease'
                  }}
                  onMouseDown={handleMouseDown}
                >
                  <div 
                    className={`text-3xl md:text-5xl font-bold ${fontFamily} text-center whitespace-nowrap`}
                    style={{ 
                      color: textColor,
                      textShadow: '0 4px 20px rgba(0,0,0,0.8), 0 0 10px rgba(255,255,255,0.3)'
                    }}
                  >
                    {customText}
                  </div>
                </div>
              )}
              
              {/* Decorative Effects */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-secondary/10 pointer-events-none mix-blend-overlay" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
