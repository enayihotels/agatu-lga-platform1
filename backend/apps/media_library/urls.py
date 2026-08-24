from rest_framework.routers import DefaultRouter

from .views import MediaAssetViewSet

app_name = "media_library"

router = DefaultRouter()
router.register("", MediaAssetViewSet, basename="media-asset")

urlpatterns = router.urls
