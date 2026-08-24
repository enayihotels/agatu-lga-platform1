from rest_framework import viewsets, permissions

from apps.accounts.permissions import IsContentEditor
from .models import Ward
from .serializers import WardListSerializer, WardDetailSerializer


class WardViewSet(viewsets.ModelViewSet):
    """
    Public read access (anyone can browse the ward directory), writes
    restricted to Content Editors / Super Admin. Ward Officers manage
    contacts/clans for their own ward via Django admin in Phase 2 â€”
    a self-serve "my ward" API endpoint can be added in a later phase
    once IsWardOfficerOrAbove needs object-level scoping.
    """
    queryset = Ward.objects.all().prefetch_related("contacts", "clans")
    lookup_field = "slug"

    def get_serializer_class(self):
        if self.action == "list":
            return WardListSerializer
        return WardDetailSerializer

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            return [permissions.AllowAny()]
        return [IsContentEditor()]
