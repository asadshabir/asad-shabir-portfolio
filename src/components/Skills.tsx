import { motion } from "framer-motion";
import { Bot, Brain, Cpu, Workflow, Code2, Cloud } from "lucide-react";
import Card3D from "./Card3D";
import InfiniteMovingCards from "./aceternity/InfiniteMovingCards";
import BackgroundBeams from "./aceternity/BackgroundBeams";

const categories = [
  { icon: Bot, label: "AI Chatbots", gradient: "from-primary to-emerald", glow: "cyan" as const, token: "--primary" },
  { icon: Brain, label: "Agentic AI", gradient: "from-accent to-primary", glow: "magenta" as const, token: "--accent" },
  { icon: Cpu, label: "Python AI", gradient: "from-brand-python to-primary", glow: "both" as const, token: "--brand-python" },
  { icon: Workflow, label: "n8n Flows", gradient: "from-brand-n8n to-emerald", glow: "emerald" as const, token: "--brand-n8n" },
  { icon: Code2, label: "React Apps", gradient: "from-brand-react to-accent", glow: "cyan" as const, token: "--brand-react" },
  { icon: Cloud, label: "DevOps", gradient: "from-brand-devops to-accent", glow: "both" as const, token: "--brand-devops" },
];

const marqueeItems = [
  "React", "Next.js", "TypeScript", "Python", "FastAPI", "OpenAI",
  "LangChain", "Supabase", "Tailwind", "Docker", "Node.js", "PostgreSQL",
  "Vercel", "Git", "GraphQL", "Framer Motion",
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, scale: 0.7, rotateX: -30 },
  show: { opacity: 1, scale: 1, rotateX: 0, transition: { type: "spring" as const, stiffness: 200, damping: 20 } },
};

const Skills = () => (
  <section id="skills" className="py-32 relative overflow-hidden">
    <BackgroundBeams />
    <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[150px]" />
    <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[150px]" />

    <div className="container px-6 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <p className="text-sm font-mono tracking-widest uppercase text-primary mb-4">Skills & Tech</p>
        <h2 className="text-4xl md:text-5xl font-bold">
          My <span className="holographic-text">Arsenal</span>
        </h2>
      </motion.div>

      {/* 3D Category Tokens */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-2 md:grid-cols-3 gap-5 sm:gap-7 max-w-4xl mx-auto mb-20"
        style={{ perspective: "1000px" }}
      >
        {categories.map((cat, i) => (
          <motion.div key={cat.label} variants={item} className="[transform-style:preserve-3d]">
            <Card3D glowColor={cat.glow} className="p-4 sm:p-6 text-center group cursor-default min-h-[178px] rounded-[1.7rem]">
              <div
                className="skill-isometric relative w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 flex items-center justify-center transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-3"
                style={{ "--skill-glow": `var(${cat.token})` } as React.CSSProperties}
              >
                <div className={`absolute inset-[10px] bg-gradient-to-br ${cat.gradient} opacity-35 blur-md`} />
                <div className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center border border-foreground/20 shadow-2xl skill-icon-3d`}
                  style={{ boxShadow: `inset 0 2px 10px hsl(var(--foreground) / 0.22), inset 0 -10px 16px hsl(var(--background) / 0.36), 0 16px 34px hsl(var(${cat.token}) / 0.28)` }}
                >
                  <cat.icon className="w-7 h-7 sm:w-8 sm:h-8 text-primary-foreground" strokeWidth={2.35} />
                </div>
              </div>
              <h3 className="font-bold text-lg">{cat.label}</h3>
              {/* Animated gradient underline */}
              <motion.div
                className={`h-0.5 mx-auto mt-3 rounded-full bg-gradient-to-r ${cat.gradient}`}
                initial={{ width: 0 }}
                whileInView={{ width: "60%" }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
              />
            </Card3D>
          </motion.div>
        ))}
      </motion.div>

      {/* Infinite 3D Marquee */}
      <div className="premium-glass rounded-2xl p-4 sm:p-6 max-w-5xl mx-auto">
        <InfiniteMovingCards items={marqueeItems} speed="slow" />
      </div>
    </div>
  </section>
);

export default Skills;
