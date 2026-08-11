"use client";

import { useEffect } from "react";

const SCROLL_STORAGE_PREFIX = "brian-site-scroll:";

export function ScrollPositionRestorer() {
  useEffect(() => {
    let saveFrame: number | null = null;
    const restoreTimers = new Set<number>();

    const storageKey = () =>
      `${SCROLL_STORAGE_PREFIX}${window.location.pathname}${window.location.search}${window.location.hash}`;

    const writeScrollPosition = () => {
      const scrollPosition = Math.max(0, window.scrollY);

      try {
        window.sessionStorage.setItem(storageKey(), String(scrollPosition));
      } catch {
        // Browsing still works if a privacy setting disables session storage.
      }
    };

    const saveScrollPosition = () => {
      if (saveFrame !== null) return;

      saveFrame = window.requestAnimationFrame(() => {
        saveFrame = null;
        writeScrollPosition();
      });
    };

    const saveBeforeNavigation = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const link = target.closest<HTMLAnchorElement>("a[href]");
      if (!link || link.origin !== window.location.origin) return;

      writeScrollPosition();
    };

    const restoreScrollPosition = () => {
      let savedPosition: string | null = null;

      try {
        savedPosition = window.sessionStorage.getItem(storageKey());
      } catch {
        return;
      }

      const scrollPosition = savedPosition === null ? NaN : Number(savedPosition);

      if (!Number.isFinite(scrollPosition)) return;

      const applyScrollPosition = () => {
        window.scrollTo({ top: scrollPosition, left: 0, behavior: "auto" });
      };

      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          applyScrollPosition();
        });
      });

      [150, 600, 1200].forEach((delay) => {
        const restoreTimer = window.setTimeout(() => {
          restoreTimers.delete(restoreTimer);
          applyScrollPosition();
        }, delay);
        restoreTimers.add(restoreTimer);
      });
    };

    const restoreAfterPageShow = () => restoreScrollPosition();

    restoreScrollPosition();
    document.addEventListener("click", saveBeforeNavigation, true);
    window.addEventListener("scroll", saveScrollPosition, { passive: true });
    window.addEventListener("popstate", restoreScrollPosition);
    window.addEventListener("pageshow", restoreAfterPageShow);
    window.addEventListener("pagehide", writeScrollPosition);

    return () => {
      if (saveFrame !== null) window.cancelAnimationFrame(saveFrame);
      restoreTimers.forEach((timer) => window.clearTimeout(timer));
      writeScrollPosition();
      document.removeEventListener("click", saveBeforeNavigation, true);
      window.removeEventListener("scroll", saveScrollPosition);
      window.removeEventListener("popstate", restoreScrollPosition);
      window.removeEventListener("pageshow", restoreAfterPageShow);
      window.removeEventListener("pagehide", writeScrollPosition);
    };
  }, []);

  return null;
}
