// frontend/src/components/LocalizedPrice.tsx

import { useEffect, useState } from "react";

import {
  CURRENCY_INFO,
  DEFAULT_CURRENCY,
  detectCurrency,
  formatCurrency,
  getExchangeRate,
  convertFromKES,
  type SupportedCurrency,
} from "@/lib/currency";

type LocalizedPriceProps = {
  priceCents: number | null | undefined;
  className?: string;
};

export default function LocalizedPrice({
  priceCents,
  className = "",
}: LocalizedPriceProps) {
  const [currency, setCurrency] =
    useState<SupportedCurrency>(DEFAULT_CURRENCY);

  const [rate, setRate] = useState<number>(1);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadCurrency() {
      const detectedCurrency = detectCurrency();

      if (cancelled) return;

      setCurrency(detectedCurrency);

      if (detectedCurrency === "KES") {
        setRate(1);
        return;
      }

      setLoading(true);

      try {
        const exchangeRate =
          await getExchangeRate(detectedCurrency);

        if (!cancelled) {
          setRate(exchangeRate);
        }
      } catch (error) {
        console.warn(
          "Currency conversion unavailable. Falling back to KES.",
          error
        );

        if (!cancelled) {
          setCurrency("KES");
          setRate(1);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadCurrency();

    return () => {
      cancelled = true;
    };
  }, []);

  if (
    priceCents === null ||
    priceCents === undefined ||
    Number(priceCents) <= 0
  ) {
    return (
      <span className={className}>
        Price on request
      </span>
    );
  }

  if (loading) {
    return (
      <span className={className}>
        Checking price...
      </span>
    );
  }

  const convertedAmount = convertFromKES(
    Number(priceCents),
    rate
  );

  return (
    <span
      className={className}
      title={`Base price: KES ${(
        Number(priceCents) / 100
      ).toLocaleString("en-KE")}`}
    >
      {formatCurrency(convertedAmount, currency)}
    </span>
  );
}