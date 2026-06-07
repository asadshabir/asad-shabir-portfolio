"""
RAG Configuration — single source of truth for vector DB connection
and embedding parameters.
"""
import os

# ── Cohere (Embedding) ──────────────────────────────────
COHERE_API_KEY = os.getenv("COHERE_API_KEY", "")
COHERE_EMBED_MODEL = "embed-multilingual-v3.0"
COHERE_EMBED_DIMS = 1024

# ── Qdrant (Vector DB) ──────────────────────────────────
QDRANT_URL = os.getenv("QDRANT_URL", "https://c16ca3ad-9eaf-4492-b980-47049b3b57ae.us-west-1-0.aws.cloud.qdrant.io:6333")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY", "")
QDRANT_COLLECTION = "asad_portfolio_kb"

# ── Retrieval settings ──────────────────────────────────
TOP_K = 6
MIN_SCORE = 0.42
