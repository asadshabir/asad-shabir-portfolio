import { type ReactNode } from "react";
import { motion } from "framer-motion";

interface Card3DProps {
  children: ReactNode;
  className?: string;
  glowColor?: "cyan" | "magenta" | "emerald" | "both";
  intensity?: number;
}

const Card3D = ({ children, className = "", glowColor = "cyan" }: Card3DProps) => {
  const glowColors = {
    cyan: "hsl(var(--primary) / 0.18)",
    magenta: "hsl(var(--accent) / 0.18)",
    emerald: "hsl(var(--emerald) / 0.18)",
    both: "hsl(var(--primary) / 0.12)",
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{
        background: `radial-gradient(circle at 50% 50%, ${glowColors[glowColor]}, transparent 56%), linear-gradient(145deg, hsl(var(--card) / 0.58), hsl(var(--background) / 0.25))`,
      }}
      className={`premium-project-card premium-glass rounded-2xl relative overflow-hidden ${className}`}
    >
      <div
        className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          boxShadow: glowColor === "magenta"
            ? "inset 0 0 38px hsl(var(--accent) / 0.14), 0 0 34px hsl(var(--accent) / 0.12)"
            : glowColor === "emerald"
            ? "inset 0 0 38px hsl(var(--emerald) / 0.14), 0 0 34px hsl(var(--emerald) / 0.12)"
            : "inset 0 0 38px hsl(var(--primary) / 0.14), 0 0 34px hsl(var(--primary) / 0.12)",
        }}
      />
      <div className="premium-project-card__content">
        {children}
      </div>
    </motion.div>
  );
};

export default Card3D;
