from abc import ABC, abstractmethod
from typing import Any


class AIProvider(ABC):
    """Common interface every model provider must implement.

    Swapping providers is a config change (AI_PROVIDER env var), never a
    rewrite of application code. Application code only ever talks to this
    interface, never to a vendor SDK directly.
    """

    @abstractmethod
    def generate_structured(self, prompt: str, schema: dict[str, Any]) -> dict[str, Any]:
        """Generate JSON matching `schema` from `prompt`. Raises AIProviderError on failure."""
        raise NotImplementedError


class AIProviderError(Exception):
    """Raised when a provider fails to produce a valid structured response."""
