import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FlipWordsProps {
  words: string[];
  duration?: number;
  className?: string;
}

const FlipWords = ({ words, duration = 3000, className = "" }: FlipWordsProps) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, duration);
    return () => clearInterval(interval);
  }, [words.length, duration]);

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={words[index]}
        initial={{ opacity: 0, y: 20, rotateX: -90, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -20, rotateX: 90, filter: "blur(8px)" }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className={`inline-block ${className}`}
        style={{ perspective: "800px" }}
      >
        {words[index]}
      </motion.span>
    </AnimatePresence>
  );
};

export default FlipWords;
