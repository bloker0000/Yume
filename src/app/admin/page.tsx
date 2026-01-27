"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: string;
}

interface StatusHistoryEntry {
  id: number;
  status: string;
  note: string | null;
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
  total: string;
  createdAt: string;
  items: OrderItem[];
  statusHistory: StatusHistoryEntry[];
}

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-500/20 text-yellow-500",
  CONFIRMED: "bg-blue-500/20 text-blue-500",
  PREPARING: "bg-orange-500/20 text-orange-500",
  READY: "bg-green-500/20 text-green-500",
  OUT_FOR_DELIVERY: "bg-purple-500/20 text-purple-500",
  DELIVERED: "bg-green-500/20 text-green-500",
  PICKED_UP: "bg-green-500/20 text-green-500",
  CANCELLED: "bg-red-500/20 text-red-500",
};

const statusOptions = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "READY",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "PICKED_UP",
  "CANCELLED",
];

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchOrders();
    }
  }, [status, filter]);

  const fetchOrders = async () => {
    try {
      const params = new URLSearchParams();
      if (filter !== "all") params.append("status", filter);
      
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
  };

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
      }
    } catch (error) {
      console.error("Error updating order:", error);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat("nl-NL", {
      style: "currency",
      currency: "EUR",
    }).format(parseFloat(price));
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-red-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <header className="bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">
            <span className="text-red-500">夢</span> Yume Admin
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-zinc-400 text-sm">{session.user?.email}</span>
            <button
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm rounded-lg transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Orders</h2>
          <div className="flex gap-2">
            {["all", "PENDING", "CONFIRMED", "PREPARING", "READY", "OUT_FOR_DELIVERY"].map((s) => (
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="bg-zinc-900 rounded-xl p-8 text-center border border-zinc-800">
                <p className="text-zinc-400">No orders found</p>
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className={`bg-zinc-900 rounded-xl p-4 border cursor-pointer transition ${
                    selectedOrder?.id === order.id
                      ? "border-red-500"
                      : "border-zinc-800 hover:border-zinc-700"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-white">#{order.orderNumber}</p>
                      <p className="text-sm text-zinc-400">
                        {order.customerFirstName} {order.customerLastName}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${statusColors[order.status]}`}>
                      {order.status.replace(/_/g, " ")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-400">{formatDate(order.createdAt)}</span>
                    <span className="text-white font-medium">{formatPrice(order.total)}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="lg:sticky lg:top-8 h-fit">
            {selectedOrder ? (
              <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
                <div className="p-6 border-b border-zinc-800">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        Order #{selectedOrder.orderNumber}
                      </h3>
                      <p className="text-zinc-400">{formatDate(selectedOrder.createdAt)}</p>
                    </div>
                    <span className={`px-3 py-1 text-sm rounded-full ${statusColors[selectedOrder.status]}`}>
                      {selectedOrder.status.replace(/_/g, " ")}
                    </span>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    {statusOptions.map((s) => (
                      <button
                        key={s}
                        onClick={() => updateOrderStatus(selectedOrder.id, s)}
                        disabled={updatingStatus || selectedOrder.status === s}
                        className={`px-3 py-1.5 text-xs rounded-lg transition ${
                          selectedOrder.status === s
                            ? "bg-red-500 text-white"
                            : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 disabled:opacity-50"
                        }`}
                      >
                        {s.replace(/_/g, " ")}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-6 border-b border-zinc-800">
                  <h4 className="text-sm font-semibold text-zinc-400 mb-3">Customer</h4>
                  <p className="text-white">
                    {selectedOrder.customerFirstName} {selectedOrder.customerLastName}
                  </p>
                  <p className="text-zinc-400 text-sm">{selectedOrder.customerEmail}</p>
                  <p className="text-zinc-400 text-sm">{selectedOrder.customerPhone}</p>
                  
                  {selectedOrder.orderType === "DELIVERY" && selectedOrder.deliveryStreet && (
                    <div className="mt-3 pt-3 border-t border-zinc-800">
                      <h4 className="text-sm font-semibold text-zinc-400 mb-1">Delivery Address</h4>
                      <p className="text-white text-sm">
                        {selectedOrder.deliveryStreet}
                        {selectedOrder.deliveryApartment && `, ${selectedOrder.deliveryApartment}`}
                      </p>
                      <p className="text-white text-sm">
                        {selectedOrder.deliveryPostalCode} {selectedOrder.deliveryCity}
                      </p>
                    </div>
                  )}
                </div>

                <div className="p-6 border-b border-zinc-800">
                  <h4 className="text-sm font-semibold text-zinc-400 mb-3">Items</h4>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-white">
                          {item.quantity}x {item.name}
                        </span>
                        <span className="text-zinc-400">
                          {formatPrice(String(parseFloat(item.price) * item.quantity))}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-zinc-800 flex justify-between">
                    <span className="font-semibold text-white">Total</span>
                    <span className="font-semibold text-white">{formatPrice(selectedOrder.total)}</span>
                  </div>
                </div>

                <div className="p-6">
                  <h4 className="text-sm font-semibold text-zinc-400 mb-3">Status History</h4>
                  <div className="space-y-3">
                    {selectedOrder.statusHistory.map((entry) => (
                      <div key={entry.id} className="text-sm">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 text-xs rounded ${statusColors[entry.status]}`}>
                            {entry.status.replace(/_/g, " ")}
                          </span>
                          <span className="text-zinc-500">{formatDate(entry.createdAt)}</span>
                        </div>
                        {entry.note && <p className="text-zinc-400 mt-1">{entry.note}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-zinc-900 rounded-xl p-8 text-center border border-zinc-800">
                <p className="text-zinc-400">Select an order to view details</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}