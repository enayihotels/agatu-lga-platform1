from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.accounts.permissions import IsContentEditor
from .models import Event, RSVP
from .serializers import EventSerializer


class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all().select_related("ward").prefetch_related("rsvps")
    serializer_class = EventSerializer
    lookup_field = "slug"

    def get_permissions(self):
        if self.action in ("list", "retrieve", "rsvp"):
            # Reads are public; RSVP itself still requires auth (checked inside the action).
            return [permissions.AllowAny()]
        return [IsContentEditor()]

    def get_queryset(self):
        qs = super().get_queryset()
        if not (self.request.user.is_authenticated and getattr(self.request.user, "is_content_editor", False)):
            qs = qs.filter(is_public=True)
        return qs

    @action(detail=True, methods=["post"], url_path="rsvp")
    def rsvp(self, request, slug=None):
        """POST /api/events/<slug>/rsvp/ â€” toggles RSVP for the current user."""
        if not request.user.is_authenticated:
            return Response({"detail": "Login required to RSVP."}, status=status.HTTP_401_UNAUTHORIZED)

        event = self.get_object()
        rsvp_obj, created = RSVP.objects.get_or_create(event=event, user=request.user)
        if not created:
            rsvp_obj.delete()
            return Response({"attending": False}, status=status.HTTP_200_OK)
        return Response({"attending": True}, status=status.HTTP_201_CREATED)
