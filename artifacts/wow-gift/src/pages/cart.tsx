import { useCart } from "@/lib/cart";
import { Link, useLocation } from "wouter";
import { Trash2, ArrowRight, ShoppingCart, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Cart() {
  const { items, removeFromCart, updateQuantity, totalItems, totalAmount } = useCart();
  const [, setLocation] = useLocation();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center min-h-[70vh] flex flex-col items-center justify-center">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
          <ShoppingCart className="h-12 w-12" />
        </div>
        <h1 className="text-3xl font-serif font-bold text-white mb-4">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">Looks like you haven't added any magical gifts to your cart yet. Let's find something special.</p>
        <Link href="/shop">
          <Button size="lg" className="bg-primary hover:bg-primary/90">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <h1 className="text-3xl md:text-5xl font-serif font-bold text-gradient mb-8">Your Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => (
            <div key={item.id} className="glass-panel p-4 md:p-6 rounded-2xl flex flex-col sm:flex-row gap-6 relative">
              <div className="w-full sm:w-32 aspect-square rounded-xl overflow-hidden shrink-0 border border-primary/20 bg-muted/30">
                <img 
                  src={item.product.imageUrl || ""} 
                  alt={item.product.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <Link href={`/product/${item.product.id}`}>
                    <h3 className="text-xl font-bold text-white hover:text-primary transition-colors">{item.product.name}</h3>
                  </Link>
                  <span className="text-xl font-bold text-primary">₹{item.product.price}</span>
                </div>
                
                <div className="text-sm text-muted-foreground mb-4 space-y-1">
                  {item.size && <p><span className="text-gray-400">Size:</span> {item.size}</p>}
                  {item.customText && <p><span className="text-gray-400">Text:</span> "{item.customText}"</p>}
                  {item.customImageUrl && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-gray-400">Custom Image Added</span>
                      <img src={item.customImageUrl} alt="" className="w-8 h-8 rounded bg-muted/50 object-cover border border-primary/20" />
                    </div>
                  )}
                </div>
                
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center border border-border/50 rounded-xl bg-background/50 h-10">
                    <button 
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="w-10 h-full flex items-center justify-center text-lg hover:text-primary transition-colors"
                    >-</button>
                    <div className="w-10 h-full flex items-center justify-center font-bold text-sm">{item.quantity}</div>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-10 h-full flex items-center justify-center text-lg hover:text-primary transition-colors"
                    >+</button>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => removeFromCart(item.id)}
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4 mr-2" /> Remove
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="lg:col-span-1">
          <div className="glass-panel p-6 rounded-2xl border-primary/20 sticky top-24">
            <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal ({totalItems} items)</span>
                <span>₹{totalAmount}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span className="text-accent">Free</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Tax</span>
                <span>Calculated at checkout</span>
              </div>
              
              <div className="border-t border-border/50 pt-4 flex justify-between items-center text-white font-bold text-lg">
                <span>Total</span>
                <span className="text-2xl text-primary drop-shadow-[0_0_5px_rgba(255,105,180,0.5)]">₹{totalAmount}</span>
              </div>
            </div>
            
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 mb-6 flex gap-3 text-sm">
              <Info className="h-5 w-5 text-primary shrink-0" />
              <p className="text-primary-foreground/80">
                You will be able to select your payment method (UPI or Cash on Delivery) in the next step.
              </p>
            </div>
            
            <Button 
              size="lg" 
              className="w-full h-14 text-lg rounded-xl bg-primary hover:bg-primary/90 text-white shadow-[0_0_20px_rgba(255,105,180,0.4)]"
              onClick={() => setLocation("/checkout")}
            >
              Proceed to Checkout <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <div className="mt-4 text-center">
              <Link href="/shop" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                or Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
