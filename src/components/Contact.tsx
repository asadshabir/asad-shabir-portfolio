import { useState, type CSSProperties } from "react";
import { motion } from "framer-motion";
import { Mail, Linkedin, Github, Facebook, Download, Send, Heart, Loader2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAnalytics } from "@/hooks/useAnalytics";
import { submitContact } from "@/lib/contactService";
import Card3D from "./Card3D";
import BackgroundBeams from "./aceternity/BackgroundBeams";

const socials = [
  {
    icon: Mail,
    label: "Gmail",
    href: "https://mail.google.com/mail/?view=cm&fs=1&to=asadshabir505@gmail.com&su=Hello%20Asad%20%E2%80%94%20from%20your%20portfolio",
    color: "group-hover:text-brand-gmail",
    glow: "--brand-gmail",
  },
  { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/asad-shabir-programmer110/", color: "group-hover:text-brand-linkedin", glow: "--brand-linkedin" },
  { icon: Github, label: "GitHub", href: "https://github.com/asadshabir/", color: "group-hover:text-brand-github", glow: "--brand-github" },
  { icon: Facebook, label: "Facebook", href: "https://www.facebook.com/Asadalibhatti110", color: "group-hover:text-brand-facebook", glow: "--brand-facebook" },
];

const Contact = () => {
  const { toast } = useToast();
  const { trackContact } = useAnalytics();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;

    setFieldErrors({});
    setSending(true);
    trackContact();

    try {
      const result = await submitContact(form);

      if (result.ok) {
        toast({
          title: "Message sent! 🎉",
          description: "Thanks for reaching out. I'll get back to you within 24 hours.",
        });
        setForm({ name: "", email: "", message: "" });
      } else {
        // Backend returned a business-level error
        if (result.details && result.details.length > 0) {
          // Field-level validation errors
          const errors: Record<string, string> = {};
          result.details.forEach((d) => { errors[d.field] = d.error; });
          setFieldErrors(errors);
          toast({
            title: "Validation error",
            description: "Please check the highlighted fields and try again.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Couldn't send message",
            description: result.message || "Something went wrong on our end. Please try again or email me directly.",
            variant: "destructive",
          });
        }
      }
    } catch (err) {
      toast({
        title: "Network error",
        description: err instanceof Error ? err.message : "Couldn't reach the server. Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
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
            className="contact-panel-shell"
          >
            <Card3D glowColor="cyan" className="contact-layered-panel p-6 sm:p-8 md:p-10 h-full">
              <h3 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8">Find me online</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 sm:mb-10">
                {socials.map((s) => (
                  <motion.a
                    key={s.label}
                    whileHover={{ y: -8, rotateX: 8, rotateY: -8, scale: 1.035 }}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ "--social-glow": `var(${s.glow})` } as CSSProperties}
                    className="social-geo-tile premium-glass p-4 flex flex-col items-center justify-center gap-3 text-muted-foreground transition-all group border border-foreground/10 min-h-[128px]"
                  >
                    <div className="social-geo-icon w-12 h-12 rounded-[1.1rem] bg-gradient-to-br from-foreground/10 via-background/50 to-foreground/5 flex items-center justify-center group-hover:scale-110 transition-all duration-300 border border-foreground/10 shadow-inner">
                      <s.icon className={`w-5 h-5 text-primary ${s.color} transition-colors`} />
                    </div>
                    <span className="font-semibold text-sm sm:text-base text-center">{s.label}</span>
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
            className="contact-panel-shell contact-panel-shell-alt"
          >
            <Card3D glowColor="magenta" className="contact-layered-panel p-6 sm:p-8 md:p-10 h-full">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 h-full flex flex-col">
                <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">Send a message</h3>
                <input
                  type="text"
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => { setForm({ ...form, name: e.target.value }); setFieldErrors((prev) => ({ ...prev, name: "" })); }}
                  required
                  disabled={sending}
                  className={`w-full px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl frost-input premium-focus-field border outline-none transition-all text-sm ${
                    fieldErrors.name ? "border-red-500/50 focus:border-red-500" : "border-foreground/10 focus:border-primary/50"
                  }`}
                />
                {fieldErrors.name && (
                  <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {fieldErrors.name}
                  </p>
                )}
                <input
                  type="email"
                  placeholder="Your email"
                  value={form.email}
                  onChange={(e) => { setForm({ ...form, email: e.target.value }); setFieldErrors((prev) => ({ ...prev, email: "" })); }}
                  required
                  disabled={sending}
                  className={`w-full px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl frost-input premium-focus-field border outline-none transition-all text-sm ${
                    fieldErrors.email ? "border-red-500/50 focus:border-red-500" : "border-foreground/10 focus:border-primary/50"
                  }`}
                />
                {fieldErrors.email && (
                  <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {fieldErrors.email}
                  </p>
                )}
                <textarea
                  placeholder="Your message"
                  rows={4}
                  value={form.message}
                  onChange={(e) => { setForm({ ...form, message: e.target.value }); setFieldErrors((prev) => ({ ...prev, message: "" })); }}
                  required
                  disabled={sending}
                  className={`w-full px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl frost-input premium-focus-field border outline-none transition-all text-sm resize-none flex-1 ${
                    fieldErrors.message ? "border-red-500/50 focus:border-red-500" : "border-foreground/10 focus:border-primary/50"
                  }`}
                />
                {fieldErrors.message && (
                  <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {fieldErrors.message}
                  </p>
                )}
                <motion.button
                  type="submit"
                  disabled={sending}
                  whileHover={{ scale: sending ? 1 : 1.02, y: sending ? 0 : -1 }}
                  whileTap={{ scale: sending ? 1 : 0.96, y: sending ? 0 : 2 }}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-primary via-emerald to-accent text-primary-foreground font-bold text-base sm:text-lg neon-glow-cyan transition-all disabled:opacity-50 shadow-2xl shadow-primary/20"
                >
                  {sending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
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
