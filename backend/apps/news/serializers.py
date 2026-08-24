from rest_framework import serializers

from .models import NewsCategory, NewsPost, NewsFlash


class NewsCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsCategory
        fields = ("id", "name", "slug")


class NewsPostListSerializer(serializers.ModelSerializer):
    """Lightweight version for feed/listing views."""
    category_name = serializers.CharField(source="category.name", read_only=True, default=None)
    ward_name = serializers.CharField(source="ward.name", read_only=True, default=None)
    author_name = serializers.CharField(source="author.get_full_name", read_only=True, default=None)

    class Meta:
        model = NewsPost
        fields = (
            "id", "title", "slug", "excerpt", "cover_image",
            "category_name", "ward_name", "author_name", "published_at",
        )


class NewsPostDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsPost
        fields = (
            "id", "title", "slug", "excerpt", "body", "cover_image",
            "category", "ward", "author", "is_published", "published_at",
            "ai_assisted_draft", "created_at", "updated_at",
        )
        read_only_fields = ("author", "ai_assisted_draft", "created_at", "updated_at")


class NewsFlashSerializer(serializers.ModelSerializer):
    linked_post_slug = serializers.CharField(source="linked_post.slug", read_only=True, default=None)

    class Meta:
        model = NewsFlash
        fields = ("id", "headline", "linked_post", "linked_post_slug", "priority", "expires_at")
