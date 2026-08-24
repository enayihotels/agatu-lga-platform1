import logging

from celery import shared_task

from .services import send_sms

logger = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=3, default_retry_delay=30)
def send_otp_sms(self, phone_number: str, code: str):
    """
    Fires the OTP SMS asynchronously so the "request verification code"
    endpoint returns immediately instead of waiting on Twilio's API
    round-trip. Retries up to 3 times, 30 seconds apart, if Twilio's
    API is briefly unavailable.
    """
    body = f"Your AgatuConnect verification code is {code}. It expires in 10 minutes."
    try:
        send_sms(phone_number, body)
    except Exception as exc:
        logger.warning("send_otp_sms failed for %s: %s", phone_number, exc)
        raise self.retry(exc=exc)
