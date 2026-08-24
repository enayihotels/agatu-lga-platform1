from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import PhoneVerificationCode
from .serializers import (
    ConfirmPhoneVerificationSerializer,
    RegisterSerializer,
    UserProfileSerializer,
)
from .tasks import send_otp_sms


class RegisterView(generics.CreateAPIView):
    """POST /api/accounts/register/ — public self-registration."""
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class MeView(APIView):
    """GET /api/accounts/me/ — the logged-in user's own profile."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)


class RequestPhoneVerificationView(APIView):
    """
    POST /api/accounts/verify-phone/request/ — sends a fresh 6-digit
    OTP by SMS to the logged-in user's phone_number. Requires a phone
    number already on file (set at registration or via profile update).
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        if not user.phone_number:
            return Response(
                {"detail": "No phone number on file. Update your profile first."},
                status=400,
            )

        verification = PhoneVerificationCode.generate_for(user)
        send_otp_sms.delay(user.phone_number, verification.code)
        return Response({"detail": "Verification code sent."}, status=200)


class ConfirmPhoneVerificationView(APIView):
    """
    POST /api/accounts/verify-phone/confirm/ — body: {"code": "123456"}.
    Checks the most recent unused, unexpired code for this user and,
    if it matches, marks is_phone_verified True.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ConfirmPhoneVerificationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        code = serializer.validated_data["code"]

        verification = (
            PhoneVerificationCode.objects.filter(user=request.user, code=code, is_used=False)
            .order_by("-created_at")
            .first()
        )
        if not verification or not verification.is_valid():
            return Response({"detail": "Invalid or expired code."}, status=400)

        verification.is_used = True
        verification.save(update_fields=["is_used"])

        request.user.is_phone_verified = True
        request.user.save(update_fields=["is_phone_verified"])

        return Response({"detail": "Phone number verified."}, status=200)
