from django.contrib import admin
from django.db import transaction

from .models import CitizenReport, ReportPhoto, ReportStatusUpdate


class ReportPhotoInline(admin.TabularInline):
    model = ReportPhoto
    extra = 0
    readonly_fields = ("created_at",)


class ReportStatusUpdateInline(admin.TabularInline):
    model = ReportStatusUpdate
    extra = 0
    readonly_fields = ("old_status", "new_status", "note", "updated_by", "created_at")
    can_delete = False

    def has_add_permission(self, request, obj=None):
        return False


@admin.register(CitizenReport)
class CitizenReportAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "ward", "status", "submitted_by", "created_at")
    list_filter = ("status", "category", "ward")
    search_fields = ("title", "description")
    inlines = [ReportPhotoInline, ReportStatusUpdateInline]
    readonly_fields = ("submitted_by", "created_at", "updated_at")

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        user = request.user
        if user.is_superuser or getattr(user, "is_content_editor", False):
            return qs
        if getattr(user, "is_ward_officer", False):
            return qs.filter(ward_id=user.ward_id)
        return qs.none()

    def save_model(self, request, obj, form, change):
        """
        Detect a status change made directly in the admin (not via the
        API's update_status action) and log + notify the same way, so
        both paths stay consistent for the resident who submitted it.
        """
        old_status = None
        if change:
            old_status = (
                CitizenReport.objects.filter(pk=obj.pk).values_list("status", flat=True).first()
            )

        super().save_model(request, obj, form, change)

        if change and old_status and old_status != obj.status:
            obj.status_updates.create(
                old_status=old_status, new_status=obj.status, updated_by=request.user
            )
            submitter = obj.submitted_by
            if submitter and submitter.phone_number and submitter.receives_sms_alerts:
                from apps.notifications.models import NotificationLog
                from apps.notifications.tasks import send_notification_sms

                body = f"AgatuConnect: your report '{obj.title}' is now {obj.get_status_display()}."
                log = NotificationLog.objects.create(
                    recipient_phone=submitter.phone_number,
                    recipient_user=submitter,
                    body=body,
                )
                transaction.on_commit(lambda: send_notification_sms.delay(log.id))
