from rest_framework import viewsets, permissions

from apps.accounts.permissions import IsContentEditor
from .models import Leader, HistoricalEvent, CultureEntry
from .serializers import LeaderSerializer, HistoricalEventSerializer, CultureEntrySerializer


class PublicReadEditorWriteMixin:
    """Shared permission pattern: anyone can read, only editors can write."""

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            return [permissions.AllowAny()]
        return [IsContentEditor()]


class LeaderViewSet(PublicReadEditorWriteMixin, viewsets.ModelViewSet):
    queryset = Leader.objects.all().select_related("ward")
    serializer_class = LeaderSerializer


class HistoricalEventViewSet(PublicReadEditorWriteMixin, viewsets.ModelViewSet):
    queryset = HistoricalEvent.objects.all().select_related("related_leader")
    serializer_class = HistoricalEventSerializer


class CultureEntryViewSet(PublicReadEditorWriteMixin, viewsets.ModelViewSet):
    queryset = CultureEntry.objects.all()
    serializer_class = CultureEntrySerializer
    lookup_field = "slug"

    def get_queryset(self):
        qs = super().get_queryset()
        category = self.request.query_params.get("category")
        if category:
            qs = qs.filter(category=category)
        return qs
