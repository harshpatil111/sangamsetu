from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import MissingPerson, FoundPerson, MatchSuggestion
from .serializers import (
    MissingPersonSerializer,
    FoundPersonSerializer,
    MatchSuggestionSerializer,
)
from .permissions import IsVolunteerOrPolice
from .utils import calculate_confidence


class MissingPersonCreateView(generics.CreateAPIView):
    serializer_class = MissingPersonSerializer
    permission_classes = [IsAuthenticated, IsVolunteerOrPolice]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class MissingPersonListView(generics.ListAPIView):
    queryset = MissingPerson.objects.all().order_by('-created_at')
    serializer_class = MissingPersonSerializer
    permission_classes = [IsAuthenticated, IsVolunteerOrPolice]


class FoundPersonCreateView(generics.CreateAPIView):
    serializer_class = FoundPersonSerializer
    permission_classes = [IsAuthenticated, IsVolunteerOrPolice]

    def perform_create(self, serializer):
        found = serializer.save(created_by=self.request.user)
        missing_cases = MissingPerson.objects.filter(is_found=False)

        for missing in missing_cases:
            confidence = calculate_confidence(missing, found)
            if confidence >= 0.6:
                MatchSuggestion.objects.create(
                    missing_person=missing,
                    found_person=found,
                    confidence=confidence,
                )


class FoundPersonListView(generics.ListAPIView):
    queryset = FoundPerson.objects.all().order_by('-created_at')
    serializer_class = FoundPersonSerializer
    permission_classes = [IsAuthenticated, IsVolunteerOrPolice]


class MatchListView(generics.ListAPIView):
    queryset = MatchSuggestion.objects.all().order_by('-confidence', '-created_at')
    serializer_class = MatchSuggestionSerializer
    permission_classes = [IsAuthenticated, IsVolunteerOrPolice]


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class DashboardStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        stats = {
            'missing_count': MissingPerson.objects.count(),
            'found_count': FoundPerson.objects.count(),
            'match_count': MatchSuggestion.objects.count(),
        }
        return Response(stats)

class ConfirmMatchView(APIView):
    permission_classes = [IsVolunteerOrPolice]

    def post(self, request, match_id):
        try:
            match = MatchSuggestion.objects.get(id=match_id)
        except MatchSuggestion.DoesNotExist:
            return Response(
                {"error": "Match not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        # Only police or admin should confirm (logic-level safety)
        if not request.user.groups.filter(name__in=["POLICE", "ADMIN"]).exists():
            return Response(
                {"error": "You are not authorized to confirm matches"},
                status=status.HTTP_403_FORBIDDEN
            )

        # Confirm match
        match.is_confirmed = True
        match.save()

        # Mark missing person as found
        missing = match.missing_person
        missing.is_found = True
        missing.save()

        # Optional: delete other unconfirmed matches for same missing person
        MatchSuggestion.objects.filter(
            missing_person=missing,
            is_confirmed=False
        ).exclude(id=match.id).delete()

        return Response(
            {"message": "Match confirmed successfully"},
            status=status.HTTP_200_OK
        )


class RejectMatchView(APIView):
    permission_classes = [IsVolunteerOrPolice]

    def delete(self, request, match_id):
        try:
            match = MatchSuggestion.objects.get(id=match_id)
        except MatchSuggestion.DoesNotExist:
            return Response(
                {"error": "Match not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        # Only police or admin should reject (logic-level safety)
        if not request.user.groups.filter(name__in=["POLICE", "ADMIN"]).exists():
            return Response(
                {"error": "You are not authorized to reject matches"},
                status=status.HTTP_403_FORBIDDEN
            )

        # Delete the match
        match.delete()

        return Response(
            {"message": "Match rejected successfully"},
            status=status.HTTP_200_OK
        )

