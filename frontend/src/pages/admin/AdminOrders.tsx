import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Search,
  RefreshCw,
  Eye,
  X,
  Package,
  Clock3,
  Truck,
  CheckCircle2,
  XCircle,
  CreditCard,
  ShoppingBag,
  ChevronDown,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  User,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import { getApiBase } from "@/services/api";

// ============================================================
// TYPES
// ============================================================

type OrderStatus =
  | "PENDING"
  |  "CONFIRMED"
  |  "PROCESSING"
  | "READY"
  | "SHIPPED"
  | "COMPLETED"
  | "CANCELLED";

type PaymentStatus =
  | "UNPAID"
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "REFUNDED";

type OrderType = "HARDCOPY" | "INQUIRY";

type Book = {
  id: string;
  title: string;
  slug?: string;
  coverImage?: string | null;
  priceCents?: number | null;
};

type OrderItem = {
  id: string;
  quantity: number;
  priceCents: number;
  book?: Book | null;
};

type Order = {
  id: string;
  orderNumber?: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;

  orderType?: OrderType | string | null;

  status: OrderStatus;
  paymentStatus: PaymentStatus;

  paymentMethod?: string | null;
  transactionCode?: string | null;

  amountCents: number;

  deliveryAddress?: string | null;
  deliveryCity?: string | null;

  createdAt: string;
  updatedAt?: string;

  items?: OrderItem[];
  book?: Book | null;
};

// ============================================================
// CONSTANTS
// ============================================================

const ORDER_STATUSES: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "READY",
  "SHIPPED",
  "COMPLETED",
  "CANCELLED",
];

const PAYMENT_STATUSES: PaymentStatus[] = [
  "UNPAID",
  "PENDING",
  "PAID",
  "FAILED",
  "REFUNDED",
];

// ============================================================
// HELPERS
// ============================================================

function getToken() {
  return (
    localStorage.getItem("admin_token") ||
    localStorage.getItem("token") ||
    localStorage.getItem("auth_token") ||
    ""
  );
}

async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

  const headers = new Headers(options.headers);

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${getApiBase()}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.error ||
        data?.message ||
        "Something went wrong. Please try again."
    );
  }

  return data as T;
}

