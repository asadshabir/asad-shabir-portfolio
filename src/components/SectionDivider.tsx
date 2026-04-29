import { motion } from "framer-motion";

const SectionDivider = () => (
  <div className="relative h-32 flex items-center justify-center overflow-hidden">
    {/* Aurora-style background glow */}
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
      className="absolute inset-0"
    >
       <div className="absolute top-1/2 left-1/4 w-48 h-10 bg-primary/10 rounded-full blur-3xl" />
       <div className="absolute top-1/2 right-1/4 w-48 h-10 bg-accent/10 rounded-full blur-3xl" />
       <div className="absolute top-1/2 left-1/2 w-36 h-8 bg-emerald/10 rounded-full blur-3xl" />
    </motion.div>

    {/* Main glowing line */}
    <motion.div
      initial={{ scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="w-full max-w-2xl h-px mx-auto"
      style={{
         background: "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.5), hsl(var(--accent) / 0.45), hsl(var(--emerald) / 0.35), transparent)",
      }}
    />

    {/* Center dot */}
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
