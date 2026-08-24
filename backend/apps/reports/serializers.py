from rest_framework import serializers

from .models import CitizenReport, ReportPhoto, ReportStatusUpdate


class ReportPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReportPhoto
        fields = ("id", "image", "created_at")
        read_only_fields = ("created_at",)


class ReportStatusUpdateSerializer(serializers.ModelSerializer):
    updated_by_name = serializers.CharField(
        source="updated_by.get_full_name", read_only=True, default=None
    )

    class Meta:
        model = ReportStatusUpdate
        fields = (
            "id", "old_status", "new_status", "note",
            "updated_by", "updated_by_name", "created_at",
        )
        read_only_fields = fields


class CitizenReportSerializer(serializers.ModelSerializer):
    ward_name = serializers.CharField(source="ward.name", read_only=True, default=None)
    submitted_by_name = serializers.CharField(
        source="submitted_by.get_full_name", read_only=True, default=None
    )
    photos = ReportPhotoSerializer(many=True, read_only=True)
    status_updates = ReportStatusUpdateSerializer(many=True, read_only=True)

    class Meta:
        model = CitizenReport
        fields = (
            "id", "title", "description", "category", "ward", "ward_name",
            "status", "submitted_by", "submitted_by_name",
            "latitude", "longitude", "photos", "status_updates",
            "created_at", "updated_at",
        )
        # status is deliberately read-only here -- changes go through the
        # dedicated update_status action, which also logs and notifies.
        read_only_fields = ("status", "submitted_by", "created_at", "updated_at")
