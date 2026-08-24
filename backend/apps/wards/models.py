from django.db import models
from django.utils.text import slugify


class Ward(models.Model):
    """
    Agatu LGA's 10 INEC-recognised electoral wards. Seeded via the
    seed_wards management command (Phase 2 checkpoint) rather than
    hardcoded, so you can correct/extend details from the admin later.
    """
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=110, unique=True, blank=True)
    description = models.TextField(
        blank=True,
        help_text="Short overview: geography, dominant clans, notable settlements.",
    )
    headquarters_town = models.CharField(max_length=150, blank=True)
    is_lga_headquarters = models.BooleanField(
        default=False,
        help_text="True only for the ward hosting the LGA secretariat (Obagaji).",
    )
    cover_image = models.ImageField(upload_to="wards/covers/", blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class WardContact(models.Model):
    """A named contact point for a ward â€” officer, town union head, etc."""
    ward = models.ForeignKey(Ward, on_delete=models.CASCADE, related_name="contacts")
    full_name = models.CharField(max_length=200)
    role_title = models.CharField(max_length=150, help_text="e.g. Ward Officer, Town Union Chairman")
    phone_number = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)

    class Meta:
        ordering = ["ward__name", "full_name"]

    def __str__(self):
        return f"{self.full_name} â€” {self.role_title} ({self.ward.name})"


class Clan(models.Model):
    """Dominant clan/kindred groupings associated with a ward."""
    ward = models.ForeignKey(Ward, on_delete=models.CASCADE, related_name="clans")
    name = models.CharField(max_length=150)
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ["ward__name", "name"]
        verbose_name_plural = "Clans"

    def __str__(self):
        return f"{self.name} ({self.ward.name})"
