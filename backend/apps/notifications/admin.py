from django.contrib import admin

from .models import NotificationLog


@admin.register(NotificationLog)
class NotificationLogAdmin(admin.ModelAdmin):
    """
    Read-only by design -- this is a log of what actually happened, not
    something to hand-edit. Useful for answering "did this resident get
    the flood alert" without digging through Twilio's own console.
    """
    list_display = (
        "recipient_phone", "recipient_user", "channel", "status",
        "alert", "created_at", "sent_at",
    )
    list_filter = ("status", "channel", "created_at")
    search_fields = ("recipient_phone", "recipient_user__username", "body")
    readonly_fields = [f.name for f in NotificationLog._meta.fields]

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False
