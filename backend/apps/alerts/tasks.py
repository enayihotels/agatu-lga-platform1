import logging

from celery import shared_task
from django.utils import timezone

from apps.accounts.models import User
from apps.notifications.models import NotificationLog
from apps.notifications.tasks import send_notification_sms

from .models import EmergencyAlert

logger = logging.getLogger(__name__)


@shared_task
def fan_out_alert_sms(alert_id):
    """
    Builds one NotificationLog + one send_notification_sms task per
    eligible recipient, rather than sending directly. This keeps a
    durable per-resident log (needed for "did everyone in Ward X get
    the flood alert") and lets each send retry independently if
    Twilio has a transient failure for one recipient, without blocking
    the rest of the batch.
    """
    try:
        alert = EmergencyAlert.objects.select_related("ward").get(pk=alert_id)
    except EmergencyAlert.DoesNotExist:
        logger.warning("fan_out_alert_sms: alert %s not found", alert_id)
        return

    recipients = User.objects.filter(
        receives_sms_alerts=True, is_phone_verified=True
    ).exclude(phone_number="")

    if alert.ward_id:
        recipients = recipients.filter(ward_id=alert.ward_id)

    sms_body = f"[AgatuConnect {alert.get_severity_display()}] {alert.title}: {alert.body}"

    sent_count = 0
    for user in recipients.iterator():
        log = NotificationLog.objects.create(
            recipient_phone=user.phone_number,
            recipient_user=user,
            body=sms_body,
            alert=alert,
        )
        send_notification_sms.delay(log.id)
        sent_count += 1

    alert.sms_sent_at = timezone.now()
    alert.save(update_fields=["sms_sent_at"])
    logger.info("fan_out_alert_sms: queued %s notifications for alert %s", sent_count, alert_id)
