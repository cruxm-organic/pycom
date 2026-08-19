"""Crawl-on-demand fetcher: given a URL a user explicitly submits, fetch it, respecting
robots.txt, and extract readable text for indexing.

This is deliberately NOT a general-purpose web crawler that discovers and follows links on
its own. It only ever fetches URLs a user explicitly gives it, one request per call, with a
per-host rate limit. That keeps this from becoming a tool that can be pointed at a site and
used to hammer it.
"""

import time
import urllib.error
import urllib.request
from urllib.parse import urlparse
from urllib.robotparser import RobotFileParser

from bs4 import BeautifulSoup

USER_AGENT = "PyComSearchBot/1.0 (+https://pycom.example/bot)"
MAX_CONTENT_BYTES = 3_000_000  # 3MB cap, plenty for an article, guards against huge downloads
FETCH_TIMEOUT = 10

_last_fetch_by_host: dict[str, float] = {}
MIN_SECONDS_BETWEEN_FETCHES_PER_HOST = 2.0


class CrawlError(Exception):
    pass


def _check_robots_allowed(url: str) -> bool:
    parsed = urlparse(url)
    robots_url = f"{parsed.scheme}://{parsed.netloc}/robots.txt"
    parser = RobotFileParser()
    parser.set_url(robots_url)
    try:
        parser.read()
    except Exception:  # noqa: BLE001
        # If robots.txt is unreachable, err toward not blocking on that alone, most sites
        # allow crawling by default when they don't publish a robots.txt at all.
        return True
    return parser.can_fetch(USER_AGENT, url)


def _rate_limit_host(url: str) -> None:
    host = urlparse(url).netloc
    now = time.monotonic()
    last = _last_fetch_by_host.get(host, 0)
    wait = MIN_SECONDS_BETWEEN_FETCHES_PER_HOST - (now - last)
    if wait > 0:
        time.sleep(wait)
    _last_fetch_by_host[host] = time.monotonic()


def fetch_and_extract(url: str) -> dict:
    """Returns {"title": str, "text": str}. Raises CrawlError on any failure, including
    robots.txt disallowing this URL."""
    parsed = urlparse(url)
    if parsed.scheme not in ("http", "https") or not parsed.netloc:
        raise CrawlError("Only http(s) URLs are supported.")

    if not _check_robots_allowed(url):
        raise CrawlError("This site's robots.txt disallows crawling this URL.")

    _rate_limit_host(url)

    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    try:
        with urllib.request.urlopen(req, timeout=FETCH_TIMEOUT) as resp:
            content_type = resp.headers.get("Content-Type", "")
            if "text/html" not in content_type and "text" not in content_type:
                raise CrawlError(f"Unsupported content type: {content_type}")
            raw = resp.read(MAX_CONTENT_BYTES)
    except urllib.error.HTTPError as exc:
        raise CrawlError(f"Fetch failed with HTTP {exc.code}") from exc
    except urllib.error.URLError as exc:
        raise CrawlError(f"Could not reach that URL: {exc.reason}") from exc

    soup = BeautifulSoup(raw, "html.parser")
    for tag in soup(["script", "style", "nav", "footer", "header", "noscript"]):
        tag.decompose()

    title = soup.title.string.strip() if soup.title and soup.title.string else url
    text = " ".join(soup.get_text(separator=" ").split())

    if not text:
        raise CrawlError("No readable text content found on that page.")

    return {"title": title, "text": text}


def chunk_text(text: str, chunk_size: int = 1200, overlap: int = 150) -> list[str]:
    """Split into overlapping character chunks, simple and good enough for article-length
    content; overlap keeps ideas from being cut in half at chunk boundaries."""
    if len(text) <= chunk_size:
        return [text]
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunks.append(text[start:end])
        start = end - overlap
    return chunks
