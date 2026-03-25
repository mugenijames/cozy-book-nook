import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, Loader2, Star, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { resolveBookCoverUrl } from "@/lib/resolveBookCover";
import { bookPurchaseHref, bookPurchaseLabel } from "@/config/purchase";
import { formatPrice } from "@/lib/formatPrice";
import { createCheckoutSession, getCheckoutStatus } from "@/services/api";

export type BookShowcaseCardProps = {
  id: string;
  title: string;
  author: string;
  slug?: string | null;
  coverImage?: string | null;
  rating?: number | null;
  description?: string | null;
  priceCents?: number | null;
};

export function BookShowcaseCard({
  id,
  title,
  author,
  slug,
  coverImage,
  rating,
  description,
  priceCents,
}: BookShowcaseCardProps) {
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const { data: checkout } = useQuery({
    queryKey: ["checkout", "status"],
    queryFn: getCheckoutStatus,
    staleTime: 60_000,
  });

  const detailHref = `/book/${slug || id}`;
  const coverSrc = resolveBookCoverUrl(coverImage);
  const buyHref = bookPurchaseHref(slug);
  const buyLabel = bookPurchaseLabel();
  const isExternalBuy = buyHref.startsWith("http");

  const stripeReady = Boolean(checkout?.enabled);
  const canStripePay =
    stripeReady && priceCents != null && Number(priceCents) > 0;

  async function startCheckout(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!canStripePay) return;
    setCheckoutLoading(true);
    try {
      const { url } = await createCheckoutSession(id);
      window.location.href = url;
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Could not start checkout.";
      toast.error(msg);
    } finally {
      setCheckoutLoading(false);
    }
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#E8DDD4] bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <Link to={detailHref} className="block shrink-0">
        <div className="aspect-[2/3] overflow-hidden bg-gradient-to-br from-[#F9F6EF] to-[#E8E0D5]">
          {coverSrc ? (
            <img
              src={coverSrc}
              alt={`Cover: ${title}`}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/placeholder.svg";
              }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <BookOpen className="h-14 w-14 text-[#C17B4F]" aria-hidden />
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link to={detailHref}>
          <h3 className="font-heading text-lg font-semibold leading-snug text-[#2E1208] transition group-hover:text-[#C17B4F] line-clamp-2">
            {title}
          </h3>
        </Link>
        <p className="mt-1 text-sm text-[#5C4436] line-clamp-1">by {author}</p>

        {priceCents != null && Number(priceCents) > 0 ? (
          <p className="mt-2 text-base font-semibold text-[#2E1208]">
            {formatPrice(Number(priceCents))}
          </p>
        ) : null}

        {rating != null && rating > 0 && (
          <div className="mt-2 flex items-center gap-1 text-sm text-[#5C4436]">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden />
            <span>{Number(rating).toFixed(1)}</span>
          </div>
        )}

        {description ? (
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-[#5C4436]">
            {description}
          </p>
        ) : null}

        <div className="mt-auto flex flex-wrap gap-2 pt-4">
          <Link
            to={detailHref}
            className="inline-flex min-w-[7rem] flex-1 items-center justify-center rounded-lg bg-[#2E1208] px-3 py-2.5 text-center text-sm font-semibold text-[#FDF8F3] transition hover:bg-[#4A1F0E]"
          >
            Read more
          </Link>
          {canStripePay ? (
            <button
              type="button"
              onClick={startCheckout}
              disabled={checkoutLoading}
              className="inline-flex min-w-[7rem] flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#D4A017] bg-[#D4A017] px-3 py-2.5 text-center text-sm font-semibold text-[#2E1208] transition hover:bg-[#b58900] disabled:opacity-60"
            >
              {checkoutLoading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
              ) : (
                <ShoppingBag className="h-3.5 w-3.5" aria-hidden />
              )}
              Pay now
            </button>
          ) : (
            <a
              href={buyHref}
              {...(isExternalBuy
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="inline-flex min-w-[7rem] flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#C9B8A8] bg-[#FAF3EB] px-3 py-2.5 text-center text-sm font-semibold text-[#4A1F0E] transition hover:border-[#D4A017] hover:bg-[#F5E6B5]/40"
            >
              <ShoppingBag className="h-3.5 w-3.5" aria-hidden />
              {buyLabel}
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