function formatPrice(amountCents: number | null | undefined) {
  const amount = Number(amountCents || 0) / 100;

  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(date: string) {
  if (!date) return "—";

  return new Intl.DateTimeFormat("en-KE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

function formatStatus(value: string) {
  return value
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getStatusClasses(status: string) {
  switch (status) {
    case "PENDING":
      return "bg-amber-50 text-amber-700 border-amber-200";

    case "CONFIRMED":
      return "bg-blue-50 text-blue-700 border-blue-200";

    case "PROCESSING":
      return "bg-purple-50 text-purple-700 border-purple-200";

    case "READY":
      return "bg-indigo-50 text-indigo-700 border-indigo-200";

    case "SHIPPED":
      return "bg-cyan-50 text-cyan-700 border-cyan-200";

    case "COMPLETED":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";

    case "CANCELLED":
      return "bg-red-50 text-red-700 border-red-200";

    case "PAID":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";

    case "FAILED":
      return "bg-red-50 text-red-700 border-red-200";

    case "REFUNDED":
      return "bg-slate-100 text-slate-700 border-slate-200";

    default:
      return "bg-slate-50 text-slate-600 border-slate-200";
  }
}

// ============================================================
// API
// ============================================================

async function fetchOrders() {
  return apiRequest<Order[]>("/api/orders");
}

async function updateOrderStatus(
  id: string,
  status: OrderStatus
) {
  return apiRequest(`/api/orders/${id}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
}

async function updatePaymentStatus(
  id: string,
  paymentStatus: PaymentStatus
) {
  return apiRequest(`/api/orders/${id}/payment-status`, {
    method: "PUT",
    body: JSON.stringify({ paymentStatus }),
  });
}

// ============================================================
// STAT CARD
// ============================================================

function StatCard({
  title,
  value,
  icon: Icon,
  description,
}: {
  title: string;
  value: string | number;
  icon: typeof Package;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-[#eadfce] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-[#766957]">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold text-[#3b2a1f]">
            {value}
          </p>

          <p className="mt-1 text-xs text-[#8b7a67]">
            {description}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f5ecdf] text-[#8a5a2b]">
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function AdminOrders() {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<"ALL" | OrderStatus>("ALL");

  const [paymentFilter, setPaymentFilter] =
    useState<"ALL" | PaymentStatus>("ALL");

  const [typeFilter, setTypeFilter] =
    useState<"ALL" | OrderType>("ALL");

  const [selectedOrder, setSelectedOrder] =
    useState<Order | null>(null);

  // ==========================================================
  // QUERY
  // ==========================================================

  const {
    data: orders = [],
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: fetchOrders,
  });

  // ==========================================================
  // STATUS MUTATION
  // ==========================================================

  const statusMutation = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: OrderStatus;
    }) => updateOrderStatus(id, status),

    onSuccess: async () => {
      toast.success("Order status updated successfully.");

      await queryClient.invalidateQueries({
        queryKey: ["admin-orders"],
      });

      setSelectedOrder(null);
    },

    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // ==========================================================
  // PAYMENT MUTATION
  // ==========================================================

  const paymentMutation = useMutation({
    mutationFn: ({
      id,
      paymentStatus,
    }: {
      id: string;
      paymentStatus: PaymentStatus;
    }) =>
      updatePaymentStatus(id, paymentStatus),

    onSuccess: async () => {
      toast.success("Payment status updated successfully.");

      await queryClient.invalidateQueries({
        queryKey: ["admin-orders"],
      });
    },

    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // ==========================================================
  // FILTERING
  // ==========================================================

  const filteredOrders = useMemo(() => {
    const term = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesSearch =
        !term ||
        order.customerName
          ?.toLowerCase()
          .includes(term) ||
        order.customerEmail
          ?.toLowerCase()
          .includes(term) ||
        order.customerPhone
          ?.toLowerCase()
          .includes(term) ||
        order.orderNumber
          ?.toLowerCase()
          .includes(term) ||
        order.id.toLowerCase().includes(term);

      const matchesStatus =
        statusFilter === "ALL" ||
        order.status === statusFilter;

      const matchesPayment =
        paymentFilter === "ALL" ||
        order.paymentStatus === paymentFilter;

      const matchesType =
        typeFilter === "ALL" ||
        order.orderType === typeFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPayment &&
        matchesType
      );
    });
  }, [
    orders,
    search,
    statusFilter,
    paymentFilter,
    typeFilter,
  ]);

  // ==========================================================
  // STATISTICS
  // ==========================================================

  const statistics = useMemo(() => {
    const pending = orders.filter(
      (order) => order.status === "PENDING"
    ).length;

    const inProgress = orders.filter((order) =>
      ["CONFIRMED", "PROCESSING", "READY", "SHIPPED"].includes(
        order.status
      )
    ).length;

    const completed = orders.filter(
      (order) => order.status === "COMPLETED"
    ).length;

    const cancelled = orders.filter(
      (order) => order.status === "CANCELLED"
    ).length;

    const paidRevenue = orders
      .filter((order) => order.paymentStatus === "PAID")
      .reduce(
        (total, order) =>
          total + Number(order.amountCents || 0),
        0
      );

    return {
      total: orders.length,
      pending,
      inProgress,
      completed,
      cancelled,
      paidRevenue,
    };
  }, [orders]);

  // ==========================================================
  // UPDATE SELECTED ORDER
  // ==========================================================

  const currentSelectedOrder = selectedOrder
    ? orders.find(
        (order) => order.id === selectedOrder.id
      ) || selectedOrder
    : null;

  // ==========================================================
  // LOADING
  // ==========================================================

  if (isLoading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="flex items-center gap-3 text-[#725337]">
          <Loader2
            className="animate-spin"
            size={22}
          />
          <span className="font-medium">
            Loading orders...
          </span>
        </div>
      </div>
    );
  }

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="min-h-screen bg-[#faf7f2] p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-[1600px]">

        {/* ====================================================
            HEADER
        ==================================================== */}

        <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-[#8b6f4e]">
              <ShoppingBag size={16} />
              Commerce
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-[#3b2a1f]">
              Orders
            </h1>

            <p className="mt-1 text-sm text-[#796b5c]">
              Manage customer orders, payments and fulfilment.
            </p>
          </div>

          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#d9c9b5] bg-white px-4 py-2.5 text-sm font-semibold text-[#60452f] shadow-sm transition hover:bg-[#f7f0e6] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={17}
              className={isFetching ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* ====================================================
            STATISTICS
        ==================================================== */}

        <div className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">

          <StatCard
            title="Total Orders"
            value={statistics.total}
            icon={Package}
            description="All customer orders"
          />

          <StatCard
            title="Pending"
            value={statistics.pending}
            icon={Clock3}
            description="Awaiting confirmation"
          />

          <StatCard
            title="In Progress"
            value={statistics.inProgress}
            icon={Truck}
            description="Being processed"
          />

          <StatCard
            title="Completed"
            value={statistics.completed}
            icon={CheckCircle2}
            description="Successfully completed"
          />

          <StatCard
            title="Paid Revenue"
            value={formatPrice(statistics.paidRevenue)}
            icon={CreditCard}
            description="From paid orders"
          />

        </div>

        {/* ====================================================
            FILTERS
        ==================================================== */}

        <div className="mb-5 rounded-2xl border border-[#eadfce] bg-white p-4 shadow-sm">

          <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto_auto]">

            {/* Search */}

            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9b8a77]"
              />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search customer, email, phone or order..."
                className="h-11 w-full rounded-xl border border-[#e0d4c5] bg-[#fdfbf8] pl-10 pr-4 text-sm text-[#3b2a1f] outline-none transition focus:border-[#9a7045] focus:ring-2 focus:ring-[#9a7045]/10"
              />
            </div>

            {/* Status */}

            <div className="relative">
              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value as
                      | "ALL"
                      | OrderStatus
                  )
                }
                className="h-11 min-w-[170px] appearance-none rounded-xl border border-[#e0d4c5] bg-[#fdfbf8] px-4 pr-10 text-sm font-medium text-[#4b392b] outline-none focus:border-[#9a7045]"
              >
                <option value="ALL">
                  All Order Statuses
                </option>

                {ORDER_STATUSES.map((status) => (
                  <option
                    key={status}
                    value={status}
                  >
                    {formatStatus(status)}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8b7a67]"
              />
            </div>

            {/* Payment */}

            <div className="relative">
              <select
                value={paymentFilter}
                onChange={(event) =>
                  setPaymentFilter(
                    event.target.value as
                      | "ALL"
                      | PaymentStatus
                  )
                }
                className="h-11 min-w-[170px] appearance-none rounded-xl border border-[#e0d4c5] bg-[#fdfbf8] px-4 pr-10 text-sm font-medium text-[#4b392b] outline-none focus:border-[#9a7045]"
              >
                <option value="ALL">
                  All Payments
                </option>

                {PAYMENT_STATUSES.map((status) => (
                  <option
                    key={status}
                    value={status}
                  >
                    {formatStatus(status)}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8b7a67]"
              />
            </div>

            {/* Type */}

            <div className="relative">
              <select
                value={typeFilter}
                onChange={(event) =>
                  setTypeFilter(
                    event.target.value as
                      | "ALL"
                      | OrderType
                  )
                }
                className="h-11 min-w-[150px] appearance-none rounded-xl border border-[#e0d4c5] bg-[#fdfbf8] px-4 pr-10 text-sm font-medium text-[#4b392b] outline-none focus:border-[#9a7045]"
              >
                <option value="ALL">
                  All Types
                </option>

                <option value="HARDCOPY">
                  Hardcopy
                </option>

                <option value="INQUIRY">
                  Inquiry
                </option>
              </select>

              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8b7a67]"
              />
            </div>

          </div>

          <div className="mt-3 text-xs text-[#897a6a]">
            Showing{" "}
            <strong className="text-[#5d4937]">
              {filteredOrders.length}
            </strong>{" "}
            of{" "}
            <strong className="text-[#5d4937]">
              {orders.length}
            </strong>{" "}
            orders
          </div>
        </div>

        {/* ====================================================
            ORDERS TABLE
        ==================================================== */}

        <div className="overflow-hidden rounded-2xl border border-[#eadfce] bg-white shadow-sm">

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1050px] text-left">

              <thead className="border-b border-[#eadfce] bg-[#fbf7f1]">

                <tr>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-[#806b55]">
                    Order
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-[#806b55]">
                    Customer
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-[#806b55]">
                    Amount
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-[#806b55]">
                    Status
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-[#806b55]">
                    Payment
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-[#806b55]">
                    Date
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-[#806b55]">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-[#f0e7dc]">

                {filteredOrders.length === 0 ? (

                  <tr>

                    <td
                      colSpan={7}
                      className="px-5 py-16 text-center"
                    >

                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f5ecdf] text-[#92704c]">
                        <Package size={25} />
                      </div>

                      <h3 className="mt-4 text-base font-semibold text-[#4b392b]">
                        No orders found
                      </h3>

                      <p className="mt-1 text-sm text-[#897a6a]">
                        Try changing your filters or search term.
                      </p>

                    </td>

                  </tr>

                ) : (

                  filteredOrders.map((order) => (

                    <tr
                      key={order.id}
                      className="transition hover:bg-[#fdfbf8]"
                    >

                      {/* Order */}

                      <td className="px-5 py-4">

                        <div className="font-semibold text-[#493629]">
                          {order.orderNumber ||
                            `#${order.id.slice(0, 8).toUpperCase()}`}
                        </div>

                        <div className="mt-1 text-xs text-[#948474]">
                          {order.orderType || "HARDCOPY"}
                        </div>

                      </td>

                      {/* Customer */}

                      <td className="px-5 py-4">

                        <div className="font-medium text-[#493629]">
                          {order.customerName}
                        </div>

                        <div className="mt-1 text-xs text-[#897a6a]">
                          {order.customerEmail}
                        </div>

                      </td>

                      {/* Amount */}

                      <td className="px-5 py-4">

                        <span className="font-semibold text-[#493629]">
                          {formatPrice(order.amountCents)}
                        </span>

                      </td>

                      {/* Status */}

                      <td className="px-5 py-4">

                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusClasses(
                            order.status
                          )}`}
                        >
                          {formatStatus(order.status)}
                        </span>

                      </td>

                      {/* Payment */}

                      <td className="px-5 py-4">

                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusClasses(
                            order.paymentStatus
                          )}`}
                        >
                          {formatStatus(
                            order.paymentStatus
                          )}
                        </span>

                      </td>

                      {/* Date */}

                      <td className="px-5 py-4 text-sm text-[#756657]">
                        {formatDate(order.createdAt)}
                      </td>

                      {/* Action */}

                      <td className="px-5 py-4 text-right">

                        <button
                          type="button"
                          onClick={() =>
                            setSelectedOrder(order)
                          }
                          className="inline-flex items-center gap-2 rounded-lg border border-[#d9c9b5] bg-white px-3 py-2 text-xs font-semibold text-[#654a32] transition hover:bg-[#f5ecdf]"
                        >
                          <Eye size={15} />
                          View
                        </button>

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

      {/* ======================================================
          ORDER DETAIL DRAWER
      ======================================================= */}

      {currentSelectedOrder && (

        <div className="fixed inset-0 z-50">

          {/* Backdrop */}

          <button
            type="button"
            aria-label="Close order details"
            onClick={() => setSelectedOrder(null)}
            className="absolute inset-0 cursor-default bg-black/30 backdrop-blur-[2px]"
          />

          {/* Drawer */}

          <aside className="absolute right-0 top-0 flex h-full w-full max-w-xl flex-col bg-[#fffdf9] shadow-2xl">

            {/* Drawer Header */}

            <div className="flex items-center justify-between border-b border-[#eadfce] px-5 py-4">

              <div>

                <p className="text-xs font-semibold uppercase tracking-wider text-[#98754e]">
                  Order Details
                </p>

                <h2 className="mt-1 text-lg font-bold text-[#3b2a1f]">
                  {currentSelectedOrder.orderNumber ||
                    `#${currentSelectedOrder.id
                      .slice(0, 8)
                      .toUpperCase()}`}
                </h2>

              </div>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#dfd2c2] text-[#6f5c49] transition hover:bg-[#f5ecdf]"
              >
                <X size={18} />
              </button>

            </div>

            {/* Drawer Content */}

            <div className="flex-1 overflow-y-auto p-5">

              {/* Customer */}

              <section className="rounded-2xl border border-[#eadfce] bg-white p-4">

                <div className="mb-4 flex items-center gap-2">
                  <User
                    size={17}
                    className="text-[#8a5a2b]"
                  />

                  <h3 className="font-semibold text-[#493629]">
                    Customer
                  </h3>
                </div>

                <div className="space-y-3 text-sm">

                  <div className="flex items-start gap-3">
                    <User
                      size={16}
                      className="mt-0.5 text-[#9b8a77]"
                    />

                    <div>
                      <p className="font-medium text-[#493629]">
                        {currentSelectedOrder.customerName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail
                      size={16}
                      className="mt-0.5 text-[#9b8a77]"
                    />

                    <a
                      href={`mailto:${currentSelectedOrder.customerEmail}`}
                      className="text-[#795b3e] hover:underline"
                    >
                      {currentSelectedOrder.customerEmail}
                    </a>
                  </div>

                  {currentSelectedOrder.customerPhone && (
                    <div className="flex items-start gap-3">
                      <Phone
                        size={16}
                        className="mt-0.5 text-[#9b8a77]"
                      />

                      <a
                        href={`tel:${currentSelectedOrder.customerPhone}`}
                        className="text-[#795b3e] hover:underline"
                      >
                        {currentSelectedOrder.customerPhone}
                      </a>
                    </div>
                  )}

                </div>

              </section>

              {/* Delivery */}

              {(currentSelectedOrder.deliveryAddress ||
                currentSelectedOrder.deliveryCity) && (

                <section className="mt-4 rounded-2xl border border-[#eadfce] bg-white p-4">

                  <div className="mb-4 flex items-center gap-2">
                    <MapPin
                      size={17}
                      className="text-[#8a5a2b]"
                    />

                    <h3 className="font-semibold text-[#493629]">
                      Delivery
                    </h3>
                  </div>

                  <p className="text-sm leading-6 text-[#665647]">
                    {currentSelectedOrder.deliveryAddress}
                    {currentSelectedOrder.deliveryCity
                      ? `, ${currentSelectedOrder.deliveryCity}`
                      : ""}
                  </p>

                </section>
              )}

              {/* Items */}

              <section className="mt-4 rounded-2xl border border-[#eadfce] bg-white p-4">

                <div className="mb-4 flex items-center gap-2">
                  <ShoppingBag
                    size={17}
                    className="text-[#8a5a2b]"
                  />

                  <h3 className="font-semibold text-[#493629]">
                    Order Items
                  </h3>
                </div>

                <div className="space-y-3">

                  {currentSelectedOrder.items &&
                  currentSelectedOrder.items.length > 0 ? (

                    currentSelectedOrder.items.map((item) => (

                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-4 rounded-xl bg-[#faf7f2] p-3"
                      >

                        <div className="min-w-0">

                          <p className="truncate text-sm font-medium text-[#493629]">
                            {item.book?.title ||
                              "Book"}
                          </p>

                          <p className="mt-1 text-xs text-[#897a6a]">
                            Quantity: {item.quantity}
                          </p>

                        </div>

                        <p className="shrink-0 text-sm font-semibold text-[#493629]">
                          {formatPrice(
                            item.priceCents *
                              item.quantity
                          )}
                        </p>

                      </div>

                    ))

                  ) : currentSelectedOrder.book ? (

                    <div className="rounded-xl bg-[#faf7f2] p-3">

                      <p className="text-sm font-medium text-[#493629]">
                        {currentSelectedOrder.book.title}
                      </p>

                    </div>

                  ) : (

                    <p className="text-sm text-[#897a6a]">
                      No item details available.
                    </p>

                  )}

                </div>

                <div className="mt-4 flex items-center justify-between border-t border-[#eadfce] pt-4">

                  <span className="font-semibold text-[#5e4a38]">
                    Total
                  </span>

                  <span className="text-lg font-bold text-[#3b2a1f]">
                    {formatPrice(
                      currentSelectedOrder.amountCents
                    )}
                  </span>

                </div>

              </section>

              {/* Payment */}

              <section className="mt-4 rounded-2xl border border-[#eadfce] bg-white p-4">

                <div className="mb-4 flex items-center gap-2">
                  <CreditCard
                    size={17}
                    className="text-[#8a5a2b]"
                  />

                  <h3 className="font-semibold text-[#493629]">
                    Payment
                  </h3>
                </div>

                <div className="space-y-3 text-sm">

                  <div className="flex justify-between gap-4">
                    <span className="text-[#897a6a]">
                      Status
                    </span>

                    <span
                      className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusClasses(
                        currentSelectedOrder.paymentStatus
                      )}`}
                    >
                      {formatStatus(
                        currentSelectedOrder.paymentStatus
                      )}
                    </span>
                  </div>

                  {currentSelectedOrder.paymentMethod && (
                    <div className="flex justify-between gap-4">
                      <span className="text-[#897a6a]">
                        Method
                      </span>

                      <span className="font-medium text-[#493629]">
                        {currentSelectedOrder.paymentMethod}
                      </span>
                    </div>
                  )}

                  {currentSelectedOrder.transactionCode && (
                    <div className="flex justify-between gap-4">
                      <span className="text-[#897a6a]">
                        Transaction
                      </span>

                      <span className="font-medium text-[#493629]">
                        {currentSelectedOrder.transactionCode}
                      </span>
                    </div>
                  )}

                </div>

                {/* Payment selector */}

                <div className="mt-4">

                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[#806b55]">
                    Update Payment Status
                  </label>

                  <select
                    value={
                      currentSelectedOrder.paymentStatus
                    }
                    onChange={(event) =>
                      paymentMutation.mutate({
                        id: currentSelectedOrder.id,
                        paymentStatus:
                          event.target.value as PaymentStatus,
                      })
                    }
                    disabled={paymentMutation.isPending}
                    className="h-11 w-full rounded-xl border border-[#dfd2c2] bg-[#fffdf9] px-3 text-sm font-medium text-[#493629] outline-none focus:border-[#9a7045]"
                  >

                    {PAYMENT_STATUSES.map(
                      (status) => (
                        <option
                          key={status}
                          value={status}
                        >
                          {formatStatus(status)}
                        </option>
                      )
                    )}

                  </select>

                </div>

              </section>

              {/* Order Status */}

              <section className="mt-4 rounded-2xl border border-[#eadfce] bg-white p-4">

                <div className="mb-4 flex items-center gap-2">
                  <Package
                    size={17}
                    className="text-[#8a5a2b]"
                  />

                  <h3 className="font-semibold text-[#493629]">
                    Order Status
                  </h3>
                </div>

                <select
                  value={currentSelectedOrder.status}
                  onChange={(event) =>
                    statusMutation.mutate({
                      id: currentSelectedOrder.id,
                      status:
                        event.target.value as OrderStatus,
                    })
                  }
                  disabled={statusMutation.isPending}
                  className="h-11 w-full rounded-xl border border-[#dfd2c2] bg-[#fffdf9] px-3 text-sm font-medium text-[#493629] outline-none focus:border-[#9a7045]"
                >

                  {ORDER_STATUSES.map(
                    (status) => (
                      <option
                        key={status}
                        value={status}
                      >
                        {formatStatus(status)}
                      </option>
                    )
                  )}

                </select>

                {statusMutation.isPending && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-[#897a6a]">
                    <Loader2
                      size={14}
                      className="animate-spin"
                    />
                    Updating order status...
                  </div>
                )}

              </section>

              {/* Date */}

              <section className="mt-4 rounded-2xl border border-[#eadfce] bg-white p-4">

                <div className="flex items-center gap-3">

                  <CalendarDays
                    size={17}
                    className="text-[#8a5a2b]"
                  />

                  <div>

                    <p className="text-xs text-[#897a6a]">
                      Created
                    </p>

                    <p className="mt-1 text-sm font-medium text-[#493629]">
                      {formatDate(
                        currentSelectedOrder.createdAt
                      )}
                    </p>

                  </div>

                </div>

              </section>

            </div>

            {/* Drawer Footer */}

            <div className="border-t border-[#eadfce] bg-white px-5 py-4">

              <button
                type="button"
                onClick={() =>
                  setSelectedOrder(null)
                }
                className="w-full rounded-xl border border-[#d9c9b5] bg-[#f7f0e6] px-4 py-3 text-sm font-semibold text-[#60452f] transition hover:bg-[#eee2d1]"
              >
                Close
              </button>

            </div>

          </aside>

        </div>

      )}

    </div>
  );
}