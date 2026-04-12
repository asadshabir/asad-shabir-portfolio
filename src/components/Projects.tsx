import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, Sparkles } from "lucide-react";
import Card3D from "./Card3D";
import BackgroundBeams from "./aceternity/BackgroundBeams";

const filters = [
  { label: "All", color: "from-primary to-accent" },
  { label: "AI & Agents", color: "from-violet-500 to-primary" },
  { label: "Full-Stack Apps", color: "from-accent to-primary" },
  { label: "Automation Tools", color: "from-primary to-teal-400" },
];

const projects = [
  {
    title: "ASA-Mind",
    description: "An intelligent AI Chat Assistant powered by OpenAI Agents SDK with multi-agent orchestration and real-time streaming responses.",
    category: "AI & Agents",
    tech: ["OpenAI Agents SDK", "Python", "FastAPI", "React", "Supabase"],
    live: "#",
    github: "#",
    gradient: "from-violet-600/20 via-primary/10 to-violet-900/20",
    border: "border-violet-500/30",
    image: "/placeholder.svg",
    featured: true,
  },
  {
    title: "AI-Powered Robotics Book",
    description: "An interactive, AI-generated educational book exploring the intersection of robotics and artificial intelligence.",
    category: "AI & Agents",
    tech: ["Next.js", "OpenAI", "TypeScript", "Tailwind"],
    live: "#",
    github: "#",
    gradient: "from-purple-600/20 via-primary/10 to-indigo-900/20",
    border: "border-purple-500/30",
    image: "/placeholder.svg",
    featured: false,
  },
  {
    title: "Full-Stack E-Commerce Platform",
    description: "A complete e-commerce solution with payments, auth, and admin dashboard built for speed and scale.",
    category: "Full-Stack Apps",
    tech: ["Next.js", "Supabase", "Stripe", "TypeScript"],
    live: "#",
    github: "#",
    gradient: "from-accent/20 via-primary/10 to-fuchsia-900/20",
    border: "border-accent/30",
    image: "/placeholder.svg",
    featured: false,
  },
  {
    title: "Workflow Automation Engine",
    description: "An intelligent automation system that connects APIs, processes data, and triggers actions based on custom rules.",
    category: "Automation Tools",
    tech: ["Python", "FastAPI", "Celery", "Redis"],
    live: "#",
    github: "#",
    gradient: "from-teal-600/20 via-primary/10 to-cyan-900/20",
    border: "border-teal-500/30",
    image: "/placeholder.svg",
    featured: false,
  },
  {
    title: "AI Resume Analyzer",
    description: "Smart resume parsing and analysis tool using NLP to extract skills, experience, and provide improvement suggestions.",
    category: "AI & Agents",
    tech: ["Python", "LangChain", "React", "FastAPI"],
    live: "#",
    github: "#",
    gradient: "from-violet-600/20 via-indigo-500/10 to-primary/20",
    border: "border-violet-500/30",
    image: "/placeholder.svg",
    featured: false,
  },
  {
    title: "Real-Time Dashboard",
    description: "A live analytics dashboard with WebSocket connections, interactive charts, and role-based access control.",
    category: "Full-Stack Apps",
    tech: ["React", "Node.js", "PostgreSQL", "WebSockets"],
    live: "#",
    github: "#",
    gradient: "from-fuchsia-600/20 via-accent/10 to-primary/20",
    border: "border-accent/30",
    image: "/placeholder.svg",
    featured: false,
  },
];

const Projects = () => {
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? projects : projects.filter((p) => p.category === active);

  return (
    <section id="projects" className="py-32 relative">
      <BackgroundBeams className="opacity-30" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[150px]" />
      <div className="absolute top-1/3 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[150px]" />

      <div className="container px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-sm font-mono tracking-widest uppercase text-primary mb-4">Portfolio</p>
          <h2 className="text-4xl md:text-5xl font-bold">
            Built <span className="gradient-text">Projects</span>
          </h2>
        </motion.div>

        {/* Filters with MovingBorder style */}
        <div className="flex flex-wrap justify-center gap-3 mb-14">
          {filters.map((f) => (
            <motion.button
              key={f.label}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActive(f.label)}
              className={`relative px-5 py-2.5 rounded-full text-sm font-medium transition-all overflow-hidden ${
                active === f.label
                  ? "text-primary-foreground neon-glow-cyan"
                  : "glass text-muted-foreground hover:text-foreground"
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
              {active === f.label && (
                <motion.div
                  className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-foreground/80 rounded-full"
                  layoutId="filterUnderline"
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* 3D Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
                  className={`overflow-hidden group h-full ${project.border}`}
                >
                  {/* Project image */}
                  <div className={`relative h-48 overflow-hidden bg-gradient-to-br ${project.gradient}`}>
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card/90 to-transparent" />

                    {project.featured && (
                      <div className="absolute top-3 right-3 z-20">
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/20 text-primary text-xs font-mono border border-primary/30 backdrop-blur-md"
                        >
                          <Sparkles className="w-3 h-3" />
                          Featured
                        </motion.div>
                      </div>
                    )}

                    {/* Live Demo badge */}
                    <div className="absolute top-3 left-3 z-20">
                      <motion.div
                        animate={{ boxShadow: ["0 0 8px hsl(var(--primary) / 0.3)", "0 0 16px hsl(var(--primary) / 0.6)", "0 0 8px hsl(var(--primary) / 0.3)"] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-mono border border-primary/20 backdrop-blur-md"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        Live
                      </motion.div>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors duration-300">
                      {project.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed line-clamp-2">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-5">
                      {project.tech.map((t) => (
                        <motion.span
                          key={t}
                          whileHover={{ scale: 1.1, y: -2 }}
                          className="text-xs px-2.5 py-1 rounded-md bg-primary/10 text-primary font-mono border border-primary/10"
                        >
                          {t}
                        </motion.span>
                      ))}
                    </div>

                    <div className="flex gap-4">
                      <motion.a
                        whileHover={{ x: 2 }}
                        href={project.live}
                        className="flex items-center gap-1.5 text-sm text-primary hover:underline font-medium"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Live Demo
                      </motion.a>
                      <motion.a
                        whileHover={{ x: 2 }}
                        href={project.github}
                        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
                      >
                        <Github className="w-3.5 h-3.5" /> GitHub
                      </motion.a>
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
