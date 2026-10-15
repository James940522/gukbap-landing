// Local event queue only. No analytics provider or network request is installed.
export const ANALYTICS_EVENTS = [
  "inquiry_cta_click", "phone_click", "email_click", "directions_click", "generate_lead",
] as const;
export const ANALYTICS_SOURCES = [
  "hero", "header", "footer", "menu", "stores", "inquiry", "contact", "floating", "other",
] as const;
export type AnalyticsEvent = typeof ANALYTICS_EVENTS[number];
export type AnalyticsSource = typeof ANALYTICS_SOURCES[number];

export function trackEvent(event: AnalyticsEvent, source: AnalyticsSource) {
  if (typeof window === "undefined" || !ANALYTICS_EVENTS.includes(event)) return;
  // Construct an allowlisted payload; never copy URLs, form values or query strings.
  const payload = {
    event,
    source: ANALYTICS_SOURCES.includes(source) ? source : "other",
    page_path: window.location.pathname === "/stores" ? "/stores" : "/",
  };
  try {
    const analyticsWindow = window as Window & { dataLayer?: unknown[] };
    analyticsWindow.dataLayer ??= [];
    analyticsWindow.dataLayer.push(payload);
    window.dispatchEvent(new CustomEvent("ddukson:analytics", { detail: payload }));
  } catch {
    // Analytics must never interrupt navigation or a successful inquiry.
  }
}
