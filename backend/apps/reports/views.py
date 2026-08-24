from django.db import transaction
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response

from apps.accounts.permissions import IsVerifiedAccount, IsWardOfficerOrAbove
from apps.notifications.models import NotificationLog
from apps.notifications.tasks import send_notification_sms

from .models import CitizenReport, ReportPhoto, ReportStatus
from .serializers import CitizenReportSerializer, ReportPhotoSerializer


class CitizenReportViewSet(viewsets.ModelViewSet):
    """
    Any verified account can submit a report and see their own reports.
    Ward officers see reports scoped to their own ward; content editors
    and super admins see everything. Status changes go through the
    dedicated update_status action below (not a raw PATCH) -- that's
    what triggers the audit trail entry and the status-change SMS back
    to the resident who submitted it.
    """
    queryset = (
        CitizenReport.objects.all()
        .select_related("ward", "submitted_by")
        .prefetch_related("photos", "status_updates")
    )
    serializer_class = CitizenReportSerializer
    parser_classes = (MultiPartParser, FormParser)

    def get_permissions(self):
        if self.action == "update_status":
            return [IsWardOfficerOrAbove()]
        return [IsVerifiedAccount()]

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user
        if user.is_content_editor:  # covers super admins too
            return qs
        if user.is_ward_officer:
            return qs.filter(ward_id=user.ward_id)
        return qs.filter(submitted_by=user)

    def perform_create(self, serializer):
        serializer.save(submitted_by=self.request.user)

    @action(detail=True, methods=["post"])
    def update_status(self, request, pk=None):
        report = self.get_object()
        new_status = request.data.get("status")
        note = request.data.get("note", "")

        if new_status not in ReportStatus.values:
            return Response({"detail": "Invalid status."}, status=400)

        old_status = report.status
        if old_status == new_status:
            return Response({"detail": "Report is already in that status."}, status=400)

        report.status = new_status
        report.save(update_fields=["status", "updated_at"])

        report.status_updates.create(
            old_status=old_status, new_status=new_status, note=note, updated_by=request.user
        )

        submitter = report.submitted_by
        if submitter and submitter.phone_number and submitter.receives_sms_alerts:
            body = f"AgatuConnect: your report '{report.title}' is now {report.get_status_display()}."
            log = NotificationLog.objects.create(
                recipient_phone=submitter.phone_number, recipient_user=submitter, body=body
            )
            transaction.on_commit(lambda: send_notification_sms.delay(log.id))

        serializer = self.get_serializer(report)
        return Response(serializer.data)

    @action(detail=True, methods=["post"], parser_classes=(MultiPartParser, FormParser))
    def add_photo(self, request, pk=None):
        report = self.get_object()
        if not (
            request.user == report.submitted_by
            or request.user.is_content_editor
            or request.user.is_ward_officer
        ):
            return Response({"detail": "Not allowed to add a photo to this report."}, status=403)

        image = request.FILES.get("image")
        if not image:
            return Response({"detail": "No image provided."}, status=400)

        photo = ReportPhoto.objects.create(report=report, image=image)
        return Response(ReportPhotoSerializer(photo).data, status=201)
