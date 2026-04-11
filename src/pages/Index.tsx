import { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import ChatBot, { ChatButton } from "@/components/ChatBot";
import ScrollProgress from "@/components/ScrollProgress";

const Index = () => {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <ScrollProgress />
      <Navbar />
      <Hero onOpenChat={() => setChatOpen(true)} />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <Contact />

      {/* Footer */}
      <footer className="py-8 border-t border-border/30">
        <div className="container px-6 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Asad Shabir. Built with passion & AI.
          </p>
        </div>
      </footer>

      {/* ChatBot */}
      <ChatBot isOpen={chatOpen} onClose={() => setChatOpen(false)} />
      {!chatOpen && <ChatButton onClick={() => setChatOpen(true)} />}
    </div>
  );
};

export default Index;
