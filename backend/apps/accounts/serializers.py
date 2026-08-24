from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()


class UserProfileSerializer(serializers.ModelSerializer):
    """Read-only profile info returned to the frontend after login."""

    class Meta:
        model = User
        fields = (
            "id", "username", "email", "first_name", "last_name",
            "role", "phone_number", "ward_name",
            "is_phone_verified", "receives_sms_alerts",
        )
        read_only_fields = fields


class RegisterSerializer(serializers.ModelSerializer):
    """
    Public self-registration. New accounts default to VERIFIED_RESIDENT
    role at the DB level, but phone verification (Phase 4/5, via Twilio
    OTP) must flip is_phone_verified before they gain resident privileges
    like submitting citizen reports.
    """
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = (
            "id", "username", "email", "first_name", "last_name",
            "phone_number", "ward_name", "password",
        )

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user
