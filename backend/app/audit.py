import hashlib
import json
import logging
import time
from pathlib import Path

_LOG_PATH = Path(__file__).resolve().parent.parent / "audit.log"

_logger = logging.getLogger("pycom.audit")
_logger.setLevel(logging.INFO)
_handler = logging.FileHandler(_LOG_PATH, encoding="utf-8")
_handler.setFormatter(logging.Formatter("%(message)s"))
_logger.addHandler(_handler)


def _hash_client(identifier: str) -> str:
    # Never store raw IPs; keep enough to correlate abuse without keeping PII.
    return hashlib.sha256(identifier.encode()).hexdigest()[:16]


def log_request(client_id: str, endpoint: str, provider: str, status: str, detail: str = "") -> None:
    entry = {
        "ts": time.time(),
        "client": _hash_client(client_id),
        "endpoint": endpoint,
        "provider": provider,
        "status": status,
        "detail": detail[:200],
    }
    _logger.info(json.dumps(entry))
