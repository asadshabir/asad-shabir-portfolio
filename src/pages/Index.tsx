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
import { Mail, Linkedin, Github, Facebook } from "lucide-react";

const footerSocials = [
  { icon: Mail, href: "mailto:asadshabir505@gmail.com", label: "Gmail" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/asad-shabir-programmer110/", label: "LinkedIn" },
  { icon: Github, href: "https://github.com/asadshabir/", label: "GitHub" },
  { icon: Facebook, href: "https://www.facebook.com/Asadalibhatti110", label: "Facebook" },
];

const Index = () => {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="min-h-screen overflow-x-hidden">
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
      <footer className="py-8 border-t border-border/30">
        <div className="container px-4 sm:px-6 flex flex-col items-center gap-4">
          <div className="flex items-center gap-4">
            {footerSocials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target={s.href.startsWith("mailto") ? undefined : "_blank"}
                rel="noopener noreferrer"
                aria-label={s.label}
                className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-muted-foreground hover:text-primary hover:neon-glow-cyan transition-all duration-300"
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
      {!chatOpen && <ChatButton onClick={() => setChatOpen(true)} />}
    </div>
  );
};

export default Index;
