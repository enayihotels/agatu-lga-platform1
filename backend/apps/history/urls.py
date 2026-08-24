from rest_framework.routers import DefaultRouter

from .views import LeaderViewSet, HistoricalEventViewSet, CultureEntryViewSet

app_name = "history"

router = DefaultRouter()
router.register("leaders", LeaderViewSet, basename="leader")
router.register("events", HistoricalEventViewSet, basename="historical-event")
router.register("culture", CultureEntryViewSet, basename="culture-entry")

urlpatterns = router.urls
