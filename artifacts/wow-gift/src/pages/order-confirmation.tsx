import { useEffect, useState } from "react";
import { useParams, Link } from "wouter";
import { CheckCircle2, Package, ArrowRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";

export default function OrderConfirmation() {
  const { id } = useParams();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Confetti animation
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#ff69b4', '#8a2be2', '#ffd700']
      });
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#ff69b4', '#8a2be2', '#ffd700']
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <div className="container mx-auto px-4 py-24 min-h-[80vh] flex flex-col items-center justify-center text-center">
      <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center text-primary mb-8 relative neon-border animate-in zoom-in duration-500">
        <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
        <CheckCircle2 className="h-12 w-12 relative z-10" />
      </div>
      
      <h1 className="text-4xl md:text-5xl font-serif font-bold text-gradient mb-6 animate-in slide-in-from-bottom-4 fade-in duration-700">
        Order Confirmed!
      </h1>
      
      <div className="glass-panel p-8 rounded-3xl max-w-xl w-full border-primary/30 animate-in slide-in-from-bottom-8 fade-in duration-700 delay-150">
        <h2 className="text-2xl font-serif font-bold text-white mb-2">Your Gift is Being Prepared with Love</h2>
        <p className="text-muted-foreground mb-6">
          Thank you for choosing WOW Gift. We've received your order and our artisans will start working on your customized gift right away.
        </p>
        
        <div className="bg-background/50 border border-border/50 rounded-xl p-4 flex items-center justify-center gap-4 mb-8">
          <Package className="h-6 w-6 text-accent" />
          <div className="text-left">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Order Reference ID</p>
            <p className="font-mono font-bold text-lg text-white">#{id?.padStart(6, '0') || '000000'}</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/shop">
            <Button variant="outline" className="w-full sm:w-auto rounded-full border-primary/50 text-white hover:bg-primary/10">
              <ArrowRight className="mr-2 h-4 w-4" /> Continue Shopping
            </Button>
          </Link>
          <Link href="/">
            <Button className="w-full sm:w-auto rounded-full bg-primary hover:bg-primary/90 text-white shadow-[0_0_15px_rgba(255,105,180,0.5)]">
              <Home className="mr-2 h-4 w-4" /> Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
