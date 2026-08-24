from rest_framework import serializers

from .models import Event, RSVP


class EventSerializer(serializers.ModelSerializer):
    ward_name = serializers.CharField(source="ward.name", read_only=True, default=None)
    rsvp_count = serializers.IntegerField(source="rsvps.count", read_only=True)
    is_user_attending = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = (
            "id", "title", "slug", "description", "location", "ward", "ward_name",
            "starts_at", "ends_at", "cover_image", "is_public",
            "rsvp_count", "is_user_attending",
        )

    def get_is_user_attending(self, obj):
        request = self.context.get("request")
        if not request or not request.user.is_authenticated:
            return False
        return obj.rsvps.filter(user=request.user).exists()


class RSVPSerializer(serializers.ModelSerializer):
    class Meta:
        model = RSVP
        fields = ("id", "event", "user", "created_at")
        read_only_fields = ("user", "created_at")
