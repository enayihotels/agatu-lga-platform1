from django.conf import settings
from django.db import models


class NotificationChannel(models.TextChoices):
    SMS = "sms", "SMS"
    # Room to add EMAIL/WHATSAPP later without touching existing rows.


class NotificationStatus(models.TextChoices):
    PENDING = "pending", "Pending"
    SENT = "sent", "Sent"
    FAILED = "failed", "Failed"


class NotificationLog(models.Model):
    """
    A durable record of every outbound notification attempt, success
    or failure. Twilio's own dashboard only retains logs for so long,
    and doesn't know which Agatu resident or ward a message belonged
    to — this is the Agatu-specific record, e.g. for answering "who did
    we actually reach" after a flood alert broadcast.
    """
    channel = models.CharField(
        max_length=10, choices=NotificationChannel.choices, default=NotificationChannel.SMS
    )
    recipient_phone = models.CharField(max_length=20)
    recipient_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="notification_logs",
    )
    body = models.TextField()
    status = models.CharField(
        max_length=10, choices=NotificationStatus.choices, default=NotificationStatus.PENDING
    )
    provider_message_sid = models.CharField(max_length=64, blank=True)
    # Capped at 255: a provider error message is free-text and can run
    # long. Always truncate the value before assigning it here (done in
    # tasks.py) rather than relying on the DB to reject an overflow.
    error_message = models.CharField(max_length=255, blank=True)
    alert = models.ForeignKey(
        "alerts.EmergencyAlert",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="notification_logs",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    sent_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.recipient_phone} — {self.status} ({self.created_at:%Y-%m-%d %H:%M})"
