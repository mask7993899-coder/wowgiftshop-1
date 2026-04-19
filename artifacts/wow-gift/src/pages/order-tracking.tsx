import { useState } from "react";
import { Link } from "wouter";
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  ChevronRight,
  Home,
  Phone,
  Hash,
  MapPin,
  CreditCard,
  Calendar,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getApiBaseUrl } from "@/lib/utils";

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; icon: React.ElementType; step: number }
> = {
  pending: { label: "Order Placed", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", icon: Clock, step: 1 },
  confirmed: { label: "Confirmed", color: "bg-blue-500/20 text-blue-400 border-blue-500/30", icon: CheckCircle2, step: 2 },
  shipped: { label: "Shipped", color: "bg-purple-500/20 text-purple-400 border-purple-500/30", icon: Truck, step: 3 },
  delivered: { label: "Delivered", color: "bg-green-500/20 text-green-400 border-green-500/30", icon: CheckCircle2, step: 4 },
  cancelled: { label: "Cancelled", color: "bg-red-500/20 text-red-400 border-red-500/30", icon: XCircle, step: 0 },
};

const STEPS = [
  { label: "Placed", icon: ShoppingBag },
  { label: "Confirmed", icon: CheckCircle2 },
  { label: "Shipped", icon: Truck },
  { label: "Delivered", icon: Package },
];

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${cfg.color}`}>
      <Icon className="h-3.5 w-3.5" />
      {cfg.label}
    </span>
  );
}

function TrackingTimeline({ status }: { status: string }) {
  const currentStep = STATUS_CONFIG[status]?.step ?? 1;
  if (status === "cancelled") {
    return (
      <div className="flex items-center gap-2 text-red-400 text-sm">
        <XCircle className="h-4 w-4" />
        This order was cancelled.
      </div>
    );
  }
  return (
    <div className="flex items-center w-full gap-0">
      {STEPS.map((step, i) => {
        const done = currentStep > i + 1;
        const active = currentStep === i + 1;
        const Icon = step.icon;
        return (
          <div key={step.label} className="flex-1 flex flex-col items-center">
            <div className="flex items-center w-full">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-all z-10
                  ${done ? "bg-primary border-primary text-white"
                    : active ? "bg-primary/20 border-primary text-primary animate-pulse"
                    : "bg-muted/30 border-border text-muted-foreground"}`}
              >
                <Icon className="h-4 w-4" />
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 ${done ? "bg-primary" : "bg-border"}`} />
              )}
            </div>
            <span className={`text-[10px] mt-1 font-medium ${active ? "text-primary" : done ? "text-foreground" : "text-muted-foreground"}`}>
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function OrderCard({ order }: { order: any }) {
  const date = order.createdAt
    ? new Date(order.createdAt).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <div className="glass-card rounded-2xl p-6 space-y-5 border border-primary/20">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
            <Hash className="h-3 w-3" />
            Order ID
          </p>
          <p className="text-lg font-bold text-gradient">#{String(order.id).padStart(6, "0")}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <TrackingTimeline status={order.status} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        <div className="flex items-start gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4 mt-0.5 text-primary/60 shrink-0" />
          <span>{date}</span>
        </div>
        <div className="flex items-start gap-2 text-muted-foreground">
          <CreditCard className="h-4 w-4 mt-0.5 text-primary/60 shrink-0" />
          <span>{order.paymentMethod === "cod" ? "Cash on Delivery" : "UPI"}</span>
        </div>
        <div className="flex items-start gap-2 text-muted-foreground">
          <Phone className="h-4 w-4 mt-0.5 text-primary/60 shrink-0" />
          <span>{order.customerPhone}</span>
        </div>
        <div className="flex items-start gap-2 text-muted-foreground">
          <MapPin className="h-4 w-4 mt-0.5 text-primary/60 shrink-0" />
          <span className="line-clamp-2">{order.customerAddress}</span>
        </div>
      </div>

      <div className="border-t border-border/50 pt-4 space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Items</p>
        {(order.items || []).map((item: any) => (
          <div key={item.id} className="flex items-start justify-between gap-2 text-sm">
            <div>
              <span className="font-medium text-foreground">{item.productName}</span>
              {item.size && <span className="text-muted-foreground text-xs ml-1">({item.size})</span>}
              {item.customText && (
                <p className="text-xs text-muted-foreground italic mt-0.5">"{item.customText}"</p>
              )}
              <span className="text-muted-foreground text-xs"> x{item.quantity}</span>
            </div>
            <span className="font-semibold text-primary shrink-0">₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
          </div>
        ))}
        <div className="flex justify-between pt-2 border-t border-border/30">
          <span className="font-semibold text-sm">Total</span>
          <span className="font-bold text-primary">₹{Number(order.totalAmount).toLocaleString("en-IN")}</span>
        </div>
      </div>
    </div>
  );
}

export default function OrderTracking() {
  const [searchType, setSearchType] = useState<"id" | "phone">("id");
  const [searchValue, setSearchValue] = useState("");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const base = getApiBaseUrl();

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const val = searchValue.trim();
    if (!val) return;

    setLoading(true);
    setError(null);
    setOrders([]);
    setSearched(true);

    try {
      if (searchType === "id") {
        const res = await fetch(`${base}/orders/${encodeURIComponent(val)}`);
        if (res.status === 404) {
          setError("No order found with that ID.");
        } else if (!res.ok) {
          setError("Something went wrong. Please try again.");
        } else {
          const data = await res.json();
          setOrders([data]);
        }
      } else {
        const res = await fetch(`${base}/orders?phone=${encodeURIComponent(val)}`);
        if (!res.ok) {
          setError("Something went wrong. Please try again.");
        } else {
          const data = await res.json();
          if (!data || data.length === 0) {
            setError("No orders found for that phone number.");
          } else {
            setOrders(data);
          }
        }
      }
    } catch {
      setError("Could not connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/30 mb-4">
            <Package className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-gradient mb-3">Track Your Order</h1>
          <p className="text-muted-foreground">Enter your order ID or phone number to see the latest status.</p>
        </div>

        <div className="glass-card rounded-2xl p-6 mb-8 border border-primary/20">
          <div className="flex gap-2 mb-5">
            <button
              onClick={() => { setSearchType("id"); setOrders([]); setError(null); setSearched(false); setSearchValue(""); }}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all border ${
                searchType === "id"
                  ? "bg-primary text-white border-primary"
                  : "bg-muted/30 text-muted-foreground border-border hover:border-primary/40"
              }`}
            >
              <Hash className="inline h-4 w-4 mr-1 -mt-0.5" />
              Order ID
            </button>
            <button
              onClick={() => { setSearchType("phone"); setOrders([]); setError(null); setSearched(false); setSearchValue(""); }}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all border ${
                searchType === "phone"
                  ? "bg-primary text-white border-primary"
                  : "bg-muted/30 text-muted-foreground border-border hover:border-primary/40"
              }`}
            >
              <Phone className="inline h-4 w-4 mr-1 -mt-0.5" />
              Phone Number
            </button>
          </div>

          <form onSubmit={handleSearch} className="flex gap-3">
            <Input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder={searchType === "id" ? "Enter order ID (e.g. 1)" : "Enter 10-digit phone number"}
              className="bg-background/50 border-border/60 focus:border-primary/60"
              type={searchType === "id" ? "number" : "tel"}
              min={searchType === "id" ? "1" : undefined}
            />
            <Button type="submit" disabled={loading || !searchValue.trim()} className="btn-primary shrink-0">
              {loading ? (
                <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </form>
        </div>

        {error && (
          <div className="glass-card rounded-2xl p-6 text-center border border-red-500/20 mb-6">
            <XCircle className="h-10 w-10 text-red-400 mx-auto mb-3" />
            <p className="text-red-400 font-medium">{error}</p>
            <p className="text-muted-foreground text-sm mt-1">Check your details and try again.</p>
          </div>
        )}

        {!searched && !loading && (
          <div className="text-center text-muted-foreground text-sm mt-12 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Clock, label: "Pending", desc: "Order received, awaiting confirmation" },
                { icon: CheckCircle2, label: "Confirmed", desc: "Shop confirmed your order" },
                { icon: Truck, label: "Shipped", desc: "On the way to you" },
                { icon: Package, label: "Delivered", desc: "Arrived at your doorstep" },
              ].map(({ icon: Icon, label, desc }) => (
                <div key={label} className="glass-card rounded-xl p-4 border border-border/40 text-left">
                  <Icon className="h-5 w-5 text-primary mb-2" />
                  <p className="font-semibold text-foreground text-xs">{label}</p>
                  <p className="text-[11px] text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-5">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>

        {orders.length > 0 && (
          <div className="flex justify-center mt-8">
            <Link href="/shop">
              <Button variant="outline" className="border-primary/40 text-primary hover:bg-primary/10">
                <Home className="h-4 w-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
