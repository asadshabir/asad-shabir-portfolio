import { useEffect, useState } from "react";

/**
 * useScrollHide
 * - returns `true` while the user is actively scrolling
 * - switches back to `false` after `delay` ms of no scroll events
 * - only activates when scrolled past 50px (avoids tiny scroll flickers at top)
 */
export default function useScrollHide(delay = 250): boolean {
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    const onScroll = () => {
      // Only trigger when actually scrolled past the threshold
      if (window.scrollY > 50) {
        setIsScrolling(true);
      }

      if (timer) clearTimeout(timer);
      timer = setTimeout(() => setIsScrolling(false), delay);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (timer) clearTimeout(timer);
    };
  }, [delay]);

  return isScrolling;
}
