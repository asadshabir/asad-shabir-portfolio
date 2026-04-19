// Single source of truth for Asad Shabir's portfolio knowledge.
// Used by the in-browser chatbot to give grounded, on-topic answers.

export const ASAD = {
  name: "Asad Shabir",
  email: "asadshabir505@gmail.com",
  location: "Pakistan",
  roles: [
    "AI Engineer",
    "Agentic AI Developer",
    "Full-Stack Developer",
    "Prompt Engineer",
    "Chatbot & Automation Architect",
  ],
  bio:
    "Asad Shabir is an AI Engineer and Full-Stack Developer from Pakistan specializing in agentic AI systems, intelligent chatbots, and production-ready full-stack applications. He builds with the OpenAI Agents SDK, Groq, LangChain, FastAPI, Next.js, React, and Supabase. He is currently studying Agentic AI & Spec-Driven Development at PIAIC / GIAIC and applies enterprise engineering practices learned at Digitel FTE — including DevOps, QA automation, and scalable backend architecture.",
  education: [
    {
      org: "PIAIC / GIAIC",
      focus: "Agentic AI, OpenAI Agents SDK, Spec-Driven Development",
      period: "Ongoing",
    },
  ],
  experience: [
    {
      org: "Digitel FTE",
      role: "Engineering knowledge & enterprise practices",
      highlights: [
        "Telecom-grade DevOps and CI/CD pipelines",
        "QA automation and reliability engineering",
        "Scalable backend architecture patterns",
      ],
    },
    {
      org: "Freelance / GIAIC Projects",
      role: "AI Engineer & Full-Stack Developer (2024 – Present)",
      highlights: [
        "Building agentic AI systems with OpenAI Agents SDK",
        "Production-grade chatbots and RAG pipelines",
        "Full-stack apps with Next.js, FastAPI, Supabase",
      ],
    },
  ],
  skills: {
    "AI Chatbots": ["OpenAI Agents SDK", "Groq", "LangChain", "RAG", "Streaming"],
    "Agentic AI": ["Multi-agent orchestration", "Tool use", "Memory", "Guardrails"],
    "AI-Native": ["Next.js + AI", "Edge AI", "Vector DBs", "Prompt design"],
    "SDD (Spec-Driven Development)": ["Specs first", "Type-safe contracts", "Test-driven"],
    "Full-Stack Apps": ["Next.js", "React", "TypeScript", "FastAPI", "Supabase", "Tailwind"],
    "DevOps": ["Docker", "GitHub Actions", "Vercel", "CI/CD"],
  },
  projects: [
    {
      name: "ASA-Mind",
      summary:
        "Flagship AI chat assistant powered by OpenAI Agents SDK with multi-agent orchestration, streaming, and memory.",
      live: "https://asa-mind.vercel.app",
      github: "https://github.com/asadshabir/asa-mind",
      tech: ["OpenAI Agents SDK", "Python", "FastAPI", "React", "Supabase"],
    },
    {
      name: "AI-Powered Robotics Book",
      summary: "Interactive AI-generated educational book on robotics × AI.",
      live: "https://robotics-ai-book.vercel.app",
      github: "https://github.com/asadshabir/robotics-ai-book",
      tech: ["Next.js", "OpenAI", "TypeScript"],
    },
    {
      name: "Full-Stack E-Commerce Platform",
      summary: "Production e-commerce with Stripe, Supabase auth, admin dashboard.",
      live: "https://ecommerce-asad.vercel.app",
      github: "https://github.com/asadshabir/ecommerce-platform",
      tech: ["Next.js", "Supabase", "Stripe", "TypeScript"],
    },
    {
      name: "Workflow Automation Engine",
      summary: "Rule-based automation connecting APIs and triggering actions.",
      live: "https://flow-engine.vercel.app",
      github: "https://github.com/asadshabir/workflow-automation",
      tech: ["Python", "FastAPI", "Celery", "Redis"],
    },
    {
      name: "AI Resume Analyzer",
      summary: "NLP-powered resume parser with scoring and improvement tips.",
      live: "https://resume-ai-asad.vercel.app",
      github: "https://github.com/asadshabir/ai-resume-analyzer",
      tech: ["Python", "LangChain", "React", "FastAPI"],
    },
    {
      name: "Real-Time Dashboard",
      summary: "Live analytics with WebSockets, charts, and RBAC.",
      live: "https://realtime-dash.vercel.app",
      github: "https://github.com/asadshabir/realtime-dashboard",
      tech: ["React", "Node.js", "PostgreSQL", "WebSockets"],
    },
  ],
  socials: {
    gmail: "https://mail.google.com/mail/?view=cm&fs=1&to=asadshabir505@gmail.com",
    linkedin: "https://www.linkedin.com/in/asad-shabir-programmer110/",
    github: "https://github.com/asadshabir/",
    facebook: "https://www.facebook.com/Asadalibhatti110",
  },
};

export type ChatResponse = {
  text: string;
  references?: { label: string; url: string }[];
};

const includesAny = (s: string, words: string[]) =>
  words.some((w) => s.includes(w));

