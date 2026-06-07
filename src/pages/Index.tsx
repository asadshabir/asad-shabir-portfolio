import { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import Certifications from "@/components/Certifications";
import CaseStudiesSection from "@/components/CaseStudiesSection";
import Contact from "@/components/Contact";
import TrustSection from "@/components/TrustSection";
import ProjectEstimator from "@/components/ProjectEstimator";
import ResumeReviewer from "@/components/ResumeReviewer";
import EmailCapture from "@/components/EmailCapture";
import Sidebar from "@/components/Sidebar";
import SeoMeta from "@/components/seo/SeoMeta";
import ChatBot, { ChatButton } from "@/components/ChatBot";
import ScrollProgress from "@/components/ScrollProgress";
import SectionDivider from "@/components/SectionDivider";
import ScrollToTop from "@/components/ScrollToTop";
import { Bot, Cpu, Facebook, Github, Linkedin, Mail, Sparkles } from "lucide-react";
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
    <div className="premium-page min-h-screen overflow-x-hidden relative">
      {/* Global SEO */}
      <SeoMeta
        title="Asad Shabir — AI Full-Stack Developer"
        description="AI Full-Stack Developer building intelligent agents, full-stack apps, and automation systems. Available for freelance and contract work."
      />

      <div className="fixed inset-0 pointer-events-none ambient-mesh opacity-50" />

      {/* Persistent Elements */}
      <ScrollProgress />
      <Navbar />
      <Sidebar />

      {/* Main Sections */}
      <Hero onOpenChat={() => setChatOpen(true)} />

      <SectionDivider />
      <About />

      <SectionDivider />
      <Skills />

      <SectionDivider />
      <Projects />

      <SectionDivider />
      <CaseStudiesSection />

      <SectionDivider />
      <Certifications />

      <SectionDivider />
      <Experience />

      <SectionDivider />
      <TrustSection />

      <SectionDivider />
      <ProjectEstimator />

      <SectionDivider />
      <ResumeReviewer />

      <SectionDivider />
      <EmailCapture />

      <SectionDivider />
      <Contact />

      {/* Premium Footer */}
      <footer className="obsidian-footer relative overflow-hidden pb-28 pt-12 sm:pb-14 sm:pt-16">
        <div className="obsidian-footer-border" />
        <div className="container relative z-10 px-4 sm:px-6">
          <div className="footer-glass-panel mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
            <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-end">
              <div className="space-y-5">
                <div className="powered-ai-badge">
                  <Sparkles className="h-4 w-4" />
                  Powered by AI
                </div>
                <div>
                  <p className="mb-2 text-xs font-mono uppercase tracking-[0.38em] text-primary/80">Premium AI Portfolio</p>
                  <h2 className="text-3xl font-black sm:text-5xl holographic-text">Asad Shabir</h2>
                </div>
                <p className="max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
                  High-end AI agents, full-stack products, automation systems, and production-grade digital experiences.
                </p>
              </div>

              <div className="flex flex-col gap-5 md:items-end">
                <div className="flex items-center gap-3">
                  <span className="footer-tech-chip"><Bot className="h-4 w-4" /> AI Native</span>
                  <span className="footer-tech-chip"><Cpu className="h-4 w-4" /> Full Stack</span>
                </div>
                <div className="flex items-center gap-3">
                  {footerSocials.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      style={{ "--social-glow": `var(${social.glow})` } as CSSProperties}
                      className="footer-orb-link"
                    >
                      <social.icon className="h-4 w-4" />
                    </a>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground sm:text-sm">
                  © {new Date().getFullYear()} Asad Shabir. Built with passion & AI.
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Chatbot */}
      <ChatBot isOpen={chatOpen} onClose={() => setChatOpen(false)} />
      {!chatOpen && <ScrollToTop />}
      {!chatOpen && <ChatButton onClick={() => setChatOpen(true)} />}
    </div>
  );
};

export default Index;
