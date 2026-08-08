// frontend/src/lib/currency.ts

export type SupportedCurrency =
  | "KES"
  | "USD"
  | "GBP"
  | "EUR"
  | "CAD"
  | "AUD"
  | "ZAR"
  | "NGN"
  | "INR"
  | "AED"
  | "JPY";

export const DEFAULT_CURRENCY: SupportedCurrency = "KES";

const CURRENCY_BY_COUNTRY: Record<string, SupportedCurrency> = {
  KE: "KES",

  US: "USD",
  CA: "CAD",
  AU: "AUD",

  GB: "GBP",

  // Eurozone
  AT: "EUR",
  BE: "EUR",
  CY: "EUR",
  DE: "EUR",
  EE: "EUR",
  ES: "EUR",
  FI: "EUR",
  FR: "EUR",
  GR: "EUR",
  IE: "EUR",
  IT: "EUR",
  LT: "EUR",
  LU: "EUR",
  LV: "EUR",
  MT: "EUR",
  NL: "EUR",
  PT: "EUR",
  SI: "EUR",
  SK: "EUR",

  ZA: "ZAR",
  NG: "NGN",
  IN: "INR",
  AE: "AED",
  JP: "JPY",
};

export const CURRENCY_INFO: Record<
  SupportedCurrency,
  {
    name: string;
    symbol: string;
    locale: string;
  }
> = {
  KES: {
    name: "Kenyan Shilling",
    symbol: "KES",
    locale: "en-KE",
  },

  USD: {
    name: "US Dollar",
    symbol: "$",
    locale: "en-US",
  },

  GBP: {
    name: "British Pound",
    symbol: "£",
    locale: "en-GB",
  },

  EUR: {
    name: "Euro",
    symbol: "€",
    locale: "de-DE",
  },

  CAD: {
    name: "Canadian Dollar",
    symbol: "CA$",
    locale: "en-CA",
  },

  AUD: {
    name: "Australian Dollar",
    symbol: "A$",
    locale: "en-AU",
  },

  ZAR: {
    name: "South African Rand",
    symbol: "ZAR",
    locale: "en-ZA",
  },

  NGN: {
    name: "Nigerian Naira",
    symbol: "₦",
    locale: "en-NG",
  },

  INR: {
    name: "Indian Rupee",
    symbol: "₹",
    locale: "en-IN",
  },

  AED: {
    name: "UAE Dirham",
    symbol: "AED",
    locale: "en-AE",
  },

  JPY: {
    name: "Japanese Yen",
    symbol: "¥",
    locale: "ja-JP",
  },
};

/**
 * Detect the visitor's preferred currency.
 *
 * This uses the browser's locale rather than collecting
 * the visitor's exact location.
 */
export function detectCurrency(): SupportedCurrency {
  if (typeof navigator === "undefined") {
    return DEFAULT_CURRENCY;
  }

  const language =
    navigator.languages?.[0] ||
    navigator.language ||
    "en-KE";

  const countryMatch = language.match(/[-_]([A-Z]{2})$/i);

  if (countryMatch) {
    const country = countryMatch[1].toUpperCase();

    if (CURRENCY_BY_COUNTRY[country]) {
      return CURRENCY_BY_COUNTRY[country];
    }
  }

  // Helpful fallback based on common browser languages.
  const lowerLanguage = language.toLowerCase();

  if (lowerLanguage.startsWith("en-us")) return "USD";
  if (lowerLanguage.startsWith("en-gb")) return "GBP";
  if (lowerLanguage.startsWith("en-ca")) return "CAD";
  if (lowerLanguage.startsWith("en-au")) return "AUD";
  if (lowerLanguage.startsWith("en-ke")) return "KES";

  return DEFAULT_CURRENCY;
}

/**
 * Fetch the latest exchange rate.
 *
 * The database price is stored in KES.
 */
export async function getExchangeRate(
  targetCurrency: SupportedCurrency
): Promise<number> {
  if (targetCurrency === "KES") {
    return 1;
  }

  const response = await fetch(
    `https://api.frankfurter.dev/v2/rate/KES/${targetCurrency}`
  );

  if (!response.ok) {
    throw new Error("Unable to retrieve exchange rate");
  }

  const data = await response.json();

  if (!data?.rate || typeof data.rate !== "number") {
    throw new Error("Invalid exchange rate");
  }

  return data.rate;
}

/**
 * Convert a price from KES to another currency.
 *
 * priceCents is the value stored by your current database.
 * Example:
 *
 * 95000 = KES 950
 */
export function convertFromKES(
  priceCents: number,
  rate: number
): number {
  const kesAmount = priceCents / 100;

  return kesAmount * rate;
}

/**
 * Format a converted amount professionally.
 */
export function formatCurrency(
  amount: number,
  currency: SupportedCurrency
): string {
  const info = CURRENCY_INFO[currency];

  return new Intl.NumberFormat(info.locale, {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "JPY" ? 0 : 2,
  }).format(amount);
}