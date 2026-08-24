from django.urls import path

from .views import (
    AskView,
    DraftAlertCopyView,
    DraftNewsFlashView,
    QACultureEntryView,
    ReviewDiasporaContributionView,
    StructureHistoryEntryView,
    SummarizeDailyReportsView,
)

app_name = "ai_assistant"

urlpatterns = [
    path("ask/", AskView.as_view(), name="ask"),
    path("admin/ai/draft-news-flash/", DraftNewsFlashView.as_view(), name="draft-news-flash"),
    path(
        "admin/ai/structure-history-entry/",
        StructureHistoryEntryView.as_view(),
        name="structure-history-entry",
    ),
    path(
        "admin/ai/summarize-daily-reports/",
        SummarizeDailyReportsView.as_view(),
        name="summarize-daily-reports",
    ),
    path("admin/ai/draft-alert-copy/", DraftAlertCopyView.as_view(), name="draft-alert-copy"),
    path(
        "admin/ai/review-diaspora-contribution/",
        ReviewDiasporaContributionView.as_view(),
        name="review-diaspora-contribution",
    ),
    path("admin/ai/qa-culture-entry/", QACultureEntryView.as_view(), name="qa-culture-entry"),
]
