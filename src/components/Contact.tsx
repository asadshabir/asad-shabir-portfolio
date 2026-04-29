import { useState, type CSSProperties } from "react";
import { motion } from "framer-motion";
import { Mail, Linkedin, Github, Facebook, Download, Send, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Card3D from "./Card3D";
import BackgroundBeams from "./aceternity/BackgroundBeams";

const socials = [
  {
    icon: Mail,
    label: "Gmail",
    href: "https://mail.google.com/mail/?view=cm&fs=1&to=asadshabir505@gmail.com&su=Hello%20Asad%20%E2%80%94%20from%20your%20portfolio",
    color: "group-hover:text-red-400",
    glow: "--brand-gmail",
  },
  { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/asad-shabir-programmer110/", color: "group-hover:text-brand-linkedin", glow: "--brand-linkedin" },
  { icon: Github, label: "GitHub", href: "https://github.com/asadshabir/", color: "group-hover:text-brand-github", glow: "--brand-github" },
  { icon: Facebook, label: "Facebook", href: "https://www.facebook.com/Asadalibhatti110", color: "group-hover:text-brand-facebook", glow: "--brand-facebook" },
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
    <section id="contact" className="py-20 sm:py-32 relative overflow-hidden">
      <BackgroundBeams className="opacity-40" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px]" />

      <div className="container px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <p className="text-sm font-mono tracking-widest uppercase text-primary mb-4 flex items-center justify-center gap-2">
            <Heart className="w-4 h-4" /> Get In Touch
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
            Let's <span className="holographic-text">Connect</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-md mx-auto text-sm sm:text-base">
            Have a project in mind or want to collaborate? I'd love to hear from you.
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card3D glowColor="cyan" className="p-6 sm:p-8 md:p-10 h-full">
              <h3 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8">Find me online</h3>
              <div className="space-y-4 sm:space-y-5 mb-8 sm:mb-10">
                {socials.map((s) => (
                  <motion.a
                    key={s.label}
                    whileHover={{ x: 6, scale: 1.02 }}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ "--social-glow": `var(${s.glow})` } as CSSProperties}
                    className="social-3d premium-glass rounded-2xl p-3 flex items-center gap-4 text-muted-foreground transition-all group border border-foreground/10"
                  >
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-foreground/10 via-background/50 to-foreground/5 flex items-center justify-center group-hover:scale-110 transition-all duration-300 border border-foreground/10 shadow-inner">
                      <s.icon className={`w-5 h-5 text-primary ${s.color} transition-colors`} />
                    </div>
                    <span className="font-semibold text-base sm:text-lg">{s.label}</span>
                  </motion.a>
                ))}
              </div>

              <motion.a
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                href="/Asad_Shabir_Resume.pdf"
                download="Asad_Shabir_Resume.pdf"
                className="w-full flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-primary via-emerald to-accent text-primary-foreground font-bold text-base sm:text-lg neon-glow-cyan transition-all"
              >
                <Download className="w-5 h-5" />
                Download Resume
              </motion.a>
            </Card3D>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card3D glowColor="magenta" className="p-6 sm:p-8 md:p-10 h-full">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 h-full flex flex-col">
                <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">Send a message</h3>
                <input
                  type="text"
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl frost-input border border-foreground/10 outline-none transition-all text-sm"
                />
                <input
                  type="email"
                  placeholder="Your email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="w-full px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl frost-input border border-foreground/10 outline-none transition-all text-sm"
                />
                <textarea
                  placeholder="Your message"
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                  className="w-full px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl frost-input border border-foreground/10 outline-none transition-all text-sm resize-none flex-1"
                />
                <motion.button
                  type="submit"
                  disabled={sending}
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.96, y: 2 }}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-primary via-emerald to-accent text-primary-foreground font-bold text-base sm:text-lg neon-glow-cyan transition-all disabled:opacity-50 shadow-2xl shadow-primary/20"
                >
                  <Send className="w-5 h-5" />
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
