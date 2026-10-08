import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  RefreshCw,
  Eye,
  X,
  CreditCard,
  CheckCircle2,
  Clock3,
  XCircle,
  RotateCcw,
  Smartphone,
  WalletCards,
  CalendarDays,
  Mail,
  Phone,
  User,
  Package,
  Hash,
  Loader2,
} from "lucide-react";
import { getApiBase } from "@/services/api";

// ============================================================
// TYPES
// ============================================================

type PaymentStatus =
  | "UNPAID"
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "REFUNDED";

type Order = {
  id: string;
  orderNumber?: string | null;

  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;

  amountCents: number;

  paymentStatus: PaymentStatus;
  paymentMethod?: string | null;
  transactionCode?: string | null;

  status?: string | null;
  orderType?: string | null;

  createdAt: string;

  items?: Array<{
    id: string;
    quantity: number;
    priceCents: number;
    book?: {
      id: string;
      title: string;
    } | null;
  }>;

  book?: {
    id: string;
    title: string;
  } | null;
};

// ============================================================
// CONSTANTS
// ============================================================

const PAYMENT_STATUSES: PaymentStatus[] = [
  "UNPAID",
  "PENDING",
  "PAID",
  "FAILED",
  "REFUNDED",
];

// ============================================================
// AUTH
// ============================================================

function getToken() {
  return (
    localStorage.getItem("admin_token") ||
    localStorage.getItem("token") ||
    localStorage.getItem("auth_token") ||
    ""
  );
}

// ============================================================
// API
// ============================================================

async function fetchPayments(): Promise<Order[]> {
  const token = getToken();

  const response = await fetch(
    `${getApiBase()}/api/orders`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.error ||
        data?.message ||
        "Failed to load payments."
    );
  }

  return data as Order[];
}

// ============================================================
// HELPERS
// ============================================================

function formatPrice(
  amountCents: number | null | undefined
) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(Number(amountCents || 0) / 100);
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

function getPaymentStatusClasses(status: string) {
  switch (status) {
    case "PAID":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";

    case "PENDING":
      return "border-amber-200 bg-amber-50 text-amber-700";

    case "FAILED":
      return "border-red-200 bg-red-50 text-red-700";

    case "REFUNDED":
      return "border-purple-200 bg-purple-50 text-purple-700";

    case "UNPAID":
      return "border-slate-200 bg-slate-50 text-slate-700";

    default:
      return "border-slate-200 bg-slate-50 text-slate-600";
  }
}

function getPaymentIcon(method?: string | null) {
  const normalized = method?.toLowerCase() || "";

  if (normalized.includes("mpesa")) {
    return Smartphone;
  }

  if (
    normalized.includes("paypal") ||
    normalized.includes("card")
  ) {
    return WalletCards;
  }

  return CreditCard;
}

// ============================================================
// STAT CARD
// ============================================================

function StatCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  description: string;
  icon: typeof CreditCard;
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
// MAIN
// ============================================================

