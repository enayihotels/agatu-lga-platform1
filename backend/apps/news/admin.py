from django.contrib import admin

from .models import NewsCategory, NewsPost, NewsFlash


@admin.register(NewsCategory)
class NewsCategoryAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)
    prepopulated_fields = {"slug": ("name",)}


@admin.register(NewsPost)
class NewsPostAdmin(admin.ModelAdmin):
    list_display = (
        "title", "category", "ward", "author",
        "is_published", "published_at", "ai_assisted_draft",
    )
    list_filter = ("is_published", "category", "ward", "ai_assisted_draft")
    search_fields = ("title", "body", "excerpt")
    prepopulated_fields = {"slug": ("title",)}
    autocomplete_fields = ["category", "ward"]

    def save_model(self, request, obj, form, change):
        if not obj.author_id:
            obj.author = request.user
        super().save_model(request, obj, form, change)


@admin.register(NewsFlash)
class NewsFlashAdmin(admin.ModelAdmin):
    list_display = ("headline", "is_active", "priority", "expires_at", "created_at")
    list_filter = ("is_active",)
    search_fields = ("headline",)
