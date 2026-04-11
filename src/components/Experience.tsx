import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";
import Card3D from "./Card3D";

const experiences = [
  {
    role: "AI Engineer & Full-Stack Developer",
    company: "Freelance / GIAIC Projects",
    date: "2024 – Present",
    points: [
      "Building agentic AI systems with OpenAI Agents SDK",
      "Developing production-grade chatbots and RAG pipelines",
      "Full-stack applications with Next.js, FastAPI & Supabase",
    ],
  },
  {
    role: "Software Engineer",
    company: "Techlogix",
    date: "2023 – 2024",
    points: [
      "Built enterprise-grade web applications using React & Node.js",
      "Integrated AI/ML models into production workflows",
      "Led development of automation tools for internal processes",
    ],
  },
  {
    role: "Associate Software Engineer",
    company: "Arbisoft",
    date: "2022 – 2023",
    points: [
      "Developed scalable full-stack features for edtech platforms",
      "Collaborated on Python/Django backend services",
      "Implemented UI components with React and TypeScript",
    ],
  },
];

const Experience = () => (
  <section id="experience" className="py-32 relative">
    <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[150px]" />

    <div className="container px-6 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <p className="text-sm font-mono tracking-widest uppercase text-primary mb-4">Experience</p>
        <h2 className="text-4xl md:text-5xl font-bold">
          My <span className="gradient-text">Journey</span>
        </h2>
      </motion.div>

      <div className="max-w-3xl mx-auto relative">
        {/* Animated glowing vertical line */}
        <motion.div
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute left-6 md:left-8 top-0 bottom-0 w-px origin-top"
          style={{
            background: "linear-gradient(180deg, hsl(var(--primary) / 0.6), hsl(var(--accent) / 0.4), transparent)",
            boxShadow: "0 0 8px hsl(var(--primary) / 0.3)",
          }}
        />

        {experiences.map((exp, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.2, duration: 0.6, type: "spring" }}
            className="relative pl-16 md:pl-20 pb-12 last:pb-0"
          >
            {/* Glowing dot */}
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 + 0.3, type: "spring" }}
              className="absolute left-4 md:left-6 top-1 w-4 h-4 rounded-full bg-primary border-2 border-background"
              style={{ boxShadow: "0 0 12px hsl(var(--primary) / 0.6), 0 0 24px hsl(var(--primary) / 0.2)" }}
            />

            <Card3D glowColor={i === 0 ? "cyan" : i === 1 ? "magenta" : "both"} className="p-6">
              <div className="flex items-center gap-2 text-primary text-sm font-mono mb-2">
                <Briefcase className="w-4 h-4" />
                {exp.date}
              </div>
              <h3 className="text-xl font-bold mb-1">{exp.role}</h3>
              <p className="text-muted-foreground font-medium mb-4">{exp.company}</p>
              <ul className="space-y-2">
                {exp.points.map((point, j) => (
                  <li key={j} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" style={{ boxShadow: "0 0 6px hsl(var(--primary) / 0.5)" }} />
                    {point}
                  </li>
                ))}
              </ul>
            </Card3D>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Experience;
