from django.contrib import admin

from .models import PublicQueryLog


@admin.register(PublicQueryLog)
class PublicQueryLogAdmin(admin.ModelAdmin):
    """
    Read-only -- this is a log for spotting content gaps (questions
    residents ask that don't have a good grounded answer yet), not
    something to hand-edit.
    """
    list_display = ("question_preview", "had_sources", "created_at")
    list_filter = ("had_sources", "created_at")
    search_fields = ("question", "answer")
    readonly_fields = [f.name for f in PublicQueryLog._meta.fields]

    def question_preview(self, obj):
        return obj.question[:80]

    question_preview.short_description = "Question"

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False
