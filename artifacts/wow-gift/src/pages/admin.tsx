import { useState } from "react";
import { 
  useGetDashboardStats, 
  useGetRecentOrders, 
  useListProducts, 
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  useUpdateOrderStatus,
  UpdateOrderStatusBodyStatus,
  getListProductsQueryKey,
  getGetDashboardStatsQueryKey,
  getGetRecentOrdersQueryKey
} from "@workspace/api-client-react";
import { 
  Package, ShoppingBag, IndianRupee, Clock, Search, 
  Plus, Edit, Trash2, MoreVertical, Loader2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

export default function Admin() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "products" | "orders">("dashboard");
  const { data: stats, isLoading: statsLoading } = useGetDashboardStats();
  const { data: recentOrders, isLoading: ordersLoading } = useGetRecentOrders();
  const { data: products, isLoading: productsLoading } = useListProducts();
  
  const updateOrder = useUpdateOrderStatus();
  const deleteProduct = useDeleteProduct();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleStatusUpdate = (orderId: number, status: UpdateOrderStatusBodyStatus) => {
    updateOrder.mutate(
      { id: orderId, data: { status } },
      {
        onSuccess: () => {
          toast({ title: "Order status updated" });
          queryClient.invalidateQueries({ queryKey: getGetRecentOrdersQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetDashboardStatsQueryKey() });
        }
      }
    );
  };

  const handleDeleteProduct = (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    deleteProduct.mutate(
      { id },
      {
        onSuccess: () => {
          toast({ title: "Product deleted" });
          queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() });
        }
      }
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 glass-panel border-r border-primary/20 flex flex-col shrink-0">
        <div className="p-6 border-b border-primary/20">
          <h2 className="font-serif text-2xl font-bold text-gradient">WOW Admin</h2>
        </div>
        <nav className="p-4 space-y-2 flex-1">
          <Button 
            variant={activeTab === "dashboard" ? "default" : "ghost"} 
            className={`w-full justify-start ${activeTab === "dashboard" ? "bg-primary text-white shadow-[0_0_15px_rgba(255,105,180,0.3)]" : "text-muted-foreground hover:text-white"}`}
            onClick={() => setActiveTab("dashboard")}
          >
            <Package className="mr-2 h-4 w-4" /> Dashboard
          </Button>
          <Button 
            variant={activeTab === "products" ? "default" : "ghost"} 
            className={`w-full justify-start ${activeTab === "products" ? "bg-primary text-white shadow-[0_0_15px_rgba(255,105,180,0.3)]" : "text-muted-foreground hover:text-white"}`}
            onClick={() => setActiveTab("products")}
          >
            <ShoppingBag className="mr-2 h-4 w-4" /> Products
          </Button>
          <Button 
            variant={activeTab === "orders" ? "default" : "ghost"} 
            className={`w-full justify-start ${activeTab === "orders" ? "bg-primary text-white shadow-[0_0_15px_rgba(255,105,180,0.3)]" : "text-muted-foreground hover:text-white"}`}
            onClick={() => setActiveTab("orders")}
          >
            <Clock className="mr-2 h-4 w-4" /> Orders
          </Button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {activeTab === "dashboard" && (
          <div className="space-y-8 animate-in fade-in">
            <h1 className="text-3xl font-serif font-bold text-white mb-6">Dashboard Overview</h1>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="glass-panel p-6 rounded-2xl border-primary/20 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex justify-between items-start mb-4">
                  <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                    <IndianRupee className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground font-medium">Total Revenue</p>
                <h3 className="text-3xl font-bold text-white mt-1">
                  {statsLoading ? <Skeleton className="h-8 w-24" /> : `₹${stats?.totalRevenue || 0}`}
                </h3>
              </div>

              <div className="glass-panel p-6 rounded-2xl border-secondary/20 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex justify-between items-start mb-4">
                  <div className="h-10 w-10 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary">
                    <ShoppingBag className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground font-medium">Total Orders</p>
                <h3 className="text-3xl font-bold text-white mt-1">
                  {statsLoading ? <Skeleton className="h-8 w-16" /> : stats?.totalOrders || 0}
                </h3>
              </div>

              <div className="glass-panel p-6 rounded-2xl border-accent/20 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex justify-between items-start mb-4">
                  <div className="h-10 w-10 rounded-xl bg-accent/20 flex items-center justify-center text-accent">
                    <Clock className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground font-medium">Pending Orders</p>
                <h3 className="text-3xl font-bold text-white mt-1">
                  {statsLoading ? <Skeleton className="h-8 w-16" /> : stats?.pendingOrders || 0}
                </h3>
              </div>

              <div className="glass-panel p-6 rounded-2xl border-primary/20 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex justify-between items-start mb-4">
                  <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                    <Package className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground font-medium">Total Products</p>
                <h3 className="text-3xl font-bold text-white mt-1">
                  {statsLoading ? <Skeleton className="h-8 w-16" /> : stats?.totalProducts || 0}
                </h3>
              </div>
            </div>

            <div className="mt-12 glass-panel rounded-3xl border-primary/20 overflow-hidden">
              <div className="p-6 border-b border-border/50">
                <h2 className="text-xl font-serif font-bold text-white">Recent Orders</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-background/50 text-muted-foreground">
                    <tr>
                      <th className="px-6 py-4 font-medium">Order ID</th>
                      <th className="px-6 py-4 font-medium">Customer</th>
                      <th className="px-6 py-4 font-medium">Date</th>
                      <th className="px-6 py-4 font-medium">Amount</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {ordersLoading ? (
                      <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">Loading...</td></tr>
                    ) : recentOrders?.length === 0 ? (
                      <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">No recent orders</td></tr>
                    ) : (
                      recentOrders?.map(order => (
                        <tr key={order.id} className="hover:bg-primary/5 transition-colors">
                          <td className="px-6 py-4 font-mono font-medium text-white">#{order.id.toString().padStart(6, '0')}</td>
                          <td className="px-6 py-4">{order.customerName}</td>
                          <td className="px-6 py-4 text-muted-foreground">
                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '-'}
                          </td>
                          <td className="px-6 py-4 text-primary font-bold">₹{order.totalAmount}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                              order.status === 'delivered' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                              order.status === 'cancelled' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                              order.status === 'shipped' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                              'bg-accent/10 text-accent border-accent/20'
                            }`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-card border-primary/20">
                                <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, "pending")}>Mark Pending</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, "confirmed")}>Mark Confirmed</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, "shipped")}>Mark Shipped</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, "delivered")}>Mark Delivered</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive" onClick={() => handleStatusUpdate(order.id, "cancelled")}>Cancel Order</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "products" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h1 className="text-3xl font-serif font-bold text-white">Products Management</h1>
              <Button className="bg-primary hover:bg-primary/90 text-white">
                <Plus className="mr-2 h-4 w-4" /> Add Product
              </Button>
            </div>
            
            <div className="glass-panel p-4 rounded-2xl border-primary/20 flex gap-4 items-center">
              <Search className="h-5 w-5 text-muted-foreground ml-2" />
              <Input 
                placeholder="Search products..." 
                className="border-0 bg-transparent focus-visible:ring-0 px-0 text-white placeholder:text-muted-foreground"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {productsLoading ? (
                [1, 2, 3].map(i => <Skeleton key={i} className="h-48 rounded-2xl" />)
              ) : products?.map(product => (
                <div key={product.id} className="glass-panel p-4 rounded-2xl border-primary/20 flex gap-4">
                  <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-background/50">
                    <img src={product.imageUrl || ""} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col">
                    <h3 className="font-bold text-white line-clamp-1">{product.name}</h3>
                    <div className="text-primary font-bold mt-1">₹{product.price}</div>
                    <div className="mt-auto flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="space-y-6 animate-in fade-in">
            <h1 className="text-3xl font-serif font-bold text-white mb-6">All Orders</h1>
            <div className="glass-panel rounded-3xl border-primary/20 overflow-hidden p-8 text-center">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-bold mb-2">Order Management</h3>
              <p className="text-muted-foreground">Order details and management interface would be fully implemented here.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
