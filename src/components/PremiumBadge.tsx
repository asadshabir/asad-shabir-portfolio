import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface PremiumBadgeProps {
  children: ReactNode;
  className?: string;
  tone?: "cyan" | "magenta" | "emerald" | "mixed";
}

const toneStyles = {
  cyan: "text-primary border-primary/25 hover:border-primary/50",
  magenta: "text-accent border-accent/25 hover:border-accent/50",
  emerald: "text-emerald border-emerald/25 hover:border-emerald/50",
  mixed: "holographic-text border-primary/20 hover:border-accent/45",
};

const PremiumBadge = ({ children, className = "", tone = "cyan" }: PremiumBadgeProps) => (
  <motion.span
    whileHover={{ y: -2, scale: 1.04, rotateX: -4 }}
    transition={{ type: "spring", stiffness: 380, damping: 24 }}
    className={`premium-badge px-3 py-1 text-[10px] sm:text-xs ${toneStyles[tone]} ${className}`}
    style={{ transformStyle: "preserve-3d" }}
  >
    {children}
  </motion.span>
);

export default PremiumBadge;