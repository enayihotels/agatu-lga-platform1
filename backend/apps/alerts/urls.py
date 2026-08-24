from rest_framework.routers import DefaultRouter

from .views import EmergencyAlertViewSet

app_name = "alerts"

router = DefaultRouter()
router.register("", EmergencyAlertViewSet, basename="alert")

urlpatterns = router.urls
