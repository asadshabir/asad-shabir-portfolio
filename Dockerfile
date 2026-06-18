# ──────────────────────────────────────────────────────────────────
# Asad Shabir Portfolio — HuggingFace Spaces Dockerfile
# Unifies Main API (estimator, reviewer, contact, etc.) and
# Chatbot API into a single container serving on port 7860.
# ──────────────────────────────────────────────────────────────────

FROM python:3.11-slim

WORKDIR /app

# Install system dependencies (build-essential for some pip packages)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy and install Python dependencies first (layer caching)
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Install additional deployment dependencies
RUN pip install --no-cache-dir \
    starlette==0.41.0 \
    uvicorn[standard]==0.34.0 \
    python-dotenv==1.0.1 \
    cohere>=5.0.0 \
    qdrant-client>=1.9.0

# Copy the entire backend package
COPY backend/ ./backend/

# Expose HuggingFace Spaces default port
EXPOSE 7860

# Run the composite app (routes /api/* to Main API, /chat to Chatbot)
CMD ["uvicorn", "backend.composite_app:app", "--host", "0.0.0.0", "--port", "7860"]
