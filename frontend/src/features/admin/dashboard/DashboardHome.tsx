import { useMemo, type ElementType } from "react";
import { Link } from "react-router-dom";

import { useQuery } from "@tanstack/react-query";

import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  CreditCard,
  DollarSign,
  Eye,
  MessageSquare,
  PackageCheck,
  Plus,
  RefreshCw,
  ShoppingBag,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";

import { getBooks } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";

/* =========================================================
   TYPES
========================================================= */

type DashboardOrder = {
  id: string;
  bookTitle?: string | null;
  email?: string | null;
  customerName?: string | null;
  amountCents?: number | null;
  currency?: string | null;
  status?: string | null;
  paymentStatus?: string | null;
  orderType?: string | null;
  createdAt?: string | null;
};

/* =========================================================
   DATA
========================================================= */

const API_ORIGIN = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"
)
  .replace(/\/+$/, "")
  .replace(/\/api$/, "");

/*
 * Throws on failure so the dashboard can show a real error
 * instead of silently pretending there are no orders.
 */
const fetchOrders = async (): Promise<DashboardOrder[]> => {
  const token =
    localStorage.getItem("admin_token") ||
    localStorage.getItem("token") ||
    "";

  const response = await fetch(`${API_ORIGIN}/api/orders`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error(`Failed to load orders (${response.status})`);
  }

  const data = await response.json();

  return Array.isArray(data) ? data : data.orders || [];
};

/* =========================================================
   HELPERS
========================================================= */

const upper = (value?: string | null) =>
  String(value || "").toUpperCase();

const orderCurrency = (order: DashboardOrder) =>
  upper(order.currency) || "KES";

/* Orders are stored in the currency they were placed in (KES by default). */
const money = (cents?: number | null, currency = "KES") => {
  const code = upper(currency) || "KES";

  try {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: code,
      maximumFractionDigits: code === "KES" ? 0 : 2,
    }).format(Number(cents || 0) / 100);
  } catch {
    return `${code} ${(Number(cents || 0) / 100).toFixed(2)}`;
  }
};

const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

const formatDate = (date?: string | null) => {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "—";
  }

  return parsed.toLocaleDateString("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatRelativeDate = (date?: string | null) => {
  if (!date) return "";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  const diff = Date.now() - parsed.getTime();

  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) return "Just now";

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);

  if (days < 7) {
    return `${days}d ago`;
  }

  return formatDate(date);
};

const statusLabel = (status?: string | null) => {
  switch (upper(status)) {
    case "PENDING":
      return "Pending";
    case "CONFIRMED":
      return "Confirmed";
    case "PROCESSING":
      return "Processing";
    case "READY":
      return "Ready";
    case "SHIPPED":
      return "Shipped";
    case "COMPLETED":
      return "Completed";
    case "CANCELLED":
      return "Cancelled";
    default:
      return status || "Unknown";
  }
};

const statusClasses = (status?: string | null) => {
  switch (upper(status)) {
    case "COMPLETED":
      return "bg-emerald-50 text-emerald-700 border-emerald-100";
    case "CONFIRMED":
    case "READY":
      return "bg-blue-50 text-blue-700 border-blue-100";
    case "PROCESSING":
      return "bg-violet-50 text-violet-700 border-violet-100";
    case "SHIPPED":
      return "bg-indigo-50 text-indigo-700 border-indigo-100";
    case "CANCELLED":
      return "bg-red-50 text-red-700 border-red-100";
    case "PENDING":
    default:
      return "bg-amber-50 text-amber-700 border-amber-100";
  }
};

const paymentClasses = (status?: string | null) => {
  switch (upper(status)) {
    case "PAID":
      return "bg-emerald-50 text-emerald-700";
    case "FAILED":
      return "bg-red-50 text-red-700";
    case "REFUNDED":
      return "bg-slate-100 text-slate-700";
    case "PENDING":
      return "bg-blue-50 text-blue-700";
    default:
      return "bg-amber-50 text-amber-700";
  }
};

const WEEKS = 12;
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

/* =========================================================
   STAT CARD
========================================================= */

