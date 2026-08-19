import time
from collections import defaultdict, deque
from threading import Lock


class RateLimiter:
    """Simple in-memory sliding window rate limiter, keyed by client identifier.

    Not a substitute for a shared limiter (Redis) once this runs on more than
    one process, but correct and dependency-free for a single-instance deployment.
    """

    def __init__(self, max_requests: int, window_seconds: int) -> None:
        self._max = max_requests
        self._window = window_seconds
        self._hits: dict[str, deque] = defaultdict(deque)
        self._lock = Lock()

    def allow(self, key: str) -> bool:
        now = time.monotonic()
        with self._lock:
            hits = self._hits[key]
            while hits and now - hits[0] > self._window:
                hits.popleft()
            if len(hits) >= self._max:
                return False
            hits.append(now)
            return True


def validate_dilemma(payload: dict) -> bool:
    """Reject anything that doesn't structurally match what the frontend expects,
    regardless of which provider produced it."""
    if not isinstance(payload, dict):
        return False
    required = {"problem", "options", "answer", "explanation"}
    if not required.issubset(payload.keys()):
        return False
    if not isinstance(payload["options"], list) or len(payload["options"]) != 4:
        return False
    if payload["answer"] not in payload["options"]:
        return False
    if not isinstance(payload["problem"], str) or not payload["problem"].strip():
        return False
    return True