export default function AdminPayments() {
  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState<"ALL" | PaymentStatus>("ALL");

  const [methodFilter, setMethodFilter] =
    useState("ALL");

  const [selectedPayment, setSelectedPayment] =
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
    queryKey: ["admin-payments"],
    queryFn: fetchPayments,
  });

  // ==========================================================
  // PAYMENT RECORDS
  // ==========================================================

  const payments = useMemo(() => {
    return orders.filter(
      (order) =>
        order.paymentStatus !== undefined &&
        order.amountCents !== undefined
    );
  }, [orders]);

  // ==========================================================
  // PAYMENT METHODS
  // ==========================================================

  const paymentMethods = useMemo(() => {
    const methods = new Set<string>();

    payments.forEach((payment) => {
      if (payment.paymentMethod) {
        methods.add(payment.paymentMethod);
      }
    });

    return Array.from(methods);
  }, [payments]);

  // ==========================================================
  // FILTERED PAYMENTS
  // ==========================================================

  const filteredPayments = useMemo(() => {
    const term = search.trim().toLowerCase();

    return payments.filter((payment) => {
      const matchesSearch =
        !term ||
        payment.customerName
          ?.toLowerCase()
          .includes(term) ||
        payment.customerEmail
          ?.toLowerCase()
          .includes(term) ||
        payment.customerPhone
          ?.toLowerCase()
          .includes(term) ||
        payment.transactionCode
          ?.toLowerCase()
          .includes(term) ||
        payment.orderNumber
          ?.toLowerCase()
          .includes(term) ||
        payment.id
          .toLowerCase()
          .includes(term);

      const matchesStatus =
        statusFilter === "ALL" ||
        payment.paymentStatus === statusFilter;

      const matchesMethod =
        methodFilter === "ALL" ||
        payment.paymentMethod === methodFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesMethod
      );
    });
  }, [
    payments,
    search,
    statusFilter,
    methodFilter,
  ]);

  // ==========================================================
  // STATISTICS
  // ==========================================================

  const statistics = useMemo(() => {
    const paid = payments.filter(
      (payment) =>
        payment.paymentStatus === "PAID"
    );

    const pending = payments.filter(
      (payment) =>
        payment.paymentStatus === "PENDING"
    );

    const unpaid = payments.filter(
      (payment) =>
        payment.paymentStatus === "UNPAID"
    );

    const failed = payments.filter(
      (payment) =>
        payment.paymentStatus === "FAILED"
    );

    const refunded = payments.filter(
      (payment) =>
        payment.paymentStatus === "REFUNDED"
    );

    const revenue = paid.reduce(
      (total, payment) =>
        total + Number(payment.amountCents || 0),
      0
    );

    const refundedAmount = refunded.reduce(
      (total, payment) =>
        total + Number(payment.amountCents || 0),
      0
    );

    return {
      total: payments.length,
      paid: paid.length,
      pending: pending.length,
      unpaid: unpaid.length,
      failed: failed.length,
      refunded: refunded.length,
      revenue,
      refundedAmount,
    };
  }, [payments]);

  // ==========================================================
  // LOADING
  // ==========================================================

  if (isLoading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="flex items-center gap-3 text-[#725337]">
          <Loader2
            size={22}
            className="animate-spin"
          />

          <span className="font-medium">
            Loading payments...
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
              <CreditCard size={16} />
              Commerce
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-[#3b2a1f]">
              Payments
            </h1>

            <p className="mt-1 text-sm text-[#796b5c]">
              Monitor payment activity, revenue and transaction records.
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
              className={
                isFetching
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh
          </button>

        </div>

        {/* ====================================================
            STATISTICS
        ==================================================== */}

        <div className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">

          <StatCard
            title="Total Payments"
            value={statistics.total}
            description="All payment records"
            icon={CreditCard}
          />

          <StatCard
            title="Paid"
            value={statistics.paid}
            description="Successful payments"
            icon={CheckCircle2}
          />

          <StatCard
            title="Pending"
            value={statistics.pending}
            description="Awaiting confirmation"
            icon={Clock3}
          />

          <StatCard
            title="Failed"
            value={statistics.failed}
            description="Unsuccessful payments"
            icon={XCircle}
          />

          <StatCard
            title="Revenue"
            value={formatPrice(statistics.revenue)}
            description="Successfully paid"
            icon={WalletCards}
          />

        </div>

        {/* ====================================================
            SECONDARY SUMMARY
        ==================================================== */}

        <div className="mb-6 grid gap-4 md:grid-cols-3">

          <div className="rounded-2xl border border-[#eadfce] bg-white p-4">
            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                <CreditCard size={19} />
              </div>

              <div>
                <p className="text-xs text-[#897a6a]">
                  Unpaid
                </p>

                <p className="text-lg font-bold text-[#493629]">
                  {statistics.unpaid}
                </p>
              </div>

            </div>
          </div>

          <div className="rounded-2xl border border-[#eadfce] bg-white p-4">
            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <RotateCcw size={19} />
              </div>

              <div>
                <p className="text-xs text-[#897a6a]">
                  Refunded
                </p>

                <p className="text-lg font-bold text-[#493629]">
                  {statistics.refunded}
                </p>
              </div>

            </div>
          </div>

          <div className="rounded-2xl border border-[#eadfce] bg-white p-4">
            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <WalletCards size={19} />
              </div>

              <div>
                <p className="text-xs text-[#897a6a]">
                  Refunded Amount
                </p>

                <p className="text-lg font-bold text-[#493629]">
                  {formatPrice(
                    statistics.refundedAmount
                  )}
                </p>
              </div>

            </div>
          </div>

        </div>

        {/* ====================================================
            FILTERS
        ==================================================== */}

        <div className="mb-5 rounded-2xl border border-[#eadfce] bg-white p-4 shadow-sm">

          <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto]">

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
                placeholder="Search customer, email, transaction or order..."
                className="h-11 w-full rounded-xl border border-[#e0d4c5] bg-[#fdfbf8] pl-10 pr-4 text-sm text-[#3b2a1f] outline-none transition focus:border-[#9a7045] focus:ring-2 focus:ring-[#9a7045]/10"
              />

            </div>

            {/* Status */}

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value as
                    | "ALL"
                    | PaymentStatus
                )
              }
              className="h-11 min-w-[180px] rounded-xl border border-[#e0d4c5] bg-[#fdfbf8] px-4 text-sm font-medium text-[#4b392b] outline-none focus:border-[#9a7045]"
            >
              <option value="ALL">
                All Payment Statuses
              </option>

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

            {/* Method */}

            <select
              value={methodFilter}
              onChange={(event) =>
                setMethodFilter(event.target.value)
              }
              className="h-11 min-w-[170px] rounded-xl border border-[#e0d4c5] bg-[#fdfbf8] px-4 text-sm font-medium text-[#4b392b] outline-none focus:border-[#9a7045]"
            >

              <option value="ALL">
                All Payment Methods
              </option>

              {paymentMethods.map(
                (method) => (
                  <option
                    key={method}
                    value={method}
                  >
                    {formatStatus(method)}
                  </option>
                )
              )}

            </select>

          </div>

          <div className="mt-3 text-xs text-[#897a6a]">
            Showing{" "}
            <strong className="text-[#5d4937]">
              {filteredPayments.length}
            </strong>{" "}
            of{" "}
            <strong className="text-[#5d4937]">
              {payments.length}
            </strong>{" "}
            payment records
          </div>

        </div>

        {/* ====================================================
            TABLE
        ==================================================== */}

        <div className="overflow-hidden rounded-2xl border border-[#eadfce] bg-white shadow-sm">

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1050px] text-left">

              <thead className="border-b border-[#eadfce] bg-[#fbf7f1]">

                <tr>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-[#806b55]">
                    Transaction
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-[#806b55]">
                    Customer
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-[#806b55]">
                    Method
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-[#806b55]">
                    Amount
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-[#806b55]">
                    Status
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

                {filteredPayments.length === 0 ? (

                  <tr>

                    <td
                      colSpan={7}
                      className="px-5 py-16 text-center"
                    >

                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f5ecdf] text-[#92704c]">
                        <CreditCard size={25} />
                      </div>

                      <h3 className="mt-4 text-base font-semibold text-[#4b392b]">
                        No payment records found
                      </h3>

                      <p className="mt-1 text-sm text-[#897a6a]">
                        Try changing your search or filters.
                      </p>

                    </td>

                  </tr>

                ) : (

                  filteredPayments.map(
                    (payment) => {

                      const PaymentIcon =
                        getPaymentIcon(
                          payment.paymentMethod
                        );

                      return (
                        <tr
                          key={payment.id}
                          className="transition hover:bg-[#fdfbf8]"
                        >

                          {/* Transaction */}

                          <td className="px-5 py-4">

                            <div className="font-semibold text-[#493629]">
                              {payment.transactionCode ||
                                payment.orderNumber ||
                                `#${payment.id
                                  .slice(0, 8)
                                  .toUpperCase()}`}
                            </div>

                            <div className="mt-1 text-xs text-[#948474]">
                              {payment.orderNumber
                                ? `Order ${payment.orderNumber}`
                                : "Payment record"}
                            </div>

                          </td>

                          {/* Customer */}

                          <td className="px-5 py-4">

                            <div className="font-medium text-[#493629]">
                              {payment.customerName}
                            </div>

                            <div className="mt-1 text-xs text-[#897a6a]">
                              {payment.customerEmail}
                            </div>

                          </td>

                          {/* Method */}

                          <td className="px-5 py-4">

                            <div className="flex items-center gap-2">

                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f5ecdf] text-[#8a5a2b]">
                                <PaymentIcon
                                  size={15}
                                />
                              </div>

                              <span className="text-sm font-medium text-[#5d4937]">
                                {payment.paymentMethod
                                  ? formatStatus(
                                      payment.paymentMethod
                                    )
                                  : "Not specified"}
                              </span>

                            </div>

                          </td>

                          {/* Amount */}

                          <td className="px-5 py-4">

                            <span className="font-semibold text-[#493629]">
                              {formatPrice(
                                payment.amountCents
                              )}
                            </span>

                          </td>

                          {/* Status */}

                          <td className="px-5 py-4">

                            <span
                              className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getPaymentStatusClasses(
                                payment.paymentStatus
                              )}`}
                            >
                              {formatStatus(
                                payment.paymentStatus
                              )}
                            </span>

                          </td>

                          {/* Date */}

                          <td className="px-5 py-4 text-sm text-[#756657]">
                            {formatDate(
                              payment.createdAt
                            )}
                          </td>

                          {/* Action */}

                          <td className="px-5 py-4 text-right">

                            <button
                              type="button"
                              onClick={() =>
                                setSelectedPayment(
                                  payment
                                )
                              }
                              className="inline-flex items-center gap-2 rounded-lg border border-[#d9c9b5] bg-white px-3 py-2 text-xs font-semibold text-[#654a32] transition hover:bg-[#f5ecdf]"
                            >
                              <Eye size={15} />
                              View
                            </button>

                          </td>

                        </tr>
                      );
                    }
                  )

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

      {/* ======================================================
          PAYMENT DETAIL DRAWER
      ======================================================= */}

      {selectedPayment && (

        <div className="fixed inset-0 z-50">

          <button
            type="button"
            aria-label="Close payment details"
            onClick={() =>
              setSelectedPayment(null)
            }
            className="absolute inset-0 cursor-default bg-black/30 backdrop-blur-[2px]"
          />

          <aside className="absolute right-0 top-0 flex h-full w-full max-w-xl flex-col bg-[#fffdf9] shadow-2xl">

            {/* Header */}

            <div className="flex items-center justify-between border-b border-[#eadfce] px-5 py-4">

              <div>

                <p className="text-xs font-semibold uppercase tracking-wider text-[#98754e]">
                  Payment Details
                </p>

                <h2 className="mt-1 text-lg font-bold text-[#3b2a1f]">
                  {selectedPayment.transactionCode ||
                    selectedPayment.orderNumber ||
                    `#${selectedPayment.id
                      .slice(0, 8)
                      .toUpperCase()}`}
                </h2>

              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedPayment(null)
                }
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#dfd2c2] text-[#6f5c49] transition hover:bg-[#f5ecdf]"
              >
                <X size={18} />
              </button>

            </div>

            {/* Content */}

            <div className="flex-1 overflow-y-auto p-5">

              {/* Amount */}

              <div className="rounded-2xl border border-[#eadfce] bg-white p-5 text-center">

                <p className="text-xs font-semibold uppercase tracking-wider text-[#897a6a]">
                  Payment Amount
                </p>

                <p className="mt-2 text-3xl font-bold text-[#3b2a1f]">
                  {formatPrice(
                    selectedPayment.amountCents
                  )}
                </p>

                <span
                  className={`mt-3 inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getPaymentStatusClasses(
                    selectedPayment.paymentStatus
                  )}`}
                >
                  {formatStatus(
                    selectedPayment.paymentStatus
                  )}
                </span>

              </div>

              {/* Transaction */}

              <section className="mt-4 rounded-2xl border border-[#eadfce] bg-white p-4">

                <div className="mb-4 flex items-center gap-2">

                  <Hash
                    size={17}
                    className="text-[#8a5a2b]"
                  />

                  <h3 className="font-semibold text-[#493629]">
                    Transaction
                  </h3>

                </div>

                <div className="space-y-3 text-sm">

                  <div className="flex justify-between gap-4">

                    <span className="text-[#897a6a]">
                      Transaction Code
                    </span>

                    <span className="max-w-[240px] break-all text-right font-medium text-[#493629]">
                      {selectedPayment.transactionCode ||
                        "Not available"}
                    </span>

                  </div>

                  <div className="flex justify-between gap-4">

                    <span className="text-[#897a6a]">
                      Payment Method
                    </span>

                    <span className="font-medium text-[#493629]">
                      {selectedPayment.paymentMethod
                        ? formatStatus(
                            selectedPayment.paymentMethod
                          )
                        : "Not specified"}
                    </span>

                  </div>

                  <div className="flex justify-between gap-4">

                    <span className="text-[#897a6a]">
                      Order
                    </span>

                    <span className="font-medium text-[#493629]">
                      {selectedPayment.orderNumber ||
                        `#${selectedPayment.id
                          .slice(0, 8)
                          .toUpperCase()}`}
                    </span>

                  </div>

                </div>

              </section>

              {/* Customer */}

              <section className="mt-4 rounded-2xl border border-[#eadfce] bg-white p-4">

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

                    <span className="font-medium text-[#493629]">
                      {selectedPayment.customerName}
                    </span>

                  </div>

                  <div className="flex items-start gap-3">

                    <Mail
                      size={16}
                      className="mt-0.5 text-[#9b8a77]"
                    />

                    <a
                      href={`mailto:${selectedPayment.customerEmail}`}
                      className="break-all text-[#795b3e] hover:underline"
                    >
                      {selectedPayment.customerEmail}
                    </a>

                  </div>

                  {selectedPayment.customerPhone && (
                    <div className="flex items-start gap-3">

                      <Phone
                        size={16}
                        className="mt-0.5 text-[#9b8a77]"
                      />

                      <a
                        href={`tel:${selectedPayment.customerPhone}`}
                        className="text-[#795b3e] hover:underline"
                      >
                        {selectedPayment.customerPhone}
                      </a>

                    </div>
                  )}

                </div>

              </section>

              {/* Order */}

              <section className="mt-4 rounded-2xl border border-[#eadfce] bg-white p-4">

                <div className="mb-4 flex items-center gap-2">

                  <Package
                    size={17}
                    className="text-[#8a5a2b]"
                  />

                  <h3 className="font-semibold text-[#493629]">
                    Order
                  </h3>

                </div>

                {selectedPayment.items &&
                selectedPayment.items.length > 0 ? (

                  <div className="space-y-2">

                    {selectedPayment.items.map(
                      (item) => (

                        <div
                          key={item.id}
                          className="flex items-center justify-between gap-4 rounded-xl bg-[#faf7f2] p-3"
                        >

                          <div>

                            <p className="text-sm font-medium text-[#493629]">
                              {item.book?.title ||
                                "Book"}
                            </p>

                            <p className="mt-1 text-xs text-[#897a6a]">
                              Quantity:{" "}
                              {item.quantity}
                            </p>

                          </div>

                          <p className="text-sm font-semibold text-[#493629]">
                            {formatPrice(
                              item.priceCents *
                                item.quantity
                            )}
                          </p>

                        </div>

                      )
                    )}

                  </div>

                ) : selectedPayment.book ? (

                  <div className="rounded-xl bg-[#faf7f2] p-3">

                    <p className="text-sm font-medium text-[#493629]">
                      {selectedPayment.book.title}
                    </p>

                  </div>

                ) : (

                  <p className="text-sm text-[#897a6a]">
                    No item details available.
                  </p>

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
                      Payment Date
                    </p>

                    <p className="mt-1 text-sm font-medium text-[#493629]">
                      {formatDate(
                        selectedPayment.createdAt
                      )}
                    </p>

                  </div>

                </div>

              </section>

            </div>

            {/* Footer */}

            <div className="border-t border-[#eadfce] bg-white px-5 py-4">

              <button
                type="button"
                onClick={() =>
                  setSelectedPayment(null)
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