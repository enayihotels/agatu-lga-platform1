from django.utils import timezone
from rest_framework import viewsets, permissions

from apps.accounts.permissions import IsContentEditor
from .models import NewsCategory, NewsPost, NewsFlash
from .serializers import (
    NewsCategorySerializer, NewsPostListSerializer,
    NewsPostDetailSerializer, NewsFlashSerializer,
)


class NewsCategoryViewSet(viewsets.ModelViewSet):
    queryset = NewsCategory.objects.all()
    serializer_class = NewsCategorySerializer

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            return [permissions.AllowAny()]
        return [IsContentEditor()]


class NewsPostViewSet(viewsets.ModelViewSet):
    queryset = NewsPost.objects.all().select_related("category", "ward", "author")
    lookup_field = "slug"

    def get_serializer_class(self):
        if self.action == "list":
            return NewsPostListSerializer
        return NewsPostDetailSerializer

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            return [permissions.AllowAny()]
        return [IsContentEditor()]

    def get_queryset(self):
        qs = super().get_queryset()
        # Public/anonymous users only ever see published posts.
        # Editors (and above) see everything, including drafts.
        user = self.request.user
        if not (user.is_authenticated and getattr(user, "is_content_editor", False)):
            qs = qs.filter(is_published=True)
        ward_slug = self.request.query_params.get("ward")
        if ward_slug:
            qs = qs.filter(ward__slug=ward_slug)
        return qs

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class NewsFlashViewSet(viewsets.ModelViewSet):
    """The homepage ticker feed."""
    queryset = NewsFlash.objects.all()
    serializer_class = NewsFlashSerializer

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            return [permissions.AllowAny()]
        return [IsContentEditor()]

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user
        if not (user.is_authenticated and getattr(user, "is_content_editor", False)):
            now = timezone.now()
            qs = qs.filter(is_active=True).exclude(expires_at__lt=now)
        return qs
