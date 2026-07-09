// src/features/admin/dashboard/AdminDashboard.tsx
import { useQuery } from "@tanstack/react-query";
import { BookOpen, ShoppingBag, DollarSign, Clock, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { getBooks, apiFetch } from "@/services/api";
import { formatPrice } from "@/lib/formatPrice";
import type { Order } from "@/services/api";

const getOrders = (): Promise<Order[]> =>
  fetch(`${(() => { const b = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"; return b.replace(/\/+$/, ""); })()}/api/orders`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("admin_token") || ""}`,
    },
  }).then((r) => r.json());

export default function AdminDashboard() {
  const { data: books = [], isLoading: booksLoading } = useQuery({
    queryKey: ["books"],
    queryFn: getBooks,
  });

  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
    retry: false,
  });

  const isLoading = booksLoading || ordersLoading;

  const totalBooks = books.length;
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const approvedOrders = orders.filter((o) => o.status === "approved").length;
  const rejectedOrders = orders.filter((o) => o.status === "rejected").length;
  const totalRevenueCents = orders
    .filter((o) => o.status === "approved")
    .reduce((sum, o) => sum + (o.amountCents || 0), 0);

  const stats = [
    {
      label: "Total Books",
      value: totalBooks,
      icon: BookOpen,
      color: "bg-[#2E1208]",
      iconColor: "text-[#D4A017]",
    },
    {
      label: "Total Orders",
      value: totalOrders,
      icon: ShoppingBag,
      color: "bg-[#D4A017]",
      iconColor: "text-[#2E1208]",
    },
    {
      label: "Revenue (Approved)",
      value: formatPrice(totalRevenueCents),
      icon: DollarSign,
      color: "bg-green-700",
      iconColor: "text-green-200",
    },
    {
      label: "Pending Orders",
      value: pendingOrders,
      icon: Clock,
      color: "bg-orange-600",
      iconColor: "text-orange-100",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="h-8 w-8 animate-spin text-[#D4A017]" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-heading text-[#2E1208]">Dashboard</h1>
        <p className="text-sm text-[#5C4436] mt-1">Live data from your database</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl shadow-sm border border-[#E8DDD4] p-6 flex items-center gap-4">
            <div className={`${stat.color} p-3 rounded-xl`}>
              <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
            </div>
            <div>
              <p className="text-xs text-[#5C4436] font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-[#2E1208] mt-0.5">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Order breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-[#E8DDD4] p-5 flex items-center gap-4 shadow-sm">
          <Clock className="h-8 w-8 text-orange-500" />
          <div>
            <p className="text-xs text-[#5C4436] font-medium">Pending</p>
            <p className="text-xl font-bold text-[#2E1208]">{pendingOrders}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E8DDD4] p-5 flex items-center gap-4 shadow-sm">
          <CheckCircle className="h-8 w-8 text-green-600" />
          <div>
            <p className="text-xs text-[#5C4436] font-medium">Approved</p>
            <p className="text-xl font-bold text-[#2E1208]">{approvedOrders}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E8DDD4] p-5 flex items-center gap-4 shadow-sm">
          <XCircle className="h-8 w-8 text-red-500" />
          <div>
            <p className="text-xs text-[#5C4436] font-medium">Rejected</p>
            <p className="text-xl font-bold text-[#2E1208]">{rejectedOrders}</p>
          </div>
        </div>
      </div>

      {/* Recent orders table */}
      <div className="bg-white rounded-2xl border border-[#E8DDD4] shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E8DDD4]">
          <h2 className="font-heading font-semibold text-[#2E1208]">Recent Orders</h2>
        </div>
        {orders.length === 0 ? (
          <div className="p-10 text-center text-[#5C4436]">
            <ShoppingBag className="h-10 w-10 mx-auto mb-3 text-[#C9B8A8]" />
            <p>No orders yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F9F6EF] text-[#5C4436]">
                <tr>
                  <th className="px-6 py-3 text-left font-medium">Book</th>
                  <th className="px-6 py-3 text-left font-medium">Email</th>
                  <th className="px-6 py-3 text-left font-medium">Method</th>
                  <th className="px-6 py-3 text-left font-medium">Amount</th>
                  <th className="px-6 py-3 text-left font-medium">Status</th>
                  <th className="px-6 py-3 text-left font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DDD4]">
                {orders.slice(0, 10).map((order) => (
                  <tr key={order.id} className="hover:bg-[#F9F6EF]/50 transition-colors">
                    <td className="px-6 py-3 font-medium text-[#2E1208] max-w-[160px] truncate">{order.bookTitle}</td>
                    <td className="px-6 py-3 text-[#5C4436] max-w-[160px] truncate">{order.email}</td>
                    <td className="px-6 py-3 text-[#5C4436] capitalize">{order.paymentMethod}</td>
                    <td className="px-6 py-3 text-[#2E1208] font-medium">{formatPrice(order.amountCents)}</td>
                    <td className="px-6 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        order.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : order.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-orange-100 text-orange-700"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-[#5C4436]">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}