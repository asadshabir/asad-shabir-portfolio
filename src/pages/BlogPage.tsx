import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Clock, Tag, ArrowRight, PenLine } from "lucide-react";
import SeoMeta from "@/components/seo/SeoMeta";
import SectionDivider from "@/components/SectionDivider";
import Contact from "@/components/Contact";
import ScrollToTop from "@/components/ScrollToTop";
import { loadAllPostMeta, formatDate, type BlogMeta } from "@/lib/blogLoader";
import { useAnalytics } from "@/hooks/useAnalytics";

const BlogPage = () => {
  const [posts, setPosts] = useState<BlogMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const { trackCTA } = useAnalytics();

  useEffect(() => {
    loadAllPostMeta()
      .then(setPosts)
      .catch(console.error)
      .finally(() => setLoading(false));

    trackCTA("Blog Page View");
  }, [trackCTA]);

  // Get all unique tags
  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags))).sort();

  // Filter posts by selected tag
  const filteredPosts = selectedTag
    ? posts.filter((p) => p.tags.includes(selectedTag))
    : posts;

  // Group posts by month/year for better organization
  const groupedPosts = filteredPosts.reduce((acc, post) => {
    const date = new Date(post.date);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(post);
    return acc;
  }, {} as Record<string, BlogMeta[]>);

  const sortedKeys = Object.keys(groupedPosts).sort((a, b) => b.localeCompare(a));

  return (
    <>
      <SeoMeta
        title="Blog — Insights on AI, Full-Stack & Automation"
        description="Articles on building AI agents, workflow automation, FastAPI, React, and modern full-stack development. Learn from production experience."
        ogImage="/og-image.jpg"
        type="website"
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl"
            >
              <div className="flex items-center gap-2 text-primary mb-4">
                <PenLine className="w-5 h-5" />
                <span className="text-sm font-medium uppercase tracking-wider">Blog & Insights</span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 leading-tight">
                Thoughts on{" "}
                <span className="holographic-text">AI</span>,{" "}
                <span className="holographic-text">Engineering</span>, and{" "}
                <span className="holographic-text">Building</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl">
                Practical insights from building production systems. No fluff, just
                real-world lessons from AI agents, automation, and full-stack development.
              </p>
              <div className="mt-5 flex items-center gap-4">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  ← Back to main page
                </Link>
                <span className="text-muted-foreground/40">·</span>
                <Link
                  to="/blog"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  All Articles
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Tags filter */}
        <section className="relative pb-8">
          <div className="container px-4 sm:px-6 relative z-10">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedTag === null
                    ? "bg-primary text-primary-foreground"
                    : "bg-card/50 border border-border/50 hover:border-primary/50 text-muted-foreground hover:text-foreground"
                }`}
              >
                All Posts
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
                    selectedTag === tag
                      ? "bg-primary text-primary-foreground"
                      : "bg-card/50 border border-border/50 hover:border-primary/50 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Posts list */}
        <section className="relative py-12">
          <div className="container px-4 sm:px-6 relative z-10">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-48 rounded-2xl bg-muted/30" />
                  </div>
                ))}
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-20">
                <PenLine className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">No posts found</h3>
                <p className="text-muted-foreground">
                  {selectedTag
                    ? `No posts tagged with "${selectedTag}"`
                    : "Blog posts coming soon"}
                </p>
              </div>
            ) : (
              <div className="space-y-12">
                {sortedKeys.map((key) => (
                  <div key={key}>
                    {/* Month header */}
                    <h3 className="text-sm font-medium text-muted-foreground/70 uppercase tracking-wider mb-6 flex items-center gap-3">
                      <span>
                        {new Date(key + "-01").toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                      <span className="flex-1 h-px bg-border/30" />
                    </h3>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {groupedPosts[key].map((post, index) => (
                        <motion.article
                          key={post.slug}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                        >
                          <Link
                            to={`/blog/${post.slug}`}
                            className="group block h-full"
                          >
                            <article className="h-full rounded-2xl overflow-hidden border border-border/50 bg-card/30 backdrop-blur-sm hover:border-primary/30 hover:bg-card/50 transition-all duration-300">
                              {/* Cover image */}
                              {post.coverImage && (
                                <div className="aspect-video overflow-hidden">
                                  <img
                                    src={post.coverImage}
                                    alt={post.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    loading="lazy"
                                  />
                                </div>
                              )}

                              {/* Content */}
                              <div className="p-6">
                                {/* Tags */}
                                <div className="flex flex-wrap gap-1.5 mb-3">
                                  {post.tags.slice(0, 3).map((tag) => (
                                    <span
                                      key={tag}
                                      className="px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>

                                {/* Title */}
                                <h2 className="text-lg font-bold mb-2 leading-snug group-hover:text-primary transition-colors">
                                  {post.title}
                                </h2>

                                {/* Description */}
                                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                  {post.description}
                                </p>

                                {/* Meta */}
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {formatDate(post.date)}
                                  </span>
                                  <span className="flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5" />
                                    {post.readingTime} min read
                                  </span>
                                </div>

                                {/* Read more */}
                                <div className="mt-4 pt-4 border-t border-border/30 flex items-center gap-2 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                  Read article
                                  <ArrowRight className="w-4 h-4" />
                                </div>
                              </div>
                            </article>
                          </Link>
                        </motion.article>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <SectionDivider />
        <Contact />
        <ScrollToTop />
      </div>
    </>
  );
};

export default BlogPage;