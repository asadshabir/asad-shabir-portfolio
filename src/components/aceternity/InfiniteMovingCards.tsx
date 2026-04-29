import { motion } from "framer-motion";

interface InfiniteMovingCardsProps {
  items: string[];
  speed?: "slow" | "normal" | "fast";
  direction?: "left" | "right";
  className?: string;
}

const speedMap = { slow: 40, normal: 25, fast: 15 };

const InfiniteMovingCards = ({
  items,
  speed = "normal",
  direction = "left",
  className = "",
}: InfiniteMovingCardsProps) => {
  const doubled = [...items, ...items];
  const dur = speedMap[speed];

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
      <motion.div
        className="flex gap-6 whitespace-nowrap"
        animate={{ x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"] }}
        transition={{ duration: dur, repeat: Infinity, ease: "linear" }}
      >
        {doubled.map((item, i) => (
          <div
            key={i}
            className="premium-badge flex-shrink-0 px-5 py-3 text-sm text-muted-foreground/70 hover:text-primary transition-all duration-300"
            style={{
              perspective: "600px",
              transform: `rotateY(${Math.sin(i * 0.4) * 6}deg)`,
            }}
          >
            {item}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default InfiniteMovingCards;
