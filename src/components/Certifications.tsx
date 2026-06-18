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

const certificates: Certificate[] = [
  {
    id: "cert-agentic-ai-dev",
    title: "Agentic AI Developer",
    issuer: "Professional Certification",
    image: "/certificates/agentic-ai-developer.png",
    skills: ["Agentic AI", "Autonomous Agents", "AI Orchestration"],
  },
  {
    id: "cert-ai-engineer",
    title: "AI Engineer",
    issuer: "Professional Certification",
    image: "/certificates/ai-engineer.png",
    skills: ["Artificial Intelligence", "Machine Learning", "Deep Learning"],
  },
  {
    id: "cert-ai-native-dev",
    title: "AI-Native Developer",
    issuer: "Professional Certification",
    image: "/certificates/ai-native-developer.png",
    skills: ["AI-Native Development", "Prompt Engineering", "LLM Integration"],
  },
  {
    id: "cert-cloud-native",
    title: "Cloud Native Developer",
    issuer: "Professional Certification",
    image: "/certificates/cloud-native.png",
    skills: ["Cloud Computing", "Docker", "Kubernetes"],
  },
  {
    id: "cert-full-stack",
    title: "Full Stack Developer",
    issuer: "Professional Certification",
    image: "/certificates/full-stack-developer.png",
    skills: ["React", "TypeScript", "FastAPI", "PostgreSQL"],
  },
  {
    id: "cert-prompt-engineer",
    title: "Prompt Engineer",
    issuer: "Professional Certification",
    image: "/certificates/prompt-engineer.png",
    skills: ["Prompt Engineering", "LLM Fine-tuning", "RAG"],
  },
  {
    id: "cert-qa-engineer",
    title: "QA Engineer",
    issuer: "Professional Certification",
    image: "/certificates/qa-engineer.png",
    skills: ["Software Testing", "Automation", "Quality Assurance"],
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
          <div className="relative h-[500px] sm:h-[560px] md:h-[580px] flex items-center justify-center">
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
                  <div className="relative bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
                    <div className="relative h-56 sm:h-72 md:h-80 flex items-center justify-center p-4 sm:p-6">
                      <img
                        src={currentCert.image}
                        alt={currentCert.title}
                        className="w-full h-full object-contain drop-shadow-lg"
                        loading="lazy"
                      />
                    </div>
                    {/* Gradient overlay at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/95 via-background/60 to-transparent h-24 sm:h-28" />
                    <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl premium-glass flex items-center justify-center flex-shrink-0 shadow-lg">
                          <Award className="w-5 h-5 sm:w-6 sm:h-6 text-emerald" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base sm:text-lg font-bold text-foreground mb-0.5 line-clamp-2">
                            {currentCert.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-primary font-medium">{currentCert.issuer}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Certificate Details */}
                  <div className="p-5 sm:p-6 space-y-4">
                    <div>
                      <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
                        Skills
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {currentCert.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {currentCert.credentialUrl && currentCert.credentialUrl !== "#" && (
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
          <div className="flex justify-center gap-2 mt-8
          
          ">
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
