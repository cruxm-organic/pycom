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

        self._api_key = api_key
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

    def generate_image(self, prompt: str, aspect_ratio: str) -> bytes:
        import base64

        try:
            response = self._client.models.generate_images(
                model="imagen-4.0-generate-001",
                prompt=prompt,
                config={
                    "number_of_images": 1,
                    "output_mime_type": "image/jpeg",
                    "aspect_ratio": aspect_ratio,
                },
            )
            image_bytes = response.generated_images[0].image.image_bytes
            # SDK may return raw bytes or a base64 str depending on version; normalize.
            if isinstance(image_bytes, str):
                return base64.b64decode(image_bytes)
            return image_bytes
        except Exception as exc:  # noqa: BLE001
            raise AIProviderError(f"Gemini generate_image failed: {exc}") from exc

    def edit_image(self, prompt: str, image_bytes: bytes, mime_type: str) -> bytes:
        import base64

        try:
            response = self._client.models.generate_content(
                model="gemini-2.5-flash-image",
                contents={
                    "parts": [
                        {"inline_data": {"data": base64.b64encode(image_bytes).decode(), "mime_type": mime_type}},
                        {"text": prompt},
                    ]
                },
                config={"response_modalities": ["IMAGE"]},
            )
            for part in response.candidates[0].content.parts:
                if part.inline_data:
                    return base64.b64decode(part.inline_data.data)
            raise AIProviderError("No image was returned from the edit operation.")
        except AIProviderError:
            raise
        except Exception as exc:  # noqa: BLE001
            raise AIProviderError(f"Gemini edit_image failed: {exc}") from exc

    def analyze_image(self, image_bytes: bytes, mime_type: str, question: str) -> str:
        import base64

        try:
            response = self._client.models.generate_content(
                model=self._model,
                contents={
                    "parts": [
                        {"inline_data": {"data": base64.b64encode(image_bytes).decode(), "mime_type": mime_type}},
                        {"text": question or "Describe this image in detail."},
                    ]
                },
            )
            return response.text or ""
        except Exception as exc:  # noqa: BLE001
            raise AIProviderError(f"Gemini analyze_image failed: {exc}") from exc

    def generate_video(self, prompt: str, image_bytes: bytes | None, image_mime: str | None, aspect_ratio: str) -> str:
        try:
            kwargs: dict = {
                "model": "veo-3.1-fast-generate-preview",
                "prompt": prompt,
                "config": {"number_of_videos": 1, "resolution": "720p", "aspect_ratio": aspect_ratio},
            }
            if image_bytes and image_mime:
                import base64

                kwargs["image"] = {
                    "image_bytes": base64.b64encode(image_bytes).decode(),
                    "mime_type": image_mime,
                }
            operation = self._client.models.generate_videos(**kwargs)
            if not operation.name:
                raise AIProviderError("Video operation was started but returned no tracking id.")
            return operation.name
        except AIProviderError:
            raise
        except Exception as exc:  # noqa: BLE001
            raise AIProviderError(f"Gemini generate_video failed: {exc}") from exc

    def get_video_status(self, operation_id: str) -> tuple[bool, bytes | None]:
        try:
            operation = self._client.operations.get(name=operation_id)
            if not operation.done:
                return False, None

            generated = getattr(operation.response, "generated_videos", None) if operation.response else None
            uri = generated[0].video.uri if generated else None
            if not uri:
                raise AIProviderError("Video generation finished, but no video URI was found.")

            # Fetch the video ourselves so the signed URL + API key never goes to the browser.
            import urllib.request

            sep = "&" if "?" in uri else "?"
            req = urllib.request.Request(f"{uri}{sep}key={self._api_key}")
            with urllib.request.urlopen(req, timeout=60) as resp:
                return True, resp.read()
        except AIProviderError:
            raise
        except Exception as exc:  # noqa: BLE001
            raise AIProviderError(f"Gemini get_video_status failed: {exc}") from exc

    def grounded_search(self, prompt: str, search_type: str, lat: float | None, lng: float | None):
        try:
            config: dict = {
                "tools": [{"google_search": {}}] if search_type == "web" else [{"google_maps": {}}]
            }
            if search_type == "maps" and lat is not None and lng is not None:
                config["tool_config"] = {
                    "retrieval_config": {"lat_lng": {"latitude": lat, "longitude": lng}}
                }

            response = self._client.models.generate_content(
                model=self._model,
                contents=prompt,
                config=config,
            )
            chunks_raw = getattr(response.candidates[0], "grounding_metadata", None)
            chunks_raw = getattr(chunks_raw, "grounding_chunks", None) or []
            chunks = []
            for c in chunks_raw:
                web = getattr(c, "web", None)
                maps = getattr(c, "maps", None)
                chunks.append({
                    "web": {"uri": web.uri, "title": web.title} if web else None,
                    "maps": {"uri": maps.uri, "title": maps.title} if maps else None,
                })
            return response.text or "", chunks
        except Exception as exc:  # noqa: BLE001
            raise AIProviderError(f"Gemini grounded_search failed: {exc}") from exc

    def embed_text(self, texts: list[str]) -> list[list[float]]:
        try:
            response = self._client.models.embed_content(
                model="gemini-embedding-001",
                contents=texts,
            )
            return [e.values for e in response.embeddings]
        except Exception as exc:  # noqa: BLE001
            raise AIProviderError(f"Gemini embed_text failed: {exc}") from exc
