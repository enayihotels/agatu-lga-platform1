from django.db import models
from django.utils.text import slugify

from apps.wards.models import Ward


class Leader(models.Model):
    """
    Past and present traditional/political leaders â€” Council Chairmen,
    District Heads, or other recognised Agatu leadership positions.
    This is the backbone of the "Living History Archive" feature.
    """
    full_name = models.CharField(max_length=200)
    title = models.CharField(
        max_length=150,
        help_text="e.g. 'Executive Chairman, Agatu LGA', 'District Head', 'Och'Agatu'",
    )
    portrait = models.ImageField(upload_to="leaders/portraits/", blank=True, null=True)
    start_year = models.PositiveIntegerField(help_text="Year tenure began")
    end_year = models.PositiveIntegerField(
        null=True, blank=True,
        help_text="Leave blank if currently in office",
    )
    biography = models.TextField()
    achievements = models.TextField(blank=True)
    ward = models.ForeignKey(
        Ward, on_delete=models.SET_NULL, null=True, blank=True,
        related_name="leaders",
        help_text="Optional â€” for ward-level or district-level leaders",
    )
    is_current = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-start_year"]

    def __str__(self):
        years = f"{self.start_year}â€“{self.end_year or 'present'}"
        return f"{self.full_name} ({self.title}, {years})"


class HistoricalEvent(models.Model):
    """Significant dated events in Agatu's history â€” for the timeline view."""
    title = models.CharField(max_length=200)
    year = models.PositiveIntegerField()
    month = models.PositiveSmallIntegerField(null=True, blank=True)
    summary = models.TextField()
    image = models.ImageField(upload_to="history/events/", blank=True, null=True)
    related_leader = models.ForeignKey(
        Leader, on_delete=models.SET_NULL, null=True, blank=True, related_name="events"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-year", "-month"]

    def __str__(self):
        return f"{self.year} â€” {self.title}"


class CultureCategory(models.TextChoices):
    LANGUAGE = "language", "Language"
    FESTIVAL = "festival", "Festival"
    PROVERB = "proverb", "Proverb"
    FOLKLORE = "folklore", "Folklore"
    CUSTOM = "custom", "Custom / Tradition"


class CultureEntry(models.Model):
    """
    The Culture & Language Vault â€” Idoma-Agatu terms, proverbs, festivals,
    folklore. audio_pronunciation lets residents/diaspora hear correct
    pronunciation, not just read a spelling.
    """
    category = models.CharField(max_length=20, choices=CultureCategory.choices)
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    local_text = models.CharField(
        max_length=300, blank=True,
        help_text="The Idoma (or local dialect) word/phrase/proverb itself",
    )
    english_meaning = models.TextField()
    context_notes = models.TextField(
        blank=True,
        help_text="When/how it's used, regional variation across Agatu wards, etc.",
    )
    audio_pronunciation = models.FileField(
        upload_to="culture/audio/", blank=True, null=True
    )
    image = models.ImageField(upload_to="culture/images/", blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["category", "title"]
        verbose_name_plural = "Culture entries"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(f"{self.category}-{self.title}")
        super().save(*args, **kwargs)

    def __str__(self):
        return f"[{self.get_category_display()}] {self.title}"
