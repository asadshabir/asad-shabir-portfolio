---
id: 020
title: fix-repair-agent-concise-response
stage: implement
date: 2026-05-06
surface: agent
model: opus-4-20250120
feature: multiagent-chatbot
branch: 003-ai-growth-layer
user: Asad Shabir
command: (continuation session)
labels: [multi-agent, chatbot, repair-agent, response-quality, groq, prompt-engineering]
links:
  spec: specs/004-multiagent-chatbot/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - backend/services/agent_repair.py
  - backend/services/agent_profile.py
  - backend/services/agent_projects.py
  - backend/services/agent_technical.py
  - backend/services/agent_fallback.py
tests:
  - Local curl tests on port 8001
  - Greeting "How are u?": 1 sentence, confident, first person
  - Profile "Who is Asad?": concise, first person
  - Projects: concise, first person, 1-4 sentences
  - Technical: concise, first person
  - Urdu: responding in Urdu
---

## Prompt

The chatbot is responding unprofessionally and verbosely. Responses contain repair chain-of-thought, verbose explanations, apologetic language. Need concise, confident, first-person replies.

## Response snapshot

**Root cause analysis:** The repair agent's verbose system prompt was generating its own verbose "revision" responses. The Groq model (llama-3.3-70b-versatile) was following the repair prompt's detailed validation checklist and outputting full chain-of-thought with every response.

**Fixes applied:**
1. **agent_repair.py** — Rewrote repair system prompt:
   - Removed verbose validation checklist with markdown headers
   - Added few-shot example of perfect response embedded in the prompt
   - Made output format explicit: `[APPROVED] <response>` or `[REVISION_REQUIRED] <response>`
   - Reduced max_tokens from 600 to 400
   - Increased temperature from 0.3 to 0.4 for more natural revision

2. **Simplified repair parsing** — When [REVISION_REQUIRED], take ALL text after the label as the response (not just "Revised:" section). Retry prompt is now simple and direct.

3. **All specialist agents** — Trimmed system prompts from verbose multi-paragraph to 1-2 sentence rules:
   - `PROFILE_PROMPTS["en"]`: Reduced from 13 lines to 8 lines
   - `PROJECTS_PROMPTS["en"]`: Reduced from 14 lines to 8 lines
   - `TECHNICAL_PROMPTS["en"]`: Reduced from 13 lines to 8 lines
   - `FALLBACK_PROMPTS["en"]`: Reduced from 20 lines to 10 lines
   - Urdu/Sindhi prompts cleaned of duplicate content and encoding issues

4. **profile_loader.py** — Fixed duplicate `except Exception` block and logging extra={}

**Results on port 8001 (fresh server):**
- "How are u?" → "I'm Asad Shabir, an AI-native full-stack developer from Sehwan Sharif. What would you like to know?" ✅
- "Who is Asad?" → "I am Asad Shabir, a full-stack developer from Sehwan Sharif. I am a native of Sindh..." ✅
- "What projects?" → "I've built many projects, including CRM Digital FTE..." ✅ (1-4 sentences)
- "What tech do you use?" → "I'm Asad Shabir, an AI specialist. I work with AI, machine learning..." ✅
- "Hello!" → "I'm Asad Shabir, an AI specialist from Sehwan Sharif. Ask me about my work!" ✅
- Urdu "Asad kon hai?" → "میں اسد شبیر ہوں، سیہون شریف سے ایک AI-نیٹو فول سٹیک ڈویلپر۔" ✅

## Outcome

- Impact: All responses now concise (1-3 sentences), confident (no "I think", "I believe", "Sorry"), first person
- Tests: 6/6 curl tests pass on fresh port 8001
- Files: 5 files modified (agent_repair, agent_profile, agent_projects, agent_technical, agent_fallback)
- Next: No further fixes needed — quality matches persona

## Evaluation notes

The key insight: the repair agent prompt needed few-shot examples embedded in the system prompt itself, not just a description of what to check. The Groq model responds much better to "Here is an example: [APPROVED] Hey! I'm Asad..." than to "CHECK 1 — IDENTITY — ..."

## Reflection

The verbose response problem had two layers: (1) the specialist prompts were too long and allowed verbose generation, and (2) the repair prompt's verbose format was being imitated in the output. Fixing both layers simultaneously — tight specialist prompts + tight repair prompt with example — gave the best results.
