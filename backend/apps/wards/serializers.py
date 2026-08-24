from rest_framework import serializers

from .models import Ward, WardContact, Clan


class WardContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = WardContact
        fields = ("id", "full_name", "role_title", "phone_number", "email")


class ClanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Clan
        fields = ("id", "name", "notes")


class WardListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for the ward directory list view."""

    class Meta:
        model = Ward
        fields = (
            "id", "name", "slug", "headquarters_town",
            "is_lga_headquarters", "cover_image",
        )


class WardDetailSerializer(serializers.ModelSerializer):
    contacts = WardContactSerializer(many=True, read_only=True)
    clans = ClanSerializer(many=True, read_only=True)

    class Meta:
        model = Ward
        fields = (
            "id", "name", "slug", "description", "headquarters_town",
            "is_lga_headquarters", "cover_image", "contacts", "clans",
        )
