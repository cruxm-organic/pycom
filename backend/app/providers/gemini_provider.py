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

    def chat(self, system_instruction: str, history: list[dict[str, str]]) -> str:
        try:
            contents = [{"role": m["role"], "parts": [{"text": m["text"]}]} for m in history]
            response = self._client.models.generate_content(
                model=self._model,
                contents=contents,
                config={"system_instruction": system_instruction, "temperature": 0.6},
            )
            return response.text or ""
        except Exception as exc:  # noqa: BLE001
            raise AIProviderError(f"Gemini chat failed: {exc}") from exc

    def text_to_speech(self, text: str) -> bytes:
        import base64

        from google.genai import types

        try:
            response = self._client.models.generate_content(
                model="gemini-2.5-flash-preview-tts",
                contents=[{"parts": [{"text": text}]}],
                config=types.GenerateContentConfig(
                    response_modalities=["AUDIO"],
                    speech_config=types.SpeechConfig(
                        voice_config=types.VoiceConfig(
                            prebuilt_voice_config=types.PrebuiltVoiceConfig(voice_name="Kore")
                        )
                    ),
                ),
            )
            b64_audio = response.candidates[0].content.parts[0].inline_data.data
            return base64.b64decode(b64_audio)
        except Exception as exc:  # noqa: BLE001
            raise AIProviderError(f"Gemini text_to_speech failed: {exc}") from exc
