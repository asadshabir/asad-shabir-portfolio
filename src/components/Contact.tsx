import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Linkedin, Github, Twitter, Download, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Card3D from "./Card3D";

const socials = [
  { icon: Mail, label: "Gmail", href: "mailto:asad@example.com" },
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/in/asadshabir" },
  { icon: Github, label: "GitHub", href: "https://github.com/asadshabir" },
  { icon: Twitter, label: "X / Twitter", href: "https://x.com/asadshabir" },
];

const Contact = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    await new Promise((r) => setTimeout(r, 1000));
    toast({ title: "Message sent!", description: "Thanks for reaching out. I'll get back to you soon!" });
    setForm({ name: "", email: "", message: "" });
    setSending(false);
  };

  return (
    <section id="contact" className="py-32 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[150px]" />

      <div className="container px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-mono tracking-widest uppercase text-primary mb-4">Get In Touch</p>
          <h2 className="text-4xl md:text-5xl font-bold">
            Let's <span className="gradient-text">Connect</span>
          </h2>
        </motion.div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card3D glowColor="cyan" className="p-8 h-full">
              <h3 className="text-xl font-bold mb-6">Find me online</h3>
              <div className="space-y-4 mb-8">
                {socials.map((s) => (
                  <motion.a
                    key={s.label}
                    whileHover={{ x: 4 }}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:neon-glow-cyan transition-all duration-300">
                      <s.icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-medium">{s.label}</span>
                  </motion.a>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold neon-glow-cyan transition-all"
              >
                <Download className="w-4 h-4" />
                Download Resume
              </motion.button>
            </Card3D>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card3D glowColor="magenta" className="p-8 h-full">
              <form onSubmit={handleSubmit} className="space-y-4 h-full flex flex-col">
                <h3 className="text-xl font-bold mb-2">Send a message</h3>
                <input
                  type="text"
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-background/50 border border-border/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/30 outline-none transition-all text-sm"
                />
                <input
                  type="email"
                  placeholder="Your email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-background/50 border border-border/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/30 outline-none transition-all text-sm"
                />
                <textarea
                  placeholder="Your message"
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-background/50 border border-border/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/30 outline-none transition-all text-sm resize-none flex-1"
                />
                <motion.button
                  type="submit"
                  disabled={sending}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold neon-glow-cyan transition-all disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {sending ? "Sending..." : "Send Message"}
                </motion.button>
              </form>
            </Card3D>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
