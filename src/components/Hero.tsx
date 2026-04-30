import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, MessageCircle, Download, Bot, Cpu, Network, Workflow } from "lucide-react";
import ParticleBackground from "./ParticleBackground";
import FlipWords from "./aceternity/FlipWords";
import SparklesEffect from "./aceternity/Sparkles";
import profilePhoto from "@/assets/portfolio_profile-2.png";

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

const orbitIcons = [Bot, Cpu, Network, Workflow];

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

      <div className="absolute inset-0 ambient-mesh opacity-80" />
      <div className="absolute top-20 left-1/2 h-px w-[70vw] -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-primary/10 blur-[120px] animate-float" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-accent/10 blur-[120px] animate-float" style={{ animationDelay: "1.5s" }} />
      <div className="absolute bottom-16 left-1/3 w-80 h-80 rounded-full bg-emerald/10 blur-[130px] animate-float" style={{ animationDelay: "2.2s" }} />

      <div className="container relative z-10 flex flex-col lg:flex-row items-center gap-10 lg:gap-20 px-4 sm:px-6 py-24 lg:py-20">
        {/* 3D Profile Photo */}
        <motion.div
          ref={photoRef}
          initial={{ opacity: 0, scale: 0.7, rotateY: -30 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 1, type: "spring", stiffness: 80 }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ perspective: "1200px" }}
          className="relative flex-shrink-0 order-1 lg:order-none"
        >
          <div className="absolute -inset-10 rounded-[3rem] bg-gradient-to-br from-primary/10 via-accent/10 to-emerald/10 blur-3xl" />
          <motion.div
            animate={{ rotateX: photoTilt.x, rotateY: photoTilt.y }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="relative w-64 h-80 sm:w-72 sm:h-96 lg:w-[22rem] lg:h-[28rem] animate-levitate-3d"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="absolute -inset-5 rounded-[2.2rem] bg-gradient-to-br from-primary/25 via-accent/25 to-emerald/20 blur-2xl animate-pulse-glow" />
            <div className="absolute -inset-[3px] rounded-[2rem] overflow-hidden">
              <div className="absolute inset-0 bg-[conic-gradient(from_0deg,hsl(var(--primary)),hsl(var(--accent)),hsl(var(--emerald)),hsl(var(--primary)))] animate-border-orbit" />
            </div>
            <div className="absolute inset-0 rounded-[2rem] premium-glass overflow-hidden p-2" style={{ transform: "translateZ(28px)" }}>
              <div className="relative h-full w-full overflow-hidden rounded-[1.55rem] bg-card">
                <img
                  src={profilePhoto}
                  alt="Asad Shabir"
                  className="h-full w-full object-cover object-top"
                  style={{ imageRendering: "auto", transform: "translateZ(34px) scale(1.01)" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/35 via-transparent to-primary/5 pointer-events-none" />
              </div>
            </div>
            <div className="absolute -right-6 top-8 hidden sm:block premium-badge px-3 py-2 text-xs text-emerald border-emerald/30" style={{ transform: "translateZ(70px) rotateY(-16deg)" }}>Digital FTE</div>
            <div className="absolute -left-7 bottom-16 hidden sm:block premium-badge px-3 py-2 text-xs text-primary border-primary/30" style={{ transform: "translateZ(80px) rotateY(18deg)" }}>AI Agents</div>

            {/* Floating orbit particles */}
            {orbitIcons.map((Icon, i) => (
              <motion.div
                key={i}
                className="absolute hidden sm:flex w-10 h-10 rounded-2xl premium-glass items-center justify-center text-primary"
                style={{
                  top: "50%",
                  left: "50%",
                  boxShadow: "0 0 28px hsl(var(--primary) / 0.18)",
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
              >
                <Icon className="w-4 h-4" />
              </motion.div>
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
            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black mb-4 premium-name-lockup"
          >
            <SparklesEffect>
              <span className="inline-block premium-name-text">Asad Shabir</span>
            </SparklesEffect>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, scaleX: 0.7 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.42, duration: 0.7 }}
            className="heartbeat-line-wrap mx-auto lg:mx-0 mb-5"
          >
            <svg className="heartbeat-line" viewBox="0 0 420 44" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <linearGradient id="heartbeatGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="hsl(var(--primary))" />
                  <stop offset="52%" stopColor="hsl(var(--emerald))" />
                  <stop offset="100%" stopColor="hsl(var(--accent))" />
                </linearGradient>
              </defs>
              <path className="heartbeat-base" d="M4 24 H115 L132 24 L143 8 L157 36 L171 15 L184 24 H416" />
              <path className="heartbeat-pulse" d="M4 24 H115 L132 24 L143 8 L157 36 L171 15 L184 24 H416" />
            </svg>
          </motion.div>

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
            className="hero-intro text-base sm:text-lg max-w-xl mb-8 sm:mb-10 mx-auto lg:mx-0"
          >
            Building <span className="intro-neon-word">intelligent</span>, <span className="intro-neon-word">production-ready</span> AI agents, full-stack applications,
            and <span className="intro-neon-word">automation</span> systems that actually work.
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
              className="group flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary via-emerald to-accent text-primary-foreground font-semibold neon-glow-cyan transition-all text-sm sm:text-base shadow-2xl shadow-primary/20"
            >
              <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              Explore My Projects
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={onOpenChat}
              className="group flex items-center justify-center gap-2 px-6 py-3 rounded-xl premium-glass border-primary/30 text-primary font-semibold hover:neon-glow-cyan transition-all text-sm sm:text-base"
            >
              <MessageCircle className="w-4 h-4" />
              Talk to My AI
            </motion.button>
            <motion.a
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              href="/Asad_Shabir_Resume.pdf"
              download="Asad_Shabir_Resume.pdf"
              className="group flex items-center justify-center gap-2 px-6 py-3 rounded-xl premium-glass border-accent/30 text-accent font-semibold hover:neon-glow-magenta transition-all text-sm sm:text-base"
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
