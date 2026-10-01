"use client";

import { useEffect } from "react";

// The browser positions the PNG at its hotspot; no mouse-following DOM overlay.
export function CustomCursorState() {
  useEffect(() => {
    const root = document.documentElement;
    const mouseQuery = window.matchMedia("(hover: hover) and (pointer: fine)");

    function reset() {
      root.removeAttribute("data-cursor-pressed");
    }

    function prepare() {
      reset();
      if (!mouseQuery.matches) return;

      // Cache every state before the first hover or press to avoid flicker.
      for (const state of ["default", "hover", "click", "text"]) {
        const image = new Image();
        image.src = `/asset/cursor/${state}.png`;
      }
    }

    function startPress(event: PointerEvent) {
      if (
        !mouseQuery.matches ||
        event.pointerType !== "mouse" ||
        event.button !== 0
      ) return;

      root.setAttribute("data-cursor-pressed", "");
    }

    function syncButtons(event: PointerEvent) {
      // Recover when the mouse was released outside the browser window.
      if (event.pointerType === "mouse" && (event.buttons & 1) === 0) reset();
    }

    function leaveWindow(event: PointerEvent) {
      if (event.relatedTarget === null) reset();
    }

    prepare();
    mouseQuery.addEventListener("change", prepare);
    window.addEventListener("pointerdown", startPress, true);
    window.addEventListener("pointerup", reset, true);
    window.addEventListener("pointercancel", reset, true);
    window.addEventListener("pointermove", syncButtons, { passive: true });
    window.addEventListener("pointerout", leaveWindow, true);
    window.addEventListener("blur", reset);
    window.addEventListener("dragend", reset);
    window.addEventListener("contextmenu", reset);
    document.addEventListener("visibilitychange", reset);

    return () => {
      reset();
      mouseQuery.removeEventListener("change", prepare);
      window.removeEventListener("pointerdown", startPress, true);
      window.removeEventListener("pointerup", reset, true);
      window.removeEventListener("pointercancel", reset, true);
      window.removeEventListener("pointermove", syncButtons);
      window.removeEventListener("pointerout", leaveWindow, true);
      window.removeEventListener("blur", reset);
      window.removeEventListener("dragend", reset);
      window.removeEventListener("contextmenu", reset);
      document.removeEventListener("visibilitychange", reset);
    };
  }, []);

  return null;
}
