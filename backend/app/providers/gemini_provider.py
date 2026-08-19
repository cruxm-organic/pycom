import json
import os
from typing import Any

from .base import AIProvider, AIProviderError


class GeminiProvider(AIProvider):
    def __init__(self) -> None:
        api_key = os.getenv("AI_API_KEY")
        if not api_key:
            raise RuntimeError("AI_API_KEY is required when AI_PROVIDER=gemini")
        from google import genai

        self._client = genai.Client(api_key=api_key)
        self._model = os.getenv("AI_MODEL", "gemini-3.6-flash")

    def generate_structured(self, prompt: str, schema: dict[str, Any]) -> dict[str, Any]:
        try:
            response = self._client.models.generate_content(
                model=self._model,
                contents=prompt,
                config={
                    "response_mime_type": "application/json",
                    "response_schema": schema,
                    "temperature": 0.9,
                },
            )
            return json.loads(response.text.strip())
        except Exception as exc:  # noqa: BLE001 - normalize every provider failure the same way
            raise AIProviderError(f"Gemini generation failed: {exc}") from exc
