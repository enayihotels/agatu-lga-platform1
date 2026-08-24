import os

from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models

from apps.media_library.models import validate_file_size

ALLOWED_REPORT_IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"]


def validate_report_image_extension(file):
    ext = os.path.splitext(file.name)[1].lower()
    if ext not in ALLOWED_REPORT_IMAGE_EXTENSIONS:
        raise ValidationError(
            f"Unsupported image type '{ext}'. Allowed: {', '.join(ALLOWED_REPORT_IMAGE_EXTENSIONS)}"
        )


class ReportCategory(models.TextChoices):
    ROADS = "roads", "Roads"
    WATER = "water", "Water & Boreholes"
    SECURITY = "security", "Security"
    HEALTH = "health", "Health"
    ELECTRICITY = "electricity", "Electricity"
    OTHER = "other", "Other"


class ReportStatus(models.TextChoices):
    SUBMITTED = "submitted", "Submitted"
    IN_REVIEW = "in_review", "In Review"
    RESOLVED = "resolved", "Resolved"
    REJECTED = "rejected", "Rejected"


class CitizenReport(models.Model):
    """
    The Citizen Report/Feedback Portal -- residents flag infrastructure
    issues (roads, boreholes, insecurity, etc.) with an optional photo
    and location, and can track status without needing to call anyone.
    """
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(
        max_length=20, choices=ReportCategory.choices, default=ReportCategory.OTHER
    )
    ward = models.ForeignKey(
        "wards.Ward",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="citizen_reports",
    )
    status = models.CharField(
        max_length=20, choices=ReportStatus.choices, default=ReportStatus.SUBMITTED
    )
    submitted_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="citizen_reports",
    )
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.title} ({self.get_status_display()})"


class ReportPhoto(models.Model):
    report = models.ForeignKey(CitizenReport, on_delete=models.CASCADE, related_name="photos")
    image = models.ImageField(
        upload_to="reports/photos/",
        validators=[validate_file_size, validate_report_image_extension],
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return f"Photo for {self.report.title}"


class ReportStatusUpdate(models.Model):
    """An audit trail entry: every status change, who made it, and an optional note."""
    report = models.ForeignKey(
        CitizenReport, on_delete=models.CASCADE, related_name="status_updates"
    )
    old_status = models.CharField(max_length=20, choices=ReportStatus.choices)
    new_status = models.CharField(max_length=20, choices=ReportStatus.choices)
    note = models.TextField(blank=True)
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="report_status_updates",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.report.title}: {self.old_status} -> {self.new_status}"
