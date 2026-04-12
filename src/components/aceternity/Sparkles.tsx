import { motion } from "framer-motion";

const SparklesEffect = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const sparkles = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 2 + Math.random() * 3,
    delay: Math.random() * 2,
    duration: 1.5 + Math.random() * 2,
  }));

  return (
    <div className={`relative inline-block ${className}`}>
      {sparkles.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full bg-primary pointer-events-none"
          style={{
            width: s.size,
            height: s.size,
            left: `${s.x}%`,
            top: `${s.y}%`,
            boxShadow: `0 0 ${s.size * 2}px hsl(var(--primary) / 0.6)`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.2, 0],
          }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      {children}
    </div>
  );
};

export default SparklesEffect;
