import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, Sparkles, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import Card3D from "./Card3D";
import BackgroundBeams from "./aceternity/BackgroundBeams";
import PremiumBadge from "./PremiumBadge";

const filters = [
  { label: "All", color: "from-primary to-accent" },
  { label: "AI & Agents", color: "from-violet-500 to-primary" },
  { label: "Full-Stack Apps", color: "from-accent to-primary" },
  { label: "Automation Tools", color: "from-primary to-teal-400" },
];

const projects = [
  {
    title: "MediBridge",
    description: "AI-powered healthcare management platform connecting patients, doctors, and pharmacies with AI-driven diagnostics, appointment scheduling, and prescription management.",
    category: "AI & Agents",
    tech: ["Python", "FastAPI", "React", "PostgreSQL", "OpenAI", "AWS"],
    live: "https://medibridge.vercel.app",
    github: "https://github.com/asadshabir/medibridge",
    gradient: "from-emerald-600/30 via-primary/15 to-teal-900/30",
    border: "border-emerald-400/40",
    image: "/medibridge.png",
    featured: false,
    caseStudy: "/case-studies/medibridge-healthcare-platform",
  },

  {
    title: "AI-Powered Robotics Book",
    description: "Interactive AI-generated educational book exploring robotics × artificial intelligence with rich visuals and chapter-level Q&A.",
    category: "AI & Agents",
    tech: ["Next.js", "OpenAI", "TypeScript", "Tailwind", "Three.js"],
    live: "https://robotics-ai-book.vercel.app",
    github: "https://github.com/asadshabir/robotics-ai-book",
    gradient: "from-purple-600/30 via-primary/15 to-indigo-900/30",
    border: "border-purple-400/40",
    image: "/robotic-book.png",
    featured: false,
    caseStudy: "/case-studies/ai-robotics-book-platform",
  },
    {
    title: "Todo App",
    description: "Full-stack task management application with real-time sync, drag-and-drop kanban board, team collaboration, and push notifications.",
    category: "Full-Stack Apps",
    tech: ["React", "Node.js", "PostgreSQL", "WebSockets"],
    live: "https://todo-asad.vercel.app",
    github: "https://github.com/asadshabir/todo-app",
    gradient: "from-amber-600/30 via-primary/15 to-orange-900/30",
    border: "border-amber-400/40",
    image: "/todo-app.png",
    featured: false,
  },
  {
    title: "AI Resume Analyzer",
    description: "Smart resume parser using NLP to extract skills, score experience, and suggest targeted improvements.",
    category: "AI & Agents",
    tech: ["Python", "LangChain", "React", "FastAPI"],
    live: "https://resume-ai-asad.vercel.app",
    github: "https://github.com/asadshabir/ai-resume-analyzer",
    gradient: "from-violet-600/30 via-indigo-500/15 to-primary/30",
    border: "border-violet-400/40",
    image: "/resume-analyzer.png",
    featured: false,
  },
  {
    title: "Real-Time Dashboard",
    description: "Live analytics dashboard with WebSocket connections, interactive charts, and role-based access control.",
    category: "Full-Stack Apps",
    tech: ["React", "Node.js", "PostgreSQL", "WebSockets"],
    live: "https://realtime-dash.vercel.app",
    github: "https://github.com/asadshabir/realtime-dashboard",
    gradient: "from-fuchsia-600/30 via-accent/15 to-primary/30",
    border: "border-accent/40",
    image: "/realtime-dashboard.png",
    featured: true,
  },
    {
    title: "ASA-Mind",
    description: "Intelligent AI chat assistant powered by OpenAI Agents SDK with multi-agent orchestration, streaming responses, and conversational memory.",
    category: "AI & Agents",
    tech: ["OpenAI Agents SDK", "Python", "FastAPI", "React", "Supabase"],
    live: "https://asa-mind.vercel.app",
    github: "https://github.com/asadshabir/asa-mind",
    gradient: "from-violet-600/30 via-primary/15 to-violet-900/30",
    border: "border-violet-400/40",
    image: "/asa-mind.png",
    featured: true,
  },

];

