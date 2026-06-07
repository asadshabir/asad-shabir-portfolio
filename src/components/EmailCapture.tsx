import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, CheckCircle2, Loader2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAnalytics } from "@/hooks/useAnalytics";

const STORAGE_KEY = "email_capture_shown";

type State = "idle" | "loading" | "success" | "error";

interface SubscribeResponse {
  ok: boolean;
  message: string;
}

async function subscribe(email: string): Promise<SubscribeResponse> {
  const res = await fetch("/api/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      source_page: window.location.pathname || "/",
    }),
  });
  const data = await res.json() as SubscribeResponse;
  return data;
}

const EmailCapture = () => {
  const { toast } = useToast();
  const { trackEmailCapture } = useAnalytics();
  const [state, setState] = useState<State>("idle");
  const [email, setEmail] = useState("");
  const [visible, setVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Show only once per browser session (localStorage suppression)
  useEffect(() => {
    try {
      const shown = localStorage.getItem(STORAGE_KEY);
      if (!shown) setVisible(true);
    } catch {
      // localStorage unavailable — always show
      setVisible(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || state === "loading") return;

    setState("loading");
    try {
      const result = await subscribe(email.trim());
      if (result.ok) {
        setState("success");
        trackEmailCapture();
        try {
          localStorage.setItem(STORAGE_KEY, "1");
        } catch {}
        // Auto-dismiss after 5 seconds
        setTimeout(() => setVisible(false), 5000);
      }
    } catch {
      setState("error");
      toast({
        title: "Couldn't subscribe",
        description: "Something went wrong. Please try again in a moment.",
        variant: "destructive",
      });
      setTimeout(() => setState("idle"), 3000);
    }
  };

  const handleDismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {}
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.section
        id="email-capture"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 16 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="py-16 sm:py-20 relative overflow-hidden"
      >
        {/* Subtle background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-primary/5 rounded-full blur-[120px]" />
        </div>

        <div className="container px-4 sm:px-6 relative z-10 max-w-xl mx-auto text-center">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5"
          >
            <Mail className="w-6 h-6 text-primary" />
          </motion.div>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-2xl sm:text-3xl font-bold mb-3"
          >
            Stay in the loop
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-sm sm:text-base mb-8 max-w-md mx-auto"
          >
            I share insights on AI agents, full-stack development, and project lessons.
            No spam — just thoughtful updates when something is worth sharing.
          </motion.p>

          {/* Form / States */}
          <AnimatePresence mode="wait">
            {state === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
              >
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">
                  You're in! I'll send updates when I have something worth sharing.
                </span>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="relative"
              >
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    ref={inputRef}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    disabled={state === "loading"}
                    className="flex-1 px-5 py-3.5 rounded-xl border border-border/60 bg-card/60 backdrop-blur-sm outline-none focus:border-primary/50 transition-colors text-sm disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={!email.trim() || state === "loading"}
                    className="px-6 py-3.5 rounded-xl font-semibold text-sm premium-glass-button premium-glass-button--primary disabled:opacity-50 flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    {state === "loading" ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Joining...
                      </>
                    ) : (
                      "Subscribe"
                    )}
                  </button>
                </div>

                {/* Error hint */}
                {state === "error" && (
                  <p className="text-xs text-destructive mt-2">
                    Couldn't subscribe — please try again.
                  </p>
                )}
              </motion.form>
            )}
          </AnimatePresence>

          {/* Dismiss */}
          <button
            onClick={handleDismiss}
            className="absolute top-2 right-2 text-muted-foreground/50 hover:text-muted-foreground transition-colors p-2 rounded-full hover:bg-muted/30"
            aria-label="Dismiss email capture"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.section>
    </AnimatePresence>
  );
};

export default EmailCapture;
