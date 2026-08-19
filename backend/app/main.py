import os

from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .audit import log_request
from .providers.base import AIProviderError
from .providers.factory import get_provider
from .security import RateLimiter, validate_dilemma

app = FastAPI(title="PyCom API")

allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_methods=["GET"],
    allow_headers=["*"],
)

# 20 requests/minute per client is plenty for a quiz a real user is answering by hand,
# and cheap insurance against a script hammering the endpoint to burn API credits.
_limiter = RateLimiter(max_requests=20, window_seconds=60)

DILEMMA_SCHEMA = {
    "type": "object",
    "properties": {
        "problem": {"type": "string"},
        "options": {"type": "array", "items": {"type": "string"}},
        "answer": {"type": "string"},
        "explanation": {"type": "string"},
    },
    "required": ["problem", "options", "answer", "explanation"],
}

DILEMMA_PROMPT = (
    "Generate a new, unique Python data structure dilemma. Give a short real-world problem "
    "(1-2 sentences), four options from ['List', 'Tuple', 'Dictionary', 'Set'], the correct "
    "answer, and a one-sentence explanation. The problem must be distinct from generic examples."
)

MOCK_DILEMMA = {
    "problem": (
        "You need to store a collection of unique tags for a blog post, and the order doesn't "
        "matter. Which data structure is most efficient for checking if a tag already exists?"
    ),
    "options": ["List", "Tuple", "Dictionary", "Set"],
    "answer": "Set",
    "explanation": "Sets provide fast O(1) average time complexity for membership testing.",
}


def _client_key(request: Request) -> str:
    return request.client.host if request.client else "unknown"


@app.get("/api/health")
def health() -> dict:
    return {"status": "ok"}


@app.get("/api/dilemma")
def dilemma(request: Request):
    client_key = _client_key(request)
    provider_name = os.getenv("AI_PROVIDER", "gemini")

    if not _limiter.allow(client_key):
        log_request(client_key, "/api/dilemma", provider_name, "rate_limited")
        return JSONResponse(status_code=429, content={"detail": "Too many requests, slow down."})

    if not os.getenv("AI_API_KEY"):
        log_request(client_key, "/api/dilemma", provider_name, "mock_no_key")
        return MOCK_DILEMMA

    try:
        provider = get_provider()
        result = provider.generate_structured(DILEMMA_PROMPT, DILEMMA_SCHEMA)
    except AIProviderError as exc:
        log_request(client_key, "/api/dilemma", provider_name, "provider_error", str(exc))
        return MOCK_DILEMMA

    if not validate_dilemma(result):
        log_request(client_key, "/api/dilemma", provider_name, "invalid_response")
        return MOCK_DILEMMA

    log_request(client_key, "/api/dilemma", provider_name, "ok")
    return result
