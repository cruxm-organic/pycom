import os

from .base import AIProvider

_SUPPORTED = {"gemini", "claude", "openai"}


def get_provider() -> AIProvider:
    """Instantiate the configured provider. Reads AI_PROVIDER once per call so
    swapping providers only ever requires changing the environment, never code."""
    name = os.getenv("AI_PROVIDER", "gemini").strip().lower()
    if name not in _SUPPORTED:
        raise RuntimeError(f"Unsupported AI_PROVIDER '{name}'. Supported: {sorted(_SUPPORTED)}")

    if name == "gemini":
        from .gemini_provider import GeminiProvider

        return GeminiProvider()
    if name == "claude":
        from .claude_provider import ClaudeProvider

        return ClaudeProvider()
    from .openai_provider import OpenAIProvider

    return OpenAIProvider()
