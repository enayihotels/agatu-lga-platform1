"""
Thin wrapper around a local Ollama instance for the public "Ask
AgatuConnect" widget. Deliberately simple HTTP calls -- one model, one
endpoint, one job: answer strictly from what's already been retrieved
and handed to it in the prompt, nothing more.
"""
import httpx
from django.conf import settings


class OllamaError(Exception):
    pass


def generate(prompt: str, timeout: float = 30.0) -> str:
    """
    Calls Ollama's /api/generate with streaming disabled -- the
    simplest integration for a synchronous request/response Q&A widget.
    """
    url = f"{settings.OLLAMA_BASE_URL.rstrip('/')}/api/generate"
    payload = {
        "model": settings.OLLAMA_MODEL,
        "prompt": prompt,
        "stream": False,
    }
    try:
        response = httpx.post(url, json=payload, timeout=timeout)
        response.raise_for_status()
    except httpx.HTTPError as exc:
        raise OllamaError(f"Ollama request failed: {exc}") from exc

    data = response.json()
    return data.get("response", "").strip()
