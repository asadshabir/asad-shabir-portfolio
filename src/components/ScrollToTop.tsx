import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp } from "lucide-react";

const ScrollToTop = ({ hidden = false, isScrolling = false }: { hidden?: boolean; isScrolling?: boolean }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > window.innerHeight * 0.75);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToHero = () => {
    document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" });
  };

  // Only render when conditions are met
  const show = visible && !hidden && !isScrolling;

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          aria-label="Scroll to top"
          initial={{ opacity: 0, y: 18, scale: 0.86 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 18, scale: 0.86 }}
          whileHover={{ y: -6, rotateX: 10, scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          onClick={scrollToHero}
          className="scroll-top-3d fixed bottom-6 left-4 sm:left-6 md:left-8 z-[50] h-12 w-12 sm:h-14 sm:w-14 flex items-center justify-center text-primary"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <ArrowUp className="relative z-10 h-5 w-5 sm:h-6 sm:w-6" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;
