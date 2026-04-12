import { useRef } from "react";
import { motion } from "framer-motion";

interface MovingBorderProps {
  children: React.ReactNode;
  duration?: number;
  className?: string;
  containerClassName?: string;
  borderClassName?: string;
}

const MovingBorder = ({
  children,
  duration = 4,
  className = "",
  containerClassName = "",
  borderClassName = "",
}: MovingBorderProps) => {
  return (
    <div className={`relative rounded-xl overflow-hidden p-[1px] ${containerClassName}`}>
      {/* Rotating gradient border */}
      <motion.div
        className={`absolute inset-0 ${borderClassName}`}
        style={{
          background: "conic-gradient(from 0deg, hsl(var(--primary)), hsl(var(--accent)), hsl(var(--primary)), transparent, hsl(var(--primary)))",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
      />
      <div className={`relative rounded-xl bg-card ${className}`}>
        {children}
      </div>
    </div>
  );
};

export default MovingBorder;
