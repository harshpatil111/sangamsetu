from rest_framework import serializers
from .models import MissingPerson, FoundPerson,MatchSuggestion

class MissingPersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = MissingPerson
        fields = [
            'id', 'name', 'age', 'gender', 'last_seen_location', 
            'last_seen_date', 'description', 'clothing', 'identifying_marks',
            'contact_name', 'contact_phone', 'contact_email',
            'created_by', 'created_at', 'is_found'
        ]
        read_only_fields = ['id', 'created_by', 'created_at', 'is_found']


class FoundPersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = FoundPerson
        fields = '__all__'
        read_only_fields = ['created_by', 'created_at']

class MatchSuggestionSerializer(serializers.ModelSerializer):
    missing_name = serializers.CharField(
        source="missing_person.name",
        read_only=True
    )
    found_location = serializers.CharField(
        source="found_person.found_location",
        read_only=True
    )
    missing_person_data = MissingPersonSerializer(
        source="missing_person",
        read_only=True
    )
    found_person_data = FoundPersonSerializer(
        source="found_person",
        read_only=True
    )
    confidence_score = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()

    class Meta:
        model = MatchSuggestion
        fields = [
            "id",
            "missing_name",
            "found_location",
            "missing_person_data",
            "found_person_data",
            "confidence",
            "confidence_score",
            "is_confirmed",
            "status",
            "created_at"
        ]

    def get_confidence_score(self, obj):
        return int(obj.confidence * 100)

    def get_status(self, obj):
        if obj.is_confirmed:
            return "CONFIRMED"
        return "PENDING"
