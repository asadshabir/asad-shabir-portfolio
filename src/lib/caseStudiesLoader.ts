export interface CaseStudy {
  slug: string;
  title: string;
  excerpt: string;
  challenge: string;
  approach: string;
  stack: string[];
  results: string[];
  screenshots: string[];
  published_date: string;
  tags: string[];
}

const CASE_STUDIES_URL = "/content/case-studies.json";

let _cache: CaseStudy[] | null = null;

export async function loadCaseStudies(): Promise<CaseStudy[]> {
  if (_cache) return _cache;
  const res = await fetch(CASE_STUDIES_URL);
  if (!res.ok) throw new Error(`Failed to load case studies: ${res.status}`);
  _cache = await res.json() as CaseStudy[];
  return _cache;
}

export async function loadCaseStudy(slug: string): Promise<CaseStudy | null> {
  const all = await loadCaseStudies();
  return all.find((cs) => cs.slug === slug) ?? null;
}
