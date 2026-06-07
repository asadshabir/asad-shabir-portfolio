/**
 * Blog Content Types and Loader
 *
 * Loads blog posts from static markdown files with frontmatter.
 * Uses the same pattern as caseStudiesLoader but for markdown content.
 */

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  coverImage?: string;
  content: string;
  readingTime: number;
}

export interface BlogMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  coverImage?: string;
  readingTime: number;
}

// Cache for loaded posts
let _postsCache: BlogPost[] | null = null;
let _metaCache: BlogMeta[] | null = null;

/**
 * Parse YAML frontmatter from markdown content.
 */
function parseFrontmatter(content: string): {
  frontmatter: Record<string, string | string[]>;
  body: string;
} {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { frontmatter: {}, body: content };

  const [, frontmatterStr, body] = match;
  const frontmatter: Record<string, string | string[]> = {};

  for (const line of frontmatterStr.split(/\r?\n/)) {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    const value = line.slice(colonIdx + 1).trim();

    if (value.startsWith("[") && value.endsWith("]")) {
      // Parse array values
      frontmatter[key] = value
        .slice(1, -1)
        .split(",")
        .map((v) => v.trim().replace(/^["']|["']$/g, ""));
    } else {
      frontmatter[key] = value.replace(/^["']|["']$/g, "");
    }
  }

  return { frontmatter, body };
}

/**
 * Calculate reading time from content.
 * Average reading speed: 200 words per minute.
 */
function calculateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

/**
 * Load all blog posts.
 * In Vite dev, imports.meta.glob works. For production, we fetch from public.
 */
export async function loadAllPosts(): Promise<BlogPost[]> {
  if (_postsCache) return _postsCache;

  try {
    // Try to load from public/blog directory (for production builds)
    const res = await fetch("/content/blog/posts.json");
    if (res.ok) {
      _postsCache = await res.json();
      return _postsCache;
    }
  } catch {
    // Fall back to import glob
  }

  // Development fallback using Vite's import.meta.glob
  const modules = import.meta.glob("/src/content/blog/*.md", {
    query: "?raw",
    import: "default",
    eager: true,
  }) as Record<string, string>;

  const posts: BlogPost[] = [];

  for (const [path, rawContent] of Object.entries(modules)) {
    const { frontmatter, body } = parseFrontmatter(rawContent);

    posts.push({
      slug: (frontmatter.slug as string) || path.split("/").pop()?.replace(".md", "") || "",
      title: (frontmatter.title as string) || "Untitled",
      description: (frontmatter.description as string) || "",
      date: (frontmatter.date as string) || new Date().toISOString().split("T")[0],
      tags: (frontmatter.tags as string[]) || [],
      coverImage: frontmatter.cover_image as string | undefined,
      content: body.trim(),
      readingTime: calculateReadingTime(body),
    });
  }

  // Sort by date descending
  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  _postsCache = posts;
  return posts;
}

/**
 * Load all blog post metadata (without content).
 * Useful for listing pages where full content isn't needed.
 */
export async function loadAllPostMeta(): Promise<BlogMeta[]> {
  if (_metaCache) return _metaCache;

  const posts = await loadAllPosts();
  _metaCache = posts.map(({ content: _content, ...meta }) => meta);
  return _metaCache;
}

/**
 * Load a single blog post by slug.
 */
export async function loadPost(slug: string): Promise<BlogPost | null> {
  const posts = await loadAllPosts();
  return posts.find((post) => post.slug === slug) ?? null;
}

/**
 * Format date for display.
 */
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}