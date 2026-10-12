/** Display amount; `currency` is an ISO 4217 code (match `STRIPE_CURRENCY` / `VITE_STRIPE_CURRENCY`). */
/** Display amount; `currency` is an ISO 4217 code (match `STRIPE_CURRENCY` / `VITE_STRIPE_CURRENCY`). */
export function formatPrice(
  priceCents: number,
  currency: string = import.meta.env.VITE_STRIPE_CURRENCY || "KES"
): string {
  try {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: currency.toUpperCase(),
      minimumFractionDigits: 2,
    }).format(priceCents / 100);
  } catch {
    return `KES ${(priceCents / 100).toFixed(2)}`;
  }
}