"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { 
  Clock, 
  CheckCircle, 
  ChefHat, 
  Package, 
  Truck, 
  Home, 
  X, 
  DollarSign,
  BarChart3,
  ClipboardList,
  Settings as SettingsIcon
} from "lucide-react";

interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: string;
  toppings?: { name: string; price: number }[] | null;
  brothRichness?: string | null;
  noodleFirmness?: string | null;
  spiceLevel?: number | null;
  specialInstructions?: string | null;
}

interface StatusHistoryEntry {
  id: number;
  status: string;
  note: string | null;
  createdAt: string;
}

interface OrderNote {
  id: number;
  content: string;
  createdBy: string;
  createdAt: string;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  orderType: string;
  customerFirstName: string;
  customerLastName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryStreet: string | null;
  deliveryApartment: string | null;
  deliveryCity: string | null;
  deliveryPostalCode: string | null;
  deliveryInstructions: string | null;
  subtotal: string;
  deliveryFee: string;
  tax: string;
  total: string;
  notes: string | null;
  createdAt: string;
  items: OrderItem[];
  statusHistory: StatusHistoryEntry[];
  internalNotes?: OrderNote[];
  deletedAt?: string | null;
}

interface Stats {
  orders: { today: number; week: number; month: number };
  revenue: { today: number; week: number; month: number };
  active: { pending: number; preparing: number; delivery: number };
  statusCounts: Record<string, number>;
  recentOrders?: Array<{
    id: string;
    orderNumber: string;
    status: string;
    total: number;
    createdAt: string;
    customerFirstName: string;
    customerLastName: string;
  }>;
}

type TabType = "dashboard" | "orders" | "settings";

const statusColors: Record<string, { bg: string; text: string; border: string }> = {
  PENDING: { bg: "bg-amber-500/10", text: "text-amber-500", border: "border-amber-500/30" },
  CONFIRMED: { bg: "bg-blue-500/10", text: "text-blue-500", border: "border-blue-500/30" },
  PREPARING: { bg: "bg-orange-500/10", text: "text-orange-500", border: "border-orange-500/30" },
  READY: { bg: "bg-emerald-500/10", text: "text-emerald-500", border: "border-emerald-500/30" },
  OUT_FOR_DELIVERY: { bg: "bg-violet-500/10", text: "text-violet-500", border: "border-violet-500/30" },
  DELIVERED: { bg: "bg-green-500/10", text: "text-green-500", border: "border-green-500/30" },
  PICKED_UP: { bg: "bg-green-500/10", text: "text-green-500", border: "border-green-500/30" },
  CANCELLED: { bg: "bg-red-500/10", text: "text-red-500", border: "border-red-500/30" },
  REFUNDED: { bg: "bg-gray-500/10", text: "text-gray-500", border: "border-gray-500/30" },
};

const statusFlow: Record<string, string[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PREPARING", "CANCELLED"],
  PREPARING: ["READY", "CANCELLED"],
  READY: ["OUT_FOR_DELIVERY", "PICKED_UP", "CANCELLED"],
  OUT_FOR_DELIVERY: ["DELIVERED", "CANCELLED"],
  DELIVERED: [],
  PICKED_UP: [],
  CANCELLED: ["REFUNDED"],
  REFUNDED: [],
};

