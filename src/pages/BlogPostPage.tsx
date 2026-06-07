import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Clock, Tag, ArrowLeft, Share2, BookOpen, MessageCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import SeoMeta from "@/components/seo/SeoMeta";
import SectionDivider from "@/components/SectionDivider";
import Contact from "@/components/Contact";
import ScrollToTop from "@/components/ScrollToTop";
import { loadPost, formatDate, type BlogPost } from "@/lib/blogLoader";
import { useAnalytics } from "@/hooks/useAnalytics";

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const { trackCTA } = useAnalytics();

  useEffect(() => {
    if (!slug) return;

    loadPost(slug)
      .then((result) => {
        if (result) {
          setPost(result);
          trackCTA(`Blog Post: ${result.title}`, `/blog/${slug}`);
        } else {
          setNotFound(true);
        }
      })
      .catch(() => setNotFound(true));
  }, [slug, trackCTA]);

  const handleShare = async () => {
    const url = window.location.href;
    const title = post?.title || "Blog Post";

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // User cancelled or error - fall through to clipboard
      }
    }

    // Fallback to clipboard
    await navigator.clipboard.writeText(url);
    setShareSuccess(true);
    setTimeout(() => setShareSuccess(false), 2000);
  };

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Article not found</h1>
          <p className="text-muted-foreground mb-6">
            This article may have been moved or removed.
          </p>
          <Link to="/blog" className="text-primary hover:underline">
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    image: post.coverImage,
    datePublished: post.date,
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
        title={post.title}
        description={post.description}
        ogImage={post.coverImage}
        canonicalUrl={`https://asadshabir.com/blog/${post.slug}`}
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
        <section className="relative pt-32 pb-12 sm:pt-40 sm:pb-16 overflow-hidden">
          <div className="container px-4 sm:px-6 relative z-10">
            {/* Back link */}
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              All Articles
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 text-sm ml-6"
            >
              ← Main page
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 text-sm ml-6"
            >
              ← Main page
            </Link>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag) => (
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
              {post.title}
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg sm:text-xl text-muted-foreground max-w-3xl mb-8"
            >
              {post.description}
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
                {formatDate(post.date)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-primary" />
                {post.readingTime} min read
              </span>
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors"
                title="Share this article"
              >
                <Share2 className="w-4 h-4" />
                {shareSuccess ? "Copied!" : "Share"}
              </button>
            </motion.div>
          </div>
        </section>

        {/* Cover image */}
        {post.coverImage && (
          <section className="relative pb-8">
            <div className="container px-4 sm:px-6 relative z-10">
              <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden border border-border/50 shadow-2xl">
                <img
                  src={post.coverImage}
                  alt={post.title}
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
            <motion.article
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="prose prose-lg dark:prose-invert max-w-3xl mx-auto
                prose-headings:font-black prose-headings:tracking-tight
                prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4
                prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                prose-p:text-muted-foreground prose-p:leading-relaxed
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-code:text-primary prose-code:bg-muted/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                prose-pre:bg-card prose-pre:border prose-pre:border-border/50 prose-pre:rounded-xl
                prose-pre:p-6 prose-pre:overflow-x-auto
                prose-ul:list-disc prose-ul:marker:text-primary
                prose-ol:list-decimal prose-ol:marker:text-primary
                prose-li:text-muted-foreground prose-li:leading-relaxed
                prose-blockquote:border-l-primary prose-blockquote:bg-primary/5 prose-blockquote:py-2 prose-blockquote:not-italic
                prose-strong:text-foreground prose-strong:font-semibold
                prose-img:rounded-xl prose-img:border prose-img:border-border/50"
            >
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </motion.article>

            {/* Tags footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="max-w-3xl mx-auto mt-12 pt-8 border-t border-border/30"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm text-muted-foreground">Topics:</span>
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-card/50 border border-border/50 text-muted-foreground"
                  >
                    <Tag className="w-3 h-3 inline mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Share section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="max-w-3xl mx-auto mt-8 p-6 rounded-2xl bg-card/30 border border-border/50 text-center"
            >
              <h3 className="text-lg font-bold mb-2">Share this article</h3>
              <p className="text-sm text-muted-foreground mb-4">
                If you found this helpful, share it with others who might benefit.
              </p>
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium premium-glass-button premium-glass-button--primary"
              >
                <Share2 className="w-4 h-4" />
                {shareSuccess ? "Link Copied!" : "Copy Link"}
              </button>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="max-w-3xl mx-auto mt-8 p-8 rounded-2xl premium-glass-card border border-primary/20 text-center"
            >
              <h3 className="text-xl font-bold mb-3">Interested in building something similar?</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto text-sm">
                I build production-ready AI systems, automation tools, and full-stack applications.
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
        </section>

        <SectionDivider />
        <Contact />
        <ScrollToTop />
      </div>
    </>
  );
};

export default BlogPostPage;