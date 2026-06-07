import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  FileText,
  Search,
  List,
  Lightbulb,
  AlertTriangle,
  RefreshCw,
  Loader2,
  ArrowRight,
  TrendingUp,
  Target,
  MessageCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAnalytics } from "@/hooks/useAnalytics";
import { getReview, type ReviewResponse } from "@/lib/reviewerService";

// ── Helpers ──────────────────────────────────────────────────

const SECTION_ICONS: Record<string, React.ReactNode> = {
  strengths: <CheckCircle2 className="w-4 h-4" />,
  weaknesses: <XCircle className="w-4 h-4" />,
  ats_suggestions: <FileText className="w-4 h-4" />,
  skill_gaps: <Search className="w-4 h-4" />,
  improvement_tips: <Lightbulb className="w-4 h-4" />,
  role_fit: <Target className="w-4 h-4" />,
};

const REVIEW_LABELS = {
  en: {
    heading: "AI Resume Reviewer",
    subheading:
      "Paste your resume below for an instant AI-powered review. Get actionable feedback on strengths, gaps, and ATS optimization.",
    resume_placeholder:
      "Paste your resume or CV text here...\n\nExample:\nJohn Doe\nFull-Stack Developer\n3 years experience with React and Node.js...",
    target_role_placeholder: "Target role (optional, e.g. Senior Frontend Engineer)",
    submit: "Review My Resume",
    loading: "Analyzing your resume...",
    success: "Your resume review is ready:",
    error: "Couldn't generate review",
    reset: "Review another resume",
    summary: "Overall Assessment",
    strengths: "Strengths",
    weaknesses: "Weaknesses",
    ats_suggestions: "ATS Optimizations",
    skill_gaps: "Skill Gaps",
    improvement_tips: "Improvement Tips",
    role_fit: "Roles to Target",
    disclaimer: "This review is AI-generated and indicative. For a thorough evaluation, consult a professional recruiter.",
    char_min: "Please enter at least 50 characters for an accurate review.",
    section_count: "items",
  },
  ur: {
    heading: "AI ریزیومے ریویوور",
    subheading: "اپنا ریزیومے نیچے پیسٹ کریں اور فوری AI فیڈبیک حاصل کریں۔",
    resume_placeholder: "اپنا ریزیومے یہاں پیسٹ کریں...",
    target_role_placeholder: "ٹارگٹ رول (اختیاری)",
    submit: "میرا ریزیومے جائزہ لیں",
    loading: "آپ کا ریزیومے تجزیہ ہو رہا ہے...",
    success: "آپ کا جائزہ تیار ہے:",
    error: "جائزہ تیار نہیں کیا جا سکا",
    reset: "دوسرا ریزیومے جائزہ لیں",
    summary: "مجموعی جائزہ",
    strengths: "صلاحیتیں",
    weaknesses: "کمزوریاں",
    ats_suggestions: "ATS بہتری",
    skill_gaps: "مہارت کی کمی",
    improvement_tips: "بہتری کے نکات",
    role_fit: "ٹارگٹ رولز",
    disclaimer: "هي جائزو AI ذريعي تيار ڪيو ويو آهي.",
    char_min: "براہ کرم کم از کم 50 حروف درج کریں۔",
    section_count: "نکات",
  },
  sd: {
    heading: "AI ريزيومے ريويور",
    subheading: "پنھجو ريزيومے هيٺ ڏج ۽ فیڈبیک حاصل ڪريو.",
    resume_placeholder: "پنھجو ريزيومے هيٺ ڏج...",
    target_role_placeholder: "ٽارگٹ رول (اختیاری)",
    submit: "ميرا ريزيومے جائزو وٺو",
    loading: "پنھجو ريزيومے تجزيو ٿي رهيو آهي...",
    success: "پنھجو جائزو تيار آهي:",
    error: "جائزو تيار نه ٿي سگهي",
    reset: "ٻيو ريزيومے جائزو وٺو",
    summary: "مجموعی جائزو",
    strengths: "صلاحيتون",
    weaknesses: "ڪمزوريون",
    ats_suggestions: "ATS بهرداري",
    skill_gaps: "مهارت جي ڪمي",
    improvement_tips: "بهرداري جا نڪات",
    role_fit: "ٽارگٹ رولز",
    disclaimer: "هي جائزو AI ذريعي تيار ڪيو ويو آهي.",
    char_min: "مهرباني ڪري گهٽ ۾ گهٽ 50 اکر درج ڪريو.",
    section_count: "نڪات",
  },
};

type Stage = "idle" | "loading" | "success" | "error";

interface ResumeReviewerProps {
  language?: "en" | "ur" | "sd";
}

