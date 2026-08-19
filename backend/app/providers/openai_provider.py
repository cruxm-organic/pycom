import json
import os
from typing import Any

from .base import AIProvider, AIProviderError


class OpenAIProvider(AIProvider):
    def __init__(self) -> None:
        api_key = os.getenv("AI_API_KEY")
        if not api_key:
            raise RuntimeError("AI_API_KEY is required when AI_PROVIDER=openai")
        from openai import OpenAI

        self._client = OpenAI(api_key=api_key)
        self._model = os.getenv("AI_MODEL", "gpt-4o-mini")

    def generate_structured(self, prompt: str, schema: dict[str, Any]) -> dict[str, Any]:
        try:
            response = self._client.chat.completions.create(
                model=self._model,
                temperature=0.9,
                messages=[{"role": "user", "content": prompt}],
                response_format={
                    "type": "json_schema",
                    "json_schema": {"name": "dilemma", "schema": schema, "strict": True},
                },
            )
            return json.loads(response.choices[0].message.content)
        except Exception as exc:  # noqa: BLE001
            raise AIProviderError(f"OpenAI generation failed: {exc}") from exc

    def chat(self, system_instruction: str, history: list[dict[str, str]]) -> str:
        try:
            messages = [{"role": "system", "content": system_instruction}]
            messages += [
                {"role": "assistant" if m["role"] == "model" else "user", "content": m["text"]}
                for m in history
            ]
            response = self._client.chat.completions.create(
                model=self._model,
                temperature=0.6,
                messages=messages,
            )
            return response.choices[0].message.content or ""
        except Exception as exc:  # noqa: BLE001
            raise AIProviderError(f"OpenAI chat failed: {exc}") from exc
