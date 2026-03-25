/**
 * Global link for ordering (WhatsApp, store, email, etc.).
 * Optional: set `VITE_PURCHASE_BOOKS_URL` in `.env`.
 */
export const PURCHASE_BOOKS_URL = (
  import.meta.env.VITE_PURCHASE_BOOKS_URL as string | undefined
)?.trim() || "";

export function bookPurchaseHref(_slug?: string | null): string {
  if (PURCHASE_BOOKS_URL) return PURCHASE_BOOKS_URL;
  return "/#speaking";
}

export function bookPurchaseLabel(): string {
  return PURCHASE_BOOKS_URL ? "Buy now" : "Order / inquire";
}
