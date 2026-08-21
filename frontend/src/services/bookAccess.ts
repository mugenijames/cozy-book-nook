// frontend/src/services/bookAccess.ts
//
// Talks to the book-access-sharing endpoints described in
// docs/book-access-sharing-spec.md. Requires the backend to implement
// that spec — these calls will 404 until it does.

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export interface AccessSlot {
  id: string;
  email: string;
  role: "buyer" | "invitee";
  status: "pending" | "accepted";
  invitedAt: string;
  firstAccessedAt: string | null;
}

export interface AccessSummary {
  maxSlots: number;
  usedSlots: number;
  remainingSlots: number;
  slots: AccessSlot[];
}

export async function getBookAccess(
  bookId: string,
  buyerEmail: string
): Promise<AccessSummary> {
  const response = await fetch(
    `${API_BASE_URL}/api/books/${bookId}/access?buyerEmail=${encodeURIComponent(
      buyerEmail
    )}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error || "Failed to load access list.");
  }

  return data;
}

export async function inviteToBookAccess(
  bookId: string,
  buyerEmail: string,
  invitedEmail: string
): Promise<AccessSummary> {
  const response = await fetch(
    `${API_BASE_URL}/api/books/${bookId}/access/invite`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ buyerEmail, invitedEmail }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error || "Failed to send invite.");
  }

  return data;
}

export async function revokeBookAccess(
  bookId: string,
  buyerEmail: string,
  grantId: string
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/api/books/${bookId}/access/invite/${grantId}`,
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ buyerEmail }),
    }
  );

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data?.error || "Failed to revoke access.");
  }
}

/* =========================================================
   LOCAL BUYER-EMAIL TRACKING
   ========================================================= 
   The frontend has no purchaseId to key off, so we remember which
   email a given browser used to buy a given book, purely so the
   "Manage Access" UI knows whose access list to fetch. This is not
   a security boundary — the backend re-validates buyerEmail against
   a real completed purchase on every call.
*/

const buyerEmailKey = (bookId: string) => `book_buyer_email_${bookId}`;

export function rememberBuyerEmail(bookId: string, email: string) {
  try {
    localStorage.setItem(buyerEmailKey(bookId), email);
  } catch {
    // localStorage may be unavailable (e.g. private browsing) — non-fatal
  }
}

export function getRememberedBuyerEmail(bookId: string): string | null {
  try {
    return localStorage.getItem(buyerEmailKey(bookId));
  } catch {
    return null;
  }
}