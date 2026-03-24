/**
 * Turn API `coverImage` paths into a usable `src` for <img>.
 * In dev, `/uploads/...` is proxied by Vite (see vite.config.ts).
 */
export function resolveBookCoverUrl(
  coverImage?: string | null
): string | undefined {
  if (!coverImage) return undefined;
  if (coverImage.startsWith("http")) return coverImage;
  const path = coverImage.startsWith("/") ? coverImage : `/${coverImage}`;
  if (import.meta.env.DEV) return path;
  const base = (
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"
  ).replace(/\/+$/, "");
  return `${base}${path}`;
}