const ResumeReviewer = ({ language = "en" }: ResumeReviewerProps) => {
  const { toast } = useToast();
  const { trackReviewer } = useAnalytics();
  const l = REVIEW_LABELS[language] ?? REVIEW_LABELS.en;

  const [stage, setStage] = useState<Stage>("idle");
  const [resumeText, setResumeText] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [review, setReview] = useState<ReviewResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeText.trim() || stage === "loading") return;

    setStage("loading");
    setErrorMessage("");

    try {
      const result = await getReview(
        resumeText.trim(),
        targetRole.trim() || undefined,
        language
      );
      setReview(result);
      setStage("success");
      trackReviewer();
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
    setResumeText("");
    setTargetRole("");
    setReview(null);
    setStage("idle");
    setErrorMessage("");
    textareaRef.current?.focus();
  };

  return (
    <section
      id="resume-reviewer"
      className="py-16 sm:py-20 relative overflow-hidden"
    >
      {/* Ambient glow */}
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
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">{l.heading}</h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-lg mx-auto">
            {l.subheading}
          </p>
        </motion.div>

        {/* Form or Results */}
        <AnimatePresence mode="wait">
          {stage === "success" && review ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <ReviewCard review={review} lang={l} />

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
              {/* Target role (optional) */}
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder={l.target_role_placeholder}
                maxLength={200}
                disabled={stage === "loading"}
                className="w-full px-5 py-3.5 rounded-xl border border-border/60 bg-card/60 backdrop-blur-sm outline-none focus:border-primary/50 transition-colors text-sm disabled:opacity-50"
              />

              {/* Resume textarea */}
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder={l.resume_placeholder}
                  required
                  minLength={50}
                  maxLength={10000}
                  disabled={stage === "loading"}
                  rows={10}
                  className="w-full px-5 py-4 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm resize-none outline-none focus:border-primary/50 transition-colors text-sm disabled:opacity-50 font-mono leading-relaxed"
                />
                <span className="absolute bottom-3 right-4 text-xs text-muted-foreground">
                  {resumeText.length}/10000
                </span>
              </div>

              {/* Character hint */}
              {resumeText.length > 0 && resumeText.length < 50 && (
                <p className="text-xs text-yellow-500">{l.char_min}</p>
              )}

              {/* Error */}
              {stage === "error" && errorMessage && (
                <p className="text-sm text-destructive">{errorMessage}</p>
              )}

              {/* Submit */}
              <div className="flex items-center justify-end">
                <button
                  type="submit"
                  disabled={
                    !resumeText.trim() ||
                    resumeText.length < 50 ||
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

// ── Review Card ───────────────────────────────────────────────

function ReviewCard({
  review,
  lang,
}: {
  review: ReviewResponse;
  lang: (typeof REVIEW_LABELS)["en"];
}) {
  // Sections to render as lists (skip summary)
  const listSections: Array<{ key: keyof ReviewResponse; label: string }> = [
    { key: "strengths", label: lang.strengths },
    { key: "weaknesses", label: lang.weaknesses },
    { key: "ats_suggestions", label: lang.ats_suggestions },
    { key: "skill_gaps", label: lang.skill_gaps },
    { key: "improvement_tips", label: lang.improvement_tips },
    { key: "role_fit", label: lang.role_fit },
  ];

  return (
    <div className="space-y-5">
      {/* Summary */}
      {review.summary && (
        <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold">{lang.summary}</h3>
          </div>
          <p className="text-sm text-foreground/90 leading-relaxed">
            {review.summary}
          </p>
        </div>
      )}

      {/* List sections in a 2-column grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {listSections.map(({ key, label }) => {
          const items = review[key];
          if (!items || items.length === 0) return null;
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-4"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-primary">
                  {SECTION_ICONS[key]}
                </span>
                <h3 className="text-xs font-semibold text-primary uppercase tracking-wide">
                  {label}
                </h3>
              </div>
              <ul className="space-y-2">
                {items.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-xs text-foreground/80"
                  >
                    <span className="mt-0.5 w-1 h-1 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>

      {/* Disclaimer footer */}
      <p className="text-xs text-muted-foreground/70 text-center">
        {review.disclaimer}
      </p>

      {/* CTA Block */}
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center">
        <p className="text-sm font-semibold mb-2">Want personalized career guidance?</p>
        <p className="text-xs text-muted-foreground mb-4">
          I can help you improve your resume and prepare for your target roles.
        </p>
        <a
          href="#contact"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm premium-glass-button premium-glass-button--primary"
        >
          <MessageCircle className="w-4 h-4" />
          Let&apos;s Talk
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}

export default ResumeReviewer;