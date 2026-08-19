"""WebSocket relay for Gemini's real-time voice API.

The browser never talks to Gemini directly and never sees the API key. It connects to this
relay instead; the relay holds the one real connection to Gemini server-side using the
server's key, and shuttles audio both directions. This is the only way to keep a real-time
bidirectional voice feature secure, a plain REST proxy can't do this, the connection has to
stay open and multiplex both directions concurrently.
"""

import asyncio
import base64
import json
import os
import time

from fastapi import WebSocket, WebSocketDisconnect

MAX_CONCURRENT_SESSIONS = 5
MAX_SESSION_SECONDS = 5 * 60  # hard cap per session, this is the most expensive feature in the app

_active_sessions = 0
_sessions_lock = asyncio.Lock()


async def handle_live_chat(ws: WebSocket) -> None:
    global _active_sessions

    # WebSocket handshakes bypass CORS entirely (browsers don't send preflight for them), so
    # the origin check has to happen explicitly here, otherwise any site could open a socket
    # to this relay and burn through the server's API quota.
    allowed_origins = {o.strip() for o in os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")}
    origin = ws.headers.get("origin", "")
    if origin not in allowed_origins:
        await ws.close(code=4403)
        return

    await ws.accept()

    if not os.getenv("AI_API_KEY") or os.getenv("AI_PROVIDER", "gemini") != "gemini":
        await ws.send_json({"type": "error", "message": "Live chat requires Gemini to be configured."})
        await ws.close()
        return

    async with _sessions_lock:
        if _active_sessions >= MAX_CONCURRENT_SESSIONS:
            await ws.send_json({"type": "error", "message": "Live chat is at capacity, try again shortly."})
            await ws.close()
            return
        _active_sessions += 1

    try:
        await _run_session(ws)
    finally:
        async with _sessions_lock:
            _active_sessions -= 1


async def _run_session(ws: WebSocket) -> None:
    from google import genai
    from google.genai import types

    client = genai.Client(api_key=os.getenv("AI_API_KEY"))
    config = types.LiveConnectConfig(
        response_modalities=["AUDIO"],
        speech_config=types.SpeechConfig(
            voice_config=types.VoiceConfig(prebuilt_voice_config=types.PrebuiltVoiceConfig(voice_name="Zephyr"))
        ),
    )

    start_time = time.monotonic()

    try:
        async with client.aio.live.connect(model="gemini-2.5-flash-native-audio-preview-09-2025", config=config) as session:
            await ws.send_json({"type": "ready"})

            async def pump_client_to_gemini() -> None:
                while True:
                    if time.monotonic() - start_time > MAX_SESSION_SECONDS:
                        await ws.send_json({"type": "error", "message": "Session time limit reached."})
                        break
                    raw = await ws.receive_text()
                    msg = json.loads(raw)
                    if msg.get("type") == "audio":
                        pcm_bytes = base64.b64decode(msg["data"])
                        await session.send_realtime_input(
                            media={"data": pcm_bytes, "mime_type": msg.get("mimeType", "audio/pcm;rate=16000")}
                        )
                    elif msg.get("type") == "close":
                        break

            async def pump_gemini_to_client() -> None:
                async for message in session.receive():
                    server_content = getattr(message, "server_content", None)
                    if server_content is None:
                        continue
                    model_turn = getattr(server_content, "model_turn", None)
                    if model_turn and model_turn.parts:
                        for part in model_turn.parts:
                            inline = getattr(part, "inline_data", None)
                            if inline and inline.data:
                                await ws.send_json({
                                    "type": "audio",
                                    "data": base64.b64encode(inline.data).decode(),
                                })
                    if getattr(server_content, "interrupted", False):
                        await ws.send_json({"type": "interrupted"})

            client_task = asyncio.create_task(pump_client_to_gemini())
            gemini_task = asyncio.create_task(pump_gemini_to_client())
            done, pending = await asyncio.wait(
                {client_task, gemini_task}, return_when=asyncio.FIRST_COMPLETED
            )
            for task in pending:
                task.cancel()

    except WebSocketDisconnect:
        pass
    except Exception as exc:  # noqa: BLE001
        try:
            await ws.send_json({"type": "error", "message": f"Live session error: {exc}"})
        except Exception:  # noqa: BLE001
            pass
    finally:
        try:
            await ws.close()
        except Exception:  # noqa: BLE001
            pass
