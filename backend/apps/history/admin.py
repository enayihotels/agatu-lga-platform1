from django.contrib import admin

from .models import Leader, HistoricalEvent, CultureEntry


@admin.register(Leader)
class LeaderAdmin(admin.ModelAdmin):
    list_display = ("full_name", "title", "start_year", "end_year", "is_current", "ward")
    list_filter = ("is_current", "ward")
    search_fields = ("full_name", "title", "biography")
    ordering = ("-start_year",)


@admin.register(HistoricalEvent)
class HistoricalEventAdmin(admin.ModelAdmin):
    list_display = ("title", "year", "month", "related_leader")
    list_filter = ("year",)
    search_fields = ("title", "summary")


@admin.register(CultureEntry)
class CultureEntryAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "local_text", "updated_at")
    list_filter = ("category",)
    search_fields = ("title", "local_text", "english_meaning")
    prepopulated_fields = {"slug": ("title",)}
