import type { CaseStudy } from "./caseStudiesLoader";

/**
 * Load a JSON file from the public content directory.
 * Used for case studies and other static JSON content.
 */
export async function loadJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
  return res.json() as Promise<T>;
}

/**
 * Load all case studies from the public content directory.
 */
export async function loadCaseStudies(): Promise<CaseStudy[]> {
  return loadJson<CaseStudy[]>("/content/case-studies.json");
}

/**
 * Calculate reading time from markdown text.
 * Average reading speed: 200 words per minute.
 */
export function calculateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

/**
 * Parse YAML frontmatter from a markdown string.
 * Simple parser for title, excerpt, published_date, tags fields.
 */
export function parseFrontmatter(content: string): {
  frontmatter: Record<string, unknown>;
  body: string;
} {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { frontmatter: {}, body: content };

  const [, frontmatterStr, body] = match;
  const frontmatter: Record<string, unknown> = {};

  for (const line of frontmatterStr.split(/\r?\n/)) {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    const value = line.slice(colonIdx + 1).trim();

    if (value.startsWith("[") && value.endsWith("]")) {
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
