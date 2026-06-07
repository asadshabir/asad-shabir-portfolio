import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lightbulb,
  Clock,
  Layers,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Loader2,
  Cpu,
  Server,
  Cloud,
  Zap,
  MessageCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAnalytics } from "@/hooks/useAnalytics";
import { getEstimate, type EstimateResponse } from "@/lib/estimatorService";

// ── Helpers ──────────────────────────────────────────────────

const COMPLEXITY_COLORS: Record<string, string> = {
  Low: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  High: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  "Very High": "bg-red-500/10 text-red-400 border-red-500/20",
};

const SEVERITY_COLORS: Record<string, string> = {
  Low: "bg-emerald-500/10 text-emerald-400",
  Medium: "bg-yellow-500/10 text-yellow-400",
  High: "bg-red-500/10 text-red-400",
};

const PRIORITY_COLORS: Record<string, string> = {
  Immediate: "text-primary font-semibold",
  "Short-term": "text-foreground/80",
  "Nice-to-have": "text-muted-foreground",
};

const STACK_ICONS: Record<string, React.ReactNode> = {
  frontend: <Layers className="w-4 h-4" />,
  backend: <Server className="w-4 h-4" />,
  ai_ml: <Cpu className="w-4 h-4" />,
  infrastructure: <Cloud className="w-4 h-4" />,
};

const ESTIMATE_LABELS = {
  en: {
    heading: "AI Project Estimator",
    subheading: "Get a rough sense of your project's complexity, timeline, and recommended tech stack.",
    placeholder: "Describe your project here... e.g. A web app where users can upload images, and an AI model classifies them into categories, with a dashboard for the admin.",
    submit: "Get Estimate",
    loading: "Analyzing your project...",
    success: "Here's what I'm seeing:",
    error: "Couldn't generate estimate",
    reset: "Try another project",
    complexity: "Complexity",
    timeline: "Timeline",
    stack: "Recommended Stack",
    risks: "Key Risks",
    next_steps: "Next Steps",
    disclaimer: "⚠️ Estimates are indicative and subject to detailed scoping.",
    weeks_label: "weeks",
  },
  ur: {
    heading: "AI پروجیکٹ ایسٹیمیٹر",
    subheading: "اپنے پروجیکٹ کی پیچیدگی، ٹائم لائن، اور تجویز کردہ ٹیک اسٹیک کا اندازہ لگائیں۔",
    placeholder: "اپنا پروجیکٹ بیان کریں...",
    submit: "ایسٹیمیٹ حاصل کریں",
    loading: "آپ کا پروجیکٹ تجزیہ ہو رہا ہے...",
    success: "میں یہ دیکھ رہا ہوں:",
    error: "ایسٹیمیٹ تیار نہیں کیا جا سکا",
    reset: "دوسرا پروجیکٹ آزمائیں",
    complexity: "پیچیدگی",
    timeline: "ٹائم لائن",
    stack: "تجویز کردہ ٹیک اسٹیک",
    risks: "اہم رسک",
    next_steps: "اگلا قدم",
    disclaimer: "⚠️ ایسٹیمیٹس اشاری ہیں اور تفصیلی اسکوپنگ کے تابع ہیں۔",
    weeks_label: "ہفتے",
  },
  sd: {
    heading: "AI پروجيڪٽ ايسٽيميٽر",
    subheading: "پنھجي پروجيڪٽ جي پيچيدگي، ٽائيم لائن، ۽ سفارش ڪيل ٽيڪ اسٽیڪ جو اندازو لڳائيو.",
    placeholder: "پنھجو پروجيڪٽ بيان ڪريو...",
    submit: "ايسٽيميٽ حاصل ڪريو",
    loading: "توهان جو پروجيڪٽ تجزيو ٿي رهيو آهي...",
    success: "آئی هيٺ ڏسي رهيو آهيان:",
    error: "ايسٽيميٽ تيار نه ٿي سگهي",
    reset: "ٻيو پروجيڪٽ آزمائيؤ",
    complexity: "پيچيدگي",
    timeline: "ٽائيم لائن",
    stack: "سفارش ڪيل ٽيڪ اسٽیڪ",
    risks: "اهم رسڪ",
    next_steps: "اڳيون قدم",
    disclaimer: "⚠️ ايسٽيميٽس اشاريا آهن ۽ تفصيلي اسڪوپنگ تحت آهن.",
    weeks_label: "هفتا",
  },
};

type Stage = "idle" | "loading" | "success" | "error";

interface ProjectEstimatorProps {
  language?: "en" | "ur" | "sd";
}

