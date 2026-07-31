// src/lib/analytics.ts

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string;

// Only load/track in production builds
const isProd = import.meta.env.PROD;

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

let initialized = false;

/**
 * Injects the gtag.js script and initializes GA4.
 * Call once, as early as possible (e.g. in main.tsx).
 */
export function initGA(): void {
  if (!isProd || initialized || !GA_MEASUREMENT_ID) return;

  // Inject the script tag
  const script = document.createElement("script");
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  script.async = true;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  };

  window.gtag("js", new Date());
  // send_page_view disabled here — we send pageviews manually on route change
  window.gtag("config", GA_MEASUREMENT_ID, { send_page_view: false });

  initialized = true;
}

/**
 * Sends a pageview event to GA4. Call on every route change.
 */
export function trackPageview(path: string, title?: string): void {
  if (!isProd || !initialized) return;
  window.gtag("event", "page_view", {
    page_path: path,
    page_title: title ?? document.title,
    page_location: window.location.href,
  });
}

/**
 * Sends a custom event to GA4.
 */
export function trackEvent(
  name: string,
  params?: Record<string, unknown>
): void {
  if (!isProd || !initialized) return;
  window.gtag("event", name, params);
}
