from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin

from .models import PhoneVerificationCode, User


@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    list_display = (
        "username", "email", "role", "phone_number", "ward",
        "is_phone_verified", "is_staff", "created_at",
    )
    list_filter = ("role", "is_staff", "is_phone_verified", "receives_sms_alerts", "ward")
    search_fields = ("username", "email", "phone_number", "first_name", "last_name")
    fieldsets = DjangoUserAdmin.fieldsets + (
        ("Agatu Profile", {
            "fields": (
                "role", "phone_number", "ward",
                "is_phone_verified", "receives_sms_alerts",
            )
        }),
    )


@admin.register(PhoneVerificationCode)
class PhoneVerificationCodeAdmin(admin.ModelAdmin):
    """
    Registered mainly for local debugging — lets you see the code that
    was generated without digging through Celery/Twilio logs, since in
    dev Twilio may not even be configured yet.
    """
    list_display = ("user", "code", "is_used", "created_at", "expires_at")
    list_filter = ("is_used",)
    search_fields = ("user__username", "user__phone_number", "code")
    readonly_fields = ("user", "code", "created_at", "expires_at")
