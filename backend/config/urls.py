from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


def health_check(request):
    return JsonResponse({"status": "ok", "service": "AgatuConnect API"})


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/health/", health_check, name="health-check"),
    path("api/auth/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/accounts/", include("apps.accounts.urls")),
    path("api/wards/", include("apps.wards.urls")),
    path("api/history/", include("apps.history.urls")),
    path("api/news/", include("apps.news.urls")),
    path("api/events/", include("apps.events.urls")),
    path("api/media/", include("apps.media_library.urls")),
    path("api/alerts/", include("apps.alerts.urls")),
    path("api/reports/", include("apps.reports.urls")),
    # Phase 7+: path("api/ai/", include("apps.ai_assistant.urls")),
]

# Serve uploaded media locally in DEBUG only. In production, media is
# expected to live on Cloudinary/S3 (via django-storages) rather than
# being served by Django itself — see README "Media storage in production".
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