// Strict, scoped responder: only answers questions about Asad Shabir.
export function answerAboutAsad(input: string): ChatResponse {
  const q = input.toLowerCase().trim();

  // Off-topic guard
  const onTopic =
    includesAny(q, [
      "asad", "shabir", "you", "your", "skill", "project", "experience",
      "hire", "work", "service", "help", "contact", "resume", "cv",
      "education", "piaic", "giaic", "digitel", "agentic", "agent",
      "chatbot", "openai", "groq", "langchain", "next", "react", "python",
      "fastapi", "supabase", "devops", "full-stack", "fullstack", "ai",
      "automation", "asa-mind", "asamind", "robotics", "ecommerce",
      "dashboard", "analyzer", "workflow", "tech", "stack", "tool",
      "linkedin", "github", "email", "gmail", "facebook", "price",
      "rate", "available", "freelance",
    ]) || q.length < 3;

  if (!onTopic) {
    return {
      text:
        "I can only answer questions about **Asad Shabir** — his skills, projects, experience, services, or how to contact him. Try asking: \"What are Asad's top skills?\" or \"Tell me about ASA-Mind\".",
    };
  }

  // Project-specific
  if (includesAny(q, ["asa-mind", "asamind", "asa mind"])) {
    const p = ASAD.projects[0];
    return {
      text: `**${p.name}** — ${p.summary} Built with ${p.tech.join(", ")}.`,
      references: [
        { label: "Live demo", url: p.live },
        { label: "GitHub", url: p.github },
      ],
    };
  }
  if (includesAny(q, ["robotics", "book"])) {
    const p = ASAD.projects[1];
    return {
      text: `**${p.name}** — ${p.summary}`,
      references: [
        { label: "Live", url: p.live },
        { label: "GitHub", url: p.github },
      ],
    };
  }
  if (includesAny(q, ["ecommerce", "e-commerce", "stripe", "shop"])) {
    const p = ASAD.projects[2];
    return {
      text: `**${p.name}** — ${p.summary}`,
      references: [
        { label: "Live", url: p.live },
        { label: "GitHub", url: p.github },
      ],
    };
  }
  if (includesAny(q, ["automation", "workflow"])) {
    const p = ASAD.projects[3];
    return {
      text: `**${p.name}** — ${p.summary}`,
      references: [
        { label: "Live", url: p.live },
        { label: "GitHub", url: p.github },
      ],
    };
  }
  if (includesAny(q, ["resume analyzer", "cv analyzer", "nlp"])) {
    const p = ASAD.projects[4];
    return {
      text: `**${p.name}** — ${p.summary}`,
      references: [
        { label: "Live", url: p.live },
        { label: "GitHub", url: p.github },
      ],
    };
  }
  if (includesAny(q, ["dashboard", "analytics", "websocket"])) {
    const p = ASAD.projects[5];
    return {
      text: `**${p.name}** — ${p.summary}`,
      references: [
        { label: "Live", url: p.live },
        { label: "GitHub", url: p.github },
      ],
    };
  }

  // List all projects
  if (includesAny(q, ["project", "portfolio", "built", "work"])) {
    return {
      text:
        "Asad has shipped " +
        ASAD.projects.length +
        " featured projects spanning Agentic AI, Full-Stack, and Automation. Top picks:\n\n" +
        ASAD.projects
          .slice(0, 4)
          .map((p) => `• **${p.name}** — ${p.summary}`)
          .join("\n"),
      references: ASAD.projects.slice(0, 4).map((p) => ({
        label: p.name,
        url: p.github,
      })),
    };
  }

  // Skills
  if (includesAny(q, ["skill", "stack", "tech", "tool", "expert", "good at"])) {
    return {
      text:
        "Asad's core stack:\n\n" +
        Object.entries(ASAD.skills)
          .map(([k, v]) => `• **${k}** — ${v.join(", ")}`)
          .join("\n"),
    };
  }

  // Experience / education
  if (includesAny(q, ["experience", "background", "journey", "career"])) {
    return {
      text: ASAD.experience
        .map(
          (e) =>
            `**${e.role}** @ ${e.org}\n  - ` + e.highlights.join("\n  - ")
        )
        .join("\n\n"),
    };
  }
  if (includesAny(q, ["education", "study", "piaic", "giaic", "learn"])) {
    return {
      text:
        "Asad is currently at **PIAIC / GIAIC** focusing on Agentic AI, OpenAI Agents SDK, and Spec-Driven Development. He also brings enterprise engineering knowledge from **Digitel FTE** (telecom-grade DevOps, QA automation, scalable backends).",
    };
  }
  if (includesAny(q, ["digitel", "fte"])) {
    return {
      text:
        "At **Digitel FTE**, Asad gained hands-on knowledge in telecom-grade DevOps, CI/CD, QA automation, and scalable backend architecture — practices he now applies across every project.",
    };
  }

  // Hire / services
  if (includesAny(q, ["hire", "freelance", "available", "rate", "price", "cost"])) {
    return {
      text:
        "Asad is **available for freelance and contract work** — AI integration, agentic AI systems, full-stack development, automation, and prompt engineering. Reach out via email or LinkedIn for a quick chat.",
      references: [
        { label: "Email Asad", url: ASAD.socials.gmail },
        { label: "LinkedIn", url: ASAD.socials.linkedin },
      ],
    };
  }

  // Contact / socials
  if (includesAny(q, ["contact", "reach", "email", "gmail", "linkedin", "github", "facebook", "social"])) {
    return {
      text: "Here's how to reach Asad:",
      references: [
        { label: "Gmail", url: ASAD.socials.gmail },
        { label: "LinkedIn", url: ASAD.socials.linkedin },
        { label: "GitHub", url: ASAD.socials.github },
        { label: "Facebook", url: ASAD.socials.facebook },
      ],
    };
  }

  // Resume
  if (includesAny(q, ["resume", "cv"])) {
    return {
      text: "Grab Asad's full resume here:",
      references: [{ label: "Download Resume (PDF)", url: "/Asad_Shabir_Resume.pdf" }],
    };
  }

  // Default — bio
  return {
    text: ASAD.bio,
    references: [
      { label: "See Projects", url: ASAD.socials.github },
      { label: "LinkedIn", url: ASAD.socials.linkedin },
    ],
  };
}
