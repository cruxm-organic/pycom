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

    @abstractmethod
    def chat(self, system_instruction: str, history: list[dict[str, str]]) -> str:
        """Generate a chat reply given a system instruction and a role/text history.
        Raises AIProviderError on failure."""
        raise NotImplementedError

    def text_to_speech(self, text: str) -> bytes:
        """Generate speech audio (base64-decoded PCM bytes) from text. Not every provider
        supports this; the default raises so callers get a clear, immediate failure rather
        than a silent no-op."""
        raise NotImplementedError(f"{type(self).__name__} does not support text_to_speech")

    def generate_image(self, prompt: str, aspect_ratio: str) -> bytes:
        """Generate a JPEG image from a text prompt. Gemini-only capability today."""
        raise NotImplementedError(f"{type(self).__name__} does not support generate_image")

    def edit_image(self, prompt: str, image_bytes: bytes, mime_type: str) -> bytes:
        """Edit an existing image per a text instruction, returns PNG bytes. Gemini-only
        capability today."""
        raise NotImplementedError(f"{type(self).__name__} does not support edit_image")

    def generate_video(
        self, prompt: str, image_bytes: bytes | None, image_mime: str | None, aspect_ratio: str
    ) -> str:
        """Start an async video generation job. Returns an opaque operation id to poll with
        get_video_status. Gemini (Veo)-only capability today."""
        raise NotImplementedError(f"{type(self).__name__} does not support generate_video")

    def get_video_status(self, operation_id: str) -> tuple[bool, bytes | None]:
        """Poll a video generation job. Returns (done, video_bytes). video_bytes is None until
        done is True. The video is downloaded server-side, the API key never reaches the
        browser via a signed URL. Gemini (Veo)-only capability today."""
        raise NotImplementedError(f"{type(self).__name__} does not support get_video_status")

    def embed_text(self, texts: list[str]) -> list[list[float]]:
        """Return one embedding vector per input text, in order. Every provider supports
        text embeddings via some model, so this is provider-agnostic in principle, but only
        implemented for the currently configured provider to start."""
        raise NotImplementedError(f"{type(self).__name__} does not support embed_text")

    def grounded_search(self, prompt: str, search_type: str, lat: float | None, lng: float | None) -> tuple[str, list[dict]]:
        """Answer a prompt using live web or maps grounding. Returns (text, source_chunks).
        Gemini-only capability today, no equivalent grounding tool on Claude/OpenAI's base APIs."""
        raise NotImplementedError(f"{type(self).__name__} does not support grounded_search")

    @abstractmethod
    def analyze_image(self, image_bytes: bytes, mime_type: str, question: str) -> str:
        """Describe/answer a question about an image. Supported across providers with vision
        input (Gemini, Claude, OpenAI all qualify), so every provider must implement this one,
        unlike the Gemini-only capabilities above."""
        raise NotImplementedError


class AIProviderError(Exception):
    """Raised when a provider fails to produce a valid structured response."""
