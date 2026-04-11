import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, Sparkles } from "lucide-react";
import Card3D from "./Card3D";

const filters = ["All", "Full-Stack Apps", "AI Chatbots & Agents", "Automation Tools"];

const projects = [
  {
    title: "ASA-Mind",
    description: "An intelligent AI Chat Assistant powered by OpenAI Agents SDK with multi-agent orchestration and real-time streaming responses.",
    category: "AI Chatbots & Agents",
    tech: ["OpenAI Agents SDK", "Python", "FastAPI", "React", "Supabase"],
    live: "#",
    github: "#",
    gradient: "from-primary to-accent",
    featured: true,
  },
  {
    title: "AI-Powered Robotics Book",
    description: "An interactive, AI-generated educational book exploring the intersection of robotics and artificial intelligence.",
    category: "AI Chatbots & Agents",
    tech: ["Next.js", "OpenAI", "TypeScript", "Tailwind"],
    live: "#",
    github: "#",
    gradient: "from-accent to-primary",
    featured: false,
  },
  {
    title: "Full-Stack E-Commerce Platform",
    description: "A complete e-commerce solution with payments, auth, and admin dashboard built for speed and scale.",
    category: "Full-Stack Apps",
    tech: ["Next.js", "Supabase", "Stripe", "TypeScript"],
    live: "#",
    github: "#",
    gradient: "from-primary to-primary",
    featured: false,
  },
  {
    title: "Workflow Automation Engine",
    description: "An intelligent automation system that connects APIs, processes data, and triggers actions based on custom rules.",
    category: "Automation Tools",
    tech: ["Python", "FastAPI", "Celery", "Redis"],
    live: "#",
    github: "#",
    gradient: "from-accent to-accent",
    featured: false,
  },
  {
    title: "AI Resume Analyzer",
    description: "Smart resume parsing and analysis tool using NLP to extract skills, experience, and provide improvement suggestions.",
    category: "AI Chatbots & Agents",
    tech: ["Python", "LangChain", "React", "FastAPI"],
    live: "#",
    github: "#",
    gradient: "from-primary to-accent",
    featured: false,
  },
  {
    title: "Real-Time Dashboard",
    description: "A live analytics dashboard with WebSocket connections, interactive charts, and role-based access control.",
    category: "Full-Stack Apps",
    tech: ["React", "Node.js", "PostgreSQL", "WebSockets"],
    live: "#",
    github: "#",
    gradient: "from-accent to-primary",
    featured: false,
  },
];

const Projects = () => {
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? projects : projects.filter((p) => p.category === active);

  return (
    <section id="projects" className="py-32 relative">
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[150px]" />

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
            Featured <span className="gradient-text">Projects</span>
          </h2>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {filters.map((f) => (
            <motion.button
              key={f}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActive(f)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                active === f
                  ? "bg-primary text-primary-foreground neon-glow-cyan"
                  : "glass text-muted-foreground hover:text-foreground"
              }`}
            >
              {f}
            </motion.button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
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
                  glowColor={project.gradient.includes("accent") ? "magenta" : "cyan"}
                  className="overflow-hidden group h-full"
                >
                  {/* Gradient top bar */}
                  <div className={`h-1.5 bg-gradient-to-r ${project.gradient}`} />

                  {/* Featured badge */}
                  {project.featured && (
                    <div className="absolute top-4 right-4 z-20">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/20 text-primary text-xs font-mono border border-primary/30"
                      >
                        <Sparkles className="w-3 h-3" />
                        Featured
                      </motion.div>
                    </div>
                  )}

                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors duration-300">
                      {project.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                      {project.description}
                    </p>

                    {/* Tech stack with 3D hover */}
                    <div className="flex flex-wrap gap-2 mb-6">
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

                    {/* Links */}
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
