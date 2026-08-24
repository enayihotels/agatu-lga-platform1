import random
from datetime import timedelta

from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone


class Role(models.TextChoices):
    """
    The account types decided in the blueprint. Kept as a single field on
    User (rather than Django Groups) because each role maps to distinct
    profile fields (ward, verification status) and permission logic that
    is easier to reason about as one explicit attribute.
    """
    SUPER_ADMIN = "super_admin", "Super Admin"
    CONTENT_EDITOR = "content_editor", "Content Editor"
    WARD_OFFICER = "ward_officer", "Ward Officer"
    VERIFIED_RESIDENT = "verified_resident", "Verified Resident"
    DIASPORA_MEMBER = "diaspora_member", "Diaspora Member"
    SERVICE_ACCOUNT = "service_account", "Service Account"


class User(AbstractUser):
    """
    Custom user model — must exist before the first migration so future
    role/profile fields never require a risky mid-project user-model swap.
    """
    role = models.CharField(
        max_length=32,
        choices=Role.choices,
        default=Role.VERIFIED_RESIDENT,
    )
    phone_number = models.CharField(
        max_length=20,
        blank=True,
        help_text="Used for Twilio SMS alerts. Include country code, e.g. +234...",
    )
    ward = models.ForeignKey(
        "wards.Ward",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="residents",
        help_text="The Agatu ward this account is associated with.",
    )

    is_phone_verified = models.BooleanField(default=False)
    receives_sms_alerts = models.BooleanField(
        default=True,
        help_text="Opt-in flag for emergency SMS broadcasts (Phase 5).",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.get_full_name() or self.username} ({self.get_role_display()})"

    @property
    def is_super_admin(self):
        return self.role == Role.SUPER_ADMIN or self.is_superuser

    @property
    def is_content_editor(self):
        return self.role in (Role.SUPER_ADMIN, Role.CONTENT_EDITOR) or self.is_superuser

    @property
    def is_ward_officer(self):
        return self.role == Role.WARD_OFFICER


class PhoneVerificationCode(models.Model):
    """
    A single one-time code sent via Twilio SMS to confirm a user's phone
    number. Deliberately its own small model rather than fields bolted
    onto User — keeps a history of attempts and makes expiry/reuse logic
    straightforward, and it's the natural home for rate-limiting later.
    """
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="phone_verification_codes"
    )
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.username} — {self.code} ({'used' if self.is_used else 'active'})"

    def is_valid(self):
        return not self.is_used and timezone.now() < self.expires_at

    @classmethod
    def generate_for(cls, user, ttl_minutes=10):
        code = f"{random.randint(0, 999999):06d}"
        return cls.objects.create(
            user=user,
            code=code,
            expires_at=timezone.now() + timedelta(minutes=ttl_minutes),
        )
