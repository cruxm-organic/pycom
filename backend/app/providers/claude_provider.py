import json
import os
from typing import Any

from .base import AIProvider, AIProviderError


class ClaudeProvider(AIProvider):
    def __init__(self) -> None:
        api_key = os.getenv("AI_API_KEY")
        if not api_key:
            raise RuntimeError("AI_API_KEY is required when AI_PROVIDER=claude")
        import anthropic

        self._client = anthropic.Anthropic(api_key=api_key)
        self._model = os.getenv("AI_MODEL", "claude-sonnet-5")

    def generate_structured(self, prompt: str, schema: dict[str, Any]) -> dict[str, Any]:
        try:
            instructions = (
                f"{prompt}\n\nRespond with ONLY a single JSON object matching this schema, "
                f"no prose, no markdown fences:\n{json.dumps(schema)}"
            )
            response = self._client.messages.create(
                model=self._model,
                max_tokens=1024,
                temperature=0.9,
                messages=[{"role": "user", "content": instructions}],
            )
            text = response.content[0].text.strip()
            if text.startswith("```"):
                text = text.strip("`").removeprefix("json").strip()
            return json.loads(text)
        except Exception as exc:  # noqa: BLE001
            raise AIProviderError(f"Claude generation failed: {exc}") from exc

    def chat(self, system_instruction: str, history: list[dict[str, str]]) -> str:
        try:
            messages = [
                {"role": "assistant" if m["role"] == "model" else "user", "content": m["text"]}
                for m in history
            ]
            response = self._client.messages.create(
                model=self._model,
                max_tokens=1024,
                temperature=0.6,
                system=system_instruction,
                messages=messages,
            )
            return response.content[0].text if response.content else ""
        except Exception as exc:  # noqa: BLE001
            raise AIProviderError(f"Claude chat failed: {exc}") from exc
