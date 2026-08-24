from django.db import models


class PublicQueryLog(models.Model):
    """
    A light log of what residents ask "Ask AgatuConnect" -- useful for
    spotting content gaps (frequently-asked questions with no good
    grounded answer yet) without storing anything more identifying than
    the question itself.
    """
    question = models.TextField()
    answer = models.TextField()
    had_sources = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.question[:80]
