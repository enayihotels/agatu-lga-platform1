from datetime import timedelta

from django.utils import timezone
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.permissions import IsContentEditor

from . import services
from .models import PublicQueryLog
from .providers.claude_client import ClaudeError
from .providers.ollama_client import OllamaError


class AskView(APIView):
    """
    POST /api/ask/ -- public, no auth required. Grounded retrieval +
    Ollama generation, logged (question/answer only, no user identity)
    for spotting content gaps later.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        question = (request.data.get("question") or "").strip()
        if not question:
            return Response({"detail": "question is required."}, status=400)
        if len(question) > 500:
            return Response({"detail": "question is too long (max 500 characters)."}, status=400)

        try:
            result = services.answer_public_question(question)
        except OllamaError:
            return Response(
                {"detail": "The assistant is temporarily unavailable. Please try again shortly."},
                status=503,
            )

        PublicQueryLog.objects.create(
            question=question, answer=result["answer"], had_sources=bool(result["sources"])
        )
        return Response(result)


class BaseAdminAIView(APIView):
    """
    Shared base for every staff-only Claude tool -- all restricted to
    IsContentEditor (covers super admins too). Never exposed to public
    traffic, which is what keeps Claude API cost bounded and predictable.
    """
    permission_classes = [IsContentEditor]

    def handle(self, fn, *args, **kwargs):
        try:
            return Response({"result": fn(*args, **kwargs)})
        except ClaudeError as exc:
            return Response({"detail": str(exc)}, status=503)


class DraftNewsFlashView(BaseAdminAIView):
    def post(self, request):
        notes = (request.data.get("notes") or "").strip()
        if not notes:
            return Response({"detail": "notes is required."}, status=400)
        return self.handle(services.draft_news_flash, notes)


class StructureHistoryEntryView(BaseAdminAIView):
    def post(self, request):
        notes = (request.data.get("notes") or "").strip()
        if not notes:
            return Response({"detail": "notes is required."}, status=400)
        return self.handle(services.structure_history_entry, notes)


class SummarizeDailyReportsView(BaseAdminAIView):
    def post(self, request):
        from apps.reports.models import CitizenReport

        since = timezone.now() - timedelta(days=1)
        reports = CitizenReport.objects.filter(created_at__gte=since).select_related("ward")
        summaries = [
            f"{r.get_category_display()} ({r.ward.name if r.ward else 'no ward'}): {r.title}"
            for r in reports
        ]

        if not summaries:
            return Response({"result": "No citizen reports were submitted in the last 24 hours."})
        return self.handle(services.summarize_daily_reports, summaries)


class DraftAlertCopyView(BaseAdminAIView):
    def post(self, request):
        facts = (request.data.get("facts") or "").strip()
        if not facts:
            return Response({"detail": "facts is required."}, status=400)
        return self.handle(services.draft_alert_copy, facts)


class ReviewDiasporaContributionView(BaseAdminAIView):
    def post(self, request):
        text = (request.data.get("text") or "").strip()
        if not text:
            return Response({"detail": "text is required."}, status=400)
        return self.handle(services.review_diaspora_contribution, text)


class QACultureEntryView(BaseAdminAIView):
    def post(self, request):
        text = (request.data.get("text") or "").strip()
        if not text:
            return Response({"detail": "text is required."}, status=400)
        return self.handle(services.qa_culture_entry, text)
