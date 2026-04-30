import { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import Contact from "@/components/Contact";
import ChatBot, { ChatButton } from "@/components/ChatBot";
import ScrollProgress from "@/components/ScrollProgress";
import SectionDivider from "@/components/SectionDivider";
import ScrollToTop from "@/components/ScrollToTop";
import { Mail, Linkedin, Github, Facebook } from "lucide-react";
import type { CSSProperties } from "react";

const footerSocials = [
  {
    icon: Mail,
    href: "https://mail.google.com/mail/?view=cm&fs=1&to=asadshabir505@gmail.com&su=Hello%20Asad",
    label: "Gmail",
    glow: "--brand-gmail",
  },
  { icon: Linkedin, href: "https://www.linkedin.com/in/asad-shabir-programmer110/", label: "LinkedIn", glow: "--brand-linkedin" },
  { icon: Github, href: "https://github.com/asadshabir/", label: "GitHub", glow: "--brand-github" },
  { icon: Facebook, href: "https://www.facebook.com/Asadalibhatti110", label: "Facebook", glow: "--brand-facebook" },
];

const Index = () => {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="min-h-screen overflow-x-hidden relative">
      <div className="fixed inset-0 pointer-events-none ambient-mesh opacity-40" />
      <ScrollProgress />
      <Navbar />
      <Hero onOpenChat={() => setChatOpen(true)} />
      <SectionDivider />
      <About />
      <SectionDivider />
      <Skills />
      <SectionDivider />
      <Projects />
      <SectionDivider />
      <Experience />
      <SectionDivider />
      <Contact />

      {/* Footer */}
      <footer className="relative py-8 border-t border-foreground/10 premium-glass-strong overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-accent/70" />
        <div className="container px-4 sm:px-6 flex flex-col items-center gap-4 relative z-10">
          <div className="flex items-center gap-4">
            {footerSocials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                style={{ "--social-glow": `var(${s.glow})` } as CSSProperties}
                className="social-3d w-10 h-10 rounded-2xl premium-glass flex items-center justify-center text-muted-foreground hover:-translate-y-1 transition-all duration-300 border border-foreground/10"
              >
                <s.icon className="w-4 h-4" />
              </a>
            ))}
          </div>
          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} Asad Shabir. Built with passion & AI.
          </p>
        </div>
      </footer>

      <ChatBot isOpen={chatOpen} onClose={() => setChatOpen(false)} />
      <ScrollToTop />
      {!chatOpen && <ChatButton onClick={() => setChatOpen(true)} />}
    </div>
  );
};

export default Index;