const Projects = () => {
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? projects : projects.filter((p) => p.category === active);

  return (
    <section id="projects" className="py-20 sm:py-32 relative">
      <BackgroundBeams className="opacity-30" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[150px]" />
      <div className="absolute top-1/3 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[150px]" />

      <div className="container px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-12"
        >
          <p className="text-sm font-mono tracking-widest uppercase text-primary mb-4">Portfolio</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
            Built <span className="holographic-text">Projects</span>
          </h2>
        </motion.div>

        {/* Filter tabs */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10 sm:mb-14">
          {filters.map((f) => (
            <motion.button
              key={f.label}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActive(f.label)}
              className={`relative px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all overflow-hidden ${
                active === f.label
                  ? "text-primary-foreground neon-glow-cyan"
                  : "premium-glass text-muted-foreground hover:text-foreground"
              }`}
            >
              {active === f.label && (
                <motion.div
                  layoutId="activeFilter"
                  className={`absolute inset-0 bg-gradient-to-r ${f.color} rounded-full`}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10">{f.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Card Grid */}
        <div className="premium-project-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8 max-w-6xl mx-auto">
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <motion.div
                key={project.title}
                layout
                initial={{ opacity: 0, scale: 0.85, rotateX: -10 }}
                animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.4, type: "spring" }}
              >
                <Card3D
                  glowColor={project.category === "AI & Agents" ? "magenta" : project.category === "Automation Tools" ? "cyan" : "both"}
                  className={`project-card-1500 overflow-hidden group h-full ${project.border} min-h-[430px]`}
                >
                  {/* Project image */}
                  <div className={`relative h-40 sm:h-48 overflow-hidden bg-gradient-to-br ${project.gradient}`}>
                    <img
                      src={project.image}
                      alt={`${project.title} technology preview`}
                      loading="lazy"
                      className="w-full h-full object-cover opacity-75 group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} mix-blend-screen`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-background/32 to-background/8" />
                    <div className="absolute inset-x-6 bottom-5 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />

                    {project.featured && (
                      <div className="absolute top-3 right-3 z-20">
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                          className="premium-badge flex items-center gap-1 px-2.5 py-1 text-primary text-xs border-primary/30"
                        >
                          <Sparkles className="w-3 h-3" />
                          Featured
                        </motion.div>
                      </div>
                    )}

                    <div className="absolute top-3 left-3 z-20">
                      <motion.div
                        animate={{ boxShadow: ["0 0 8px hsl(var(--primary) / 0.3)", "0 0 16px hsl(var(--primary) / 0.6)", "0 0 8px hsl(var(--primary) / 0.3)"] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="premium-badge flex items-center gap-1 px-2 py-0.5 text-primary text-[10px] border-primary/20"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        Live
                      </motion.div>
                    </div>
                  </div>

                  <div className="p-5 sm:p-6">
                    <h3 className="text-base sm:text-lg font-bold mb-2 group-hover:text-primary transition-colors duration-300">
                      {project.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed line-clamp-2">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-5">
                      {project.tech.map((t, i) => (
                        <PremiumBadge key={t} tone={i % 3 === 0 ? "cyan" : i % 3 === 1 ? "magenta" : "emerald"} className="px-2 sm:px-2.5 py-0.5 sm:py-1">
                          {t}
                        </PremiumBadge>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-action-link flex items-center gap-1.5 text-sm text-primary font-medium"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Live Demo
                      </a>
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-action-link flex items-center gap-1.5 text-sm text-muted-foreground"
                      >
                        <Github className="w-3.5 h-3.5" /> GitHub
                      </a>
                      {"caseStudy" in project && project.caseStudy && (
                        <Link
                          to={project.caseStudy}
                          className="project-action-link flex items-center gap-1.5 text-sm text-accent font-medium"
                        >
                          <FileText className="w-3.5 h-3.5" /> Case Study
                        </Link>
                      )}
                    </div>
                  </div>
                </Card3D>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default Projects;
