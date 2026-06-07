---
title: "FastAPI + React: Building Modern Full-Stack Applications"
description: "A practical guide to combining FastAPI's async power with React's reactive UI, including best practices for API design, type safety, and performance optimization."
date: "2026-02-28"
tags: ["FastAPI", "React", "TypeScript", "Python", "Full-Stack"]
slug: "fastapi-react-fullstack-guide"
cover_image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80"
---

## Why FastAPI + React?

FastAPI and React are a natural pair:

- **FastAPI**: Python async framework with automatic OpenAPI docs, type validation via Pydantic, and native support for streaming responses.
- **React**: Component-based UI with hooks, concurrent features, and a massive ecosystem.

Together, they enable fast development without sacrificing production quality.

## Project Structure

```
project/
├── backend/
│   ├── api/
│   │   ├── routes/
│   │   ├── schemas/
│   │   └── index.py
│   ├── services/
│   └── main.py
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── lib/
    │   └── pages/
    └── vite.config.ts
```

## Backend: Pydantic Models as Contracts

FastAPI uses Pydantic for request/response validation. Define schemas that serve as both documentation and validation:

```python
from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
from datetime import datetime

class ProjectRequest(BaseModel):
    title: str = Field(..., min_length=3, max_length=200)
    description: str = Field(..., min_length=50, max_length=5000)
    email: EmailStr
    budget_range: str = Field(..., pattern=r"^\$[\d,]+-\$[\d,]+$")
    timeline: str
    
    @field_validator("budget_range")
    @classmethod
    def validate_budget(cls, v: str) -> str:
        parts = v.replace("$", "").split("-")
        low, high = int(parts[0].replace(",", "")), int(parts[1].replace(",", ""))
        if low >= high:
            raise ValueError("Minimum must be less than maximum")
        return v

class ProjectResponse(BaseModel):
    id: str
    estimated_complexity: str
    created_at: datetime
    message: str
```

## Frontend: Type-Safe API Client

Generate TypeScript types from Python schemas and build a type-safe client:

```typescript
// Generated from Pydantic schemas
interface ProjectRequest {
  title: string;
  description: string;
  email: string;
  budget_range: string;
  timeline: string;
}

interface ProjectResponse {
  id: string;
  estimated_complexity: string;
  created_at: string;
  message: string;
}

// Type-safe API client
export async function submitProject(data: ProjectRequest): Promise<ProjectResponse> {
  const res = await fetch("/api/projects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "Submission failed");
  }
  
  return res.json();
}
```

## Streaming Responses

One of FastAPI's superpowers is streaming. For long operations:

```python
from fastapi import APIRouter
from fastapi.responses import StreamingResponse

router = APIRouter()

@router.post("/estimate-stream")
async def estimate_stream(request: ProjectRequest):
    async def generate():
        # Simulate streaming response
        for step in ["Analyzing requirements...", "Calculating complexity...", "Finalizing..."]:
            yield f"data: {step}\n\n"
            await asyncio.sleep(0.5)
        yield f"data: Estimated cost: ${random.randint(5000, 50000)}\n\n"
    
    return StreamingResponse(
        generate(),
        media_type="text/event-stream"
    )
```

## Performance Tips

### Backend

1. **Use async everywhere**: `async def` with async DB drivers (asyncpg, aiomysql)
2. **Connection pooling**: Reuse connections across requests
3. **Background tasks**: Move heavy work to Celery or similar

### Frontend

1. **Code splitting**: Lazy load pages and heavy components
2. **React Query**: Cache API responses, handle retries automatically
3. **Optimistic updates**: Update UI before server confirms

## Deployment

For Vercel + FastAPI on Railway/Fly.io:

```
# backend/Dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "$PORT"]
```

## Conclusion

FastAPI + React is my go-to stack for production applications. The type safety across the stack reduces bugs, the DX is excellent, and the performance is production-grade from day one.

Key practices: define schemas first, use async throughout, handle errors gracefully, and always optimize for the user's experience.
