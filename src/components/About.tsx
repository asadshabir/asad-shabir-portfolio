import { motion } from "framer-motion";
import { Cpu, Workflow, Globe, Shield } from "lucide-react";
import type { CSSProperties } from "react";
import Card3D from "./Card3D";
import BackgroundBeams from "./aceternity/BackgroundBeams";
import PremiumBadge from "./PremiumBadge";

const items = [
  {
    icon: Cpu,
    title: "Agentic AI & Digital FTEs",
    desc: "Designing intelligent AI employees, multi-agent systems, advanced RAG architectures, MCP servers, and production-grade conversational platforms that automate complex workflows.",
    glow: "cyan" as const,
    tone: "cyan",
  },
  {
    icon: Globe,
    title: "Full-Stack & Cloud Engineering",
    desc: "Building scalable AI-powered products using FastAPI, Next.js, TypeScript, PostgreSQL, Docker, Kubernetes, Dapr, and cloud-native architectures.",
    glow: "magenta" as const,
    tone: "violet",
  },
  {
    icon: Workflow,
    title: "Automation & System Orchestration",
    desc: "Creating enterprise automation pipelines with n8n, event-driven systems, CI/CD workflows, and AI-native development practices for reliable deployments.",
    glow: "emerald" as const,
    tone: "emerald",
  },
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

        <p className="text-sm font-mono tracking-widest uppercase text-primary mb-4">
          <Shield className="w-3.5 h-3.5 inline-block mr-1.5 -mt-0.5" />
          About Me
        </p>

        <h2 className="text-4xl md:text-5xl font-bold mb-8">
          <span className="holographic-text">Agentic AI Engineer</span> &{" "}
          <span className="holographic-text">Full-Stack AI Developer</span>
        </h2>

        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          I'm{" "}
          <span className="text-foreground font-semibold">
            Asad Shabir
          </span>{" "}
          — an{" "}
          <span className="text-primary font-semibold">
            Agentic AI Engineer
          </span>{" "}
          specializing in{" "}
          <span className="text-foreground font-semibold">
            Digital FTEs (AI Employees)
          </span>
          , multi-agent architectures, and intelligent systems that automate
          business operations and create measurable impact.
        </p>

        <p className="text-base text-muted-foreground leading-relaxed mb-6">
          I build AI-powered products that go beyond traditional chatbots.
          My focus is designing autonomous systems capable of handling real
          workflows, reducing manual effort, and enabling organizations to
          scale efficiently through AI and automation.
        </p>

        <p className="text-base text-muted-foreground leading-relaxed mb-6">
          Currently studying{" "}
          <span className="text-primary font-semibold">
            Agentic AI at GIAIC
          </span>
          , I combine AI engineering with modern software architecture to
          deliver production-ready solutions using multi-agent systems,
          advanced RAG pipelines, enterprise automation, and cloud-native
          deployments.
        </p>

        <p className="text-base text-muted-foreground leading-relaxed mb-12">
          My technology stack includes{" "}
          <span className="text-primary font-semibold">
            OpenAI Agents SDK
          </span>
          , LangGraph, FastAPI, Next.js, React, TypeScript, PostgreSQL,
          Docker, Kubernetes, Dapr, Kafka, n8n, and modern AI development
          frameworks. I focus on building systems that are scalable,
          maintainable, and ready for real-world deployment.
        </p>

        <div className="mb-10 flex flex-wrap items-center justify-center gap-2.5">
          {[
            "Agentic AI Engineer",
            "Digital FTE Architect",
            "Multi-Agent Systems",
            "Advanced RAG Developer",
            "Enterprise Automation",
            "Cloud-Native Engineer",
          ].map((label, i) => (
            <PremiumBadge
              key={label}
              tone={
                i % 3 === 0
                  ? "cyan"
                  : i % 3 === 1
                  ? "magenta"
                  : "emerald"
              }
            >
              {label}
            </PremiumBadge>
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
              className="expertise-card-wrap"
              style={
                {
                  "--expertise-tone": `var(--expertise-${item.tone})`,
                } as CSSProperties
              }
            >
              <Card3D
                glowColor={item.glow}
                className="expertise-card p-6 text-center group cursor-default min-h-[240px]"
              >
                <div className="expertise-content">
                  <div className="w-14 h-14 rounded-[1.15rem] bg-gradient-to-br from-primary/20 via-accent/10 to-emerald/20 flex items-center justify-center mb-4 mx-auto group-hover:neon-glow-cyan transition-all duration-500 border border-foreground/10">
                    <item.icon className="w-7 h-7 text-primary" />
                  </div>

                  <h3 className="font-semibold text-lg mb-2">
                    {item.title}
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    {item.desc}
                  </p>
                </div>
              </Card3D>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

export default About;