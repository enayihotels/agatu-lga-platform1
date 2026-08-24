from django.contrib import admin

from .models import Ward, WardContact, Clan


class WardContactInline(admin.TabularInline):
    model = WardContact
    extra = 1


class ClanInline(admin.TabularInline):
    model = Clan
    extra = 1


@admin.register(Ward)
class WardAdmin(admin.ModelAdmin):
    list_display = ("name", "headquarters_town", "is_lga_headquarters", "updated_at")
    list_filter = ("is_lga_headquarters",)
    search_fields = ("name", "headquarters_town", "description")
    prepopulated_fields = {"slug": ("name",)}
    inlines = [WardContactInline, ClanInline]


@admin.register(WardContact)
class WardContactAdmin(admin.ModelAdmin):
    list_display = ("full_name", "role_title", "ward", "phone_number")
    list_filter = ("ward",)
    search_fields = ("full_name", "role_title")


@admin.register(Clan)
class ClanAdmin(admin.ModelAdmin):
    list_display = ("name", "ward")
    list_filter = ("ward",)
