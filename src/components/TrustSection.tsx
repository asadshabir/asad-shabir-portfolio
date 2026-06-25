import { motion } from "framer-motion";
import { Clock, Code2, Users, Zap, Building2, Globe, Sparkles } from "lucide-react";

const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

const stats = [
  {
    icon: Clock,
    value: "<24h",
    label: "Response Time",
    desc: "I personally respond to project inquiries within 24 hours.",
    color: "primary",
  },
  {
    icon: Code2,
    value: "30+",
    label: "Projects Built",
    desc: "AI systems, full-stack applications, and automation solutions.",
    color: "accent",
  },
  {
    icon: Users,
    value: "3 Languages",
    label: "Communication",
    desc: "English, Urdu, and Sindhi for better collaboration.",
    color: "emerald",
  },
  {
    icon: Zap,
    value: "100%",
    label: "Production Mindset",
    desc: "Built with scalability, maintainability, and real-world deployment in mind.",
    color: "cyan",
  },
];
const projectHighlights = [
  {
    icon: Building2,
    text: "Built AI-powered customer support and Digital FTE systems.",
  },
  {
    icon: Globe,
    text: "Delivered multilingual experiences in English, Urdu, and Sindhi.",
  },
  {
    icon: Sparkles,
    text: "Developed RAG applications, agentic workflows, and automation pipelines.",
  },
  {
    icon: Building2,
    text: "Created production-ready full-stack applications using FastAPI and Next.js.",
  },
];

/**
 * TrustSection — Phase 9 Trust Signals
 *
 * Displays credibility stats: response time, projects, clients, quality.
 * Positioned after Experience, before ProjectEstimator.
 *
 * Design: Clean 4-column grid, minimal animations, strong typography.
 */
const TrustSection = () => {
  return (
    <section
      id="trust"
      className="py-20 sm:py-28 relative overflow-hidden"
      aria-label="Trust signals and credibility stats"
    >
      {/* Subtle background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-primary/5 rounded-full blur-[150px]" />
      </div>

      <div className="container px-4 sm:px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 sm:mb-14"
        >
          <p className="text-sm font-mono tracking-widest uppercase text-primary mb-3">
            Professional Highlights
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
            Built for <span className="holographic-text">Real-World</span> Impact
          </h2>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto text-sm sm:text-base">
            Focused on building intelligent systems that deliver measurable value.
          </p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * (isMobile ? 0.05 : 0.1), duration: 0.4 }}
              className="rounded-2xl border border-border/40 bg-card/40 backdrop-blur-sm p-5 sm:p-6 text-center group hover:border-primary/20 transition-colors"
            >
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-4
                  ${stat.color === "primary" ? "bg-primary/10 text-primary" : ""}
                  ${stat.color === "accent" ? "bg-accent/10 text-accent" : ""}
                  ${stat.color === "emerald" ? "bg-emerald/10 text-emerald" : ""}
                  ${stat.color === "cyan" ? "bg-cyan-500/10 text-cyan-400" : ""}
                `}
              >
                <stat.icon className="w-5 h-5" />
              </div>

              <p className="text-2xl sm:text-3xl font-black mb-1">{stat.value}</p>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                {stat.label}
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {stat.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Project highlights — honest, verifiable outcomes */}
        <div className="max-w-3xl mx-auto mt-10">
          <p className="text-center text-xs font-mono uppercase tracking-widest text-muted-foreground/60 mb-6">
            What I&apos;ve delivered
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {projectHighlights.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="flex items-start gap-3 p-4 rounded-xl bg-card/30 border border-border/40"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <item.icon className="w-4 h-4 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Trust statement */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center text-muted-foreground mt-10 text-sm sm:text-base max-w-xl mx-auto"
        >
          I focus on building reliable AI products with clean architecture, scalable systems, and long-term maintainability.
        </motion.p>
      </div>
    </section>
  );
};

export default TrustSection;