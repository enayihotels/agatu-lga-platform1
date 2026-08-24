from rest_framework.permissions import BasePermission


class IsSuperAdmin(BasePermission):
    """Only you (or another designated super admin) can pass this check."""

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_super_admin)


class IsContentEditor(BasePermission):
    """Super admins and content editors â€” used for news/history/media CRUD."""

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_content_editor)


class IsWardOfficerOrAbove(BasePermission):
    """Ward officers, content editors, and super admins."""

    def has_permission(self, request, view):
        user = request.user
        return bool(
            user
            and user.is_authenticated
            and (user.is_content_editor or user.is_ward_officer)
        )


class IsVerifiedAccount(BasePermission):
    """Any authenticated, non-service account â€” used for citizen reports, RSVPs, comments."""

    def has_permission(self, request, view):
        user = request.user
        return bool(user and user.is_authenticated)
