---
id: 023
title: Intelligent Chatbot Intent Routing
stage: green
date: 2026-06-12
surface: agent
model: oc/deepseek-v4-flash-free
feature: chatbot-intent-routing
branch: 003-ai-growth-layer
user: asad-shabir
command: make chatbot intelligent and advanced
labels: [chatbot, intent-classification, rag, qdrant, fastapi]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - backend/chatbot/intent_classifier.py (NEW)
  - backend/chatbot/knowledge_base.py (MODIFIED)
  - backend/chatbot/app.py (MODIFIED)
tests:
  - backend/chatbot/intent_classifier.py (42 inline unit tests)
  - backend/tests/ (all 52 existing tests pass)
---

## Prompt

make chatbot intelligent and advanced if your ask about any specific data -> go and retrive from databse qdrant if user simple talks the main agent llm  model will respond fast to user as frindly conversation repond according to user's talks. lets work on it by thinking hard step by step and work as OODA Loop work in todos without breaking other code.

## Response snapshot

Implemented a three-route intent-based architecture for the chatbot:

1. **Intent Classifier** (`intent_classifier.py`) — Pattern-based classification (no LLM overhead) that categorizes user messages as `greeting`, `farewell`, `casual`, or `knowledge`. Checks conversational context via `last_mode` tracking to keep follow-ups in the correct mode.

2. **Casual/Greeting route** — Uses a lightweight 70-line casual prompt (`build_casual_prompt()`) with direct LLM completion, skipping RAG retrieval entirely. Greetings get 80 max_tokens for ultra-fast responses.

3. **Knowledge route** — Unchanged existing flow: full 275-line identity prompt + RAG retrieval from Qdrant + OpenAI Agents SDK pipeline with sub-agent handoffs.

Key implementation details:
- `SessionState.conversation_mode` tracks whether we're in casual or knowledge mode
- `_direct_chat_completion` helper provides fast LLM calls without agent/tool overhead
- Conversation context awareness: "tell me more" after a knowledge answer stays in knowledge mode
- All 42 pattern-matching tests pass and all 52 existing project tests pass

## Outcome

- ✅ Impact: Chatbot now intelligently routes between fast casual chat and deep RAG-powered knowledge responses
- 🧪 Tests: 42 intent classifier unit tests + 52 existing tests all passing
- 📁 Files: 1 new file (intent_classifier.py), 2 modified (knowledge_base.py, app.py)
- 🔁 Next prompts: Could add LLM-based classifier fallback for ambiguous cases, attach defined tools to agents
- 🧠 Reflection: Pattern-based classifier is fast (~0ms) and handles most cases well. Conversation mode tracking prevents unnecessary RAG on follow-ups. The 42-test battery covers greetings, farewells, casual chat, knowledge queries, and edge cases.

## Evaluation notes (flywheel)

- Failure modes observed: "how are you?" initially misclassified as knowledge due to pattern ordering — fixed by reordering casual checks before knowledge indicators
- Graders run and results (PASS/FAIL): All 42 tests PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Attach unused tools.py and rag_tool.py to agents so they can fetch data on-demand
