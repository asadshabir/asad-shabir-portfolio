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
    tone: "var(--brand-gmail)",
  },
  { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/asad-shabir-programmer110/", tone: "var(--brand-linkedin)" },
  { icon: Github, label: "GitHub", href: "https://github.com/asadshabir/", tone: "var(--brand-github)" },
  { icon: Facebook, label: "Facebook", href: "https://www.facebook.com/Asadalibhatti110", tone: "var(--brand-facebook)" },
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
        if (result.details && result.details.length > 0) {
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
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-accent/5 rounded-[2rem] blur-[150px]" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-[2rem] blur-[120px]" />

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

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
          {/* ───────── LEFT PANEL — Social Links ───────── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="expertise-card-wrap"
            style={{ "--expertise-tone": "var(--expertise-cyan)" } as CSSProperties}
          >
            <Card3D glowColor="cyan" className="expertise-card p-6 sm:p-8">
              <div className="expertise-content w-full">
                <h3 className="text-xl sm:text-2xl font-bold mb-8 text-left">Find me online</h3>

                <div className="grid grid-cols-2 gap-4 w-full">
                  {socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ "--social-tone": s.tone } as CSSProperties}
                      className="group relative flex flex-col items-center justify-center gap-3 p-5 rounded-[2rem] transition-all duration-400 overflow-hidden"
                    >
                      {/* Premium glass background */}
                      <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-foreground/[0.06] to-background/[0.3] border border-foreground/10 transition-all duration-400 group-hover:border-[hsl(var(--social-tone)/0.5)] group-hover:shadow-[0_0_32px_hsl(var(--social-tone)/0.2)]" />
                      {/* Brand radial glow */}
                      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-24 h-24 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none" style={{ background: `radial-gradient(circle, hsl(var(--social-tone) / 0.35), transparent 70%)` }} />

                      {/* Icon — matches About's premium icon styling */}
                      <div
                        className="relative w-14 h-14 rounded-[1.15rem] bg-gradient-to-br from-primary/20 via-accent/10 to-emerald/20 flex items-center justify-center group-hover:scale-110 group-hover:shadow-[0_0_24px_hsl(var(--social-tone)/0.4)] transition-all duration-400 border border-foreground/10"
                      >
                        <s.icon
                          className="w-6 h-6 text-primary group-hover:text-[hsl(var(--social-tone))] transition-all duration-300"
                        />
                      </div>
                      <span className="relative font-semibold text-sm sm:text-base text-center text-muted-foreground group-hover:text-[hsl(var(--social-tone))] transition-colors duration-300">
                        {s.label}
                      </span>
                    </a>
                  ))}
                </div>

                {/* Download Resume — premium glass action */}
                <div className="mt-8 w-full">
                  <a
                    href="/Asad_Shabir_Resume.pdf"
                    download="Asad_Shabir_Resume.pdf"
                    className="relative group/download w-full flex items-center justify-center gap-3 px-8 py-4 rounded-[2rem] bg-gradient-to-r from-primary via-emerald to-accent text-primary-foreground font-bold text-base sm:text-lg neon-glow-cyan transition-all shadow-2xl shadow-primary/20 overflow-hidden"
                  >
                    <div className="absolute inset-0 -translate-x-full group-hover/download:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-[-20deg]" />
                    <Download className="w-5 h-5 relative z-10" />
                    <span className="relative z-10">Download Resume</span>
                  </a>
                </div>
              </div>
            </Card3D>
          </motion.div>

          {/* ───────── RIGHT PANEL — Contact Form ───────── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="expertise-card-wrap"
            style={{ "--expertise-tone": "var(--expertise-violet)" } as CSSProperties}
          >
            <Card3D glowColor="magenta" className="expertise-card p-6 sm:p-8">
              <div className="expertise-content w-full h-full">
                <h3 className="text-xl sm:text-2xl font-bold mb-8 text-left">Send a message</h3>

                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5 flex-1">
                  <div className="relative w-full">
                    <input
                      type="text"
                      placeholder="Your name"
                      value={form.name}
                      onChange={(e) => { setForm({ ...form, name: e.target.value }); setFieldErrors((prev) => ({ ...prev, name: "" })); }}
                      required
                      disabled={sending}
                      className={`w-full px-5 py-3.5 rounded-[2rem] frost-input premium-focus-field border outline-none transition-all text-sm ${
                        fieldErrors.name ? "border-red-500/50 focus:border-red-500" : "border-foreground/10 focus:border-primary/50"
                      }`}
                    />
                    {fieldErrors.name && (
                      <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {fieldErrors.name}
                      </p>
                    )}
                  </div>

                  <div className="relative w-full">
                    <input
                      type="email"
                      placeholder="Your email"
                      value={form.email}
                      onChange={(e) => { setForm({ ...form, email: e.target.value }); setFieldErrors((prev) => ({ ...prev, email: "" })); }}
                      required
                      disabled={sending}
                      className={`w-full px-5 py-3.5 rounded-[2rem] frost-input premium-focus-field border outline-none transition-all text-sm ${
                        fieldErrors.email ? "border-red-500/50 focus:border-red-500" : "border-foreground/10 focus:border-primary/50"
                      }`}
                    />
                    {fieldErrors.email && (
                      <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {fieldErrors.email}
                      </p>
                    )}
                  </div>

                  <div className="relative w-full flex-1">
                    <textarea
                      placeholder="Your message"
                      rows={4}
                      value={form.message}
                      onChange={(e) => { setForm({ ...form, message: e.target.value }); setFieldErrors((prev) => ({ ...prev, message: "" })); }}
                      required
                      disabled={sending}
                      className={`w-full px-5 py-3.5 rounded-[2rem] frost-input premium-focus-field border outline-none transition-all text-sm resize-none h-full min-h-[130px] ${
                        fieldErrors.message ? "border-red-500/50 focus:border-red-500" : "border-foreground/10 focus:border-primary/50"
                      }`}
                    />
                    {fieldErrors.message && (
                      <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {fieldErrors.message}
                      </p>
                    )}
                  </div>

                  <motion.button
                    type="submit"
                    disabled={sending}
                    whileHover={{ scale: sending ? 1 : 1.02, y: sending ? 0 : -1 }}
                    whileTap={{ scale: sending ? 1 : 0.96, y: sending ? 0 : 2 }}
                    className="relative group/submit w-full flex items-center justify-center gap-2 px-6 py-4 rounded-[2rem] bg-gradient-to-r from-primary via-emerald to-accent text-primary-foreground font-bold text-base sm:text-lg neon-glow-cyan transition-all disabled:opacity-50 shadow-2xl shadow-primary/20 overflow-hidden"
                  >
                    <div className="absolute inset-0 -translate-x-full group-hover/submit:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-[-20deg]" />
                    {sending ? (
                      <Loader2 className="w-5 h-5 animate-spin relative z-10" />
                    ) : (
                      <Send className="w-5 h-5 relative z-10" />
                    )}
                    <span className="relative z-10">{sending ? "Sending..." : "Send Message"}</span>
                  </motion.button>
                </form>
              </div>
            </Card3D>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
