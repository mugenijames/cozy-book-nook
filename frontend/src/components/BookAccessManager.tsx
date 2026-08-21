// frontend/src/components/BookAccessManager.tsx

import { useEffect, useState } from "react";
import { X, Users, Mail, Loader2, Send, Trash2, CheckCircle2, Clock } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import {
  getBookAccess,
  inviteToBookAccess,
  revokeBookAccess,
  type AccessSummary,
} from "@/services/bookAccess";

interface BookAccessManagerProps {
  bookId: string;
  bookTitle: string;
  buyerEmail: string;
  onClose: () => void;
}

export default function BookAccessManager({
  bookId,
  bookTitle,
  buyerEmail,
  onClose,
}: BookAccessManagerProps) {
  const [access, setAccess] = useState<AccessSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [revokingEmail, setRevokingEmail] = useState<string | null>(null);

  const loadAccess = async () => {
    setLoading(true);
    try {
      const summary = await getBookAccess(bookId, buyerEmail);
      setAccess(summary);
    } catch (error: any) {
      toast.error(
        error?.message || "Couldn't load your access list right now."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAccess();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId, buyerEmail]);

  const handleInvite = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!inviteEmail.trim()) {
      toast.error("Enter an email address to invite.");
      return;
    }

    if (access && access.remainingSlots <= 0) {
      toast.error("All 5 slots are already in use.");
      return;
    }

    setInviting(true);

    try {
      const updated = await inviteToBookAccess(
        bookId,
        buyerEmail,
        inviteEmail.trim()
      );

      setAccess(updated);
      setInviteEmail("");

      toast.success(`Invite sent to ${inviteEmail.trim()}.`);
    } catch (error: any) {
      toast.error(error?.message || "Failed to send invite.");
    } finally {
      setInviting(false);
    }
  };

  const handleRevoke = async (grantId: string, email: string) => {
    setRevokingEmail(email);

    try {
      await revokeBookAccess(bookId, buyerEmail, grantId);

      toast.success(`Removed ${email}'s access.`);

      await loadAccess();
    } catch (error: any) {
      toast.error(error?.message || "Failed to remove access.");
    } finally {
      setRevokingEmail(null);
    }
  };

  return (
    <div
      className="
        fixed inset-0 z-[200] flex items-center justify-center
        bg-black/50 px-4 backdrop-blur-sm
      "
      onClick={onClose}
    >
      <div
        className="
          relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-8
        "
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="
            absolute right-4 top-4 rounded-full p-2 text-gray-400
            transition-colors hover:bg-gray-100 hover:text-gray-700
          "
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-[#C17B4F]/10">
          <Users className="h-6 w-6 text-[#C17B4F]" />
        </div>

        <h2 className="font-heading text-xl font-bold text-[#2E1208]">
          Manage Book Access
        </h2>

        <p className="mt-1 text-sm text-gray-500">{bookTitle}</p>

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-[#C17B4F]" />
          </div>
        ) : access ? (
          <>
            {/* Slot counter */}
            <div className="mt-6 rounded-xl bg-[#EEF2F7] px-4 py-3">
              <p className="text-sm font-semibold text-[#2E1208]">
                {access.usedSlots} of {access.maxSlots} people have access
              </p>
              <p className="mt-0.5 text-xs text-gray-500">
                {access.remainingSlots > 0
                  ? `You can invite ${access.remainingSlots} more.`
                  : "All slots are in use. Remove someone to free a slot."}
              </p>
            </div>

            {/* Slot list */}
            <ul className="mt-4 space-y-2">
              {access.slots.map((slot) => (
                <li
                  key={slot.id}
                  className="
                    flex items-center justify-between rounded-xl border
                    border-gray-100 px-3 py-2.5
                  "
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[#2E1208]">
                      {slot.email}
                      {slot.role === "buyer" && (
                        <span className="ml-2 text-xs font-normal text-gray-400">
                          (you)
                        </span>
                      )}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
                      {slot.status === "accepted" ? (
                        <>
                          <CheckCircle2 className="h-3 w-3 text-green-600" />
                          Access active
                        </>
                      ) : (
                        <>
                          <Clock className="h-3 w-3 text-amber-500" />
                          Invite pending
                        </>
                      )}
                    </p>
                  </div>

                  {slot.role === "invitee" && (
                    <button
                      type="button"
                      onClick={() =>
                        handleRevoke(slot.id, slot.email)
                      }
                      disabled={revokingEmail === slot.email}
                      aria-label={`Remove ${slot.email}`}
                      className="
                        shrink-0 rounded-full p-2 text-gray-400
                        transition-colors hover:bg-red-50 hover:text-red-600
                        disabled:opacity-50
                      "
                    >
                      {revokingEmail === slot.email ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  )}
                </li>
              ))}
            </ul>

            {/* Invite form */}
            {access.remainingSlots > 0 && (
              <form onSubmit={handleInvite} className="mt-5 flex gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(event) => setInviteEmail(event.target.value)}
                    placeholder="friend@example.com"
                    className="
                      w-full rounded-xl border border-gray-200 py-2.5 pl-9 pr-3
                      text-sm text-[#2E1208] outline-none transition-colors
                      focus:border-[#C17B4F] focus:ring-2 focus:ring-[#C17B4F]/20
                    "
                  />
                </div>

                <Button
                  type="submit"
                  disabled={inviting}
                  className="
                    shrink-0 rounded-xl bg-[#2E1208] px-4 font-semibold
                    text-white hover:bg-[#4A2112]
                  "
                >
                  {inviting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </form>
            )}
          </>
        ) : (
          <p className="mt-6 text-sm text-gray-500">
            Couldn't load access details. Try closing and reopening this.
          </p>
        )}
      </div>
    </div>
  );
}