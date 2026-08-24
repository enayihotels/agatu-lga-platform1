from django.contrib import admin
from django.utils.html import format_html

from .models import MediaAsset


@admin.register(MediaAsset)
class MediaAssetAdmin(admin.ModelAdmin):
    list_display = (
        "thumb_preview",
        "title",
        "asset_type",
        "file_size_display",
        "uploaded_by",
        "created_at",
    )
    list_filter = ("asset_type", "created_at")
    search_fields = ("title", "alt_text", "caption")
    readonly_fields = (
        "asset_type",
        "thumbnail",
        "file_size",
        "width",
        "height",
        "created_at",
        "updated_at",
        "preview",
    )
    fields = (
        "file",
        "preview",
        "title",
        "alt_text",
        "caption",
        "asset_type",
        "thumbnail",
        "file_size",
        "width",
        "height",
        "uploaded_by",
        "created_at",
        "updated_at",
    )

    def thumb_preview(self, obj):
        if obj.thumbnail:
            return format_html(
                '<img src="{}" style="height:40px;border-radius:4px;" />', obj.thumbnail.url
            )
        return "—"

    thumb_preview.short_description = "Preview"

    def preview(self, obj):
        if obj.asset_type == "image" and obj.file:
            return format_html('<img src="{}" style="max-height:300px;" />', obj.file.url)
        return "No preview available for this file type."

    preview.short_description = "Preview"

    def file_size_display(self, obj):
        kb = obj.file_size / 1024
        if kb > 1024:
            return f"{kb / 1024:.1f} MB"
        return f"{kb:.0f} KB"

    file_size_display.short_description = "Size"

    def save_model(self, request, obj, form, change):
        if not obj.uploaded_by_id:
            obj.uploaded_by = request.user
        super().save_model(request, obj, form, change)
