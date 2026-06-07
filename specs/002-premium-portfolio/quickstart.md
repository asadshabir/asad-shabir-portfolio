# Quickstart: Premium Portfolio Website

**Branch**: `002-premium-portfolio` | **Date**: 2026-05-01

---

## Prerequisites

- Node.js 18+ (for frontend)
- Python 3.11+ (for backend)
- Git
- Resend account (resend.com) — for email
- Groq account (console.groq.com) — for chatbot LLM

---

## Setup

### 1. Clone & Install Frontend Dependencies

```bash
git clone <repo>
cd portfolio
npm install
```

### 2. Setup Backend

```bash
cd backend
python3 -m venv venv
# Activate venv: source venv/bin/activate  (mac/linux)
# Activate venv: venv\Scripts\activate    (windows)

pip install -r requirements.txt
```

### 3. Environment Variables

Create `.env` in `backend/`:
```env
# Resend (email)
RESEND_API_KEY=re_xxxxx
RESEND_FROM_EMAIL=contact@asadshabir.com
RESEND_TO_EMAIL=asadshabir505@gmail.com

# Groq (chatbot LLM)
GROQ_API_KEY=gsk_xxxxx

# Optional
RESEND_FROM_EMAIL_DOMAIN=resend.dev  # Use for testing without domain verification
```

Create `.env` in `frontend/` (if using Vite proxy for dev):
```env
VITE_API_BASE_URL=http://localhost:8000
```

### 4. Resume File

Place your resume PDF at:
```
public/
└── Asad_Shabir_Developer.pdf
```

Versioned copies (optional):
```
public/
└── resumes/
    └── v1.0-2026-05.pdf
```

---

## Development

### Run Frontend (Vite)

```bash
npm run dev
# Opens at http://localhost:5173
```

### Run Backend (FastAPI)

```bash
cd backend
uvicorn src.main:app --reload --port 8000
# API at http://localhost:8000
# Docs at http://localhost:8000/docs
```

### Vite Proxy (for dev)

The Vite config proxies `/api` to `http://localhost:8000`:
```typescript
// vite.config.ts
server: {
  proxy: {
    '/api': { target: 'http://localhost:8000', changeOrigin: true }
  }
}
```

---

## Testing

### Backend Tests (pytest)

```bash
cd backend
pytest tests/ -v
```

### Frontend Tests (Vitest)

```bash
npm run test
```

### E2E Tests (Playwright)

```bash
npx playwright test tests/e2e/
```

---

## Deployment

### Vercel (Recommended)

1. Connect repo to Vercel (vercel.com)
2. Add environment variables in Vercel dashboard:
   - `RESEND_API_KEY`
   - `RESEND_FROM_EMAIL`
   - `RESEND_TO_EMAIL`
   - `GROQ_API_KEY`
3. Deploy: Vercel auto-detects Vite frontend and Python backend

**Directory Structure for Vercel**:
```
frontend/     → Vite build (auto-detected)
api/
└── index.py  → FastAPI app (Python serverless)
```

### Manual Deploy (if needed)

```bash
# Frontend
npm run build
vercel deploy

# Backend
cd backend
pip install -r requirements.txt -t ./vendor
vercel deploy
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Module not found: fastapi" | Run `pip install -r requirements.txt` in backend/ |
| "RESEND_API_KEY not set" | Add to `.env` or Vercel dashboard environment variables |
| "Groq API error 401" | Verify `GROQ_API_KEY` is correct in environment |
| Resume 404 | Ensure `Asad_Shabir_Developer.pdf` is in `public/` directory |
| CORS errors | Check FastAPI `CORSMiddleware` allows frontend origin |

---

## File Structure Reference

```
.
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   └── services/
│   ├── public/
│   │   └── Asad_Shabir_Developer.pdf
│   └── package.json
├── backend/
│   ├── api/
│   │   ├── index.py       # FastAPI app entry
│   │   ├── contact.py     # Contact form endpoint
│   │   └── chat.py        # Chatbot endpoint
│   ├── services/
│   │   └── email.py       # Resend email service
│   ├── models/
│   │   └── schemas.py     # Pydantic models
│   ├── tests/
│   │   ├── test_contact.py
│   │   ├── test_chatbot.py
│   │   └── test_resume.py
│   ├── requirements.txt
│   └── main.py            # Alias to api/index.py
├── .env.example
└── README.md
```