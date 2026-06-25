import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import CaseStudyCard from "./CaseStudyCard";
import { loadCaseStudies, type CaseStudy } from "@/lib/caseStudiesLoader";

const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

const CaseStudiesSection = () => {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCaseStudies()
      .then(setCaseStudies)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="case-studies" className="py-20 sm:py-32 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[150px]" />
      </div>

      <div className="container px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-12"
        >
          <p className="text-sm font-mono tracking-widest uppercase text-primary mb-4">Portfolio</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Case <span className="holographic-text">Studies</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg">
            Real problems. Strategic approaches. Measurable results. Here's how I turn ideas into production-grade solutions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {loading ? (
            <>
              {[1, 2].map((i) => (
                <div key={i} className="rounded-2xl border border-border/50 bg-card/30 p-0 h-96 animate-pulse">
                  <div className="h-48 bg-muted/30 rounded-t-2xl" />
                  <div className="p-5 sm:p-6 space-y-3">
                    <div className="h-5 bg-muted/30 rounded-xl w-3/4" />
                    <div className="h-4 bg-muted/20 rounded-lg w-full" />
                    <div className="h-4 bg-muted/20 rounded-lg w-5/6" />
                    <div className="flex gap-2 mt-4">
                      <div className="h-5 w-16 bg-muted/20 rounded-full" />
                      <div className="h-5 w-20 bg-muted/20 rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : caseStudies.length === 0 ? (
            <div className="col-span-2 text-center py-12 text-muted-foreground">
              <p className="text-sm">No case studies yet.</p>
            </div>
          ) : (
            caseStudies.map((cs, i) => (
              <motion.div
                key={cs.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * (isMobile ? 0.05 : 0.1) }}
              >
                <CaseStudyCard caseStudy={cs} />
              </motion.div>
            ))
          )}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-10 sm:mt-12"
        >
          <a
            href="/#case-studies"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors group"
          >
            View All Case Studies
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default CaseStudiesSection;
