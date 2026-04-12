import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Bot, Sparkles } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const suggestions = [
  "What are your top skills?",
  "Tell me about ASA-Mind",
  "What full-stack apps have you built?",
  "How can you help my project?",
];

const ChatBot = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hey! 👋 I'm Asad's AI assistant. Ask me anything about my skills, projects, or how I can help you!" },
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
    await new Promise((r) => setTimeout(r, 1200));

    let response = "That's a great question! ";
    const lowerText = text.toLowerCase();
    if (lowerText.includes("skill")) {
      response = "My top skills include React, Next.js, TypeScript, Python, FastAPI, OpenAI Agents SDK, LangChain, Prompt Engineering, and Supabase. I'm particularly strong in agentic AI systems and full-stack development!";
    } else if (lowerText.includes("asa-mind") || lowerText.includes("asamind")) {
      response = "ASA-Mind is my flagship project — an intelligent AI Chat Assistant powered by OpenAI Agents SDK. It features multi-agent orchestration, real-time streaming responses, and conversational memory.";
    } else if (lowerText.includes("full-stack") || lowerText.includes("app")) {
      response = "I've built several full-stack applications including e-commerce platforms with Stripe integration, real-time dashboards with WebSockets, and various SaaS tools.";
    } else if (lowerText.includes("help") || lowerText.includes("project") || lowerText.includes("hire")) {
      response = "I'd love to help! I can assist with AI integration, full-stack web development, automation pipelines, or prompt engineering. Feel free to reach out!";
    } else {
      response += "I'm an AI Engineer and Full-Stack Developer specializing in agentic AI systems. What specifically would you like to know?";
    }

    setMessages((prev) => [...prev, { role: "assistant", content: response }]);
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
            className="fixed z-50 glass-strong flex flex-col overflow-hidden
              inset-0 rounded-none md:rounded-2xl
              md:bottom-24 md:right-4 lg:right-8 md:top-auto md:left-auto
              md:w-[400px] md:h-[540px] md:max-w-[calc(100vw-2rem)]"
            style={{
              boxShadow: "0 0 40px hsl(var(--primary) / 0.15), 0 20px 60px rgba(0,0,0,0.5)",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border/50 bg-gradient-to-r from-primary/10 to-accent/10">
              <div className="flex items-center gap-2">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }}>
                  <Sparkles className="w-5 h-5 text-primary" />
                </motion.div>
                <span className="font-bold text-lg">Ask Asad AI</span>
              </div>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors p-1">
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
                    className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-muted/50 text-foreground rounded-bl-md"
                    }`}
                  >
                    {msg.content}
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
                      className="text-xs px-3 py-1.5 rounded-full glass text-primary hover:bg-primary/10 transition-colors"
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
              className="flex items-center gap-2 p-4 border-t border-border/50"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 px-4 py-3 rounded-full bg-background/50 border border-border/50 focus:border-primary/50 outline-none text-sm"
              />
              <motion.button
                type="submit"
                disabled={!input.trim()}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-11 h-11 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40 transition-all"
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

// Static AI bot icon with gentle wave animation + "Ready to Talk!" label
export const ChatButton = ({ onClick }: { onClick: () => void }) => (
  <motion.button
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: 1, type: "spring" }}
    onClick={onClick}
    className="fixed bottom-6 right-4 md:right-8 z-50 group flex items-center gap-3"
  >
    {/* "Ready to Talk!" label */}
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.5 }}
      className="hidden sm:block px-4 py-2 rounded-full glass-strong border-primary/30 text-sm font-semibold text-primary neon-text-cyan"
    >
      <motion.span
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        Ready to Talk!
      </motion.span>
    </motion.div>

    <div className="relative w-16 h-16">
      {/* Outer glow ring */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-accent opacity-30 blur-lg animate-pulse-glow" />
      {/* Main orb - STATIC position, no floating */}
      <div
        className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
        style={{ boxShadow: "0 0 30px hsl(var(--primary) / 0.4), inset 0 -4px 12px hsl(var(--accent) / 0.3)" }}
      >
        {/* Bot icon with subtle wave */}
        <motion.div
          animate={{ rotate: [0, 3, -3, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        >
          <Bot className="w-7 h-7 text-primary-foreground" />
        </motion.div>
      </div>

      {/* Sparkle particles around orb */}
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

export default ChatBot;
