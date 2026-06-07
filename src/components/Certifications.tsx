import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  image: string;
  credentialUrl?: string;
  skills: string[];
}

// Demo certificates - user will replace with actual ones
const certificates: Certificate[] = [
  {
    id: "cert-1",
    title: "AWS Certified Solutions Architect",
    issuer: "Amazon Web Services",
    image: "/content/certificates/demo-aws.jpg",
    credentialUrl: "#",
    skills: ["Cloud Architecture", "AWS", "DevOps"],
  },
  {
    id: "cert-2",
    title: "Professional AI Engineer",
    issuer: "Google Cloud",
    image: "/content/certificates/demo-ai.jpg",
    credentialUrl: "#",
    skills: ["AI/ML", "TensorFlow", "Python"],
  },
  {
    id: "cert-3",
    title: "Full Stack Web Development",
    issuer: "Meta",
    image: "/content/certificates/demo-fullstack.jpg",
    credentialUrl: "#",
    skills: ["React", "Node.js", "MongoDB"],
  },
  {
    id: "cert-4",
    title: "Advanced Python Programming",
    issuer: "Python Institute",
    image: "/content/certificates/demo-python.jpg",
    credentialUrl: "#",
    skills: ["Python", "FastAPI", "Data Science"],
  },
];

const Certifications = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      let nextIndex = prevIndex + newDirection;
      if (nextIndex < 0) nextIndex = certificates.length - 1;
      if (nextIndex >= certificates.length) nextIndex = 0;
      return nextIndex;
    });
  };

  const currentCert = certificates[currentIndex];

  return (
    <section id="certifications" className="py-20 sm:py-32 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-emerald/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[140px]" />
      </div>

      <div className="container px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <p className="text-sm font-mono tracking-widest uppercase text-emerald mb-4">Credentials</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Professional <span className="holographic-text">Certifications</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg">
            Validated expertise across cloud, AI, and full-stack development
          </p>
        </motion.div>

        {/* Mobile-optimized carousel */}
        <div className="max-w-4xl mx-auto">
          <div className="relative h-[520px] sm:h-[580px] flex items-center justify-center">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                  scale: { duration: 0.2 },
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = swipePower(offset.x, velocity.x);
                  if (swipe < -swipeConfidenceThreshold) {
                    paginate(1);
                  } else if (swipe > swipeConfidenceThreshold) {
                    paginate(-1);
                  }
                }}
                className="absolute w-full max-w-md sm:max-w-lg"
              >
                <div className="premium-glass rounded-3xl overflow-hidden border border-border/50 shadow-2xl">
                  {/* Certificate Image */}
                  <div className="relative h-64 sm:h-80 bg-gradient-to-br from-card via-card/95 to-card/90 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Award className="w-32 h-32 sm:w-40 sm:h-40 text-primary/20" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl premium-glass flex items-center justify-center flex-shrink-0">
                          <Award className="w-6 h-6 sm:w-7 sm:h-7 text-emerald" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg sm:text-xl font-bold text-foreground mb-1 line-clamp-2">
                            {currentCert.title}
                          </h3>
                          <p className="text-sm text-primary font-medium">{currentCert.issuer}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Certificate Details */}
                  <div className="p-6 sm:p-8 space-y-5">
                    <div>
                      <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">
                        Skills Validated
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {currentCert.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {currentCert.credentialUrl && (
                      <motion.a
                        href={currentCert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl premium-glass-button premium-glass-button--primary text-sm font-medium"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View Credential
                      </motion.a>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <button
              onClick={() => paginate(-1)}
              className="absolute left-0 sm:-left-16 z-10 w-12 h-12 rounded-full premium-glass flex items-center justify-center hover:bg-primary/10 transition-colors"
              aria-label="Previous certificate"
            >
              <ChevronLeft className="w-6 h-6 text-primary" />
            </button>
            <button
              onClick={() => paginate(1)}
              className="absolute right-0 sm:-right-16 z-10 w-12 h-12 rounded-full premium-glass flex items-center justify-center hover:bg-primary/10 transition-colors"
              aria-label="Next certificate"
            >
              <ChevronRight className="w-6 h-6 text-primary" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {certificates.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setDirection(idx > currentIndex ? 1 : -1);
                  setCurrentIndex(idx);
                }}
                className={`h-2 rounded-full transition-all ${
                  idx === currentIndex
                    ? "w-8 bg-primary"
                    : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
                aria-label={`Go to certificate ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Certifications;
