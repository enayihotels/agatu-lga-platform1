from rest_framework import viewsets
from rest_framework.parsers import FormParser, MultiPartParser

from apps.accounts.permissions import IsContentEditor

from .models import MediaAsset
from .serializers import MediaAssetSerializer


class MediaAssetViewSet(viewsets.ModelViewSet):
    """
    Staff-only media library: upload, browse, and reuse assets across
    news/history/culture/events. Deliberately not exposed to public/
    anonymous traffic — public pages read file URLs already saved on
    their own content models (e.g. NewsPost.cover_image), not this
    endpoint directly.
    """

    queryset = MediaAsset.objects.all().select_related("uploaded_by")
    serializer_class = MediaAssetSerializer
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [IsContentEditor]

    def get_queryset(self):
        qs = super().get_queryset()
        asset_type = self.request.query_params.get("type")
        if asset_type:
            qs = qs.filter(asset_type=asset_type)
        search = self.request.query_params.get("search")
        if search:
            qs = qs.filter(title__icontains=search)
        return qs

    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)
