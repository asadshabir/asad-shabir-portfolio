import { motion } from "framer-motion";
import { ArrowRight, Calendar, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import type { CaseStudy } from "@/lib/caseStudiesLoader";

interface Props {
  caseStudy: CaseStudy;
  featured?: boolean;
}

const toneMap: Record<string, "cyan" | "magenta" | "emerald"> = {
  cyan: "cyan",
  magenta: "magenta",
  emerald: "emerald",
};

const CaseStudyCard = ({ caseStudy: cs, featured }: Props) => {
  const tone = toneMap[cs.tags[0]?.toLowerCase().includes("ai") ? "magenta" : "cyan"];
  const gradient =
    cs.tags[0]?.toLowerCase().includes("ai")
      ? "from-violet-600/30 via-primary/15 to-indigo-900/30"
      : "from-teal-600/30 via-primary/15 to-cyan-900/30";
  const borderColor =
    cs.tags[0]?.toLowerCase().includes("ai") ? "border-violet-400/40" : "border-teal-400/40";

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className={`premium-glass-card group relative overflow-hidden rounded-2xl border ${borderColor} p-0 h-full flex flex-col`}
    >
      {/* Image */}
      <div className={`relative h-44 sm:h-52 overflow-hidden bg-gradient-to-br ${gradient}`}>
        {cs.screenshots[0] ? (
          <img
            src={cs.screenshots[0]}
            alt={`${cs.title} preview`}
            loading="lazy"
            className="w-full h-full object-cover opacity-70"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-primary/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        )}
        <div className={`absolute inset-0 bg-gradient-to-t ${gradient} mix-blend-screen`} />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-background/30" />

        {featured && (
          <div className="absolute top-3 right-3 z-20">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="premium-badge flex items-center gap-1 px-2.5 py-1 text-primary text-xs border-primary/30"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Featured
            </motion.div>
          </div>
        )}

        {/* Date */}
        <div className="absolute top-3 left-3 z-20">
          <div className="premium-badge flex items-center gap-1 px-2 py-0.5 text-xs text-muted-foreground border-border/40">
            <Calendar className="w-3 h-3" />
            {new Date(cs.published_date).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 flex-1 flex flex-col">
        <h3 className="text-base sm:text-lg font-bold mb-2 group-hover:text-primary transition-colors duration-300 line-clamp-2">
          {cs.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-3 sm:mb-4 leading-relaxed line-clamp-3 flex-1">
          {cs.excerpt}
        </p>

        {/* Stack badges */}
        <div className="flex flex-wrap gap-1.5 mb-3 sm:mb-4">
          {cs.stack.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-muted text-muted-foreground"
            >
              {tech}
            </span>
          ))}
          {cs.stack.length > 3 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-muted text-muted-foreground">
              +{cs.stack.length - 3}
            </span>
          )}
        </div>

        {/* Tags */}
        <div className="flex items-center gap-2 mb-5">
          <Tag className="w-3 h-3 text-primary/60" />
          <div className="flex flex-wrap gap-1">
            {cs.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-[10px] text-primary/70">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Results preview */}
        {cs.results.length > 0 && (
          <div className="mb-5 p-3 rounded-xl bg-primary/5 border border-primary/10">
            <p className="text-xs font-semibold text-primary mb-1.5">Key Result</p>
            <p className="text-xs text-muted-foreground line-clamp-2">{cs.results[0]}</p>
          </div>
        )}

        {/* CTA */}
        <Link
          to={`/case-studies/${cs.slug}`}
          className="mt-auto inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-medium text-sm premium-glass-button premium-glass-button--primary group-hover:scale-[1.02] transition-transform"
        >
          Read Case Study
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  );
};

export default CaseStudyCard;
