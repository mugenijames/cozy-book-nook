// src/components/BookShowcaseCard.tsx

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

  /*
   * ---------------------------------------------------------
   * CHECKOUT STATUS
   * ---------------------------------------------------------
   */

  const { data: checkout } = useQuery({
    queryKey: ["checkout", "status"],
    queryFn: getCheckoutStatus,
    staleTime: 60_000,
  });

  /*
   * ---------------------------------------------------------
   * BOOK LINKS
   * ---------------------------------------------------------
   */

  const detailHref = `/book/${slug || id}`;

  const coverSrc = resolveBookCoverUrl(coverImage);

  const buyHref = bookPurchaseHref(slug);
  const buyLabel = bookPurchaseLabel();

  const isExternalBuy = buyHref.startsWith("http");

  /*
   * ---------------------------------------------------------
   * STRIPE CHECKOUT
   * ---------------------------------------------------------
   */

  const stripeReady = Boolean(checkout?.enabled);

  const canStripePay =
    stripeReady &&
    priceCents != null &&
    Number(priceCents) > 0;

  async function startCheckout(
    e: React.MouseEvent<HTMLButtonElement>
  ) {
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

  /*
   * ---------------------------------------------------------
   * RENDER
   * ---------------------------------------------------------
   */

  return (
    <article
      className="
        group
        flex
        h-full
        min-w-0
        flex-col
        rounded-2xl
        border
        border-[#E5D9CF]
        bg-white
        p-3
        shadow-sm
        transition-all
        duration-500
        hover:-translate-y-2
        hover:border-[#D4A017]/40
        hover:shadow-[0_20px_45px_rgba(46,18,8,0.14)]
      "
    >
      {/* =====================================================
          BOOK VISUAL
      ====================================================== */}

      <Link
        to={detailHref}
        aria-label={`View ${title}`}
        className="
          relative
          block
          px-2
          pt-2
          focus:outline-none
          focus-visible:ring-2
          focus-visible:ring-[#D4A017]
          focus-visible:ring-offset-2
          rounded-xl
        "
      >
        {/* Physical book shadow */}

        <div
          className="
            pointer-events-none
            absolute
            bottom-3
            left-[10%]
            right-[5%]
            h-5
            rounded-full
            bg-[#2E1208]/20
            blur-xl
            transition-all
            duration-500
            group-hover:left-[15%]
            group-hover:right-[2%]
            group-hover:bg-[#2E1208]/25
          "
        />

        {/* Book body */}

        <div
          className="
            relative
            mx-auto
            w-[92%]
            max-w-[250px]
            rounded-r-md
            shadow-[8px_10px_18px_rgba(46,18,8,0.20)]
            transition-all
            duration-500
            group-hover:translate-x-1
            group-hover:-translate-y-1
            group-hover:shadow-[12px_16px_25px_rgba(46,18,8,0.25)]
          "
        >
          {/* Book spine */}

          <div
            className="
              absolute
              bottom-0
              left-0
              top-0
              z-20
              w-[7px]
              rounded-l-md
              bg-gradient-to-r
              from-[#241008]
              via-[#5A2A16]
              to-[#2E1208]
              shadow-inner
            "
          />

          {/* Page edge */}

          <div
            className="
              absolute
              bottom-[2px]
              right-[-5px]
              top-[2px]
              z-10
              w-[6px]
              rounded-r-sm
              bg-gradient-to-r
              from-[#D8CBBE]
              via-[#F7F2EC]
              to-[#CBBBAA]
            "
          />

          {/* Cover */}

          <div
            className="
              relative
              overflow-hidden
              rounded-r-md
              bg-[#F3ECE6]
              aspect-[2/3]
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
                  duration-700
                  ease-out
                  group-hover:scale-[1.035]
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
                  gap-3
                  bg-gradient-to-br
                  from-[#F3ECE6]
                  to-[#E4D5C8]
                  px-5
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

            {/* Elegant cover lighting */}

            <div
              className="
                pointer-events-none
                absolute
                inset-0
                bg-gradient-to-br
                from-white/15
                via-transparent
                to-black/10
                opacity-60
              "
            />

            {/* Hover overlay */}

            <div
              className="
                pointer-events-none
                absolute
                inset-0
                bg-gradient-to-t
                from-black/45
                via-transparent
                to-transparent
                opacity-0
                transition-opacity
                duration-500
                group-hover:opacity-100
              "
            />

            {/* View book label */}

            <div
              className="
                absolute
                bottom-5
                left-1/2
                z-30
                -translate-x-1/2
                translate-y-3
                whitespace-nowrap
                rounded-full
                bg-white/95
                px-4
                py-2
                text-xs
                font-semibold
                text-[#2E1208]
                opacity-0
                shadow-xl
                backdrop-blur-sm
                transition-all
                duration-500
                group-hover:translate-y-0
                group-hover:opacity-100
              "
            >
              View book
            </div>
          </div>
        </div>
      </Link>

      {/* =====================================================
          BOOK INFORMATION
      ====================================================== */}

      <div className="flex flex-1 flex-col px-2 pb-2 pt-5">
        {/* Rating */}

        {rating != null && Number(rating) > 0 ? (
          <div
            className="flex items-center gap-1"
            aria-label={`Rating ${Number(rating).toFixed(
              1
            )} out of 5`}
          >
            {Array.from({ length: 5 }).map((_, index) => {
              const filled =
                index < Math.round(Number(rating));

              return (
                <Star
                  key={index}
                  className={`
                    h-3.5
                    w-3.5
                    ${filled
                      ? "fill-[#D4A017] text-[#D4A017]"
                      : "text-gray-300"
                    }
                  `}
                  aria-hidden="true"
                />
              );
            })}

            <span className="ml-1 text-xs text-[#6B5A4D]">
              {Number(rating).toFixed(1)}
            </span>
          </div>
        ) : null}

        {/* Title */}

        <Link
          to={detailHref}
          className="
            mt-3
            block
            rounded
            focus:outline-none
            focus-visible:ring-2
            focus-visible:ring-[#D4A017]
            focus-visible:ring-offset-2
          "
        >
          <h3
            className="
              line-clamp-2
              font-heading
              text-base
              font-bold
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
            text-sm
            text-[#6B5A4D]
          "
        >
          by {author}
        </p>

        {/* Price */}

        <div className="mt-3">
          {priceCents != null &&
            Number(priceCents) > 0 ? (
            <span
              className="
                text-base
                font-bold
                text-[#2E1208]
                sm:text-lg
              "
            >
              {formatPrice(Number(priceCents))}
            </span>
          ) : (
            <span className="text-sm font-medium text-[#6B5A4D]">
              Price on request
            </span>
          )}
        </div>

        {/* =================================================
            ACTIONS
        ================================================== */}

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
              min-h-[40px]
              min-w-0
              flex-1
              items-center
              justify-center
              gap-1.5
              rounded-xl
              bg-[#2E1208]
              px-3
              py-2
              text-center
              text-xs
              font-semibold
              text-white
              transition-all
              duration-300
              hover:bg-[#4A1F0E]
              hover:shadow-md
              focus:outline-none
              focus-visible:ring-2
              focus-visible:ring-[#D4A017]
              focus-visible:ring-offset-2
              sm:text-sm
            "
          >
            View book

            <ArrowRight
              className="
                h-3.5
                w-3.5
                transition-transform
                duration-300
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
                min-h-[40px]
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
                py-2
                text-center
                text-xs
                font-semibold
                text-[#2E1208]
                transition-all
                duration-300
                hover:bg-[#B58900]
                hover:shadow-md
                disabled:cursor-not-allowed
                disabled:opacity-60
                focus:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#2E1208]
                focus-visible:ring-offset-2
                sm:text-sm
              "
            >
              {checkoutLoading ? (
                <>
                  <Loader2
                    className="h-3.5 w-3.5 animate-spin"
                    aria-hidden="true"
                  />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <ShoppingBag
                    className="h-3.5 w-3.5"
                    aria-hidden="true"
                  />
                  <span>Buy</span>
                </>
              )}
            </button>
          ) : (
            /* Configured purchase link */

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
                min-h-[40px]
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
                py-2
                text-center
                text-xs
                font-semibold
                text-[#4A1F0E]
                transition-all
                duration-300
                hover:border-[#D4A017]
                hover:bg-[#F5E6B5]/40
                hover:shadow-sm
                focus:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#D4A017]
                focus-visible:ring-offset-2
                sm:text-sm
              "
            >
              <ShoppingBag
                className="h-3.5 w-3.5"
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