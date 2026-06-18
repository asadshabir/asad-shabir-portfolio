import { useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";

interface Card3DProps {
  children: ReactNode;
  className?: string;
  glowColor?: "cyan" | "magenta" | "emerald" | "both";
  intensity?: number;
}

const Card3D = ({ children, className = "", glowColor = "cyan", intensity = 15 }: Card3DProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glowX, setGlowX] = useState(50);
  const [glowY, setGlowY] = useState(50);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setRotateX((y - 0.5) * -intensity);
    setRotateY((x - 0.5) * intensity);
    setGlowX(x * 100);
    setGlowY(y * 100);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlowX(50);
    setGlowY(50);
  };

  const glowColors = {
    cyan: "hsl(var(--primary) / 0.18)",
    magenta: "hsl(var(--accent) / 0.18)",
    emerald: "hsl(var(--emerald) / 0.18)",
    both: "hsl(var(--primary) / 0.12)",
  };

  const shadowColors = {
    cyan: "0 30px 90px hsl(var(--primary) / 0.18), 0 12px 40px hsl(var(--background) / 0.55)",
    magenta: "0 30px 90px hsl(var(--accent) / 0.18), 0 12px 40px hsl(var(--background) / 0.55)",
    emerald: "0 30px 90px hsl(var(--emerald) / 0.18), 0 12px 40px hsl(var(--background) / 0.55)",
    both: "0 30px 90px hsl(var(--primary) / 0.13), 0 22px 70px hsl(var(--accent) / 0.12), 0 12px 40px hsl(var(--background) / 0.55)",
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ rotateX, rotateY }}
      whileHover={{ y: -10, scale: 1.02, rotateX: -4, rotateY: 6, boxShadow: shadowColors[glowColor] }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d",
        background: `radial-gradient(circle at ${glowX}% ${glowY}%, ${glowColors[glowColor]}, transparent 56%), linear-gradient(145deg, hsl(var(--card) / 0.58), hsl(var(--background) / 0.25))`,
      }}
      className={`premium-project-card premium-glass glare-sweep rounded-2xl relative overflow-hidden ${className}`}
    >
      {/* Neon border glow on hover */}
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
      <div className="premium-project-card__content" style={{ transform: "translateZ(34px)" }}>
        {children}
      </div>
    </motion.div>
  );
};

export default Card3D;
