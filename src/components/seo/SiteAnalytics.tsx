"use client";

import { useEffect } from "react";
import { ANALYTICS_SOURCES, trackEvent, type AnalyticsSource } from "@/lib/analytics";

function eventSource(element: Element): AnalyticsSource {
  if (element.closest("#quick-inquiry-panel, [aria-controls='quick-inquiry-panel']")) return "floating";
  if (element.closest("header")) return "header";
  if (element.closest("footer")) return "footer";
  const section = element.closest("section[id]")?.id;
  return ANALYTICS_SOURCES.includes(section as AnalyticsSource) ? section as AnalyticsSource : "other";
}

export function SiteAnalytics() {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || !(event.target instanceof Element)) return;
      const element = event.target.closest("a, button");
      if (!element) return;
      const source = eventSource(element);
      if (element.matches("button[aria-controls='quick-inquiry-panel'][aria-expanded='false']")) {
        trackEvent("inquiry_cta_click", source);
        return;
      }
      const href = element.getAttribute("href");
      if (!href) return;
      if (/^tel:/i.test(href)) trackEvent("phone_click", source);
      else if (/^mailto:/i.test(href)) trackEvent("email_click", source);
      else {
        try {
          const url = new URL(href, window.location.href);
          if (url.origin === window.location.origin && url.pathname === "/" && url.hash === "#inquiry") {
            trackEvent("inquiry_cta_click", source);
          } else if (url.hostname === "map.kakao.com") trackEvent("directions_click", source);
        } catch { /* A malformed link has no analytics event. */ }
      }
    };
    // Next Link prevents the native click during routing; capture the intent first.
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);
  return null;
}
