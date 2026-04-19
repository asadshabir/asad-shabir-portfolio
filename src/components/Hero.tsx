import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, MessageCircle, Download } from "lucide-react";
import ParticleBackground from "./ParticleBackground";
import FlipWords from "./aceternity/FlipWords";
import SparklesEffect from "./aceternity/Sparkles";
import profilePhoto from "@/assets/profile-photo.png";

const titles = [
  "Full-Stack Developer",
  "AI-Native Developer",
  "Python Developer",
  "Chatbot Developer",
  "QA Engineer",
  "AI Engineer",
  "Debug Master",
  "Premium Apps Builder",
  "Spec-Driven Developer",
  "Prompt Engineer",
  "Agentic AI Orchestration",
  "Backend Developer",
  "DevOps Developer",
];

const Hero = ({ onOpenChat }: { onOpenChat: () => void }) => {
  const photoRef = useRef<HTMLDivElement>(null);
  const [photoTilt, setPhotoTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!photoRef.current) return;
    const rect = photoRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setPhotoTilt({ x: y * -15, y: x * 15 });
  };

  const handleMouseLeave = () => setPhotoTilt({ x: 0, y: 0 });

  const scrollToProjects = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <ParticleBackground />

      {/* Gradient orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-primary/10 blur-[120px] animate-float" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-accent/10 blur-[120px] animate-float" style={{ animationDelay: "1.5s" }} />

      <div className="container relative z-10 flex flex-col lg:flex-row items-center gap-8 lg:gap-20 px-4 sm:px-6 py-20">
        {/* 3D Profile Photo */}
        <motion.div
          ref={photoRef}
          initial={{ opacity: 0, scale: 0.7, rotateY: -30 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 1, type: "spring", stiffness: 80 }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ perspective: "1200px" }}
          className="relative flex-shrink-0"
        >
          <motion.div
            animate={{ rotateX: photoTilt.x, rotateY: photoTilt.y }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="relative w-52 h-52 sm:w-64 sm:h-64 lg:w-80 lg:h-80"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Outer rotating neon ring */}
            <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-primary via-accent to-primary animate-spin-slow opacity-60 blur-sm" />
            <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-primary via-accent to-primary animate-spin-slow" style={{ padding: "2px" }}>
              <div className="w-full h-full rounded-full bg-background" />
            </div>

            {/* Inner glow ring */}
            <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 blur-md animate-pulse-glow" />

            {/* Photo - crystal clear */}
            <img
              src={profilePhoto}
              alt="Asad Shabir"
              className="absolute inset-2 rounded-full object-cover object-top z-10"
              style={{
                transform: "translateZ(30px)",
                boxShadow: "0 0 30px hsl(var(--primary) / 0.3), 0 0 60px hsl(var(--primary) / 0.1)",
              }}
            />

            {/* Floating orbit particles */}
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full bg-primary hidden sm:block"
                style={{
                  top: "50%",
                  left: "50%",
                  boxShadow: "0 0 8px hsl(var(--primary) / 0.8)",
                }}
                animate={{
                  x: [
                    Math.cos((i * Math.PI * 2) / 6) * 170,
                    Math.cos((i * Math.PI * 2) / 6 + Math.PI) * 170,
                    Math.cos((i * Math.PI * 2) / 6) * 170,
                  ],
                  y: [
                    Math.sin((i * Math.PI * 2) / 6) * 170,
                    Math.sin((i * Math.PI * 2) / 6 + Math.PI) * 170,
                    Math.sin((i * Math.PI * 2) / 6) * 170,
                  ],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{ duration: 8 + i * 0.5, repeat: Infinity, ease: "linear" }}
              />
            ))}
          </motion.div>
        </motion.div>

        {/* Text Content */}
        <div className="flex-1 text-center lg:text-left">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xs sm:text-sm font-mono tracking-widest uppercase text-primary mb-4"
          >
            Welcome to my universe
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black mb-4"
            style={{ letterSpacing: "0.04em" }}
          >
            <SparklesEffect>
              <span className="inline-block" style={{ textShadow: "0 0 40px hsl(var(--primary) / 0.15)" }}>
                Asad{" "}
              </span>
              <span className="gradient-text" style={{ textShadow: "none" }}>Shabir</span>
            </SparklesEffect>
          </motion.h1>

          {/* FlipWords cycling titles */}
          <div className="h-10 sm:h-12 md:h-14 mb-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold neon-text-cyan text-primary"
            >
              <FlipWords words={titles} duration={2500} />
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-muted-foreground text-base sm:text-lg max-w-xl mb-8 sm:mb-10 leading-relaxed mx-auto lg:mx-0"
          >
            Building intelligent, production-ready AI agents, full-stack applications,
            and automation systems that actually work.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={scrollToProjects}
              className="group flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold neon-glow-cyan transition-all text-sm sm:text-base"
            >
              <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              Explore My Projects
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={onOpenChat}
              className="group flex items-center justify-center gap-2 px-6 py-3 rounded-lg glass border-primary/30 text-primary font-semibold hover:neon-glow-cyan transition-all text-sm sm:text-base"
            >
              <MessageCircle className="w-4 h-4" />
              Talk to My AI
            </motion.button>
            <motion.a
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              href="/Asad_Shabir_Resume.pdf"
              download="Asad_Shabir_Resume.pdf"
              className="group flex items-center justify-center gap-2 px-6 py-3 rounded-lg glass border-accent/30 text-accent font-semibold hover:neon-glow-magenta transition-all text-sm sm:text-base"
            >
              <Download className="w-4 h-4" />
              Download Resume
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
