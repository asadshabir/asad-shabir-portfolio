import { motion } from "framer-motion";

const BackgroundBeams = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-px w-full"
          style={{
            top: `${15 + i * 15}%`,
            background: `linear-gradient(90deg, transparent, hsl(var(--primary) / ${0.06 + i * 0.02}), hsl(var(--accent) / ${0.04 + i * 0.01}), transparent)`,
            transform: `rotate(${-2 + i * 0.8}deg)`,
          }}
          initial={{ opacity: 0, x: "-100%" }}
          whileInView={{ opacity: 1, x: "0%" }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: i * 0.15, ease: "easeOut" }}
        />
      ))}
    </div>
  );
};

export default BackgroundBeams;
