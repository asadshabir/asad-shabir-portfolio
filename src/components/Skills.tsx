import { motion } from "framer-motion";

const skills = [
  "React", "Next.js", "TypeScript", "Python", "FastAPI", "OpenAI Agents SDK",
  "Prompt Engineering", "LangChain", "Supabase", "Tailwind CSS", "AI Chatbots",
  "Automation", "Node.js", "PostgreSQL", "Docker", "Git", "REST APIs",
  "GraphQL", "Framer Motion", "Vercel", "Web3", "RAG Systems",
];

const marqueeIcons = [
  "React", "Next.js", "TypeScript", "Python", "FastAPI", "OpenAI",
  "LangChain", "Supabase", "Tailwind", "Docker", "Node.js", "PostgreSQL",
  "Vercel", "Git", "GraphQL", "Framer Motion",
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};

const item = {
  hidden: { opacity: 0, scale: 0.7, rotateX: -30 },
  show: { opacity: 1, scale: 1, rotateX: 0, transition: { type: "spring" as const, stiffness: 200, damping: 20 } },
};

const Skills = () => (
  <section id="skills" className="py-32 relative overflow-hidden">
    <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[150px]" />

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

      {/* 3D Skill tokens */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-5xl mx-auto mb-20"
        style={{ perspective: "800px" }}
      >
        {skills.map((skill) => (
          <motion.div
            key={skill}
            variants={item}
            whileHover={{
              scale: 1.12,
              rotateY: 8,
              rotateX: -5,
              transition: { type: "spring", stiffness: 300 },
            }}
            className="glass rounded-xl px-4 py-4 text-center text-sm font-medium cursor-default hover:neon-glow-cyan hover:border-primary/50 transition-all relative overflow-hidden group"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Hover gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="relative z-10">{skill}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* Infinite 3D Marquee */}
      <div className="relative overflow-hidden py-4">
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10" />
        <div className="flex animate-marquee whitespace-nowrap" style={{ perspective: "600px" }}>
          {[...marqueeIcons, ...marqueeIcons].map((icon, i) => (
            <span
              key={i}
              className="mx-6 text-muted-foreground/30 text-lg font-mono font-semibold inline-block"
              style={{
                transform: `rotateY(${Math.sin(i * 0.3) * 8}deg)`,
              }}
            >
              {icon}
            </span>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default Skills;
