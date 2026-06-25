import { motion } from "framer-motion";
import { Briefcase, Sparkles } from "lucide-react";
import Card3D from "./Card3D";
import BackgroundBeams from "./aceternity/BackgroundBeams";

const isMobile = typeof window !== "undefined" && window.innerWidth < 768;


const experiences = [
  {
    role: "Agentic AI Engineer & Full-Stack AI Developer",
    company: "Independent Projects & Freelance",
    date: "2024 – Present",
    points: [
      "Designing and building Digital FTEs (AI Employees) that automate business workflows and operate 24/7.",
      "Developing multi-agent systems, advanced RAG architectures, and conversational AI platforms using OpenAI Agents SDK and modern AI frameworks.",
      "Building production-grade full-stack applications with FastAPI, Next.js, React, TypeScript, PostgreSQL, and Supabase.",
      "Architecting scalable cloud-native systems with Docker, Kubernetes, Dapr, Kafka, and automation pipelines.",
      "Transforming business requirements into reliable AI products focused on usability, automation, and measurable impact.",
    ],
  },

  {
    role: "Agentic AI Specialization",
    company: "Governor's Initiative for AI & Computing (GIAIC)",
    date: "2023 – Present",
    points: [
      "Studying Agentic AI, multi-agent orchestration, AI product architecture, and production engineering practices.",
      "Applying Spec-Driven Development, CI/CD workflows, and cloud-native design principles to real-world projects.",
      "Building hands-on experience with modern AI ecosystems, automation tools, and distributed application architectures.",
    ],
  },

  {
    role: "Healthcare Professional",
    company: "Public Healthcare Sector",
    date: "2022 – Present",
    points: [
      "Working in healthcare while continuously advancing AI engineering skills outside working hours.",
      "Developing discipline, communication, and problem-solving abilities through real-world operational environments.",
      "Combining healthcare experience with technology to design AI solutions that solve meaningful problems.",
    ],
  },
];



const Experience = () => (
  <section id="experience" className="py-32 relative overflow-hidden">
    <BackgroundBeams className="opacity-50" />
    {/* Ambient light beams */}
    <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[150px]" />
    <div className="absolute top-1/4 right-0 w-[300px] h-[300px] bg-accent/5 rounded-full blur-[120px]" />
    <div className="absolute bottom-0 left-1/3 w-[350px] h-[350px] bg-primary/3 rounded-full blur-[130px]" />

    <div className="container px-6 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="text-center mb-20"
      >
        <p className="text-sm font-mono tracking-widest uppercase text-primary mb-4 flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4" /> Experience
        </p>
        <h2 className="text-4xl md:text-5xl font-bold">
          My <span className="holographic-text">Journey</span>
        </h2>
        <p className="text-muted-foreground mt-4 max-w-md mx-auto">
          A timeline of growth, impact, and continuous learning.
        </p>
      </motion.div>

      <div className="max-w-3xl mx-auto relative">
        {/* Tracing beam - animated glowing vertical line */}
        <motion.div
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute left-6 md:left-8 top-0 bottom-0 w-px origin-top"
          style={{
            background: "linear-gradient(180deg, hsl(var(--primary) / 0.8), hsl(var(--accent) / 0.5), hsl(var(--primary) / 0.2), transparent)",
            boxShadow: "0 0 12px hsl(var(--primary) / 0.4), 0 0 24px hsl(var(--primary) / 0.15)",
          }}
        />
        {/* Tracing beam dot */}
        <motion.div
          className="absolute left-[21px] md:left-[29px] w-3 h-3 rounded-full bg-primary z-10"
          style={{ boxShadow: "0 0 16px hsl(var(--primary) / 0.8)" }}
          initial={{ top: 0, opacity: 0 }}
          whileInView={{ top: "100%", opacity: [0, 1, 1, 0] }}
          viewport={{ once: true }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />

        {experiences.map((exp, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * (isMobile ? 0.1 : 0.2), duration: 0.6, ease: "easeOut" }}
            className="relative pl-16 md:pl-20 pb-14 last:pb-0"
          >
            {/* Glowing dot */}
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 + 0.3, duration: 0.5, ease: "easeOut" }}
              className="absolute left-4 md:left-6 top-1 w-5 h-5 rounded-full bg-gradient-to-br from-primary to-accent border-2 border-background"
              style={{ boxShadow: "0 0 16px hsl(var(--primary) / 0.7), 0 0 32px hsl(var(--primary) / 0.25)" }}
            />

            <Card3D glowColor={i === 0 ? "cyan" : i === 1 ? "magenta" : "both"} className="p-7 relative">
              {/* Soft light beam behind card */}
              <div
                className="absolute -inset-2 -z-10 rounded-xl opacity-20 blur-xl"
                style={{
                  background: i === 0
                    ? "radial-gradient(ellipse, hsl(var(--primary) / 0.3), transparent 70%)"
                    : i === 1
                    ? "radial-gradient(ellipse, hsl(var(--accent) / 0.3), transparent 70%)"
                    : "radial-gradient(ellipse, hsl(var(--primary) / 0.2), hsl(var(--accent) / 0.1), transparent 70%)",
                }}
              />
              <div className="flex items-center gap-2 text-primary text-sm font-mono mb-3">
                <Briefcase className="w-4 h-4" />
                {exp.date}
              </div>
              <h3 className="text-xl font-bold mb-1.5 metallic-text">{exp.role}</h3>
              <p className="text-muted-foreground font-medium mb-5 text-sm">{exp.company}</p>
              <ul className="space-y-3">
                {exp.points.map((point, j) => (
                  <li key={j} className="text-sm text-muted-foreground flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-gradient-to-br from-primary to-accent mt-1.5 flex-shrink-0" style={{ boxShadow: "0 0 8px hsl(var(--primary) / 0.5)" }} />
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