const ProjectEstimator = ({ language = "en" }: ProjectEstimatorProps) => {
  const { toast } = useToast();
  const { trackEstimator } = useAnalytics();
  const l = ESTIMATE_LABELS[language] ?? ESTIMATE_LABELS.en;

  const [stage, setStage] = useState<Stage>("idle");
  const [description, setDescription] = useState("");
  const [estimate, setEstimate] = useState<EstimateResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || stage === "loading") return;

    setStage("loading");
    setErrorMessage("");

    try {
      const result = await getEstimate(description.trim(), language);
      setEstimate(result);
      setStage("success");
      trackEstimator(result.complexity?.level);
    } catch (err) {
      const msg = err instanceof Error ? err.message : l.error;
      setErrorMessage(msg);
      setStage("error");
      toast({
        title: l.error,
        description: msg,
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    setDescription("");
    setEstimate(null);
    setStage("idle");
    setErrorMessage("");
    textareaRef.current?.focus();
  };

  return (
    <section
      id="project-estimator"
      className="py-16 sm:py-20 relative overflow-hidden"
    >
      {/* Subtle ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/5 rounded-full blur-[140px]" />
      </div>

      <div className="container px-4 sm:px-6 relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
            <Zap className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">{l.heading}</h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-lg mx-auto">
            {l.subheading}
          </p>
        </motion.div>

        {/* Form or Results */}
        <AnimatePresence mode="wait">
          {stage === "success" && estimate ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <EstimateCard estimate={estimate} lang={l} />

              <div className="flex justify-center">
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  {l.reset}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {/* Textarea */}
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={l.placeholder}
                  required
                  minLength={20}
                  maxLength={2000}
                  disabled={stage === "loading"}
                  rows={5}
                  className="w-full px-5 py-4 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm resize-none outline-none focus:border-primary/50 transition-colors text-sm disabled:opacity-50"
                />
                <span className="absolute bottom-3 right-4 text-xs text-muted-foreground">
                  {description.length}/2000
                </span>
              </div>

              {/* Character count hint */}
              {description.length > 0 && description.length < 20 && (
                <p className="text-xs text-yellow-500">
                  Please describe at least 20 characters for an accurate estimate.
                </p>
              )}

              {/* Error message */}
              {stage === "error" && errorMessage && (
                <p className="text-sm text-destructive">{errorMessage}</p>
              )}

              {/* Submit */}
              <div className="flex items-center justify-end">
                <button
                  type="submit"
                  disabled={
                    !description.trim() ||
                    description.length < 20 ||
                    stage === "loading"
                  }
                  className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm premium-glass-button premium-glass-button--primary disabled:opacity-50 transition-all"
                >
                  {stage === "loading" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {l.loading}
                    </>
                  ) : (
                    <>
                      {l.submit}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Disclaimer */}
        <p className="text-xs text-muted-foreground text-center mt-8">
          {l.disclaimer}
        </p>
      </div>
    </section>
  );
};

// ── Estimate Card ────────────────────────────────────────────

function EstimateCard({
  estimate,
  lang,
}: {
  estimate: EstimateResponse;
  lang: (typeof ESTIMATE_LABELS)["en"];
}) {
  const complexityColor = COMPLEXITY_COLORS[estimate.complexity?.level] ?? COMPLEXITY_COLORS.Medium;

  return (
    <div className="space-y-5">
      {/* Success banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <p className="text-sm text-muted-foreground">{lang.success}</p>
      </motion.div>

      {/* Complexity */}
      <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold">{lang.complexity}</h3>
        </div>
        <div className="flex flex-a items-center gap-3">
          <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${complexityColor}`}>
            {estimate.complexity?.level ?? "Medium"}
          </span>
          {estimate.complexity?.reasons?.map((reason, i) => (
            <span key={i} className="text-xs text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-full">
              {reason}
            </span>
          ))}
        </div>
        {estimate.complexity?.red_flags && estimate.complexity.red_flags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {estimate.complexity.red_flags.map((flag, i) => (
              <span key={i} className="text-xs text-red-400/80 bg-red-500/5 px-2.5 py-1 rounded-full border border-red-500/10 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                {flag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold">{lang.timeline}</h3>
        </div>
        <p className="text-2xl font-bold text-primary">
          {estimate.timeline?.estimate_min_weeks ?? "?"}–{estimate.timeline?.estimate_max_weeks ?? "?"} {lang.weeks_label}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {estimate.timeline?.assumptions?.map((a, i) => (
            <span key={i} className="text-xs text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-full">
              {a}
            </span>
          ))}
        </div>
      </div>

      {/* Stack */}
      <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <Layers className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold">{lang.stack}</h3>
        </div>
        <div className="space-y-4">
          {(["frontend", "backend", "ai_ml", "infrastructure"] as const).map((key) => {
            const items = estimate.stack?.[key] ?? [];
            if (!items.length) return null;
            return (
              <div key={key} className="flex flex-wrap gap-2 items-center">
                <span className="text-xs text-muted-foreground w-20 flex items-center gap-1.5">
                  {STACK_ICONS[key]}
                  <span className="capitalize">{key.replace("_", " ")}</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {items.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs px-2.5 py-1 rounded-lg bg-primary/5 text-primary border border-primary/10"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Risks */}
      {estimate.risks && estimate.risks.length > 0 && (
        <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold">{lang.risks}</h3>
          </div>
          <div className="space-y-3">
            {estimate.risks.map((risk, i) => (
              <div key={i} className="flex items-start gap-3 text-sm">
                <span className={`px-2 py-0.5 rounded text-xs font-medium mt-0.5 flex-shrink-0 ${SEVERITY_COLORS[risk.severity] ?? SEVERITY_COLORS.Low}`}>
                  {risk.severity}
                </span>
                <div>
                  <span className="font-medium text-foreground">{risk.risk}</span>
                  <span className="text-muted-foreground text-xs"> — {risk.mitigation}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Next Steps */}
      {estimate.next_steps && estimate.next_steps.length > 0 && (
        <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <ArrowRight className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold">{lang.next_steps}</h3>
          </div>
          <div className="space-y-2">
            {estimate.next_steps.map((ns, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <span className={`text-xs flex-shrink-0 ${PRIORITY_COLORS[ns.priority] ?? ""}`}>
                  {ns.priority}
                </span>
                <span className="text-foreground">{ns.step}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <p className="text-xs text-muted-foreground/70 text-center">
        {estimate.disclaimer}
      </p>

      {/* CTA Block */}
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center">
        <p className="text-sm font-semibold mb-2">Want a detailed estimate?</p>
        <p className="text-xs text-muted-foreground mb-4">
          Let&apos;s discuss your project and create a proper roadmap together.
        </p>
        <a
          href="#contact"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm premium-glass-button premium-glass-button--primary"
        >
          <MessageCircle className="w-4 h-4" />
          Start Your Project
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}

export default ProjectEstimator;