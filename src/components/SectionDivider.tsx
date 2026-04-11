import { motion } from "framer-motion";

const SectionDivider = () => (
  <div className="relative h-24 flex items-center justify-center overflow-hidden">
    <motion.div
      initial={{ scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="w-full max-w-2xl h-px mx-auto"
      style={{
        background: "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.4), hsl(var(--accent) / 0.4), transparent)",
      }}
    />
    <motion.div
      initial={{ scale: 0 }}
      whileInView={{ scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.3, type: "spring" }}
      className="absolute w-2 h-2 rounded-full bg-primary neon-glow-cyan"
    />
  </div>
);

export default SectionDivider;
