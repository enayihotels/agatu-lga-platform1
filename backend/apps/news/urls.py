from rest_framework.routers import DefaultRouter

from .views import NewsCategoryViewSet, NewsPostViewSet, NewsFlashViewSet

app_name = "news"

router = DefaultRouter()
router.register("categories", NewsCategoryViewSet, basename="news-category")
router.register("posts", NewsPostViewSet, basename="news-post")
router.register("flashes", NewsFlashViewSet, basename="news-flash")

urlpatterns = router.urls
