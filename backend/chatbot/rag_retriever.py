"""
RAG Retriever — at query time, embeds the user question with Cohere,
searches Qdrant, and returns the most relevant knowledge chunks.
Designed to be called as a function_tool by the OpenAI Agents SDK.
"""
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


def _get_cohere() -> cohere.Client:
    global _co
    if _co is None:
        _co = cohere.Client(COHERE_API_KEY)
    return _co


def _get_qdrant() -> QdrantClient:
    global _qdrant
    if _qdrant is None:
        _qdrant = QdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY)
    return _qdrant


def retrieve_context(query: str, top_k: int = TOP_K, min_score: float = MIN_SCORE) -> str:
    """Embed the query, search Qdrant, return formatted context string.
    Returns empty string on any error (network, auth, etc.) — never throws."""
    if not query or not query.strip():
        return ""

    try:
        # Embed query
        co = _get_cohere()
        response = co.embed(
            texts=[query.strip()],
            model=COHERE_EMBED_MODEL,
            input_type="search_query",
            embedding_types=["float"],
        )
        query_vector = response.embeddings.float_[0]

        # Search Qdrant (v1.18.x uses query_points, not search)
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

        # Format results
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
        print(f"[RAG] Retrieval error: {type(e).__name__}: {str(e)[:120]}")
        return ""


def get_qdrant_stats() -> dict:
    """Return collection stats for health check / debugging."""
    qdrant = _get_qdrant()
    try:
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
