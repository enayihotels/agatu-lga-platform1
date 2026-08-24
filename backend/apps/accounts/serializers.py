from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()


class UserProfileSerializer(serializers.ModelSerializer):
    """Read-only profile info returned to the frontend after login."""

    ward_name = serializers.CharField(source="ward.name", read_only=True, default=None)

    class Meta:
        model = User
        fields = (
            "id", "username", "email", "first_name", "last_name",
            "role", "phone_number", "ward", "ward_name",
            "is_phone_verified", "receives_sms_alerts",
        )
        read_only_fields = fields


class RegisterSerializer(serializers.ModelSerializer):
    """
    Public self-registration. New accounts default to VERIFIED_RESIDENT
    role at the DB level. is_phone_verified stays False until the user
    completes the OTP flow below — some future permissions (citizen
    reports, RSVPs) may require it.
    """
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = (
            "id", "username", "email", "first_name", "last_name",
            "phone_number", "ward", "password",
        )

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class ConfirmPhoneVerificationSerializer(serializers.Serializer):
    code = serializers.CharField(max_length=6, min_length=6)
