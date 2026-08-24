from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin

from .models import User


@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    list_display = (
        "username", "email", "role", "phone_number",
        "is_phone_verified", "is_staff", "created_at",
    )
    list_filter = ("role", "is_staff", "is_phone_verified", "receives_sms_alerts")
    search_fields = ("username", "email", "phone_number", "first_name", "last_name")
    fieldsets = DjangoUserAdmin.fieldsets + (
        ("Agatu Profile", {
            "fields": (
                "role", "phone_number", "ward_name",
                "is_phone_verified", "receives_sms_alerts",
            )
        }),
    )
