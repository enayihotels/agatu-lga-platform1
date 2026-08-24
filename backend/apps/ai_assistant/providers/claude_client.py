"""
Thin wrapper around the Anthropic SDK for the staff-only content
assistant tools. One function, reused by every tool in services.py --
keeps model choice, token limits, and error handling in one place.
"""
import anthropic
from django.conf import settings


class ClaudeError(Exception):
    pass


def complete(prompt: str, max_tokens: int = 400) -> str:
    if not settings.ANTHROPIC_API_KEY:
        raise ClaudeError(
            "Anthropic is not configured -- set ANTHROPIC_API_KEY in .env "
            "before using the AI content tools."
        )

    client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)
    try:
        msg = client.messages.create(
            model=settings.ANTHROPIC_MODEL,
            max_tokens=max_tokens,
            messages=[{"role": "user", "content": prompt}],
        )
    except anthropic.APIError as exc:
        raise ClaudeError(f"Claude request failed: {exc}") from exc

    return "".join(block.text for block in msg.content if block.type == "text").strip()
