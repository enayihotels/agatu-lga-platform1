from django.urls import path

from .views import (
    ConfirmPhoneVerificationView,
    MeView,
    RegisterView,
    RequestPhoneVerificationView,
)

app_name = "accounts"

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("me/", MeView.as_view(), name="me"),
    path("verify-phone/request/", RequestPhoneVerificationView.as_view(), name="verify-phone-request"),
    path("verify-phone/confirm/", ConfirmPhoneVerificationView.as_view(), name="verify-phone-confirm"),
]
