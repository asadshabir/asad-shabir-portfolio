import { useState, useEffect, useRef } from "react";

/**
 * Hook to detect when user is scrolling vs stopped
 * Returns true when scrolling, false when stopped
 *
 * @param delay - Milliseconds to wait after last scroll event before considering stopped (default: 150ms)
 */
export const useScrollHide = (delay: number = 150) => {
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Only trigger if actually scrolling (not just at top)
      if (currentScrollY > 50) {
        setIsScrolling(true);
      }

      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Set new timeout to detect when scrolling stops
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, delay);

      lastScrollY = currentScrollY;
    };

    // Add scroll listener
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [delay]);

  return isScrolling;
};
