import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import profilePhoto from "@/assets/portfolio_profile-2.png";

const links = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 premium-navbar ${
        scrolled ? "py-2.5" : "py-4"
      }`}
    >
      <div className="container px-6 flex items-center justify-between">
        <a href="#" className="flex items-center gap-3 group" aria-label="Asad Shabir portfolio home">
          <span className="avatar-ring inline-flex h-11 w-11 rounded-full p-[2px] transition-transform duration-300 group-hover:scale-105">
            <span className="h-full w-full overflow-hidden rounded-full bg-background p-[2px]">
              <img src={profilePhoto} alt="Asad Shabir" className="h-full w-full rounded-full object-cover object-top" />
            </span>
          </span>
          <span className="text-xl font-black holographic-text">AS.</span>
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileOpen}
          className="nav-toggle-3d md:hidden group"
        >
          {mobileOpen ? (
            <X className="relative z-10 h-5 w-5" />
          ) : (
            <span className="relative z-10 flex h-5 w-6 flex-col justify-center gap-1.5">
              <span className="nav-toggle-bar w-6" />
              <span className="nav-toggle-bar w-4 self-end" />
              <span className="nav-toggle-bar w-5" />
            </span>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden premium-mobile-menu mt-2 mx-4 rounded-2xl p-4 space-y-3"
        >
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="block text-sm text-muted-foreground hover:text-primary transition-colors font-medium py-2"
            >
              {l.label}
            </a>
          ))}
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
