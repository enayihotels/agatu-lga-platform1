from rest_framework import permissions, viewsets

from apps.accounts.permissions import IsWardOfficerOrAbove

from .models import EmergencyAlert
from .serializers import EmergencyAlertSerializer
from .tasks import fan_out_alert_sms


class EmergencyAlertViewSet(viewsets.ModelViewSet):
    """
    Public reads -- residents and guests should see active alerts
    without logging in, that's the whole point of a flood warning.
    Writes are restricted to ward officers and above.
    """
    queryset = EmergencyAlert.objects.all().select_related("ward", "created_by")
    serializer_class = EmergencyAlertSerializer

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            return [permissions.AllowAny()]
        return [IsWardOfficerOrAbove()]

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user
        if not (user.is_authenticated and (user.is_content_editor or user.is_ward_officer)):
            qs = qs.filter(is_active=True)
        return qs

    def perform_create(self, serializer):
        alert = serializer.save(created_by=self.request.user)
        if alert.send_sms:
            fan_out_alert_sms.delay(alert.id)
