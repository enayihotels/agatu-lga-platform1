from rest_framework import serializers

from .models import MediaAsset


class MediaAssetSerializer(serializers.ModelSerializer):
    uploaded_by_name = serializers.CharField(
        source="uploaded_by.get_full_name", read_only=True, default=None
    )

    class Meta:
        model = MediaAsset
        fields = (
            "id",
            "file",
            "thumbnail",
            "asset_type",
            "title",
            "alt_text",
            "caption",
            "uploaded_by",
            "uploaded_by_name",
            "file_size",
            "width",
            "height",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "asset_type",
            "thumbnail",
            "file_size",
            "width",
            "height",
            "uploaded_by",
            "created_at",
            "updated_at",
        )
