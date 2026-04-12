import { motion } from "framer-motion";

interface GlowingEffectProps {
  children: React.ReactNode;
  color?: "cyan" | "magenta" | "both";
  className?: string;
  intensity?: "low" | "medium" | "high";
}

const glowMap = {
  cyan: {
    low: "0 0 10px hsl(var(--primary) / 0.15)",
    medium: "0 0 20px hsl(var(--primary) / 0.25), 0 0 40px hsl(var(--primary) / 0.1)",
    high: "0 0 30px hsl(var(--primary) / 0.4), 0 0 60px hsl(var(--primary) / 0.15)",
  },
  magenta: {
    low: "0 0 10px hsl(var(--accent) / 0.15)",
    medium: "0 0 20px hsl(var(--accent) / 0.25), 0 0 40px hsl(var(--accent) / 0.1)",
    high: "0 0 30px hsl(var(--accent) / 0.4), 0 0 60px hsl(var(--accent) / 0.15)",
  },
  both: {
    low: "0 0 10px hsl(var(--primary) / 0.15), 0 0 10px hsl(var(--accent) / 0.1)",
    medium: "0 0 20px hsl(var(--primary) / 0.2), 0 0 20px hsl(var(--accent) / 0.15)",
    high: "0 0 30px hsl(var(--primary) / 0.3), 0 0 30px hsl(var(--accent) / 0.2)",
  },
};

const GlowingEffect = ({ children, color = "cyan", className = "", intensity = "medium" }: GlowingEffectProps) => {
  return (
    <motion.div
      className={`relative ${className}`}
      whileHover={{
        boxShadow: glowMap[color][intensity],
        transition: { duration: 0.3 },
      }}
    >
      {children}
    </motion.div>
  );
};

export default GlowingEffect;
