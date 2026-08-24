import logging

from celery import shared_task
from django.utils import timezone

from apps.accounts.services import send_sms

from .models import NotificationLog, NotificationStatus

logger = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def send_notification_sms(self, log_id):
    """
    Sends the SMS for an existing NotificationLog row and updates its
    status. The log row is created first (status=PENDING) by whatever
    triggered the send (alert fan-out, weekly digest, etc.) so every
    attempt has a durable record, even ones that ultimately fail.
    """
    try:
        log = NotificationLog.objects.get(pk=log_id)
    except NotificationLog.DoesNotExist:
        logger.warning("send_notification_sms: NotificationLog %s not found", log_id)
        return

    try:
        sid = send_sms(log.recipient_phone, log.body)
        log.status = NotificationStatus.SENT
        log.provider_message_sid = sid
        log.sent_at = timezone.now()
        log.error_message = ""
        log.save(update_fields=["status", "provider_message_sid", "sent_at", "error_message"])
    except Exception as exc:
        # Truncate defensively -- a long provider error message could
        # otherwise overflow the error_message column and crash the
        # save itself, hiding the original failure behind a new one.
        log.status = NotificationStatus.FAILED
        log.error_message = str(exc)[:255]
        log.save(update_fields=["status", "error_message"])
        logger.warning("send_notification_sms failed for log %s: %s", log_id, exc)
        raise self.retry(exc=exc)


@shared_task
def send_weekly_digest():
    """
    Scheduled by celery beat (see CELERY_BEAT_SCHEDULE in
    config/settings/base.py). A lightweight SMS digest -- the 3 most
    recent published news posts plus any currently active news flashes
    -- sent to residents who've opted in and verified their phone.

    Deliberately simple: no email channel yet (this app currently only
    wraps SMS), and no AI summarization -- that's the Claude admin
    assistant's job in a later phase, not this scheduled job.
    """
    from apps.accounts.models import User
    from apps.news.models import NewsFlash, NewsPost

    recipients = User.objects.filter(
        receives_sms_alerts=True, is_phone_verified=True
    ).exclude(phone_number="")

    if not recipients.exists():
        logger.info("send_weekly_digest: no opted-in recipients, skipping.")
        return

    posts = NewsPost.objects.filter(is_published=True).order_by("-published_at")[:3]
    flashes = NewsFlash.objects.filter(is_active=True)

    lines = ["AgatuConnect weekly digest:"]
    for post in posts:
        lines.append(f"- {post.title}")
    for flash in flashes:
        lines.append(f"! {flash.headline}")

    if len(lines) == 1:
        logger.info("send_weekly_digest: nothing to send this week, skipping.")
        return

    body = "\n".join(lines)[:1500]  # keep it a reasonable SMS length

    sent_count = 0
    for user in recipients.iterator():
        log = NotificationLog.objects.create(
            recipient_phone=user.phone_number, recipient_user=user, body=body
        )
        send_notification_sms.delay(log.id)
        sent_count += 1

    logger.info("send_weekly_digest: queued %s digest notifications", sent_count)
