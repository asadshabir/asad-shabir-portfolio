import { motion } from "framer-motion";
import { Sparkles, Cpu, Zap } from "lucide-react";

const About = () => {
  return (
    <section id="about" className="py-32 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px]" />

      <div className="container px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <p className="text-sm font-mono tracking-widest uppercase text-primary mb-4">About Me</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            Crafting the <span className="gradient-text">Future</span> with Code & AI
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-12">
            I'm Asad Shabir — an AI Engineer and Full-Stack Developer from Pakistan who lives at the intersection
            of intelligent systems and beautiful, production-ready applications. I specialize in building
            agentic AI systems, conversational chatbots, and end-to-end automation pipelines that don't
            just work in demos — they ship, scale, and deliver real value. From OpenAI Agents SDK to
            Next.js to FastAPI, I bring ideas to life fast.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Cpu, title: "AI & Agents", desc: "Agentic AI systems, RAG pipelines, and intelligent chatbots" },
              { icon: Sparkles, title: "Full-Stack", desc: "React, Next.js, Python, FastAPI — end-to-end solutions" },
              { icon: Zap, title: "Automation", desc: "Workflow automation and systems that run themselves" },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="glass rounded-xl p-6 hover-lift group"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 mx-auto group-hover:neon-glow-cyan transition-all">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
