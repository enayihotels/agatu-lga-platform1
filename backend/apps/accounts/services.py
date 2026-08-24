"""
Thin wrapper around the Twilio client. Kept as one function so every
place that needs to send an SMS — this OTP flow now, the alerts app's
emergency broadcasts in Phase 5 — shares a single place that knows how
to talk to Twilio. Swapping providers later means editing this file only.
"""
from django.conf import settings


def send_sms(to_number: str, body: str) -> str:
    """
    Sends an SMS via Twilio. Returns the provider message SID.

    Raises RuntimeError if TWILIO_* settings aren't configured in .env.
    Callers running inside a Celery task should catch this and log
    rather than let a missing config crash the whole task silently.
    """
    from twilio.rest import Client

    if not (settings.TWILIO_ACCOUNT_SID and settings.TWILIO_AUTH_TOKEN and settings.TWILIO_FROM_NUMBER):
        raise RuntimeError(
            "Twilio is not configured — set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, "
            "and TWILIO_FROM_NUMBER in .env before sending SMS."
        )

    client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
    message = client.messages.create(
        to=to_number,
        from_=settings.TWILIO_FROM_NUMBER,
        body=body,
    )
    return message.sid
