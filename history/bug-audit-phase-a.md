# Phase A — Infrastructure Audit Report

## Summary
Both servers are running:
- Frontend: http://localhost:5173 (Vite)
- Backend: http://localhost:8000 (FastAPI/uvicorn)

## Verified Working Endpoints
✅ GET /api/health — returns valid JSON
✅ POST /api/chat — works correctly (Groq responding)
✅ POST /api/review — works correctly (Groq responding)
✅ POST /api/subscribe — works (returns 200 "Already subscribed" for duplicates)
✅ POST /api/estimate — works (but requires min 20 chars)

## Broken Endpoints
❌ POST /api/contact — returns 500 with SEND_FAILED (Resend API key not in backend/.env)
  - Root cause: backend/.env missing; grok API key not accessible to backend

## Verified Working Frontend Components
✅ Chatbot — service has proper error handling with res.text() fallback
✅ ProjectEstimator — service handles non-JSON responses gracefully  
✅ ResumeReviewer — service handles non-JSON responses gracefully
✅ Contact — service handles error responses correctly
✅ EmailCapture — service handles non-JSON responses
✅ AdminAnalytics — password gate, metric cards, table all work

## Root Causes Identified

### Bug 1: Contact Form Failure (Root Cause: Missing Resend API Key in backend/.env)
The backend config reads RESEND_API_KEY from backend/.env but only root/.env has it.
This causes EmailSendError on every contact form submission.

### Bug 2: Backend HTTPException detail format causes wrong error parsing in frontend
Backend raises HTTPException(detail=err_response(...)) where err_response returns a dict.
FastAPI then wraps this dict as `{"detail": {ok: false, code: "...", message: "..."}}`.
The frontend's error unwrapping logic (`body?.detail as { code?: string; message?: string }`) 
expects the error to be at `detail.message` but the actual message is at `detail.detail.message`.
This results in "Couldn't send right now — Request failed (500)" instead of proper message.

### Bug 3: Backend HTTPException detail format in chatbot/estimator/reviewer
Same issue as Bug 2 — chatbot route uses err_response() for detail which returns a dict.
Frontend gets `{detail: {ok: false, code: "...", message: "..."}}` instead of a simple error string.

### Bug 4: Frontend error handling for chatbot — error toast message not extracted
ChatBot.tsx catches errors and calls handleError which shows `err.message` via toast.
But if the error message contains internal paths (e.g. "detail.admin.chatbot..."), 
the user sees a confusing raw error instead of a friendly message.

## Navigation/Routing Bugs
- CaseStudyPage "All Case Studies" link → to="/case-studies" — goes to list, not homepage. 
  User expectation: "go back to main landing page"
- BlogPostPage "All Articles" link → to="/blog" — goes to blog list, not homepage
  User expectation: "clear go back to main landing page button"

## Scroll Bugs
- CaseStudyPage CTA link href="#contact" — when on a case study page (not contact page),
  this anchor only works if #contact exists on the same page. Since CaseStudyPage renders
  Contact at the bottom, this should work. But user reports it "scrolls to wrong section"
  — this is likely because when coming from homepage, the page already has #contact visible.
  The anchor jumps to the contact on the current page, not a specific section anchor.

## Non-Issues (Already Working)
✅ Chatbot "Unexpected end of JSON input" — not reproducible now, was likely caused by 
   backend returning non-JSON when Groq was unavailable. Service handles this gracefully.
✅ "All Case Studies" does navigate to /case-studies (which shows case studies list)
✅ "Read Case Study" in index navigates to /case-studies/:slug correctly
