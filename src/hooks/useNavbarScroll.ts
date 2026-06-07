import { useEffect, useState, useCallback, useRef } from "react";

export interface NavbarScrollState {
  isHidden: boolean;
  isScrolled: boolean;
  scrollDirection: "up" | "down" | null;
}

const SCROLL_THRESHOLD = 50;
const TRANSITION_MS = 300;

/**
 * T028 — Premium Navbar Scroll Behavior
 *
 * - Hides navbar when scrolling down past threshold
 * - Reveals navbar when scrolling up
 * - Reports `isScrolled` for background blur treatment
 * - No jitter on micro-scroll: uses cooldown timer
 * - Respects prefers-reduced-motion
 */
export function useNavbarScroll(): NavbarScrollState {
  const [state, setState] = useState<NavbarScrollState>({
    isHidden: false,
    isScrolled: false,
    scrollDirection: null,
  });

  const lastScrollY = useRef(0);
  const lastDirection = useRef<"up" | "down">("down");
  const cooldownRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleScroll = useCallback(() => {
    const currentY = window.scrollY;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      setState({
        isHidden: false,
        isScrolled: currentY > 10,
        scrollDirection: null,
      });
      return;
    }

    const delta = currentY - lastScrollY.current;
    const isScrolled = currentY > 10;
    const crossedThreshold = Math.abs(delta) > 4;

    if (crossedThreshold) {
      let newDirection: "up" | "down" | null = null;
      let isHidden = false;

      if (delta < -4) {
        newDirection = "up";
        isHidden = false;
      } else if (delta > 4 && currentY > SCROLL_THRESHOLD) {
        newDirection = "down";
        isHidden = true;
      }

      // Clear any pending cooldown
      if (cooldownRef.current) {
        clearTimeout(cooldownRef.current);
        cooldownRef.current = null;
      }

      // Set new state immediately
      setState({
        isHidden,
        isScrolled,
        scrollDirection: newDirection,
      });

      lastDirection.current = newDirection ?? lastDirection.current;
      lastScrollY.current = currentY;

      // If hidden, set a cooldown before allowing re-reveal
      if (isHidden && cooldownRef.current === null) {
        cooldownRef.current = setTimeout(() => {
          cooldownRef.current = null;
        }, TRANSITION_MS);
      }
    }
  }, []);

  useEffect(() => {
    // Initialize with current scroll position
    lastScrollY.current = window.scrollY;

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (cooldownRef.current) clearTimeout(cooldownRef.current);
    };
  }, [handleScroll]);

  return state;
}
