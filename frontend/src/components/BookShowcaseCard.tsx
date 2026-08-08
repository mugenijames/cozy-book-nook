import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Loader2,
  Star,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

import { resolveBookCoverUrl } from "@/lib/resolveBookCover";
import {
  bookPurchaseHref,
  bookPurchaseLabel,
} from "@/config/purchase";
import { formatPrice } from "@/lib/formatPrice";
import {
  createCheckoutSession,
  getCheckoutStatus,
} from "@/services/api";

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
  priceCents,
}: BookShowcaseCardProps) {
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const { data: checkout } = useQuery({
    queryKey: ["checkout", "status"],
    queryFn: getCheckoutStatus,
    staleTime: 60_000,
  });

  /*
   * Prefer the slug because it gives us a clean URL:
   *
   * /book/purpose-and-calling
   *
   * Fall back to the ID if a book doesn't have a slug.
   */
  const detailHref = `/book/${slug || id}`;

  const coverSrc = resolveBookCoverUrl(coverImage);

  const buyHref = bookPurchaseHref(slug);
  const buyLabel = bookPurchaseLabel();

  const isExternalBuy = buyHref.startsWith("http");

  const stripeReady = Boolean(checkout?.enabled);

  const canStripePay =
    stripeReady &&
    priceCents != null &&
    Number(priceCents) > 0;

  async function startCheckout(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();

    if (!canStripePay || checkoutLoading) return;

    setCheckoutLoading(true);

    try {
      const { url } = await createCheckoutSession(id);

      if (!url) {
        throw new Error("Checkout URL was not returned.");
      }

      window.location.href = url;
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Could not start checkout.";

      toast.error(message);
    } finally {
      setCheckoutLoading(false);
    }
  }

  return (
    <article
      className="
        group
        flex
        h-full
        min-w-0
        flex-col
        overflow-hidden
        rounded-2xl
        border
        border-[#E8DDD4]
        bg-white
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-[#D4A017]/50
        hover:shadow-xl
      "
    >
      {/* =========================
          BOOK COVER
      ========================== */}
      <Link
        to={detailHref}
        aria-label={`View ${title}`}
        className="
          relative
          block
          aspect-[2/3]
          w-full
          overflow-hidden
          bg-[#F3ECE6]
          focus:outline-none
          focus-visible:ring-2
          focus-visible:ring-[#D4A017]
          focus-visible:ring-inset
        "
      >
        {coverSrc ? (
          <img
            src={coverSrc}
            alt={`Cover of ${title}`}
            loading="lazy"
            className="
              h-full
              w-full
              object-cover
              object-center
              transition-transform
              duration-500
              ease-out
              group-hover:scale-[1.04]
            "
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/placeholder.svg";
            }}
          />
        ) : (
          <div
            className="
              flex
              h-full
              w-full
              flex-col
              items-center
              justify-center
              gap-2
              bg-[#F3ECE6]
              px-4
              text-center
              text-[#5C4436]
            "
          >
            <div
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-full
                bg-white
                shadow-sm
              "
            >
              <ShoppingBag
                className="h-5 w-5"
                aria-hidden="true"
              />
            </div>

            <span className="text-xs font-medium">
              Cover unavailable
            </span>
          </div>
        )}

        {/* Subtle image overlay */}
        <div
          className="
            pointer-events-none
            absolute
            inset-0
            bg-gradient-to-t
            from-black/10
            via-transparent
            to-transparent
            opacity-0
            transition-opacity
            duration-300
            group-hover:opacity-100
          "
        />
      </Link>

      {/* =========================
          CONTENT
      ========================== */}
      <div className="flex flex-1 min-w-0 flex-col p-4 sm:p-5">
        {/* Title */}
        <Link
          to={detailHref}
          className="
            block
            min-w-0
            focus:outline-none
            focus-visible:ring-2
            focus-visible:ring-[#D4A017]
            focus-visible:ring-offset-2
            rounded
          "
        >
          <h3
            className="
              line-clamp-2
              break-words
              font-heading
              text-base
              font-semibold
              leading-snug
              text-[#2E1208]
              transition-colors
              duration-200
              group-hover:text-[#C17B4F]
              sm:text-lg
            "
          >
            {title}
          </h3>
        </Link>

        {/* Author */}
        <p
          className="
            mt-1
            line-clamp-1
            break-words
            text-sm
            text-[#5C4436]
          "
        >
          by {author}
        </p>

        {/* Rating + Price */}
        <div className="mt-3 flex min-w-0 flex-wrap items-center justify-between gap-2">
          {rating != null && Number(rating) > 0 ? (
            <div
              className="
                inline-flex
                items-center
                gap-1
                text-sm
                text-[#5C4436]
              "
              aria-label={`Rating ${Number(rating).toFixed(1)} out of 5`}
            >
              <Star
                className="h-4 w-4 fill-amber-400 text-amber-400"
                aria-hidden="true"
              />

              <span>
                {Number(rating).toFixed(1)}
              </span>
            </div>
          ) : (
            <span className="text-xs text-transparent">
              Rating
            </span>
          )}

          {priceCents != null && Number(priceCents) > 0 ? (
            <span
              className="
                whitespace-nowrap
                text-sm
                font-bold
                text-[#2E1208]
                sm:text-base
              "
            >
              {formatPrice(Number(priceCents))}
            </span>
          ) : null}
        </div>

        {/* =========================
            ACTIONS
        ========================== */}
        <div
          className="
            mt-auto
            flex
            flex-col
            gap-2
            pt-5
            sm:flex-row
          "
        >
          {/* View Book */}
          <Link
            to={detailHref}
            className="
              inline-flex
              min-h-[42px]
              min-w-0
              flex-1
              items-center
              justify-center
              gap-1.5
              rounded-xl
              bg-[#2E1208]
              px-3
              py-2.5
              text-center
              text-sm
              font-semibold
              text-white
              transition-all
              duration-200
              hover:bg-[#4A1F0E]
              hover:shadow-md
              focus:outline-none
              focus-visible:ring-2
              focus-visible:ring-[#D4A017]
              focus-visible:ring-offset-2
            "
          >
            View book
            <ArrowRight
              className="
                h-3.5
                w-3.5
                transition-transform
                duration-200
                group-hover:translate-x-0.5
              "
              aria-hidden="true"
            />
          </Link>

          {/* Stripe Payment */}
          {canStripePay ? (
            <button
              type="button"
              onClick={startCheckout}
              disabled={checkoutLoading}
              aria-label={
                checkoutLoading
                  ? `Processing payment for ${title}`
                  : `Pay for ${title}`
              }
              className="
                inline-flex
                min-h-[42px]
                min-w-0
                flex-1
                items-center
                justify-center
                gap-1.5
                rounded-xl
                border
                border-[#D4A017]
                bg-[#D4A017]
                px-3
                py-2.5
                text-center
                text-sm
                font-semibold
                text-[#2E1208]
                transition-all
                duration-200
                hover:bg-[#B58900]
                hover:shadow-md
                disabled:cursor-not-allowed
                disabled:opacity-60
                focus:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#2E1208]
                focus-visible:ring-offset-2
              "
            >
              {checkoutLoading ? (
                <>
                  <Loader2
                    className="h-4 w-4 animate-spin"
                    aria-hidden="true"
                  />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <ShoppingBag
                    className="h-4 w-4"
                    aria-hidden="true"
                  />
                  <span>Pay now</span>
                </>
              )}
            </button>
          ) : (
            /* External / configured purchase link */
            <a
              href={buyHref}
              {...(isExternalBuy
                ? {
                    target: "_blank",
                    rel: "noopener noreferrer",
                  }
                : {})}
              className="
                inline-flex
                min-h-[42px]
                min-w-0
                flex-1
                items-center
                justify-center
                gap-1.5
                rounded-xl
                border
                border-[#D8C8BB]
                bg-[#FAF7F3]
                px-3
                py-2.5
                text-center
                text-sm
                font-semibold
                text-[#4A1F0E]
                transition-all
                duration-200
                hover:border-[#D4A017]
                hover:bg-[#F5E6B5]/40
                hover:shadow-sm
                focus:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#D4A017]
                focus-visible:ring-offset-2
              "
            >
              <ShoppingBag
                className="h-4 w-4"
                aria-hidden="true"
              />

              <span className="truncate">
                {buyLabel}
              </span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}