from rest_framework import serializers

from .models import Leader, HistoricalEvent, CultureEntry


class LeaderSerializer(serializers.ModelSerializer):
    ward_name = serializers.CharField(source="ward.name", read_only=True, default=None)

    class Meta:
        model = Leader
        fields = (
            "id", "full_name", "title", "portrait", "start_year", "end_year",
            "biography", "achievements", "ward", "ward_name", "is_current",
        )


class HistoricalEventSerializer(serializers.ModelSerializer):
    related_leader_name = serializers.CharField(
        source="related_leader.full_name", read_only=True, default=None
    )

    class Meta:
        model = HistoricalEvent
        fields = (
            "id", "title", "year", "month", "summary", "image",
            "related_leader", "related_leader_name",
        )


class CultureEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = CultureEntry
        fields = (
            "id", "category", "title", "slug", "local_text",
            "english_meaning", "context_notes", "audio_pronunciation", "image",
        )
