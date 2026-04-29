import { motion } from "framer-motion";
import { Sparkles, Cpu, Zap } from "lucide-react";
import Card3D from "./Card3D";
import BackgroundBeams from "./aceternity/BackgroundBeams";
import PremiumBadge from "./PremiumBadge";

const items = [
  { icon: Cpu, title: "AI & Agents", desc: "Agentic AI systems, RAG pipelines, and intelligent chatbots", glow: "cyan" as const },
  { icon: Sparkles, title: "Full-Stack", desc: "React, Next.js, Python, FastAPI — end-to-end solutions", glow: "magenta" as const },
  { icon: Zap, title: "Automation", desc: "Workflow automation and systems that run themselves", glow: "both" as const },
];

const About = () => (
  <section id="about" className="py-32 relative">
    <BackgroundBeams className="opacity-30" />
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px]" />

    <div className="container px-4 sm:px-6 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto text-center premium-glass-strong rounded-[2rem] px-5 py-10 sm:px-10 sm:py-14 relative overflow-hidden"
      >
        <div className="absolute -top-24 -right-20 w-72 h-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-20 w-72 h-72 rounded-full bg-emerald/10 blur-3xl" />
        <p className="text-sm font-mono tracking-widest uppercase text-primary mb-4">About Me</p>
        <h2 className="text-4xl md:text-5xl font-bold mb-8">
          Crafting the <span className="holographic-text">Future</span> with Code & AI
        </h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          I'm <span className="text-foreground font-semibold">Asad Shabir</span> — an
          <span className="text-primary"> AI Engineer</span>,
          <span className="text-accent"> Agentic AI Developer</span>, and Full-Stack Engineer from Pakistan.
          I build intelligent, production-ready systems with the
          <span className="text-foreground font-semibold"> OpenAI Agents SDK</span>,
          <span className="text-foreground font-semibold"> Groq</span>, LangChain, FastAPI, Next.js, and Supabase.
        </p>
        <p className="text-base text-muted-foreground leading-relaxed mb-12">
          Currently leveling up at <span className="text-primary font-semibold">PIAIC / GIAIC</span> in
          Agentic AI &amp; Spec-Driven Development, and applying enterprise-grade engineering practices learned
          at <span className="text-accent font-semibold">Digitel FTE</span> — including telecom-grade
          DevOps, QA automation, and scalable backend architecture. From multi-agent orchestration to
          buttery-smooth UIs, I ship work that doesn't just demo well — it scales, ships, and earns trust.
        </p>

        <div className="mb-10 flex flex-wrap items-center justify-center gap-2.5">
          {["Elite AI Authority", "Complex Agents", "Automated Workflows", "Production Systems"].map((label, i) => (
            <PremiumBadge key={label} tone={i % 3 === 0 ? "cyan" : i % 3 === 1 ? "magenta" : "emerald"}>{label}</PremiumBadge>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
            >
              <Card3D glowColor={item.glow} className="p-6 text-center group cursor-default min-h-[180px]">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 via-accent/10 to-emerald/20 flex items-center justify-center mb-4 mx-auto group-hover:neon-glow-cyan transition-all duration-500 border border-foreground/10">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </Card3D>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

export default About;
