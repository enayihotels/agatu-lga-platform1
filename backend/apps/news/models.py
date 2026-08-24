from django.conf import settings
from django.db import models
from django.utils import timezone
from django.utils.text import slugify

from apps.wards.models import Ward


class NewsCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=110, unique=True, blank=True)

    class Meta:
        verbose_name_plural = "News categories"
        ordering = ["name"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class NewsPost(models.Model):
    """A full news article â€” the main content type for the site."""
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    excerpt = models.CharField(max_length=300, blank=True)
    body = models.TextField()
    cover_image = models.ImageField(upload_to="news/covers/", blank=True, null=True)
    category = models.ForeignKey(
        NewsCategory, on_delete=models.SET_NULL, null=True, blank=True, related_name="posts"
    )
    ward = models.ForeignKey(
        Ward, on_delete=models.SET_NULL, null=True, blank=True, related_name="news_posts"
    )
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name="news_posts"
    )
    is_published = models.BooleanField(default=False)
    published_at = models.DateTimeField(null=True, blank=True)

    # Set when a Claude-assisted draft was used, for your own transparency/audit trail.
    ai_assisted_draft = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-published_at", "-created_at"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        if self.is_published and not self.published_at:
            self.published_at = timezone.now()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class NewsFlash(models.Model):
    """
    Short breaking-update ticker items shown on the homepage. Distinct
    from NewsPost: this is deliberately lightweight (headline + optional
    link) for fast-moving updates, e.g. flood/security notices, before
    a full article exists.
    """
    headline = models.CharField(max_length=150)
    linked_post = models.ForeignKey(
        NewsPost, on_delete=models.SET_NULL, null=True, blank=True, related_name="flashes"
    )
    is_active = models.BooleanField(default=True)
    priority = models.IntegerField(default=0, help_text="Higher shows first in the ticker")
    expires_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-priority", "-created_at"]

    def __str__(self):
        return self.headline
