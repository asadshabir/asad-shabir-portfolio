import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Tag,
  CheckCircle2,
  Cpu,
  Lightbulb,
  Target,
  ImageOff,
  MessageCircle,
} from "lucide-react";
import SeoMeta from "@/components/seo/SeoMeta";
import { loadCaseStudy, type CaseStudy } from "@/lib/caseStudiesLoader";
import SectionDivider from "@/components/SectionDivider";
import Contact from "@/components/Contact";
import ScrollToTop from "@/components/ScrollToTop";
import { useAnalytics } from "@/hooks/useAnalytics";

const CaseStudyPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [cs, setCs] = useState<CaseStudy | null>(null);
  const [notFound, setNotFound] = useState(false);
  const { trackCTA } = useAnalytics();

  useEffect(() => {
    if (!slug) return;
    // Scroll to top on page load / slug change
    window.scrollTo({ top: 0, behavior: "smooth" });
    loadCaseStudy(slug)
      .then((result) => {
        if (result) {
          setCs(result);
          // Track case study view
          trackCTA(`Case Study: ${result.title}`, window.location.pathname);
        } else {
          setNotFound(true);
        }
      })
      .catch(() => setNotFound(true));
  }, [slug, trackCTA]);

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Case study not found</h1>
          <Link to="/#case-studies" className="text-primary hover:underline">
            ← Back to Case Studies
          </Link>
        </div>
      </div>
    );
  }

  if (!cs) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: cs.title,
    description: cs.excerpt,
    image: cs.screenshots[0],
    datePublished: cs.published_date,
    author: {
      "@type": "Person",
      name: "Asad Shabir",
      url: "https://asadshabir.com",
    },
    publisher: {
      "@type": "Person",
      name: "Asad Shabir",
    },
  };

  return (
    <>
      <SeoMeta
        title={cs.title}
        description={cs.excerpt}
        ogImage={cs.screenshots[0] || "/og-image.jpg"}
        type="article"
        jsonLd={jsonLd}
      />

      <div className="min-h-screen relative">
        {/* Ambient background */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[150px]" />
          <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[150px]" />
        </div>

        {/* Hero */}
        <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-20 overflow-hidden">
          <div className="container px-4 sm:px-6 relative z-10">
            {/* Back link */}
            <Link
              to="/#case-studies"
              onClick={() => window.scrollTo(0, 0)}
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              All Case Studies
            </Link>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {cs.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 max-w-4xl leading-tight"
            >
              {cs.title}
            </motion.h1>

            {/* Excerpt */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg sm:text-xl text-muted-foreground max-w-3xl mb-8"
            >
              {cs.excerpt}
            </motion.p>

            {/* Meta */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground"
            >
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-primary" />
                {new Date(cs.published_date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-primary" />
                {cs.stack.slice(0, 4).join(", ")}
              </span>
            </motion.div>
          </div>
        </section>

        {/* Screenshots */}
        {cs.screenshots.length > 0 && (
          <section className="relative py-8">
            <div className="container px-4 sm:px-6 relative z-10">
              <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden border border-border/50 shadow-2xl">
                <img
                  src={cs.screenshots[0]}
                  alt={`${cs.title} screenshot`}
                  className="w-full object-cover max-h-[500px]"
                />
              </div>
            </div>
          </section>
        )}

        <SectionDivider />

        {/* Content */}
        <section className="relative py-12 sm:py-20">
          <div className="container px-4 sm:px-6 relative z-10">
            <div className="max-w-3xl mx-auto">
              {/* Challenge */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mb-12"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                    <Target className="w-5 h-5 text-red-400" />
                  </div>
                  <h2 className="text-2xl font-bold">The Problem</h2>
                </div>
                <div className="p-6 rounded-2xl bg-card/50 border border-border/50">
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {cs.challenge}
                  </p>
                </div>
              </motion.div>

              {/* Approach */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mb-12"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Lightbulb className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">My Strategy</h2>
                </div>
                <div className="p-6 rounded-2xl bg-card/50 border border-border/50">
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {cs.approach}
                  </p>
                </div>
              </motion.div>

              {/* Stack */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mb-12"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Cpu className="w-5 h-5 text-accent" />
                  </div>
                  <h2 className="text-2xl font-bold">Tech Stack</h2>
                </div>
                <div className="flex flex-wrap gap-3">
                  {cs.stack.map((tech) => (
                    <span
                      key={tech}
                      className="px-4 py-2 rounded-xl text-sm font-medium premium-glass border-border/50 text-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Results */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mb-16"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h2 className="text-2xl font-bold">Results</h2>
                </div>
                <div className="space-y-3">
                  {cs.results.map((result, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-3 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/15"
                    >
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <p className="text-foreground/90 leading-relaxed">{result}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Screenshots section (if multiple) */}
              {cs.screenshots.length > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mb-16"
                >
                  <h2 className="text-2xl font-bold mb-6">Screenshots</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {cs.screenshots.map((src, i) => (
                      <div
                        key={i}
                        className="rounded-xl overflow-hidden border border-border/50"
                      >
                        <img
                          src={src}
                          alt={`${cs.title} screenshot ${i + 1}`}
                          loading="lazy"
                          className="w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Fallback if no screenshots */}
              {cs.screenshots.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="mb-16 text-center p-12 rounded-2xl bg-muted/20 border border-border/30"
                >
                  <ImageOff className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                  <p className="text-muted-foreground text-sm">
                    Screenshots coming soon
                  </p>
                </motion.div>
              )}

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-8 rounded-2xl premium-glass-card border border-primary/20 text-center"
              >
                <h3 className="text-xl font-bold mb-3">Want something similar?</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto text-sm">
                  I build custom AI solutions, automation systems, and full-stack applications.
                  Let&apos;s discuss your project.
                </p>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium premium-glass-button premium-glass-button--primary"
                >
                  <MessageCircle className="w-4 h-4" />
                  Start a Conversation
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </a>
              </motion.div>
            </div>
          </div>
        </section>

        <SectionDivider />
        <Contact />
        <ScrollToTop />
      </div>
    </>
  );
};

export default CaseStudyPage;
