import Script from "next/script";

/**
 * Lightweight analytics loader.
 *
 * Set env vars:
 * - NEXT_PUBLIC_PLAUSIBLE_DOMAIN=aruform.com
 * Optional:
 * - NEXT_PUBLIC_PLAUSIBLE_SRC=https://plausible.io/js/script.js
 */
export function Analytics() {
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  const plausibleSrc =
    process.env.NEXT_PUBLIC_PLAUSIBLE_SRC || "https://plausible.io/js/script.js";

  if (!plausibleDomain) return null;

  return (
    <Script
      defer
      data-domain={plausibleDomain}
      src={plausibleSrc}
      strategy="afterInteractive"
    />
  );
}
