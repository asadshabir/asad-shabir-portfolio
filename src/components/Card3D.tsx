import { useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";

interface Card3DProps {
  children: ReactNode;
  className?: string;
  glowColor?: "cyan" | "magenta" | "both";
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
    cyan: "hsl(var(--primary) / 0.15)",
    magenta: "hsl(var(--accent) / 0.15)",
    both: "hsl(var(--primary) / 0.1)",
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ rotateX, rotateY }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d",
        background: `radial-gradient(circle at ${glowX}% ${glowY}%, ${glowColors[glowColor]}, transparent 60%)`,
      }}
      className={`glass rounded-xl relative overflow-hidden ${className}`}
    >
      {/* Neon border glow on hover */}
      <div
        className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          boxShadow: glowColor === "magenta"
            ? "inset 0 0 30px hsl(var(--accent) / 0.1), 0 0 20px hsl(var(--accent) / 0.1)"
            : "inset 0 0 30px hsl(var(--primary) / 0.1), 0 0 20px hsl(var(--primary) / 0.1)",
        }}
      />
      <div style={{ transform: "translateZ(20px)" }}>
        {children}
      </div>
    </motion.div>
  );
};

export default Card3D;
