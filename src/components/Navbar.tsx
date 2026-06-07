import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import profilePhoto from "@/assets/portfolio_profile-2.png";
import { useNavbarScroll } from "@/hooks/useNavbarScroll";

const links = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Blog", href: "/blog" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

/**
 * T028 — Premium Navbar
 *
 * Behaviors:
 * - Transparent/frosted glass at top
 * - Blurred solid background after 10px scroll
 * - Hides on scroll down (> 50px threshold, 300ms transition)
 * - Reveals on scroll up
 * - No jitter on micro-scroll (cooldown timer)
 * - Respects prefers-reduced-motion
 */
const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isHidden, isScrolled, scrollDirection } = useNavbarScroll();

  // Close mobile menu on route change / resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="premium-floating-header fixed left-3 right-3 top-3 z-[120] mx-auto max-w-[1120px] sm:left-6 sm:right-6"
      style={{
        transform:
          isHidden && scrollDirection === "down"
            ? "translateY(-110%)"
            : "translateY(0)",
        transition: "transform 300ms cubic-bezier(0.4, 0, 0.2, 1)",
      }}
      aria-label="Primary navigation"
    >
      <nav
        className={[
          "premium-nav-shell",
          isScrolled ? "is-compact" : "",
          "navbar-base",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <a
          href="#hero"
          className="premium-brand group"
          aria-label="Asad Shabir portfolio home"
        >
          <span className="premium-brand-avatar">
            <img
              src='src/assets/avatar.png'
              alt="Asad Shabir"
              className="h-full w-full object-cover object-top"
            />
          </span>
          <span className="leading-none">
            <span className="block text-[10px] font-mono uppercase tracking-[0.35em] text-primary/80">
              Asad
            </span>
            <span className="block text-lg font-black holographic-text">
              Shabir
            </span>
          </span>
        </a>

        <div className="hidden items-center gap-2 md:flex">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="glass-nav-pill">
              {link.label}
            </a>
          ))}
        </div>

        <a href="#contact" className="hidden md:inline-flex premium-header-cta">
          Hire Me
          <ArrowUpRight className="h-4 w-4" />
        </a>

        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          className="sidebar-pill-toggle md:hidden"
          aria-label={
            mobileOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={mobileOpen}
        >
          <span className="sidebar-pill-toggle__core">
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <svg
                width="30"
                height="22"
                viewBox="0 0 30 22"
                fill="none"
                aria-hidden="true"
                className="sidebar-pill-svg"
              >
                <path
                  d="M5 4.5H24"
                  className="sidebar-pill-stroke sidebar-pill-stroke-a"
                />
                <path
                  d="M9 11H26"
                  className="sidebar-pill-stroke sidebar-pill-stroke-b"
                />
                <path
                  d="M4 17.5H20"
                  className="sidebar-pill-stroke sidebar-pill-stroke-c"
                />
                <circle cx="24.5" cy="4.5" r="2" className="sidebar-pill-dot" />
                <circle cx="5" cy="17.5" r="2" className="sidebar-pill-dot" />
              </svg>
            )}
          </span>
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="premium-sidebar-panel md:hidden"
          >
            {links.map((link, index) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="premium-sidebar-link"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <span>{link.label}</span>
                <ArrowUpRight className="h-4 w-4" />
              </a>
            ))}
          </motion.aside>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;