import { motion } from "framer-motion";
import { Bot, Brain, Cpu, Layers, Code2, Cloud } from "lucide-react";
import Card3D from "./Card3D";
import InfiniteMovingCards from "./aceternity/InfiniteMovingCards";
import BackgroundBeams from "./aceternity/BackgroundBeams";

const categories = [
  { icon: Bot, label: "AI Chatbots", gradient: "from-primary to-teal-400", glow: "cyan" as const },
  { icon: Brain, label: "Agentic AI", gradient: "from-accent to-violet-500", glow: "magenta" as const },
  { icon: Cpu, label: "AI-Native", gradient: "from-violet-500 to-primary", glow: "both" as const },
  { icon: Layers, label: "SDD", gradient: "from-teal-400 to-primary", glow: "cyan" as const },
  { icon: Code2, label: "Full-Stack Apps", gradient: "from-accent to-fuchsia-400", glow: "magenta" as const },
  { icon: Cloud, label: "DevOps", gradient: "from-primary to-accent", glow: "both" as const },
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
  show: { opacity: 1, scale: 1, rotateX: 0, transition: { type: "spring", stiffness: 200, damping: 20 } },
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
          My <span className="gradient-text">Arsenal</span>
        </h2>
      </motion.div>

      {/* 3D Category Tokens */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-20"
        style={{ perspective: "1000px" }}
      >
        {categories.map((cat, i) => (
          <motion.div key={cat.label} variants={item}>
            <Card3D glowColor={cat.glow} className="p-6 text-center group cursor-default">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}
                style={{ boxShadow: `0 0 20px hsl(var(--primary) / 0.2)` }}
              >
                <cat.icon className="w-8 h-8 text-primary-foreground" />
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
      <InfiniteMovingCards items={marqueeItems} speed="slow" />
    </div>
  </section>
);

export default Skills;
