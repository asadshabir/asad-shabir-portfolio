import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown, MessageCircle, Download } from "lucide-react";
import ParticleBackground from "./ParticleBackground";
import profilePhoto from "@/assets/profile-photo.jpg";

const titles = [
  "Full-Stack Developer",
  "Agentic AI Engineer",
  "Prompt Engineer & Chatbot Architect",
  "Automation Builder",
];

const Hero = ({ onOpenChat }: { onOpenChat: () => void }) => {
  const [titleIndex, setTitleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTitleIndex((prev) => (prev + 1) % titles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const scrollToProjects = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

  const downloadResume = () => {
    // Confetti-like animation feedback
    const btn = document.getElementById("resume-btn");
    if (btn) btn.classList.add("animate-pulse-glow");
    setTimeout(() => btn?.classList.remove("animate-pulse-glow"), 2000);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <ParticleBackground />

      {/* Gradient orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-primary/10 blur-[120px]" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-accent/10 blur-[120px]" />

      <div className="container relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-20 px-6 py-20">
        {/* Profile Photo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative flex-shrink-0"
        >
          <div className="relative w-56 h-56 lg:w-72 lg:h-72">
            {/* Rotating neon border */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-accent animate-spin-slow" style={{ padding: "3px" }}>
              <div className="w-full h-full rounded-full bg-background" />
            </div>
            <img
              src={profilePhoto}
              alt="Asad Shabir"
              className="absolute inset-2 rounded-full object-cover neon-glow-cyan"
            />
          </div>
        </motion.div>

        {/* Text Content */}
        <div className="flex-1 text-center lg:text-left">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm font-mono tracking-widest uppercase text-primary mb-4"
          >
            Welcome to my universe
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-4"
          >
            Asad{" "}
            <span className="gradient-text">Shabir</span>
          </motion.h1>

          {/* Cycling titles */}
          <div className="h-10 md:h-12 mb-6 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={titleIndex}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4 }}
                className="text-xl md:text-2xl font-semibold neon-text-cyan text-primary"
              >
                {titles[titleIndex]}
              </motion.p>
            </AnimatePresence>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-muted-foreground text-lg max-w-xl mb-10 leading-relaxed mx-auto lg:mx-0"
          >
            Building intelligent, production-ready AI agents, full-stack applications,
            and automation systems that actually work.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-wrap gap-4 justify-center lg:justify-start"
          >
            <button
              onClick={scrollToProjects}
              className="group flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover-lift neon-glow-cyan transition-all"
            >
              <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              Explore My Projects
            </button>
            <button
              onClick={onOpenChat}
              className="group flex items-center gap-2 px-6 py-3 rounded-lg glass border-primary/30 text-primary font-semibold hover-lift hover:neon-glow-cyan transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              Talk to My AI
            </button>
            <button
              id="resume-btn"
              onClick={downloadResume}
              className="group flex items-center gap-2 px-6 py-3 rounded-lg glass border-accent/30 text-accent font-semibold hover-lift hover:neon-glow-magenta transition-all"
            >
              <Download className="w-4 h-4" />
              Download Resume
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
