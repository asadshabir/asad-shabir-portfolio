import { useEffect } from "react";

interface SeoMetaProps {
  title: string;
  description: string;
  ogImage?: string;
  canonicalUrl?: string;
  type?: "website" | "article";
  jsonLd?: Record<string, unknown>;
}

const DEFAULT_OG_IMAGE = "/og-image.jpg";
const DEFAULT_DESCRIPTION =
  "Asad Shabir — AI Full-Stack Developer building intelligent agents, full-stack apps, and automation systems. Available for freelance and contract work.";

const SeoMeta = ({
  title,
  description,
  ogImage = DEFAULT_OG_IMAGE,
  canonicalUrl,
  type = "website",
  jsonLd,
}: SeoMetaProps) => {
  const siteUrl = "https://asadshabir.com";
  const fullTitle = title.includes("Asad") ? title : `${title} — Asad Shabir`;
  const canonical = canonicalUrl || (typeof window !== "undefined" ? window.location.href : siteUrl);

  useEffect(() => {
    // Set title
    document.title = fullTitle;

    // Set or update meta tags
    const updateMeta = (name: string, content: string, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let el = document.querySelector<HTMLMetaElement>(selector);
      if (!el) {
        el = document.createElement("meta");
        if (property) el.setAttribute("property", name);
        else el.setAttribute("name", name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    // Standard meta
    updateMeta("description", description.slice(0, 160));
    updateMeta("author", "Asad Shabir");
    updateMeta("keywords", "AI developer, full-stack developer, Python, FastAPI, React, chatbot developer, Pakistan");

    // Open Graph
    updateMeta("og:title", fullTitle, true);
    updateMeta("og:description", description.slice(0, 160), true);
    updateMeta("og:image", `${siteUrl}${ogImage}`, true);
    updateMeta("og:url", canonical, true);
    updateMeta("og:type", type, true);
    updateMeta("og:site_name", "Asad Shabir Portfolio", true);

    // Twitter Card
    updateMeta("twitter:card", "summary_large_image");
    updateMeta("twitter:title", fullTitle);
    updateMeta("twitter:description", description.slice(0, 160));
    updateMeta("twitter:image", `${siteUrl}${ogImage}`);

    // Canonical
    let canonicalEl = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonicalEl) {
      canonicalEl = document.createElement("link");
      canonicalEl.rel = "canonical";
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.href = canonical;

    // JSON-LD
    const existingScript = document.querySelector<HTMLScriptElement>('script[data-seo="json-ld"]');
    if (existingScript) existingScript.remove();

    if (jsonLd) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-seo", "json-ld");
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }

    return () => {
      // Cleanup is optional — SPA navigation just updates tags
    };
  }, [fullTitle, description, ogImage, canonical, type, jsonLd]);

  return null;
};

export default SeoMeta;