const statusIcons: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  PENDING: Clock,
  CONFIRMED: CheckCircle,
  PREPARING: ChefHat,
  READY: Package,
  OUT_FOR_DELIVERY: Truck,
  DELIVERED: Home,
  PICKED_UP: Home,
  CANCELLED: X,
  REFUNDED: DollarSign,
};

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  
  const [filter, setFilter] = useState("all");
  const [orderTypeFilter, setOrderTypeFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  
  const [newNote, setNewNote] = useState("");
  const [addingNote, setAddingNote] = useState(false);
  
  const [showFilters, setShowFilters] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchOrders();
    }
  }, [status, filter, orderTypeFilter, debouncedSearch]);

  useEffect(() => {
    if (status === "authenticated" && activeTab === "dashboard") {
      fetchStats();
    }
  }, [status, activeTab]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
  };

  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const response = await fetch("/api/admin/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchOrders = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filter !== "all") params.append("status", filter);
      if (orderTypeFilter !== "all") params.append("orderType", orderTypeFilter);
      if (debouncedSearch) params.append("search", debouncedSearch);
      
      const response = await fetch(`/api/admin/orders?${params}`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }, [filter, orderTypeFilter, debouncedSearch]);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingStatus(true);
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const updatedOrder = await response.json();
        setOrders(orders.map(o => o.id === orderId ? updatedOrder : o));
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(updatedOrder);
        }
        showToast(`Order updated to ${newStatus.replace(/_/g, " ")}`);
      } else {
        showToast("Failed to update order", "error");
      }
    } catch (error) {
      console.error("Error updating order:", error);
      showToast("Failed to update order", "error");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const deleteOrder = async (orderId: string, permanent = false) => {
    try {
      const url = permanent 
        ? `/api/admin/orders/${orderId}?permanent=true` 
        : `/api/admin/orders/${orderId}`;
      
      const response = await fetch(url, { method: "DELETE" });

      if (response.ok) {
        setOrders(orders.filter(o => o.id !== orderId));
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(null);
          setShowOrderDetail(false);
        }
        showToast(permanent ? "Order permanently deleted" : "Order cancelled and archived");
        setShowDeleteConfirm(false);
        setOrderToDelete(null);
      } else {
        showToast("Failed to delete order", "error");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      showToast("Failed to delete order", "error");
    }
  };

  const bulkUpdateStatus = async (newStatus: string) => {
    const promises = Array.from(selectedOrders).map(orderId =>
      fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
    );

    try {
      await Promise.all(promises);
      await fetchOrders();
      setSelectedOrders(new Set());
      setShowBulkActions(false);
      showToast(`${selectedOrders.size} orders updated to ${newStatus.replace(/_/g, " ")}`);
    } catch (error) {
      console.error("Error bulk updating:", error);
      showToast("Some orders failed to update", "error");
    }
  };

  const addNote = async () => {
    if (!selectedOrder || !newNote.trim()) return;
    
    setAddingNote(true);
    try {
      const response = await fetch(`/api/admin/orders/${selectedOrder.id}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newNote }),
      });

      if (response.ok) {
        const note = await response.json();
        setSelectedOrder({
          ...selectedOrder,
          internalNotes: [note, ...(selectedOrder.internalNotes || [])],
        });
        setNewNote("");
        showToast("Note added");
      } else {
        showToast("Failed to add note", "error");
      }
    } catch (error) {
      console.error("Error adding note:", error);
      showToast("Failed to add note", "error");
    } finally {
      setAddingNote(false);
    }
  };

  const toggleOrderSelection = (orderId: string) => {
    const newSelection = new Set(selectedOrders);
    if (newSelection.has(orderId)) {
      newSelection.delete(orderId);
    } else {
      newSelection.add(orderId);
    }
    setSelectedOrders(newSelection);
  };

  const selectAllOrders = () => {
    if (selectedOrders.size === orders.length) {
      setSelectedOrders(new Set());
    } else {
      setSelectedOrders(new Set(orders.map(o => o.id)));
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`${label} copied to clipboard`);
  };

  const openMap = (order: Order) => {
    if (order.deliveryStreet && order.deliveryCity) {
      const address = encodeURIComponent(
        `${order.deliveryStreet}, ${order.deliveryPostalCode} ${order.deliveryCity}`
      );
      window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, "_blank");
    }
  };

  const callCustomer = (phone: string) => {
    window.open(`tel:${phone}`, "_self");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price: string | number) => {
    return new Intl.NumberFormat("nl-NL", {
      style: "currency",
      currency: "EUR",
    }).format(typeof price === "string" ? parseFloat(price) : price);
  };

  const printReceipt = (order: Order) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    
    const itemsHtml = order.items.map(item => `
      <tr>
        <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${item.quantity}x ${item.name}</td>
        <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;">${formatPrice(String(parseFloat(item.price) * item.quantity))}</td>
      </tr>
      ${item.toppings && Array.isArray(item.toppings) && item.toppings.length > 0 ? `
        <tr>
          <td colspan="2" style="padding: 4px 0 8px 16px; color: #666; font-size: 12px;">
            + ${item.toppings.map((t: { name: string }) => t.name).join(", ")}
          </td>
        </tr>
      ` : ""}
      ${item.specialInstructions ? `
        <tr>
          <td colspan="2" style="padding: 4px 0 8px 16px; color: #666; font-size: 12px; font-style: italic;">
            "${item.specialInstructions}"
          </td>
        </tr>
      ` : ""}
    `).join("");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Order #${order.orderNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto; padding: 20px; }
            h1 { text-align: center; margin-bottom: 5px; }
            .subtitle { text-align: center; color: #666; margin-bottom: 20px; }
            .section { margin-bottom: 20px; }
            .section-title { font-weight: bold; margin-bottom: 8px; padding-bottom: 4px; border-bottom: 2px solid #000; }
            table { width: 100%; border-collapse: collapse; }
            .total { font-size: 18px; font-weight: bold; margin-top: 10px; padding-top: 10px; border-top: 2px solid #000; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>
          <h1>夢 YUME RAMEN</h1>
          <p class="subtitle">Order #${order.orderNumber}</p>
          
          <div class="section">
            <div class="section-title">Customer</div>
            <p>${order.customerFirstName} ${order.customerLastName}</p>
            <p>${order.customerPhone}</p>
            ${order.orderType === "DELIVERY" && order.deliveryStreet ? `
              <p>${order.deliveryStreet}${order.deliveryApartment ? `, ${order.deliveryApartment}` : ""}</p>
              <p>${order.deliveryPostalCode} ${order.deliveryCity}</p>
            ` : `<p>Pickup</p>`}
          </div>
          
          <div class="section">
            <div class="section-title">Items</div>
            <table>${itemsHtml}</table>
          </div>
          
          <div class="section">
            <table>
              <tr><td>Subtotal</td><td style="text-align: right;">${formatPrice(order.subtotal)}</td></tr>
              ${parseFloat(order.deliveryFee) > 0 ? `<tr><td>Delivery</td><td style="text-align: right;">${formatPrice(order.deliveryFee)}</td></tr>` : ""}
              <tr><td>Tax</td><td style="text-align: right;">${formatPrice(order.tax)}</td></tr>
            </table>
            <div class="total">
              <table><tr><td>Total</td><td style="text-align: right;">${formatPrice(order.total)}</td></tr></table>
            </div>
          </div>
          
          <p style="text-align: center; color: #666; font-size: 12px; margin-top: 30px;">
            ${new Date(order.createdAt).toLocaleString()}<br>
            Thank you for your order!
          </p>
          
          <script>window.print(); window.close();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (status === "loading" || (loading && activeTab === "orders")) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-red-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const renderDashboard = () => (
    <div className="space-y-6 pb-24 lg:pb-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Dashboard</h2>
        <button
          onClick={fetchStats}
          className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition"
          disabled={statsLoading}
        >
          <svg className={`w-5 h-5 text-zinc-400 ${statsLoading ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {statsLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 animate-pulse">
              <div className="h-4 bg-zinc-800 rounded w-20 mb-2" />
              <div className="h-8 bg-zinc-800 rounded w-16" />
            </div>
          ))}
        </div>
      ) : stats && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-red-500/20 to-red-600/10 rounded-xl p-4 border border-red-500/20">
              <p className="text-red-400 text-sm font-medium">Today&apos;s Orders</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.orders.today}</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 rounded-xl p-4 border border-emerald-500/20">
              <p className="text-emerald-400 text-sm font-medium">Today&apos;s Revenue</p>
              <p className="text-3xl font-bold text-white mt-1">{formatPrice(stats.revenue.today)}</p>
            </div>
            <div className="bg-gradient-to-br from-amber-500/20 to-amber-600/10 rounded-xl p-4 border border-amber-500/20">
              <p className="text-amber-400 text-sm font-medium">Pending</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.active.pending}</p>
            </div>
            <div className="bg-gradient-to-br from-violet-500/20 to-violet-600/10 rounded-xl p-4 border border-violet-500/20">
              <p className="text-violet-400 text-sm font-medium">Out for Delivery</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.active.delivery}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
              <div className="p-4 border-b border-zinc-800">
                <h3 className="font-semibold text-white">Weekly Summary</h3>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Orders</span>
                  <span className="text-white font-medium">{stats.orders.week}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Revenue</span>
                  <span className="text-white font-medium">{formatPrice(stats.revenue.week)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Avg per Order</span>
                  <span className="text-white font-medium">
                    {stats.orders.week > 0 
                      ? formatPrice(Number(stats.revenue.week) / stats.orders.week)
                      : formatPrice(0)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
              <div className="p-4 border-b border-zinc-800">
                <h3 className="font-semibold text-white">Active Orders by Status</h3>
              </div>
              <div className="p-4 space-y-3">
                {["PENDING", "CONFIRMED", "PREPARING", "READY", "OUT_FOR_DELIVERY"].map((s) => (
                  <div key={s} className="flex items-center gap-3">
                    <span className={`px-2 py-1 text-xs rounded ${statusColors[s].bg} ${statusColors[s].text}`}>
                      {s.replace(/_/g, " ")}
                    </span>
                    <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${statusColors[s].bg.replace("/10", "/50")}`}
                        style={{ 
                          width: `${Math.min(100, ((stats.statusCounts[s] || 0) / Math.max(1, Object.values(stats.statusCounts).reduce((a, b) => a + b, 0))) * 100)}%` 
                        }}
                      />
                    </div>
                    <span className="text-white font-medium w-8 text-right">{stats.statusCounts[s] || 0}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
              <h3 className="font-semibold text-white">Recent Orders</h3>
              <button
                onClick={() => setActiveTab("orders")}
                className="text-red-500 text-sm hover:text-red-400 transition"
              >
                View All
              </button>
            </div>
            <div className="divide-y divide-zinc-800">
              {stats.recentOrders?.map((order: { id: string; orderNumber: string; status: string; total: number; createdAt: string; customerFirstName: string; customerLastName: string }) => (
                <div 
                  key={order.id}
                  onClick={() => {
                    const fullOrder = orders.find(o => o.id === order.id);
                    if (fullOrder) {
                      setSelectedOrder(fullOrder);
                      setShowOrderDetail(true);
                    } else {
                      setActiveTab("orders");
                    }
                  }}
                  className="p-4 flex items-center justify-between hover:bg-zinc-800/50 cursor-pointer transition"
                >
                  <div className="flex items-center gap-3">
                    {(() => {
                      const Icon = statusIcons[order.status];
                      return Icon ? <Icon size={20} className={statusColors[order.status]?.text} /> : null;
                    })()}
                    <div>
                      <p className="font-medium text-white">#{order.orderNumber}</p>
                      <p className="text-sm text-zinc-400">{order.customerFirstName} {order.customerLastName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-white">{formatPrice(order.total)}</p>
                    <p className="text-sm text-zinc-500">{formatDate(order.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-4 pb-24 lg:pb-8">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search orders, customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`p-3 rounded-xl border transition ${showFilters ? "bg-red-500 border-red-500 text-white" : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white"}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
        </button>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4 space-y-4">
              <div>
                <p className="text-sm text-zinc-400 mb-2">Status</p>
                <div className="flex flex-wrap gap-2">
                  {["all", "PENDING", "CONFIRMED", "PREPARING", "READY", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"].map((s) => (
                    <button
                      key={s}
                      onClick={() => setFilter(s)}
                      className={`px-3 py-1.5 text-sm rounded-lg transition ${
                        filter === s
                          ? "bg-red-500 text-white"
                          : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                      }`}
                    >
                      {s === "all" ? "All" : s.replace(/_/g, " ")}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm text-zinc-400 mb-2">Order Type</p>
                <div className="flex gap-2">
                  {["all", "DELIVERY", "PICKUP"].map((t) => (
                    <button
                      key={t}
                      onClick={() => setOrderTypeFilter(t)}
                      className={`px-3 py-1.5 text-sm rounded-lg transition ${
                        orderTypeFilter === t
                          ? "bg-red-500 text-white"
                          : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                      }`}
                    >
                      {t === "all" ? "All" : t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {selectedOrders.size > 0 && (
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedOrders(new Set())}
              className="p-1 hover:bg-zinc-800 rounded"
            >
              <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <span className="text-white font-medium">{selectedOrders.size} selected</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowBulkActions(true)}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition"
            >
              Bulk Actions
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 text-sm">
        <button
          onClick={selectAllOrders}
          className="text-zinc-400 hover:text-white transition"
        >
          {selectedOrders.size === orders.length ? "Deselect All" : "Select All"}
        </button>
        <span className="text-zinc-600">|</span>
        <span className="text-zinc-500">{orders.length} orders</span>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 animate-pulse">
              <div className="flex justify-between mb-3">
                <div className="h-5 bg-zinc-800 rounded w-24" />
                <div className="h-5 bg-zinc-800 rounded w-20" />
              </div>
              <div className="h-4 bg-zinc-800 rounded w-40" />
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-zinc-900 rounded-xl p-8 text-center border border-zinc-800">
          <svg className="w-12 h-12 text-zinc-700 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-zinc-400">No orders found</p>
          {(filter !== "all" || orderTypeFilter !== "all" || searchQuery) && (
            <button
              onClick={() => {
                setFilter("all");
                setOrderTypeFilter("all");
                setSearchQuery("");
              }}
              className="mt-4 text-red-500 hover:text-red-400 text-sm"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className={`bg-zinc-900 rounded-xl border transition ${
                selectedOrders.has(order.id) 
                  ? "border-red-500 bg-red-500/5" 
                  : "border-zinc-800 hover:border-zinc-700"
              }`}
            >
              <div 
                className="p-4 cursor-pointer"
                onClick={() => {
                  setSelectedOrder(order);
                  setShowOrderDetail(true);
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleOrderSelection(order.id);
                      }}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition ${
                        selectedOrders.has(order.id)
                          ? "bg-red-500 border-red-500"
                          : "border-zinc-600 hover:border-zinc-500"
                      }`}
                    >
                      {selectedOrders.has(order.id) && (
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-white">#{order.orderNumber}</p>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${statusColors[order.status].bg} ${statusColors[order.status].text}`}>
                          {order.status.replace(/_/g, " ")}
                        </span>
                      </div>
                      <p className="text-sm text-zinc-400">
                        {order.customerFirstName} {order.customerLastName}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-white">{formatPrice(order.total)}</p>
                    <p className="text-xs text-zinc-500">{formatDate(order.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <span className={`px-2 py-1 text-xs rounded ${order.orderType === "DELIVERY" ? "bg-violet-500/10 text-violet-400" : "bg-blue-500/10 text-blue-400"}`}>
                    {order.orderType}
                  </span>
                  <span className="text-xs text-zinc-500">
                    {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                  </span>
                  {order.paymentStatus === "PAID" && (
                    <span className="px-2 py-1 text-xs rounded bg-green-500/10 text-green-400">
                      Paid
                    </span>
                  )}
                </div>
              </div>
              
              {statusFlow[order.status]?.length > 0 && (
                <div className="px-4 pb-4 flex gap-2">
                  {statusFlow[order.status].slice(0, 2).map((nextStatus) => (
                    <button
                      key={nextStatus}
                      onClick={(e) => {
                        e.stopPropagation();
                        updateOrderStatus(order.id, nextStatus);
                      }}
                      disabled={updatingStatus}
                      className={`flex-1 py-2 text-sm rounded-lg transition flex items-center justify-center gap-2 ${
                        nextStatus === "CANCELLED"
                          ? "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                          : "bg-zinc-800 text-white hover:bg-zinc-700"
                      }`}
                    >
                      {(() => {
                        const Icon = statusIcons[nextStatus];
                        return Icon ? <Icon size={16} /> : null;
                      })()}
                      {nextStatus.replace(/_/g, " ")}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6 pb-24 lg:pb-8">
      <h2 className="text-2xl font-bold text-white">Settings</h2>
      
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
        <div className="p-4 border-b border-zinc-800">
          <h3 className="font-semibold text-white">Account</h3>
        </div>
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white">{session.user?.email}</p>
              <p className="text-sm text-zinc-500">Admin Account</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
        <div className="p-4 border-b border-zinc-800">
          <h3 className="font-semibold text-white">Session</h3>
        </div>
        <div className="p-4">
          <button
            onClick={() => {
              localStorage.removeItem("yume_admin_remember");
              signOut({ callbackUrl: "/admin/login" });
            }}
            className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-medium rounded-lg transition"
          >
            Sign Out
          </button>
          <p className="text-xs text-zinc-500 text-center mt-2">
            This will also clear saved login credentials
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-950">
      <header className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">
            <span className="text-red-500">夢</span> Yume Admin
          </h1>
          <div className="hidden lg:flex items-center gap-4">
            <span className="text-zinc-400 text-sm">{session.user?.email}</span>
            <button
              onClick={() => {
                localStorage.removeItem("yume_admin_remember");
                signOut({ callbackUrl: "/admin/login" });
              }}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm rounded-lg transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="hidden lg:block bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex gap-1">
            {[
              { id: "dashboard" as TabType, label: "Dashboard", icon: BarChart3 },
              { id: "orders" as TabType, label: "Orders", icon: ClipboardList },
              { id: "settings" as TabType, label: "Settings", icon: SettingsIcon },
            ].map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 text-sm font-medium transition border-b-2 flex items-center gap-2 ${
                    activeTab === tab.id
                      ? "text-red-500 border-red-500"
                      : "text-zinc-400 border-transparent hover:text-white"
                  }`}
                >
                  <TabIcon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === "dashboard" && renderDashboard()}
        {activeTab === "orders" && renderOrders()}
        {activeTab === "settings" && renderSettings()}
      </main>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 z-50">
        <div className="flex justify-around items-center py-2">
          {[
            { id: "dashboard" as TabType, label: "Dashboard", icon: (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            )},
            { id: "orders" as TabType, label: "Orders", icon: (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            )},
            { id: "settings" as TabType, label: "Settings", icon: (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )},
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center py-2 px-4 rounded-lg transition ${
                activeTab === tab.id
                  ? "text-red-500"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {tab.icon}
              <span className="text-xs mt-1">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      <AnimatePresence>
        {showOrderDetail && selectedOrder && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowOrderDetail(false)}
              className="fixed inset-0 bg-black/60 z-50 lg:hidden"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-x-0 bottom-0 z-50 lg:hidden max-h-[90vh] overflow-y-auto bg-zinc-900 rounded-t-3xl"
            >
              <div className="sticky top-0 bg-zinc-900 p-4 border-b border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-white">#{selectedOrder.orderNumber}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${statusColors[selectedOrder.status].bg} ${statusColors[selectedOrder.status].text}`}>
                    {selectedOrder.status.replace(/_/g, " ")}
                  </span>
                </div>
                <button
                  onClick={() => setShowOrderDetail(false)}
                  className="p-2 hover:bg-zinc-800 rounded-lg"
                >
                  <svg className="w-6 h-6 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="p-4 space-y-4">
                <div className="flex gap-2 overflow-x-auto pb-2">
                  <button
                    onClick={() => callCustomer(selectedOrder.customerPhone)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-400 rounded-lg whitespace-nowrap"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Call
                  </button>
                  {selectedOrder.orderType === "DELIVERY" && selectedOrder.deliveryStreet && (
                    <button
                      onClick={() => openMap(selectedOrder)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-400 rounded-lg whitespace-nowrap"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Map
                    </button>
                  )}
                  <button
                    onClick={() => printReceipt(selectedOrder)}
                    className="flex items-center gap-2 px-4 py-2 bg-zinc-800 text-zinc-300 rounded-lg whitespace-nowrap"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Print
                  </button>
                  <button
                    onClick={() => copyToClipboard(selectedOrder.orderNumber, "Order number")}
                    className="flex items-center gap-2 px-4 py-2 bg-zinc-800 text-zinc-300 rounded-lg whitespace-nowrap"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy
                  </button>
                </div>

                <div className="bg-zinc-800/50 rounded-xl p-4">
                  <h4 className="text-sm font-semibold text-zinc-400 mb-2">Customer</h4>
                  <p className="text-white font-medium">{selectedOrder.customerFirstName} {selectedOrder.customerLastName}</p>
                  <p className="text-zinc-400 text-sm">{selectedOrder.customerEmail}</p>
                  <p className="text-zinc-400 text-sm">{selectedOrder.customerPhone}</p>
                  {selectedOrder.orderType === "DELIVERY" && selectedOrder.deliveryStreet && (
                    <div className="mt-2 pt-2 border-t border-zinc-700">
                      <p className="text-white text-sm">
                        {selectedOrder.deliveryStreet}
                        {selectedOrder.deliveryApartment && `, ${selectedOrder.deliveryApartment}`}
                      </p>
                      <p className="text-white text-sm">
                        {selectedOrder.deliveryPostalCode} {selectedOrder.deliveryCity}
                      </p>
                      {selectedOrder.deliveryInstructions && (
                        <p className="text-zinc-400 text-sm mt-1 italic">&quot;{selectedOrder.deliveryInstructions}&quot;</p>
                      )}
                    </div>
                  )}
                </div>

                <div className="bg-zinc-800/50 rounded-xl p-4">
                  <h4 className="text-sm font-semibold text-zinc-400 mb-2">Items</h4>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id}>
                        <div className="flex justify-between">
                          <span className="text-white">{item.quantity}x {item.name}</span>
                          <span className="text-zinc-400">{formatPrice(String(parseFloat(item.price) * item.quantity))}</span>
                        </div>
                        {item.toppings && Array.isArray(item.toppings) && item.toppings.length > 0 && (
                          <p className="text-zinc-500 text-sm pl-4">+ {item.toppings.map((t: { name: string }) => t.name).join(", ")}</p>
                        )}
                        {item.specialInstructions && (
                          <p className="text-zinc-500 text-sm pl-4 italic">&quot;{item.specialInstructions}&quot;</p>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-zinc-700 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Subtotal</span>
                      <span className="text-zinc-300">{formatPrice(selectedOrder.subtotal)}</span>
                    </div>
                    {parseFloat(selectedOrder.deliveryFee) > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-400">Delivery</span>
                        <span className="text-zinc-300">{formatPrice(selectedOrder.deliveryFee)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Tax</span>
                      <span className="text-zinc-300">{formatPrice(selectedOrder.tax)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg pt-2">
                      <span className="text-white">Total</span>
                      <span className="text-white">{formatPrice(selectedOrder.total)}</span>
                    </div>
                  </div>
                </div>

                {statusFlow[selectedOrder.status]?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-zinc-400 mb-2">Update Status</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {statusFlow[selectedOrder.status].map((nextStatus) => (
                        <button
                          key={nextStatus}
                          onClick={() => updateOrderStatus(selectedOrder.id, nextStatus)}
                          disabled={updatingStatus}
                          className={`py-3 text-sm rounded-xl transition font-medium flex items-center justify-center gap-2 ${
                            nextStatus === "CANCELLED"
                              ? "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                              : `${statusColors[nextStatus].bg} ${statusColors[nextStatus].text} hover:opacity-80`
                          }`}
                        >
                          {(() => {
                            const Icon = statusIcons[nextStatus];
                            return Icon ? <Icon size={16} /> : null;
                          })()}
                          {nextStatus.replace(/_/g, " ")}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-semibold text-zinc-400 mb-2">Internal Notes</h4>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Add a note..."
                      className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                      onKeyDown={(e) => e.key === "Enter" && addNote()}
                    />
                    <button
                      onClick={addNote}
                      disabled={addingNote || !newNote.trim()}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-zinc-700 text-white text-sm rounded-lg transition"
                    >
                      {addingNote ? "..." : "Add"}
                    </button>
                  </div>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {selectedOrder.internalNotes?.map((note) => (
                      <div key={note.id} className="bg-zinc-800/50 rounded-lg p-3">
                        <p className="text-white text-sm">{note.content}</p>
                        <p className="text-zinc-500 text-xs mt-1">{note.createdBy} • {formatDate(note.createdAt)}</p>
                      </div>
                    ))}
                    {(!selectedOrder.internalNotes || selectedOrder.internalNotes.length === 0) && (
                      <p className="text-zinc-500 text-sm text-center py-2">No notes yet</p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-zinc-400 mb-2">Status History</h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {selectedOrder.statusHistory.map((entry) => (
                      <div key={entry.id} className="flex items-start gap-2">
                        <span className={`px-2 py-0.5 text-xs rounded ${statusColors[entry.status].bg} ${statusColors[entry.status].text}`}>
                          {entry.status.replace(/_/g, " ")}
                        </span>
                        <span className="text-zinc-500 text-xs">{formatDate(entry.createdAt)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setOrderToDelete(selectedOrder);
                    setShowDeleteConfirm(true);
                  }}
                  className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-medium rounded-xl transition"
                >
                  Cancel & Archive Order
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showOrderDetail && selectedOrder && (
          <div className="hidden lg:block fixed inset-y-0 right-0 w-[480px] bg-zinc-900 border-l border-zinc-800 z-40 overflow-y-auto">
            <div className="sticky top-0 bg-zinc-900 p-6 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold text-white">#{selectedOrder.orderNumber}</h3>
                <span className={`px-3 py-1 text-sm rounded-full ${statusColors[selectedOrder.status].bg} ${statusColors[selectedOrder.status].text}`}>
                  {selectedOrder.status.replace(/_/g, " ")}
                </span>
              </div>
              <button
                onClick={() => setShowOrderDetail(false)}
                className="p-2 hover:bg-zinc-800 rounded-lg"
              >
                <svg className="w-6 h-6 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => callCustomer(selectedOrder.customerPhone)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 transition"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call Customer
                </button>
                {selectedOrder.orderType === "DELIVERY" && selectedOrder.deliveryStreet && (
                  <button
                    onClick={() => openMap(selectedOrder)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Open in Maps
                  </button>
                )}
                <button
                  onClick={() => printReceipt(selectedOrder)}
                  className="flex items-center gap-2 px-4 py-2 bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700 transition"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Print Receipt
                </button>
              </div>

              <div className="bg-zinc-800/50 rounded-xl p-4">
                <h4 className="text-sm font-semibold text-zinc-400 mb-3">Customer Information</h4>
                <p className="text-white font-medium">{selectedOrder.customerFirstName} {selectedOrder.customerLastName}</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-zinc-400 text-sm">{selectedOrder.customerEmail}</p>
                  <button
                    onClick={() => copyToClipboard(selectedOrder.customerEmail, "Email")}
                    className="text-zinc-500 hover:text-zinc-300"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-zinc-400 text-sm">{selectedOrder.customerPhone}</p>
                  <button
                    onClick={() => copyToClipboard(selectedOrder.customerPhone, "Phone")}
                    className="text-zinc-500 hover:text-zinc-300"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
                {selectedOrder.orderType === "DELIVERY" && selectedOrder.deliveryStreet && (
                  <div className="mt-3 pt-3 border-t border-zinc-700">
                    <h5 className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Delivery Address</h5>
                    <p className="text-white text-sm">
                      {selectedOrder.deliveryStreet}
                      {selectedOrder.deliveryApartment && `, ${selectedOrder.deliveryApartment}`}
                    </p>
                    <p className="text-white text-sm">
                      {selectedOrder.deliveryPostalCode} {selectedOrder.deliveryCity}
                    </p>
                    {selectedOrder.deliveryInstructions && (
                      <p className="text-zinc-400 text-sm mt-2 italic">&quot;{selectedOrder.deliveryInstructions}&quot;</p>
                    )}
                  </div>
                )}
              </div>

              <div className="bg-zinc-800/50 rounded-xl p-4">
                <h4 className="text-sm font-semibold text-zinc-400 mb-3">Order Items</h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id}>
                      <div className="flex justify-between">
                        <span className="text-white">{item.quantity}x {item.name}</span>
                        <span className="text-zinc-400">{formatPrice(String(parseFloat(item.price) * item.quantity))}</span>
                      </div>
                      {item.toppings && Array.isArray(item.toppings) && item.toppings.length > 0 && (
                        <p className="text-zinc-500 text-sm pl-4">+ {item.toppings.map((t: { name: string }) => t.name).join(", ")}</p>
                      )}
                      {(item.brothRichness || item.noodleFirmness || item.spiceLevel) && (
                        <p className="text-zinc-500 text-sm pl-4">
                          {[
                            item.brothRichness && `Broth: ${item.brothRichness}`,
                            item.noodleFirmness && `Noodles: ${item.noodleFirmness}`,
                            item.spiceLevel && `Spice: ${item.spiceLevel}`,
                          ].filter(Boolean).join(" • ")}
                        </p>
                      )}
                      {item.specialInstructions && (
                        <p className="text-zinc-500 text-sm pl-4 italic">&quot;{item.specialInstructions}&quot;</p>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-zinc-700 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Subtotal</span>
                    <span className="text-zinc-300">{formatPrice(selectedOrder.subtotal)}</span>
                  </div>
                  {parseFloat(selectedOrder.deliveryFee) > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Delivery Fee</span>
                      <span className="text-zinc-300">{formatPrice(selectedOrder.deliveryFee)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Tax (9%)</span>
                    <span className="text-zinc-300">{formatPrice(selectedOrder.tax)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg pt-2 border-t border-zinc-700">
                    <span className="text-white">Total</span>
                    <span className="text-white">{formatPrice(selectedOrder.total)}</span>
                  </div>
                </div>
              </div>

              {statusFlow[selectedOrder.status]?.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-zinc-400 mb-3">Update Status</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {statusFlow[selectedOrder.status].map((nextStatus) => (
                      <button
                        key={nextStatus}
                        onClick={() => updateOrderStatus(selectedOrder.id, nextStatus)}
                        disabled={updatingStatus}
                        className={`py-3 text-sm rounded-xl transition font-medium flex items-center justify-center gap-2 ${
                          nextStatus === "CANCELLED"
                            ? "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                            : `${statusColors[nextStatus].bg} ${statusColors[nextStatus].text} hover:opacity-80`
                        }`}
                      >
                        {(() => {
                          const Icon = statusIcons[nextStatus];
                          return Icon ? <Icon size={16} /> : null;
                        })()}
                        {nextStatus.replace(/_/g, " ")}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-sm font-semibold text-zinc-400 mb-3">Internal Notes</h4>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add an internal note..."
                    className="flex-1 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                    onKeyDown={(e) => e.key === "Enter" && addNote()}
                  />
                  <button
                    onClick={addNote}
                    disabled={addingNote || !newNote.trim()}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-zinc-700 text-white rounded-lg transition"
                  >
                    {addingNote ? "..." : "Add"}
                  </button>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedOrder.internalNotes?.map((note) => (
                    <div key={note.id} className="bg-zinc-800/50 rounded-lg p-3">
                      <p className="text-white text-sm">{note.content}</p>
                      <p className="text-zinc-500 text-xs mt-1">{note.createdBy} • {formatDate(note.createdAt)}</p>
                    </div>
                  ))}
                  {(!selectedOrder.internalNotes || selectedOrder.internalNotes.length === 0) && (
                    <p className="text-zinc-500 text-sm text-center py-4">No internal notes yet</p>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-zinc-400 mb-3">Status History</h4>
                <div className="space-y-3">
                  {selectedOrder.statusHistory.map((entry) => (
                    <div key={entry.id} className="flex items-start gap-3">
                      <div className="mt-1">
                        <div className={`w-2 h-2 rounded-full ${statusColors[entry.status].bg.replace("/10", "")}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 text-xs rounded ${statusColors[entry.status].bg} ${statusColors[entry.status].text}`}>
                            {entry.status.replace(/_/g, " ")}
                          </span>
                          <span className="text-zinc-500 text-xs">{formatDate(entry.createdAt)}</span>
                        </div>
                        {entry.note && <p className="text-zinc-400 text-sm mt-1">{entry.note}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  setOrderToDelete(selectedOrder);
                  setShowDeleteConfirm(true);
                }}
                className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-medium rounded-xl transition"
              >
                Cancel & Archive Order
              </button>
            </div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDeleteConfirm && orderToDelete && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowDeleteConfirm(false);
                setOrderToDelete(null);
              }}
              className="fixed inset-0 bg-black/60 z-[60]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-md mx-auto bg-zinc-900 rounded-2xl p-6 z-[60] border border-zinc-800"
            >
              <h3 className="text-xl font-bold text-white mb-2">Cancel Order?</h3>
              <p className="text-zinc-400 mb-6">
                Are you sure you want to cancel order #{orderToDelete.orderNumber}? 
                The customer will be notified and the order will be archived.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setOrderToDelete(null);
                  }}
                  className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition"
                >
                  Keep Order
                </button>
                <button
                  onClick={() => deleteOrder(orderToDelete.id)}
                  className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition"
                >
                  Cancel Order
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showBulkActions && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBulkActions(false)}
              className="fixed inset-0 bg-black/60 z-[60]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-md mx-auto bg-zinc-900 rounded-2xl p-6 z-[60] border border-zinc-800"
            >
              <h3 className="text-xl font-bold text-white mb-2">Bulk Update {selectedOrders.size} Orders</h3>
              <p className="text-zinc-400 mb-4">Select a status to apply to all selected orders:</p>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {["CONFIRMED", "PREPARING", "READY", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"].map((s) => (
                  <button
                    key={s}
                    onClick={() => bulkUpdateStatus(s)}
                    className={`py-3 text-sm rounded-xl transition font-medium flex items-center justify-center gap-2 ${
                      s === "CANCELLED"
                        ? "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                        : `${statusColors[s].bg} ${statusColors[s].text} hover:opacity-80`
                    }`}
                  >
                    {(() => {
                      const Icon = statusIcons[s];
                      return Icon ? <Icon size={16} /> : null;
                    })()}
                    {s.replace(/_/g, " ")}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowBulkActions(false)}
                className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition"
              >
                Cancel
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-24 lg:bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl shadow-lg z-[70] ${
              toast.type === "success" ? "bg-green-500" : "bg-red-500"
            } text-white font-medium`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}