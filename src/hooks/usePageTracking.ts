// src/hooks/usePageTracking.ts
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageview } from "../lib/analytics";

/**
 * Mount this once near the top of your app (inside the Router).
 * Fires a GA4 page_view event on every route change (path or search change).
 */
export function usePageTracking(): void {
  const location = useLocation();

  useEffect(() => {
    trackPageview(location.pathname + location.search);
  }, [location.pathname, location.search]);
}
