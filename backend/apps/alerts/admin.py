from django.contrib import admin

from .models import EmergencyAlert


@admin.register(EmergencyAlert)
class EmergencyAlertAdmin(admin.ModelAdmin):
    list_display = (
        "title", "severity", "ward", "send_sms", "sms_sent_at",
        "is_active", "created_by", "created_at",
    )
    list_filter = ("severity", "is_active", "send_sms", "ward")
    search_fields = ("title", "body")
    readonly_fields = ("sms_sent_at", "created_by", "created_at", "updated_at")

    def save_model(self, request, obj, form, change):
        is_new = obj.pk is None
        should_fan_out = obj.send_sms and not obj.sms_sent_at
        if is_new and not obj.created_by_id:
            obj.created_by = request.user
        super().save_model(request, obj, form, change)
        if should_fan_out:
            from .tasks import fan_out_alert_sms
            fan_out_alert_sms.delay(obj.id)
