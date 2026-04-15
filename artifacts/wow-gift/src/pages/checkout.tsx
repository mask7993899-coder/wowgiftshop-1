import { useState } from "react";
import { useCart } from "@/lib/cart";
import { useCreateOrder, CreateOrderBodyPaymentMethod } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { ArrowLeft, ArrowRight, Wallet, Banknote, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const checkoutSchema = z.object({
  customerName: z.string().min(2, "Name is required"),
  customerPhone: z.string().regex(/^[0-9]{10}$/, "Must be a valid 10-digit phone number"),
  customerAddress: z.string().min(10, "Full address is required"),
  pincode: z.string().regex(/^[0-9]{6}$/, "Must be a valid 6-digit pincode"),
  paymentMethod: z.enum(["cod", "upi"])
});

type CheckoutValues = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const { items, totalAmount, clearCart } = useCart();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const createOrder = useCreateOrder();

  const form = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: "",
      customerPhone: "",
      customerAddress: "",
      pincode: "",
      paymentMethod: "upi",
    },
  });

  const onSubmit = (data: CheckoutValues) => {
    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before checking out.",
        variant: "destructive"
      });
      return;
    }

    createOrder.mutate({
      data: {
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerAddress: data.customerAddress,
        pincode: data.pincode,
        paymentMethod: data.paymentMethod as CreateOrderBodyPaymentMethod,
        items: items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
          customText: item.customText,
          customImageUrl: item.customImageUrl,
          size: item.size
        }))
      }
    }, {
      onSuccess: (order) => {
        clearCart();
        setLocation(`/order-confirmation/${order.id}`);
      },
      onError: () => {
        toast({
          title: "Failed to place order",
          description: "Something went wrong. Please try again.",
          variant: "destructive"
        });
      }
    });
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center min-h-[70vh] flex flex-col items-center justify-center">
        <h1 className="text-3xl font-serif font-bold text-white mb-4">Your Cart is Empty</h1>
        <Button onClick={() => setLocation("/shop")} className="bg-primary text-white">Back to Shop</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <button 
        onClick={() => window.history.back()} 
        className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Cart
      </button>

      <h1 className="text-3xl md:text-5xl font-serif font-bold text-gradient mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <div className="glass-panel p-6 md:p-8 rounded-2xl border-primary/20">
            <h2 className="text-2xl font-serif font-bold text-white mb-6">Delivery Details</h2>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="customerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" className="bg-background/50" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customerPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="10-digit mobile number" className="bg-background/50" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customerAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Delivery Address</FormLabel>
                      <FormControl>
                        <textarea 
                          {...field}
                          className="flex min-h-[100px] w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          placeholder="House No, Street, Landmark..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pincode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pincode</FormLabel>
                      <FormControl>
                        <Input placeholder="6-digit pincode" className="bg-background/50" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="border-t border-border/50 pt-6 mt-6">
                  <h3 className="text-xl font-serif font-bold text-white mb-4">Payment Method</h3>
                  
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-2"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0 rounded-xl border border-border/50 p-4 glass-panel [&:has([data-state=checked])]:border-primary">
                              <FormControl>
                                <RadioGroupItem value="upi" />
                              </FormControl>
                              <div className="flex items-center gap-3 w-full cursor-pointer">
                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                  <Wallet className="h-4 w-4" />
                                </div>
                                <div className="flex-1">
                                  <FormLabel className="font-bold text-white cursor-pointer">UPI / Online Payment</FormLabel>
                                  <p className="text-xs text-muted-foreground">PhonePe, Google Pay, Paytm</p>
                                </div>
                              </div>
                            </FormItem>
                            
                            <FormItem className="flex items-center space-x-3 space-y-0 rounded-xl border border-border/50 p-4 glass-panel [&:has([data-state=checked])]:border-primary">
                              <FormControl>
                                <RadioGroupItem value="cod" />
                              </FormControl>
                              <div className="flex items-center gap-3 w-full cursor-pointer">
                                <div className="h-8 w-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                                  <Banknote className="h-4 w-4" />
                                </div>
                                <div className="flex-1">
                                  <FormLabel className="font-bold text-white cursor-pointer">Cash on Delivery</FormLabel>
                                  <p className="text-xs text-muted-foreground">Pay when your gift arrives</p>
                                </div>
                              </div>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-start gap-3 mt-6">
                  <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium text-white mb-1">Secure Checkout</p>
                    Your personal information is encrypted and secure. We never store payment details.
                  </div>
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  disabled={createOrder.isPending}
                  className="w-full h-14 text-lg rounded-xl bg-primary hover:bg-primary/90 text-white shadow-[0_0_20px_rgba(255,105,180,0.4)] mt-8"
                >
                  {createOrder.isPending ? "Processing..." : `Place Order • ₹${totalAmount}`}
                  {!createOrder.isPending && <ArrowRight className="ml-2 h-5 w-5" />}
                </Button>
              </form>
            </Form>
          </div>
        </div>

        <div>
          <div className="glass-panel p-6 rounded-2xl border-primary/20 sticky top-24">
            <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>
            
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 mb-6">
              {items.map(item => (
                <div key={item.id} className="flex gap-4 border-b border-border/30 pb-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-muted/30">
                    <img src={item.product.imageUrl || ""} alt={item.product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-medium text-white line-clamp-1">{item.product.name}</h4>
                      <span className="font-bold text-primary shrink-0 ml-2">₹{item.product.price}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Qty: {item.quantity}</p>
                    {(item.customText || item.size) && (
                      <p className="text-xs text-muted-foreground truncate mt-1">
                        {item.size && `Size: ${item.size}`}
                        {item.size && item.customText && " | "}
                        {item.customText && `Text: "${item.customText}"`}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-3 mb-6 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>₹{totalAmount}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span className="text-accent">Free</span>
              </div>
              <div className="border-t border-border/50 pt-3 flex justify-between items-center text-white font-bold text-lg">
                <span>Total</span>
                <span className="text-2xl text-primary drop-shadow-[0_0_5px_rgba(255,105,180,0.5)]">₹{totalAmount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
