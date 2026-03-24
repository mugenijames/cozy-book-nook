/** Display amount; `currency` is an ISO 4217 code (match `STRIPE_CURRENCY` / `VITE_STRIPE_CURRENCY`). */
export function formatPrice(
  priceCents: number,
  currency: string = import.meta.env.VITE_STRIPE_CURRENCY || "USD"
): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(priceCents / 100);
  } catch {
    return `${(priceCents / 100).toFixed(2)} ${currency.toUpperCase()}`;
  }
}
