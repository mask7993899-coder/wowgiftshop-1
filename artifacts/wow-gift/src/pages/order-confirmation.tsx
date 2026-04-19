import { useEffect, useState } from "react";
import { useParams, Link } from "wouter";
import { CheckCircle2, Package, ArrowRight, Home, MessageCircle, Calendar, Phone, MapPin, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";
import { useGetOrder, getGetOrderQueryKey } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";

const SHOP_WHATSAPP = "918919848394";

function buildWhatsAppMessage(order: any) {
  const date = order.createdAt
    ? new Date(order.createdAt).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : new Date().toLocaleString("en-IN");

  const itemLines = (order.items || [])
    .map((item: any) => {
      let line = `  • ${item.productName} x${item.quantity} — ₹${item.price * item.quantity}`;
      if (item.size) line += ` (Size: ${item.size})`;
      if (item.customText) line += `\n    Custom text: "${item.customText}"`;
      return line;
    })
    .join("\n");

  return encodeURIComponent(
    `🎁 *New Order from WOW Gift Shop*\n\n` +
    `*Order ID:* #${String(order.id).padStart(6, "0")}\n` +
    `*Date:* ${date}\n\n` +
    `*Customer Details:*\n` +
    `  Name: ${order.customerName}\n` +
    `  Phone: ${order.customerPhone}\n` +
    `  Address: ${order.customerAddress}, ${order.pincode}\n\n` +
    `*Items Ordered:*\n${itemLines}\n\n` +
    `*Total Amount:* ₹${order.totalAmount}\n` +
    `*Payment:* ${order.paymentMethod === "cod" ? "Cash on Delivery" : "UPI / Online"}\n\n` +
    `Please confirm and prepare the order. Thank you! 🙏`
  );
}

export default function OrderConfirmation() {
  const { id } = useParams();
  const orderId = parseInt(id || "0", 10);
  const [mounted, setMounted] = useState(false);
  const [whatsappOpened, setWhatsappOpened] = useState(false);

  const { data: order, isLoading } = useGetOrder(orderId, {
    query: { enabled: !!orderId, queryKey: getGetOrderQueryKey(orderId) },
  });

  useEffect(() => {
    setMounted(true);

    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ["#ff69b4", "#8a2be2", "#ffd700"],
      });
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ["#ff69b4", "#8a2be2", "#ffd700"],
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (order && !whatsappOpened) {
      setWhatsappOpened(true);
      const msg = buildWhatsAppMessage(order);
      const url = `https://wa.me/${SHOP_WHATSAPP}?text=${msg}`;
      setTimeout(() => window.open(url, "_blank"), 1500);
    }
  }, [order, whatsappOpened]);

  if (!mounted) return null;

  const orderDate = order?.createdAt
    ? new Date(order.createdAt).toLocaleString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  const handleWhatsApp = () => {
    if (!order) return;
    const msg = buildWhatsAppMessage(order);
    window.open(`https://wa.me/${SHOP_WHATSAPP}?text=${msg}`, "_blank");
  };

  return (
    <div className="container mx-auto px-4 py-16 min-h-[80vh] flex flex-col items-center justify-center text-center">
      <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center text-primary mb-8 relative neon-border animate-in zoom-in duration-500">
        <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
        <CheckCircle2 className="h-12 w-12 relative z-10" />
      </div>

      <h1 className="text-4xl md:text-5xl font-serif font-bold text-gradient mb-4 animate-in slide-in-from-bottom-4 fade-in duration-700">
        Order Confirmed!
      </h1>
      <p className="text-muted-foreground mb-8 animate-in fade-in duration-700 delay-100">
        Your gift is being prepared with love
      </p>

      <div className="glass-panel p-6 md:p-8 rounded-3xl max-w-lg w-full border-primary/30 animate-in slide-in-from-bottom-8 fade-in duration-700 delay-150 space-y-6">

        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-6 w-1/2 mx-auto" />
            <Skeleton className="h-4 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-2/3 mx-auto" />
          </div>
        ) : order ? (
          <>
            <div className="bg-background/50 border border-border/50 rounded-xl p-4 flex items-center justify-center gap-4">
              <Package className="h-6 w-6 text-accent shrink-0" />
              <div className="text-left">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Order ID</p>
                <p className="font-mono font-bold text-xl text-white">#{String(order.id).padStart(6, "0")}</p>
              </div>
            </div>

            {orderDate && (
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 text-primary" />
                <span>{orderDate}</span>
              </div>
            )}

            <div className="text-left space-y-3 border-t border-border/40 pt-4">
              <div className="flex items-start gap-3 text-sm">
                <Phone className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span className="text-white">{order.customerName} — {order.customerPhone}</span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="h-4 w-4 text-secondary mt-0.5 shrink-0" />
                <span className="text-muted-foreground">{order.customerAddress}, {order.pincode}</span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <CreditCard className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  {order.paymentMethod === "cod" ? "Cash on Delivery" : "UPI / Online Payment"}
                </span>
              </div>
            </div>

            {order.items && order.items.length > 0 && (
              <div className="border-t border-border/40 pt-4 text-left space-y-2">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Items</p>
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-white">{item.productName} <span className="text-muted-foreground">×{item.quantity}</span></span>
                    <span className="text-primary font-bold">₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                  </div>
                ))}
                <div className="border-t border-border/40 pt-2 flex justify-between font-bold">
                  <span className="text-white">Total</span>
                  <span className="text-primary text-lg">₹{Number(order.totalAmount).toLocaleString("en-IN")}</span>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-background/50 border border-border/50 rounded-xl p-4 flex items-center justify-center gap-4">
            <Package className="h-6 w-6 text-accent" />
            <div className="text-left">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Order ID</p>
              <p className="font-mono font-bold text-xl text-white">#{id?.padStart(6, "0") || "000000"}</p>
            </div>
          </div>
        )}

        <div className="border-t border-border/40 pt-4 space-y-3">
          <p className="text-sm text-muted-foreground">
            Order details are being sent to our WhatsApp for quick processing.
          </p>

          <Button
            onClick={handleWhatsApp}
            className="w-full h-12 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold shadow-[0_0_15px_rgba(34,197,94,0.3)] hover:shadow-[0_0_25px_rgba(34,197,94,0.5)] transition-all"
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            Send Order to WhatsApp
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link href="/shop" className="flex-1">
            <Button variant="outline" className="w-full rounded-xl border-primary/50 text-white hover:bg-primary/10">
              <ArrowRight className="mr-2 h-4 w-4" /> Shop More
            </Button>
          </Link>
          <Link href="/" className="flex-1">
            <Button className="w-full rounded-xl bg-primary hover:bg-primary/90 text-white shadow-[0_0_15px_rgba(255,105,180,0.4)]">
              <Home className="mr-2 h-4 w-4" /> Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
