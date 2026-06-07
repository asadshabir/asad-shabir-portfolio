# Quickstart: Multi-Agent Chatbot

**Feature**: `004-multiagent-chatbot` | **Date**: 2026-05-05

---

## Prerequisites

- Python 3.11+
- `groq` Python SDK
- `openai-agents` Python SDK (verify latest version)
- `GROQ_API_KEY` environment variable

---

## Environment Setup

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
pip install groq openai-agents
```

### 2. Configure Environment Variables

Create or update `backend/.env`:

```bash
# Required
GROQ_API_KEY=your_groq_api_key_here

# Optional (defaults shown)
MODEL_NAME=llama-3.3-70b-versatile
ENVIRONMENT=development
FRONTEND_URL=http://localhost:5173

# Rate limiting
CHATBOT_RATE_LIMIT=10
CHATBOT_RATE_WINDOW=600
```

### 3. Verify Profile File

Ensure `asadshabir_all_info.md` is in the project root (same level as `backend/`):

```
My Portfolio/
├── asadshabir_all_info.md    ← Required
├── backend/
│   ├── app.py
│   ├── main.py
│   └── services/
│       ├── agent_router.py
│       ├── agent_profile.py
│       └── ...
```

---

## Running the Server

### Development

```bash
cd backend
uvicorn main:app --reload --port 8000
```

### Production

```bash
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000
```

---

## API Usage

### 1. Chat with the Agent (Recommended)

```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Asad kon hai?"}
    ],
    "language": "ur",
    "session_id": "my-session-123"
  }'
```

**Response**:
```json
{
  "ok": true,
  "message": {
    "role": "assistant",
    "content": "Asad Shabir ek proud Sindhi AI-Native Full-Stack Developer hain ✨..."
  },
  "language": "ur",
  "session_id": "my-session-123"
}
```

### 2. Raw Groq Completion (Debugging)

```bash
curl -X POST http://localhost:8000/api/chat/raw \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "system", "content": "You are Asad Shabir."},
      {"role": "user", "content": "Hello!"}
    ],
    "temperature": 0.7
  }'
```

### 3. Get Profile Data

```bash
curl http://localhost:8000/api/profile
```

### 4. Health Check

```bash
curl http://localhost:8000/api/health
```

**Response**:
```json
{
  "status": "ok",
  "version": "1.0.0",
  "timestamp": "2026-05-05T12:00:00Z"
}
```

---

## Testing

### Run All Tests

```bash
cd backend
pytest tests/ -v
```

### Run Chatbot-Specific Tests

```bash
cd backend
pytest tests/test_chatbot.py -v
pytest tests/test_agent_router.py -v
pytest tests/test_agent_tools.py -v
pytest tests/test_agent_repair.py -v
```

### Run with Coverage

```bash
cd backend
pytest tests/ --cov=backend --cov-report=term-missing
```

---

## Architecture Overview

```
backend/
├── main.py                      # Entry point (uvicorn)
├── app.py                       # FastAPI app factory
├── services/
│   ├── groq_client.py            # Groq async client
│   ├── profile_loader.py        # Load & cache asadshabir_all_info.md
│   ├── session_store.py         # In-memory session management
│   ├── guardrails.py            # Prompt injection, language detection
│   ├── agent_router.py          # Router agent + handoff logic
│   ├── agent_profile.py         # Profile specialist agent
│   ├── agent_projects.py        # Projects specialist agent
│   ├── agent_technical.py       # Technical specialist agent
│   ├── agent_fallback.py        # Fallback specialist agent
│   ├── agent_repair.py          # Repair/validation agent
│   ├── tools_profile.py         # get_profile_info tool
│   ├── tools_projects.py        # get_projects tool
│   └── tools_technical.py       # get_technical_skills tool
└── api/
    └── routes/
        ├── chatbot.py           # /api/chat, /api/chat/raw
        └── profile.py           # /api/profile
```

---

## Response Flow

1. **User sends message** → `/api/chat`
2. **Rate limit check** → 429 if exceeded
3. **Language detection** → en | ur | sd
4. **Session lookup** → Create if not exists
5. **Router agent** → Classify intent, hand off to specialist
6. **Specialist agent** → Generate draft using profile tools
7. **Repair agent** → Validate draft (IDENTITY, GROUNDING, TONE, LANGUAGE, SAFETY, OFF_TOPIC)
8. **Response** → Approved draft OR repaired draft OR fallback
9. **Session update** → Store last 10 messages, update last_active

---

## Troubleshooting

### "GROQ_API_KEY not set"

```bash
export GROQ_API_KEY=your_key_here
# Or add to .env file
```

### "Profile file not found"

Ensure `asadshabir_all_info.md` is in the project root, not inside `backend/`.

### "Rate limited"

Wait 600 seconds (10 minutes) or use a different IP. Check `_rate_store` in memory.

### "Model not found" error

Verify `MODEL_NAME=llama-3.3-70b-versatile` in environment or `.env`.

### "OpenAI Agents SDK import error"

Check the installed version:
```bash
pip show openai-agents
```

If not installed, install:
```bash
pip install openai-agents
```

---

## Frontend Integration

The API response format is portable and can be used by any frontend:

```typescript
// Example: React frontend integration
async function sendMessage(message: string, sessionId?: string) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [{ role: 'user', content: message }],
      session_id: sessionId,
    }),
  });
  return response.json();
}
```

---

## Performance Notes

- **Response time target**: <10s p95
- **Session store**: In-memory, 30-min TTL, auto-cleanup
- **Profile cache**: Loaded at startup, updated on file change (dev mode)
- **Rate limiting**: Per-IP, 10 requests/600s for `/api/chat`

---

*Quickstart created as part of `/sp.plan` Phase 1. For implementation, see `/sp.tasks 004-multiagent-chatbot`.*