type StatCardProps = {
  label: string;
  value: string | number;
  description: string;
  icon: ElementType;
  trend?: string;
  trendUp?: boolean;
};

function StatCard({
  label,
  value,
  description,
  icon: Icon,
  trend,
  trendUp = true,
}: StatCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-[#E5E0DB] bg-white p-5 shadow-[0_2px_12px_rgba(43,26,18,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#D7C49B] hover:shadow-[0_8px_24px_rgba(43,26,18,0.08)]">
      <div className="absolute right-0 top-0 h-20 w-20 translate-x-8 -translate-y-8 rounded-full bg-[#C9A227]/5" />

      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#8A817B]">
            {label}
          </p>

          <p className="mt-2 text-2xl font-semibold tracking-tight text-[#2B1A12] sm:text-3xl">
            {value}
          </p>

          <div className="mt-2 flex items-center gap-2">
            {trend && (
              <span
                className={[
                  "inline-flex items-center gap-0.5 text-[11px] font-semibold",
                  trendUp ? "text-emerald-600" : "text-red-600",
                ].join(" ")}
              >
                {trendUp ? (
                  <ArrowUpRight className="h-3.5 w-3.5" />
                ) : (
                  <ArrowDownRight className="h-3.5 w-3.5" />
                )}

                {trend}
              </span>
            )}

            <span className="truncate text-[11px] text-[#8A817B]">
              {description}
            </span>
          </div>
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#C9A227]/10 text-[#A98216] transition-colors group-hover:bg-[#C9A227] group-hover:text-white">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function AdminDashboard() {
  const { user } = useAuth();

  const {
    data: books = [],
    isLoading: booksLoading,
    isError: booksError,
  } = useQuery({
    queryKey: ["books"],
    queryFn: getBooks,
  });

  const {
    data: allOrders = [],
    isLoading: ordersLoading,
    isError: ordersError,
    error: ordersErrorDetail,
    refetch: refetchOrders,
    isFetching: ordersFetching,
  } = useQuery({
    // Dedicated key so other admin pages can't overwrite this cache entry
    queryKey: ["admin", "dashboard", "orders"],
    queryFn: fetchOrders,
    retry: false,
  });

  const loading = booksLoading || ordersLoading;

  /*
   * Book inquiries are stored as orders with orderType INQUIRY.
   * They're not sales, so they're kept out of every order metric.
   */
  const inquiries = useMemo(
    () => allOrders.filter((order) => upper(order.orderType) === "INQUIRY"),
    [allOrders]
  );

  const orders = useMemo(
    () => allOrders.filter((order) => upper(order.orderType) !== "INQUIRY"),
    [allOrders]
  );

  const paidOrders = useMemo(
    () => orders.filter((order) => upper(order.paymentStatus) === "PAID"),
    [orders]
  );

  /* Revenue per currency, so KES is never mixed with USD */
  const revenueByCurrency = useMemo(() => {
    const totals = new Map<string, number>();

    paidOrders.forEach((order) => {
      const currency = orderCurrency(order);
      totals.set(
        currency,
        (totals.get(currency) || 0) + Number(order.amountCents || 0)
      );
    });

    return totals;
  }, [paidOrders]);

  const kesRevenue = revenueByCurrency.get("KES") || 0;

  const otherRevenue = Array.from(revenueByCurrency.entries())
    .filter(([currency]) => currency !== "KES")
    .map(([currency, cents]) => money(cents, currency))
    .join(" + ");

  const pendingOrders = orders.filter(
    (order) => upper(order.status) === "PENDING"
  );

  const activeOrders = orders.filter((order) =>
    ["CONFIRMED", "PROCESSING", "READY", "SHIPPED"].includes(
      upper(order.status)
    )
  );

  const completedOrders = orders.filter(
    (order) => upper(order.status) === "COMPLETED"
  );

  const cancelledOrders = orders.filter(
    (order) => upper(order.status) === "CANCELLED"
  );

  const pendingPayments = orders.filter(
    (order) =>
      upper(order.status) !== "CANCELLED" &&
      ["PENDING", "UNPAID", ""].includes(upper(order.paymentStatus))
  );

  /* Each order is counted once, even if it is both pending and unpaid */
  const needsAttention = orders.filter(
    (order) =>
      upper(order.status) !== "CANCELLED" &&
      (upper(order.status) === "PENDING" ||
        ["PENDING", "UNPAID", ""].includes(upper(order.paymentStatus)))
  ).length;

  const recentOrders = useMemo(() => {
    return [...allOrders]
      .sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      )
      .slice(0, 6);
  }, [allOrders]);

  const topBooks = useMemo(() => {
    const counts = new Map<string, { title: string; count: number }>();

    orders.forEach((order) => {
      const title = order.bookTitle || "Book order";
      const existing = counts.get(title);

      if (existing) {
        existing.count += 1;
      } else {
        counts.set(title, { title, count: 1 });
      }
    });

    return Array.from(counts.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [orders]);

  /* Real weekly KES revenue for the last 12 weeks */
  const weeklyRevenue = useMemo(() => {
    const buckets = Array.from({ length: WEEKS }, () => 0);
    const now = Date.now();

    paidOrders.forEach((order) => {
      if (orderCurrency(order) !== "KES" || !order.createdAt) return;

      const created = new Date(order.createdAt).getTime();

      if (Number.isNaN(created)) return;

      const weeksAgo = Math.floor((now - created) / WEEK_MS);

      if (weeksAgo < 0 || weeksAgo >= WEEKS) return;

      buckets[WEEKS - 1 - weeksAgo] += Number(order.amountCents || 0);
    });

    return buckets;
  }, [paidOrders]);

  const maxWeekly = Math.max(...weeklyRevenue, 0);

  const statusBreakdown = [
    {
      label: "Pending",
      value: pendingOrders.length,
      icon: Clock3,
      className: "text-amber-600",
      bg: "bg-amber-50",
      bar: "bg-amber-500",
    },
    {
      label: "In progress",
      value: activeOrders.length,
      icon: PackageCheck,
      className: "text-blue-600",
      bg: "bg-blue-50",
      bar: "bg-blue-500",
    },
    {
      label: "Completed",
      value: completedOrders.length,
      icon: CheckCircle2,
      className: "text-emerald-600",
      bg: "bg-emerald-50",
      bar: "bg-emerald-500",
    },
    {
      label: "Cancelled",
      value: cancelledOrders.length,
      icon: XCircle,
      className: "text-red-600",
      bg: "bg-red-50",
      bar: "bg-red-500",
    },
  ];

  const totalStatusOrders =
    pendingOrders.length +
    activeOrders.length +
    completedOrders.length +
    cancelledOrders.length;

  const getStatusWidth = (value: number) => {
    if (!totalStatusOrders || value === 0) return 0;

    return Math.max(4, Math.round((value / totalStatusOrders) * 100));
  };

  const quickLinks = [
    { to: "/admin/books", label: "Manage books", icon: BookOpen },
    { to: "/admin/blog", label: "Manage blog", icon: BookOpen },
    { to: "/admin/orders", label: "Review orders", icon: ShoppingBag },
    { to: "/admin/payments", label: "Review payments", icon: CreditCard },
  ];

  return (
    <div className="mx-auto max-w-[1500px] space-y-7">
      {/* Header */}
      <section className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#A98216]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#C9A227]" />

            Dashboard Overview
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-[#2B1A12] sm:text-4xl">
            {getGreeting()}, {user?.name?.split(" ")[0] || "Admin"}.
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#77706B]">
            Here's a snapshot of your publishing platform, customer orders and
            payment activity.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => refetchOrders()}
            disabled={ordersFetching}
            className="inline-flex items-center gap-2 rounded-xl border border-[#E1DDD8] bg-white px-4 py-2.5 text-sm font-semibold text-[#49372D] shadow-sm transition hover:border-[#C9A227] hover:text-[#8C6B14] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              className={[
                "h-4 w-4",
                ordersFetching ? "animate-spin" : "",
              ].join(" ")}
            />

            Refresh
          </button>

          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-[#2B1A12] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#3A2419]"
          >
            View website

            <ArrowUpRight className="h-4 w-4 text-[#D5B45C]" />
          </a>
        </div>
      </section>

      {/* KPI Cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total books"
          value={booksLoading ? "—" : books.length}
          description="Catalogue items"
          icon={BookOpen}
        />

        <StatCard
          label="Total orders"
          value={ordersLoading ? "—" : orders.length}
          description={`${inquiries.length} ${
            inquiries.length === 1 ? "inquiry" : "inquiries"
          } separate`}
          icon={ShoppingBag}
          trend={`${completedOrders.length} completed`}
        />

        <StatCard
          label="Revenue"
          value={loading ? "—" : money(kesRevenue, "KES")}
          description={otherRevenue ? `+ ${otherRevenue}` : "Paid orders"}
          icon={DollarSign}
          trend={`${paidOrders.length} payments`}
        />

        <StatCard
          label="Needs attention"
          value={ordersLoading ? "—" : needsAttention}
          description="Orders & payments"
          icon={Clock3}
          trend={needsAttention > 0 ? "Review required" : "All clear"}
          trendUp={needsAttention === 0}
        />
      </section>

      {/* Analytics */}
      <section className="grid gap-6 xl:grid-cols-[1.55fr_1fr]">
        {/* Business performance */}
        <div className="overflow-hidden rounded-2xl border border-[#E5E0DB] bg-white shadow-[0_2px_12px_rgba(43,26,18,0.04)]">
          <div className="flex flex-col gap-3 border-b border-[#EAE6E2] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold text-[#2B1A12]">
                Business performance
              </h2>

              <p className="mt-1 text-xs text-[#817973]">
                Current order and payment performance
              </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-lg bg-[#C9A227]/10 px-3 py-2 text-xs font-semibold text-[#8C6B14]">
              <TrendingUp className="h-3.5 w-3.5" />

              Last {WEEKS} weeks
            </div>
          </div>

          <div className="grid gap-8 p-6 md:grid-cols-2">
            {/* Revenue */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8A817B]">
                Paid revenue
              </p>

              <p className="mt-2 text-3xl font-semibold tracking-tight text-[#2B1A12]">
                {loading ? "—" : money(kesRevenue, "KES")}
              </p>

              <div className="mt-2 flex items-center gap-2 text-xs text-[#817973]">
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
                  <TrendingUp className="h-3.5 w-3.5" />

                  {paidOrders.length}
                </span>

                paid transactions
              </div>

              {/* Revenue chart (real weekly totals) */}
              <div className="mt-8 flex h-32 items-end gap-2">
                {weeklyRevenue.map((cents, index) => {
                  const height =
                    maxWeekly > 0
                      ? Math.max(4, Math.round((cents / maxWeekly) * 100))
                      : 4;

                  return (
                    <div
                      key={index}
                      title={`${money(cents, "KES")} · ${
                        index === WEEKS - 1
                          ? "this week"
                          : `${WEEKS - 1 - index}w ago`
                      }`}
                      className="group flex h-full flex-1 items-end"
                    >
                      <div
                        style={{ height: `${height}%` }}
                        className={[
                          "w-full rounded-t-md transition-all duration-200",
                          cents === 0
                            ? "bg-[#EEE6D2]"
                            : index === WEEKS - 1
                              ? "bg-[#C9A227]"
                              : "bg-[#E8D9A9] group-hover:bg-[#C9A227]",
                        ].join(" ")}
                      />
                    </div>
                  );
                })}
              </div>

              <div className="mt-2 flex justify-between text-[10px] text-[#8A817B]">
                <span>{WEEKS} weeks ago</span>
                <span>This week</span>
              </div>
            </div>

            {/* Order distribution */}
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8A817B]">
                    Order distribution
                  </p>

                  <p className="mt-1 text-xs text-[#817973]">
                    By current status
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C9A227]/10 text-[#A98216]">
                  <ShoppingBag className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {statusBreakdown.map((item) => {
                  const Icon = item.icon;

                  const width = getStatusWidth(item.value);

                  return (
                    <div key={item.label}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className={[
                              "flex h-7 w-7 items-center justify-center rounded-lg",
                              item.bg,
                            ].join(" ")}
                          >
                            <Icon
                              className={[
                                "h-3.5 w-3.5",
                                item.className,
                              ].join(" ")}
                            />
                          </div>

                          <span className="text-xs font-medium text-[#59483E]">
                            {item.label}
                          </span>
                        </div>

                        <span className="text-xs font-semibold text-[#2B1A12]">
                          {item.value}
                        </span>
                      </div>

                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#EEECE9]">
                        <div
                          style={{ width: `${width}%` }}
                          className={["h-full rounded-full", item.bar].join(
                            " "
                          )}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-2xl border border-[#4A3326] bg-[#2B1A12] p-6 text-white shadow-[0_8px_28px_rgba(43,26,18,0.16)]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#D5B45C]">
                Quick actions
              </p>

              <h2 className="mt-2 text-xl font-semibold">
                Manage your platform
              </h2>

              <p className="mt-1 text-sm leading-6 text-white/60">
                Get to the areas you use most.
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#C9A227]/30 bg-[#C9A227]/10">
              <Plus className="h-5 w-5 text-[#D5B45C]" />
            </div>
          </div>

          <div className="mt-6 space-y-2.5">
            {quickLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition hover:border-[#C9A227]/40 hover:bg-[#C9A227]/10"
              >
                <span className="flex items-center gap-3">
                  <Icon className="h-4 w-4 text-[#D5B45C]" />

                  <span className="text-sm font-medium">{label}</span>
                </span>

                <ArrowRight className="h-4 w-4 text-white/40 transition group-hover:translate-x-1 group-hover:text-[#D5B45C]" />
              </Link>
            ))}
          </div>

          <div className="mt-6 border-t border-white/10 pt-4">
            <div className="flex items-center gap-2 text-xs text-white/50">
              <Users className="h-3.5 w-3.5" />

              Signed in as{" "}

              <span className="font-semibold text-[#D5B45C]">
                {user?.role === "SUPER_ADMIN" ? "Super Admin" : "Administrator"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Recent activity + Popular books */}
      <section className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
        {/* Recent activity */}
        <div className="overflow-hidden rounded-2xl border border-[#E5E0DB] bg-white shadow-[0_2px_12px_rgba(43,26,18,0.04)]">
          <div className="flex items-center justify-between border-b border-[#EAE6E2] px-6 py-5">
            <div>
              <h2 className="font-semibold text-[#2B1A12]">Recent activity</h2>

              <p className="mt-1 text-xs text-[#817973]">
                Latest orders and inquiries
              </p>
            </div>

            <Link
              to="/admin/orders"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#A98216] hover:text-[#7E5F0E]"
            >
              View all

              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {ordersError ? (
            <div className="flex min-h-[220px] flex-col items-center justify-center p-8 text-center">
              <XCircle className="h-8 w-8 text-red-400" />

              <p className="mt-3 text-sm font-semibold text-[#4A3326]">
                Unable to load orders
              </p>

              <p className="mt-1 text-xs text-[#817973]">
                {ordersErrorDetail instanceof Error
                  ? ordersErrorDetail.message
                  : "Please refresh the dashboard and try again."}
              </p>
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="flex min-h-[220px] flex-col items-center justify-center p-8 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#C9A227]/10">
                <ShoppingBag className="h-5 w-5 text-[#A98216]" />
              </div>

              <p className="mt-4 text-sm font-semibold text-[#4A3326]">
                No orders yet
              </p>

              <p className="mt-1 max-w-xs text-xs leading-5 text-[#817973]">
                Customer orders will appear here once they are recorded.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#EEEAE6]">
              {recentOrders.map((order) => {
                const isInquiry = upper(order.orderType) === "INQUIRY";

                return (
                  <div
                    key={order.id}
                    className="flex flex-col gap-3 px-6 py-4 transition hover:bg-[#FAFAF9] sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#C9A227]/10 text-[#A98216]">
                        {isInquiry ? (
                          <MessageSquare className="h-4 w-4" />
                        ) : (
                          <ShoppingBag className="h-4 w-4" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#3A2419]">
                          {order.bookTitle || "Book order"}
                        </p>

                        <p className="mt-0.5 truncate text-xs text-[#817973]">
                          {order.customerName || order.email || "Customer"}
                          {isInquiry && " · Inquiry"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 sm:justify-end">
                      <div className="text-left sm:text-right">
                        <p className="text-sm font-semibold text-[#3A2419]">
                          {isInquiry
                            ? "—"
                            : money(order.amountCents, orderCurrency(order))}
                        </p>

                        <p className="mt-0.5 text-[10px] text-[#8A817B]">
                          {formatRelativeDate(order.createdAt)}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <span
                          className={[
                            "rounded-full border px-2.5 py-1 text-[10px] font-semibold",
                            statusClasses(order.status),
                          ].join(" ")}
                        >
                          {statusLabel(order.status)}
                        </span>

                        {!isInquiry && (
                          <span
                            className={[
                              "rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide",
                              paymentClasses(order.paymentStatus),
                            ].join(" ")}
                          >
                            {order.paymentStatus || "Unpaid"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Popular books */}
        <div className="rounded-2xl border border-[#E5E0DB] bg-white shadow-[0_2px_12px_rgba(43,26,18,0.04)]">
          <div className="flex items-center justify-between border-b border-[#EAE6E2] px-6 py-5">
            <div>
              <h2 className="font-semibold text-[#2B1A12]">Popular books</h2>

              <p className="mt-1 text-xs text-[#817973]">
                Based on recorded orders
              </p>
            </div>

            <BookOpen className="h-5 w-5 text-[#C9A227]" />
          </div>

          {topBooks.length === 0 ? (
            <div className="flex min-h-[220px] items-center justify-center p-8 text-center text-xs text-[#817973]">
              No book sales data available yet.
            </div>
          ) : (
            <div className="p-5">
              <div className="space-y-1">
                {topBooks.map((book, index) => {
                  const maxCount = topBooks[0]?.count || 1;

                  const percentage = Math.max(
                    8,
                    Math.round((book.count / maxCount) * 100)
                  );

                  return (
                    <div
                      key={book.title}
                      className="group rounded-xl px-2 py-3 transition hover:bg-[#FAFAF9]"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#C9A227]/10 text-[11px] font-bold text-[#A98216]">
                          {index + 1}
                        </span>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-3">
                            <p className="truncate text-xs font-semibold text-[#4A3326]">
                              {book.title}
                            </p>

                            <span className="shrink-0 text-[10px] font-semibold text-[#817973]">
                              {book.count}{" "}
                              {book.count === 1 ? "order" : "orders"}
                            </span>
                          </div>

                          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#EEEAE6]">
                            <div
                              style={{ width: `${percentage}%` }}
                              className="h-full rounded-full bg-[#C9A227] transition-all group-hover:bg-[#A98216]"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Link
                to="/admin/books"
                className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-[#E1DDD8] py-2.5 text-xs font-semibold text-[#6D5547] transition hover:border-[#C9A227] hover:bg-[#C9A227]/5 hover:text-[#8C6B14]"
              >
                Manage catalogue

                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Bottom summary */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-[#E5E0DB] bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#8A817B]">
                Completed
              </p>

              <p className="mt-0.5 text-lg font-semibold text-[#2B1A12]">
                {completedOrders.length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#E5E0DB] bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <Clock3 className="h-4 w-4" />
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#8A817B]">
                Pending orders
              </p>

              <p className="mt-0.5 text-lg font-semibold text-[#2B1A12]">
                {pendingOrders.length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#E5E0DB] bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <CreditCard className="h-4 w-4" />
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#8A817B]">
                Pending payments
              </p>

              <p className="mt-0.5 text-lg font-semibold text-[#2B1A12]">
                {pendingPayments.length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#E5E0DB] bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#C9A227]/10 text-[#A98216]">
              <MessageSquare className="h-4 w-4" />
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#8A817B]">
                Inquiries
              </p>

              <p className="mt-0.5 text-lg font-semibold text-[#2B1A12]">
                {inquiries.length}
              </p>
            </div>
          </div>
        </div>
      </section>

      {(booksError || ordersError) && (
        <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
          <Eye className="h-4 w-4 shrink-0" />

          <span>
            Some dashboard information could not be loaded. Your existing
            content and orders remain unaffected.
          </span>
        </div>
      )}
    </div>
  );
}