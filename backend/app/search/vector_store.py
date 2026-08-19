"""Self-hosted vector store, SQLite for storage, cosine similarity for search.

This plays the same role pgvector would (a persistent, queryable vector index) without
needing a separate database server running. The schema is deliberately simple so migrating
to real pgvector later, if this ever needs to scale past a single-machine dev/demo index,
is a straightforward data export, not a rewrite.
"""

import json
import sqlite3
from pathlib import Path

import numpy as np

DB_PATH = Path(__file__).resolve().parent.parent.parent / "search_index.db"


def _get_conn() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS chunks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            url TEXT NOT NULL,
            title TEXT,
            chunk_text TEXT NOT NULL,
            embedding TEXT NOT NULL,
            indexed_at REAL NOT NULL
        )
        """
    )
    conn.execute("CREATE INDEX IF NOT EXISTS idx_chunks_url ON chunks(url)")
    return conn


def add_chunks(url: str, title: str, chunks: list[str], embeddings: list[list[float]], indexed_at: float) -> int:
    conn = _get_conn()
    try:
        conn.executemany(
            "INSERT INTO chunks (url, title, chunk_text, embedding, indexed_at) VALUES (?, ?, ?, ?, ?)",
            [(url, title, text, json.dumps(emb), indexed_at) for text, emb in zip(chunks, embeddings)],
        )
        conn.commit()
        return len(chunks)
    finally:
        conn.close()


def delete_url(url: str) -> None:
    """Remove previously indexed chunks for a URL before re-indexing it, avoids duplicate
    stale entries piling up every time the same page is crawled again."""
    conn = _get_conn()
    try:
        conn.execute("DELETE FROM chunks WHERE url = ?", (url,))
        conn.commit()
    finally:
        conn.close()


def search(query_embedding: list[float], top_k: int = 5) -> list[dict]:
    conn = _get_conn()
    try:
        rows = conn.execute("SELECT id, url, title, chunk_text, embedding FROM chunks").fetchall()
    finally:
        conn.close()

    if not rows:
        return []

    q = np.array(query_embedding, dtype=np.float32)
    q_norm = np.linalg.norm(q) or 1.0

    scored = []
    for row_id, url, title, chunk_text, embedding_json in rows:
        vec = np.array(json.loads(embedding_json), dtype=np.float32)
        vec_norm = np.linalg.norm(vec) or 1.0
        similarity = float(np.dot(q, vec) / (q_norm * vec_norm))
        scored.append({"id": row_id, "url": url, "title": title, "text": chunk_text, "score": similarity})

    scored.sort(key=lambda r: r["score"], reverse=True)
    return scored[:top_k]


def index_stats() -> dict:
    conn = _get_conn()
    try:
        total = conn.execute("SELECT COUNT(*) FROM chunks").fetchone()[0]
        urls = conn.execute("SELECT COUNT(DISTINCT url) FROM chunks").fetchone()[0]
        return {"chunks": total, "urls": urls}
    finally:
        conn.close()
