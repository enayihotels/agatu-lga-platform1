import os

from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models

# --- Validation rules ---

MAX_UPLOAD_SIZE_MB = 10

ALLOWED_IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"]
ALLOWED_AUDIO_EXTENSIONS = [".mp3", ".wav", ".m4a", ".ogg"]
ALLOWED_VIDEO_EXTENSIONS = [".mp4", ".webm", ".mov"]
ALLOWED_DOCUMENT_EXTENSIONS = [".pdf"]

ALL_ALLOWED_EXTENSIONS = (
    ALLOWED_IMAGE_EXTENSIONS
    + ALLOWED_AUDIO_EXTENSIONS
    + ALLOWED_VIDEO_EXTENSIONS
    + ALLOWED_DOCUMENT_EXTENSIONS
)


def validate_file_size(file):
    max_bytes = MAX_UPLOAD_SIZE_MB * 1024 * 1024
    if file.size > max_bytes:
        raise ValidationError(
            f"File too large ({file.size / 1024 / 1024:.1f}MB). "
            f"Max size is {MAX_UPLOAD_SIZE_MB}MB."
        )


def validate_extension(file):
    ext = os.path.splitext(file.name)[1].lower()
    if ext not in ALL_ALLOWED_EXTENSIONS:
        raise ValidationError(
            f"Unsupported file type '{ext}'. "
            f"Allowed: {', '.join(ALL_ALLOWED_EXTENSIONS)}"
        )


class MediaAssetType(models.TextChoices):
    IMAGE = "image", "Image"
    AUDIO = "audio", "Audio"
    VIDEO = "video", "Video"
    DOCUMENT = "document", "Document"


class MediaAsset(models.Model):
    """
    Central library for uploaded images/audio/video/documents, shared
    across news, history, culture, and events. One place to upload,
    browse, and reuse assets (feeds the admin Media Library browser
    in Phase 10) instead of every app managing its own uploads.

    Storage note: files currently live on local disk (MEDIA_ROOT) for
    development. Before going to production on Render, point this at
    Cloudinary or S3-compatible storage via django-storages — Render's
    disks aren't ideal for large media at scale (see README).
    """

    file = models.FileField(
        upload_to="library/%Y/%m/",
        validators=[validate_file_size, validate_extension],
    )
    thumbnail = models.ImageField(
        upload_to="library/thumbnails/", blank=True, null=True, editable=False
    )
    asset_type = models.CharField(
        max_length=10, choices=MediaAssetType.choices, editable=False, blank=True
    )
    title = models.CharField(max_length=200, blank=True)
    alt_text = models.CharField(
        max_length=255,
        blank=True,
        help_text="Accessibility description — required for images used on public pages.",
    )
    caption = models.TextField(blank=True)
    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="uploaded_media",
    )
    file_size = models.PositiveIntegerField(editable=False, default=0)
    width = models.PositiveIntegerField(null=True, blank=True, editable=False)
    height = models.PositiveIntegerField(null=True, blank=True, editable=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title or os.path.basename(self.file.name)

    def save(self, *args, **kwargs):
        is_new_file = bool(self.file) and not self.pk
        if self.file:
            ext = os.path.splitext(self.file.name)[1].lower()
            if ext in ALLOWED_IMAGE_EXTENSIONS:
                self.asset_type = MediaAssetType.IMAGE
            elif ext in ALLOWED_AUDIO_EXTENSIONS:
                self.asset_type = MediaAssetType.AUDIO
            elif ext in ALLOWED_VIDEO_EXTENSIONS:
                self.asset_type = MediaAssetType.VIDEO
            else:
                self.asset_type = MediaAssetType.DOCUMENT
            self.file_size = self.file.size

        super().save(*args, **kwargs)

        if is_new_file and self.asset_type == MediaAssetType.IMAGE and not self.thumbnail:
            self._generate_thumbnail()

    def _generate_thumbnail(self):
        """
        Builds a 400x400 JPEG thumbnail for image assets. Wrapped in a
        broad try/except deliberately: a corrupt or unusual image file
        should never block the upload itself — worst case, no thumbnail
        gets generated and the admin sees the full image instead.
        """
        from io import BytesIO

        from django.core.files.base import ContentFile
        from PIL import Image

        try:
            img = Image.open(self.file.path)
            self.width, self.height = img.size
            if img.mode != "RGB":
                img = img.convert("RGB")
            img.thumbnail((400, 400))

            buffer = BytesIO()
            img.save(buffer, format="JPEG", quality=85)
            thumb_name = f"thumb_{os.path.splitext(os.path.basename(self.file.name))[0]}.jpg"

            self.thumbnail.save(thumb_name, ContentFile(buffer.getvalue()), save=False)
            MediaAsset.objects.filter(pk=self.pk).update(
                thumbnail=self.thumbnail.name,
                width=self.width,
                height=self.height,
            )
        except Exception:
            pass
