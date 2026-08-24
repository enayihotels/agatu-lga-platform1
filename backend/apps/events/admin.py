from django.contrib import admin

from .models import Event, RSVP


class RSVPInline(admin.TabularInline):
    model = RSVP
    extra = 0
    readonly_fields = ("user", "created_at")


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ("title", "ward", "starts_at", "ends_at", "is_public")
    list_filter = ("is_public", "ward")
    search_fields = ("title", "description", "location")
    prepopulated_fields = {"slug": ("title",)}
    inlines = [RSVPInline]


@admin.register(RSVP)
class RSVPAdmin(admin.ModelAdmin):
    list_display = ("event", "user", "created_at")
    list_filter = ("event",)
