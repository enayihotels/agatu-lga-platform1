"""
Grounded-retrieval logic for the public "Ask AgatuConnect" widget, and
the staff-only Claude content tools. Kept in one services module (not
spread across views) so the retrieval/prompt-building logic is testable
and reusable independent of the HTTP layer.
"""
from django.db.models import Q

from apps.history.models import CultureEntry, HistoricalEvent, Leader
from apps.news.models import NewsFlash, NewsPost

from .providers.claude_client import complete as claude_complete
from .providers.ollama_client import generate as ollama_generate

MAX_SOURCES = 6


def _search_agatu_content(query: str):
    """
    Simple keyword retrieval across history/culture/news -- deliberately
    not a vector search. Fine at Agatu's content scale today; swap for
    pgvector similarity later if the content library grows large enough
    that keyword matching starts missing relevant results.
    """
    sources = []

    leaders = Leader.objects.filter(
        Q(full_name__icontains=query)
        | Q(biography__icontains=query)
        | Q(achievements__icontains=query)
    )[:MAX_SOURCES]
    for leader in leaders:
        sources.append(
            {"type": "leader", "title": f"{leader.full_name} ({leader.title})", "text": leader.biography}
        )

    events = HistoricalEvent.objects.filter(
        Q(title__icontains=query) | Q(summary__icontains=query)
    )[:MAX_SOURCES]
    for event in events:
        sources.append(
            {"type": "historical_event", "title": f"{event.year} — {event.title}", "text": event.summary}
        )

    culture = CultureEntry.objects.filter(
        Q(title__icontains=query) | Q(local_text__icontains=query) | Q(english_meaning__icontains=query)
    )[:MAX_SOURCES]
    for entry in culture:
        sources.append({"type": "culture", "title": entry.title, "text": entry.english_meaning})

    posts = NewsPost.objects.filter(is_published=True).filter(
        Q(title__icontains=query) | Q(body__icontains=query)
    )[:MAX_SOURCES]
    for post in posts:
        sources.append(
            {"type": "news", "title": post.title, "text": post.excerpt or post.body[:300]}
        )

    flashes = NewsFlash.objects.filter(is_active=True).filter(headline__icontains=query)[:MAX_SOURCES]
    for flash in flashes:
        sources.append({"type": "news_flash", "title": flash.headline, "text": flash.headline})

    return sources[:MAX_SOURCES]


def answer_public_question(question: str) -> dict:
    """
    Retrieves relevant Agatu content, builds a grounded prompt, and asks
    Ollama to answer strictly from that content -- never from open
    internet knowledge, so it doesn't hallucinate facts about Agatu.
    """
    sources = _search_agatu_content(question)

    if not sources:
        return {
            "answer": (
                "I don't have published information about that yet. "
                "Try asking about Agatu's leaders, culture, wards, or recent news."
            ),
            "sources": [],
        }

    context_block = "\n\n".join(f"[{s['type']}] {s['title']}: {s['text']}" for s in sources)
    prompt = (
        "You are AgatuConnect, an assistant for Agatu Local Government Area, Benue State, "
        "Nigeria. Answer the question using ONLY the context below. If the context doesn't "
        "contain the answer, say you don't have that information yet -- do not guess or use "
        "outside knowledge.\n\n"
        f"Context:\n{context_block}\n\n"
        f"Question: {question}\n\nAnswer:"
    )

    answer = ollama_generate(prompt)
    return {
        "answer": answer,
        "sources": [{"type": s["type"], "title": s["title"]} for s in sources],
    }


# --- Claude-powered staff content tools ---
# Every tool operates only on content the admin controls and publishes
# about Agatu -- none of this is a generic chatbot bolted on.

def draft_news_flash(raw_notes: str) -> str:
    prompt = (
        "Turn these field notes into a short, publish-ready local government "
        f"news item for Agatu LGA (2-4 sentences, plain factual tone):\n{raw_notes}"
    )
    return claude_complete(prompt, max_tokens=400)


def structure_history_entry(raw_notes: str) -> str:
    prompt = (
        "Convert these unstructured notes about Agatu LGA history/culture into a "
        "structured entry. Return plain text with clear labeled fields: Title, "
        "Category (leader/festival/proverb/folklore/event), Date/Year (if known), "
        "Summary (2-4 sentences). Do not invent facts not present in the notes.\n\n"
        f"Notes:\n{raw_notes}"
    )
    return claude_complete(prompt, max_tokens=500)


def summarize_daily_reports(report_summaries: list) -> str:
    joined = "\n".join(f"- {s}" for s in report_summaries)
    prompt = (
        "Here are today's citizen infrastructure reports for Agatu LGA. Write a "
        "short digest (3-6 sentences) highlighting which wards or issue categories "
        "are trending and anything that looks urgent:\n\n"
        f"{joined}"
    )
    return claude_complete(prompt, max_tokens=400)


def draft_alert_copy(situation_facts: str) -> str:
    prompt = (
        "Given these raw facts about an emergency situation in Agatu LGA, write two "
        "things:\n1) An SMS alert under 160 characters, calm and clear, telling "
        "residents what's happening and what to do.\n2) A longer in-app version "
        "(3-5 sentences) with more detail.\nLabel them 'SMS:' and 'In-app:'.\n\n"
        f"Facts:\n{situation_facts}"
    )
    return claude_complete(prompt, max_tokens=400)


def review_diaspora_contribution(contribution_text: str) -> str:
    prompt = (
        "A diaspora member submitted this historical contribution about Agatu LGA "
        "for moderation review. Write a short summary (2-3 sentences) and flag "
        "anything that looks like it needs fact-checking or is potentially "
        "inaccurate. Do not approve or reject -- that decision stays with the "
        "human moderator.\n\n"
        f"Submission:\n{contribution_text}"
    )
    return claude_complete(prompt, max_tokens=350)


def qa_culture_entry(entry_text: str) -> str:
    prompt = (
        "Proofread this Agatu culture/language entry for English-side grammar, "
        "clarity, and formatting consistency only. Do not comment on or change the "
        "accuracy of any Idoma words or cultural claims -- that is outside your "
        "knowledge. List any issues found, or say 'No issues found' if none.\n\n"
        f"Entry:\n{entry_text}"
    )
    return claude_complete(prompt, max_tokens=350)
