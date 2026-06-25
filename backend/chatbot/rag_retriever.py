"""
RAG Retriever — at query time, embeds the user question with Cohere,
searches Qdrant, and returns the most relevant knowledge chunks.
Designed to be called as a function_tool by the OpenAI Agents SDK.

Automatically falls back to in-memory Qdrant if cloud is unreachable,
and populates the index on first use.
"""
import logging
import os
from typing import Optional

import cohere
from qdrant_client import QdrantClient
from qdrant_client.http import models

from backend.chatbot.rag_config import (
    COHERE_API_KEY, COHERE_EMBED_MODEL,
    QDRANT_URL, QDRANT_API_KEY, QDRANT_COLLECTION,
    TOP_K, MIN_SCORE,
)

# Lazy-init (cache across calls)
_co: Optional[cohere.Client] = None
_qdrant: Optional[QdrantClient] = None

logger = logging.getLogger(__name__)


def _get_cohere() -> cohere.Client:
    global _co
    if _co is None:
        # Read .env directly to ensure we have the key regardless of when rag_config was imported
        api_key = COHERE_API_KEY
        if not api_key:
            from dotenv import load_dotenv
            from pathlib import Path
            _dot_path = Path(__file__).resolve().parent.parent.parent / '.env'
            load_dotenv(dotenv_path=_dot_path, override=True)
            api_key = os.getenv("COHERE_API_KEY", "")
        if not api_key:
            raise ValueError("COHERE_API_KEY is not set in environment")
        _co = cohere.Client(api_key=api_key)
    return _co


def _get_qdrant() -> QdrantClient:
    global _qdrant
    if _qdrant is None:
        # Try cloud first
        cloud_ok = False
        if QDRANT_URL and QDRANT_API_KEY:
            try:
                _qdrant = QdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY, timeout=5)
                _qdrant.get_collections()
                cloud_ok = True
                logger.info("Connected to Qdrant cloud")
            except Exception:
                _qdrant = None
                logger.warning("Qdrant cloud unreachable, switching to in-memory")

        if not cloud_ok:
            logger.info("Creating in-memory Qdrant instance")
            # Must clear env vars so Qdrant doesn't create HTTP client with stale Bearer
            old_key = os.environ.pop("QDRANT_API_KEY", None)
            old_url = os.environ.pop("QDRANT_URL", None)
            try:
                _qdrant = QdrantClient(location=":memory:")
                _auto_populate_index()
            finally:
                if old_key is not None:
                    os.environ["QDRANT_API_KEY"] = old_key
                if old_url is not None:
                    os.environ["QDRANT_URL"] = old_url

    return _qdrant


def _auto_populate_index():
    """Populate the in-memory Qdrant index with portfolio knowledge."""
    import sys
    from pathlib import Path

    # Import chunks builder directly (not through indexer to avoid env var conflicts)
    sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))
    from backend.chatbot.rag_indexer import build_chunks

    chunks = build_chunks()
    co = _get_cohere()

    # Check if collection already has data
    try:
        collections = [c.name for c in _qdrant.get_collections().collections]
        if QDRANT_COLLECTION in collections:
            count = _qdrant.count(collection_name=QDRANT_COLLECTION).count
            if count > 0:
                logger.info("RAG index already populated (%d chunks)", count)
                return
    except Exception:
        pass

    # Create collection
    _qdrant.recreate_collection(
        collection_name=QDRANT_COLLECTION,
        vectors_config=models.VectorParams(
            size=1024,
            distance=models.Distance.COSINE,
        ),
    )

    # Embed in batches to avoid rate limits
    texts = [chunk["content"] for chunk in chunks]
    batch_size = 20
    all_embeddings = []
    logger.info("Embedding %d chunks with Cohere...", len(texts))

    for i in range(0, len(texts), batch_size):
        batch = texts[i:i + batch_size]
        response = co.embed(
            texts=batch,
            model=COHERE_EMBED_MODEL,
            input_type="search_document",
            embedding_types=["float"],
        )
        all_embeddings.extend(response.embeddings.float_)

    # Upsert
    points = []
    for i, chunk in enumerate(chunks):
        points.append(models.PointStruct(
            id=i,
            vector=all_embeddings[i],
            payload={
                "id": chunk["id"],
                "title": chunk["title"],
                "category": chunk["category"],
                "tags": chunk["tags"],
                "content": chunk["content"],
            },
        ))

    _qdrant.upsert(collection_name=QDRANT_COLLECTION, points=points, wait=True)
    count = _qdrant.count(collection_name=QDRANT_COLLECTION).count
    logger.info("RAG index populated: %d chunks", count)


def retrieve_context(query: str, top_k: int = TOP_K, min_score: float = MIN_SCORE) -> str:
    """Embed the query, search Qdrant, return formatted context string.
    Returns empty string on any error (network, auth, etc.) — never throws."""
    if not query or not query.strip():
        return ""

    try:
        co = _get_cohere()
        response = co.embed(
            texts=[query.strip()],
            model=COHERE_EMBED_MODEL,
            input_type="search_query",
            embedding_types=["float"],
        )
        query_vector = response.embeddings.float_[0]

        qdrant = _get_qdrant()
        search_result = qdrant.query_points(
            collection_name=QDRANT_COLLECTION,
            query=query_vector,
            limit=top_k,
            score_threshold=min_score,
        )

        points = search_result.points if hasattr(search_result, 'points') else []
        if not points:
            return ""

        sections = []
        for i, hit in enumerate(points, 1):
            payload = hit.payload or {}
            score = hit.score
            title = payload.get("title", "Untitled")
            content = payload.get("content", "")
            category = payload.get("category", "")

            sections.append(
                f"[{i}] {title} (relevance: {score:.2f})\n"
                f"Category: {category}\n"
                f"{content}\n"
            )

        return "\n---\n".join(sections)
    except Exception as e:
        logger.warning("Retrieval error: %s: %s", type(e).__name__, str(e)[:120])
        return ""


def get_qdrant_stats() -> dict:
    """Return collection stats for health check / debugging."""
    try:
        qdrant = _get_qdrant()
        count_result = qdrant.count(collection_name=QDRANT_COLLECTION)
        return {
            "status": "connected",
            "points_count": count_result.count,
        }
    except Exception as e:
        return {
            "status": "error",
            "error": str(e),
        }
