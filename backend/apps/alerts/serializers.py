from rest_framework import serializers

from .models import EmergencyAlert


class EmergencyAlertSerializer(serializers.ModelSerializer):
    ward_name = serializers.CharField(source="ward.name", read_only=True, default=None)
    created_by_name = serializers.CharField(
        source="created_by.get_full_name", read_only=True, default=None
    )
    recipient_count = serializers.SerializerMethodField()

    class Meta:
        model = EmergencyAlert
        fields = (
            "id", "title", "body", "severity", "ward", "ward_name",
            "send_sms", "sms_sent_at", "is_active",
            "created_by", "created_by_name", "recipient_count",
            "created_at", "updated_at",
        )
        read_only_fields = ("sms_sent_at", "created_by", "created_at", "updated_at")

    def get_recipient_count(self, obj):
        return obj.notification_logs.count()
