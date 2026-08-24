from django.contrib.auth.models import AbstractUser
from django.db import models


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
    # Ward is added as a string reference now; Phase 2 introduces the real
    # wards.Ward model and this becomes a ForeignKey via migration.
    ward_name = models.CharField(max_length=100, blank=True)

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
