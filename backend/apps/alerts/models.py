from django.conf import settings
from django.db import models


class AlertSeverity(models.TextChoices):
    INFO = "info", "Info"
    WARNING = "warning", "Warning"
    CRITICAL = "critical", "Critical"


class EmergencyAlert(models.Model):
    """
    Flood/security broadcast -- the single most locally relevant
    feature for a river-adjacent LGA like Agatu. Publishing with
    send_sms=True fans out an SMS to every verified, opted-in resident
    (optionally scoped to one ward) via the notifications app.
    """
    title = models.CharField(max_length=200)
    body = models.TextField()
    severity = models.CharField(
        max_length=10, choices=AlertSeverity.choices, default=AlertSeverity.WARNING
    )
    ward = models.ForeignKey(
        "wards.Ward",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="alerts",
        help_text="Leave blank to broadcast LGA-wide.",
    )
    send_sms = models.BooleanField(
        default=False,
        help_text="If checked, fans out an SMS to affected residents when this alert is saved.",
    )
    sms_sent_at = models.DateTimeField(null=True, blank=True, editable=False)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="created_alerts"
    )
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        scope = self.ward.name if self.ward else "LGA-wide"
        return f"[{self.get_severity_display()}] {self.title} ({scope})"
