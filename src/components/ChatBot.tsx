import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles, ExternalLink } from "lucide-react";
import { answerAboutAsad, type ChatResponse } from "@/lib/asadKnowledge";
import chatbotIcon from "@/assets/chatbot-premium-icon.png";

interface Message {
  role: "user" | "assistant";
  content: string;
  references?: ChatResponse["references"];
}

const suggestions = [
  "What are Asad's top skills?",
  "Tell me about ASA-Mind",
  "Is Asad available for freelance?",
  "How can I contact Asad?",
];

const ChatBot = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hey! 👋 I'm **Ask Asad AI** — I only answer questions about Asad Shabir: his skills, projects (like ASA-Mind), experience at Digitel FTE, PIAIC/GIAIC studies, and how to hire him. What would you like to know?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setIsTyping(true);
    await new Promise((r) => setTimeout(r, 700 + Math.random() * 600));

    const res = answerAboutAsad(text);
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: res.text, references: res.references },
    ]);
    setIsTyping(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Mobile: full-screen overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 md:hidden"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="fixed z-50 premium-glass-strong flex flex-col overflow-hidden
              inset-0 rounded-none md:rounded-2xl
              md:bottom-24 md:right-4 lg:right-8 md:top-auto md:left-auto
              md:w-[400px] md:h-[540px] md:max-w-[calc(100vw-2rem)]"
            style={{
              boxShadow: "0 0 40px hsl(var(--primary) / 0.15), 0 20px 60px rgba(0,0,0,0.5)",
              paddingTop: "env(safe-area-inset-top)",
              paddingBottom: "env(safe-area-inset-bottom)",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 sm:px-5 py-4 border-b border-border/50 bg-gradient-to-r from-primary/10 to-accent/10">
              <div className="flex items-center gap-2">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }}>
                  <Sparkles className="w-5 h-5 text-primary" />
                </motion.div>
                <span className="font-bold text-lg">Ask Asad AI</span>
              </div>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors p-2 -mr-1">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-gradient-to-r from-primary to-emerald text-primary-foreground rounded-br-md shadow-lg shadow-primary/20"
                        : "premium-glass text-foreground rounded-bl-md"
                    }`}
                  >
                    {msg.content.split("\n").map((line, idx) => (
                      <p key={idx} className={idx > 0 ? "mt-1.5" : ""}>
                        {line.split(/(\*\*[^*]+\*\*)/g).map((part, j) =>
                          part.startsWith("**") && part.endsWith("**") ? (
                            <strong key={j} className="font-semibold text-primary">
                              {part.slice(2, -2)}
                            </strong>
                          ) : (
                            <span key={j}>{part}</span>
                          )
                        )}
                      </p>
                    ))}
                    {msg.references && msg.references.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-border/40 space-y-1.5">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono">
                          References
                        </p>
                        {msg.references.map((ref) => (
                          <a
                            key={ref.url}
                            href={ref.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs text-primary hover:text-accent hover:underline transition-colors"
                          >
                            <ExternalLink className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{ref.label}</span>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted/50 px-4 py-3 rounded-2xl rounded-bl-md">
                    <div className="flex gap-1">
                      {[0, 150, 300].map((d) => (
                        <span key={d} className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: `${d}ms` }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {messages.length <= 1 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {suggestions.map((s) => (
                    <motion.button
                      key={s}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => sendMessage(s)}
                      className="text-xs px-3 py-1.5 rounded-full premium-glass text-primary hover:bg-primary/10 transition-colors"
                    >
                      {s}
                    </motion.button>
                  ))}
                </div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
              className="flex items-center gap-2 p-3 sm:p-4 border-t border-border/50"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 px-4 py-3 rounded-full premium-glass border border-foreground/10 focus:border-primary/50 outline-none text-sm"
              />
              <motion.button
                type="submit"
                disabled={!input.trim()}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-emerald text-primary-foreground flex items-center justify-center disabled:opacity-40 transition-all flex-shrink-0 neon-glow-cyan"
              >
                <Send className="w-4 h-4" />
              </motion.button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Static AI bot icon with smart scroll behavior
export const ChatButton = ({ onClick }: { onClick: () => void }) => {
  const [showLabel, setShowLabel] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      // Hide label after scrolling past hero (~100vh)
      setShowLabel(window.scrollY < window.innerHeight * 0.8);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1, type: "spring" }}
      onClick={onClick}
      className="fixed bottom-6 right-4 sm:right-6 md:right-8 z-50 group flex items-center gap-2 sm:gap-3"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {/* "Ready to Talk!" label - hidden on scroll past hero */}
      <AnimatePresence>
        {showLabel && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.3 }}
            className="chat-ready-label px-3 py-1.5 sm:px-4 sm:py-2 rounded-full premium-glass-strong border border-primary/40 text-xs sm:text-sm font-semibold text-primary neon-text-cyan whitespace-nowrap shadow-lg shadow-primary/20"
          >
            <motion.span
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              Ready to Talk!
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative w-14 h-14 sm:w-16 sm:h-16 chat-geo-stage">
        <div className="absolute -inset-3 chatbot-photo-aura" />
        <div className="absolute -inset-1 chatbot-photo-ring animate-spin-slow" />
        <div className="chatbot-photo-shell absolute inset-0 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 overflow-hidden">
          <div className="absolute inset-0 chatbot-photo-glass" />
          <motion.div
            animate={{ rotate: [0, 1.6, -1.6, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="relative z-10 h-[calc(100%-8px)] w-[calc(100%-8px)] overflow-hidden rounded-full"
          >
            <img
              src={chatbotIcon}
              alt="Ask Asad AI chatbot"
              className="h-full w-full rounded-full object-cover object-center"
              draggable={false}
            />
          </motion.div>
        </div>

        {/* Sparkle particles */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-primary"
            style={{
              top: `${20 + i * 25}%`,
              left: i % 2 === 0 ? "-4px" : "calc(100% + 2px)",
              boxShadow: "0 0 6px hsl(var(--primary) / 0.8)",
            }}
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
            transition={{ duration: 2 + i * 0.5, delay: i * 0.7, repeat: Infinity }}
          />
        ))}
      </div>
    </motion.button>
  );
};

export default ChatBot;
