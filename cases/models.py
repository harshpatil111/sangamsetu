from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL

class MissingPerson(models.Model):
    name = models.CharField(max_length=100)
    age = models.IntegerField()
    gender = models.CharField(max_length=10)
    last_seen_location = models.CharField(max_length=255)
    last_seen_date = models.DateField(null=True, blank=True)
    description = models.TextField(blank=True, null=True)
    clothing = models.TextField(blank=True, null=True)
    identifying_marks = models.TextField(blank=True, null=True)
    contact_name = models.CharField(max_length=100, blank=True, null=True)
    contact_phone = models.CharField(max_length=20, blank=True, null=True)
    contact_email = models.EmailField(blank=True, null=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_found = models.BooleanField(default=False)

    def __str__(self):
        return self.name
    
class FoundPerson(models.Model):
    MENTAL_STATE_CHOICES = [
        ('ALERT', 'Alert/Normal'),
        ('CONFUSED', 'Confused'),
        ('DISTRESSED', 'Distressed'),
        ('UNCONSCIOUS', 'Unconscious'),
        ('INJURED', 'Injured'),
    ]
    
    approximate_age = models.IntegerField()
    gender = models.CharField(max_length=10)
    found_location = models.CharField(max_length=255)
    found_date = models.DateField(null=True, blank=True)
    physical_description = models.TextField(blank=True, null=True)
    clothing_description = models.CharField(max_length=500, blank=True, null=True)
    distinctive_features = models.TextField(blank=True, null=True)
    mental_state = models.CharField(max_length=20, choices=MENTAL_STATE_CHOICES, blank=True, null=True)
    finder_name = models.CharField(max_length=100, blank=True, null=True)
    finder_phone = models.CharField(max_length=20, blank=True, null=True)
    finder_email = models.EmailField(blank=True, null=True)
    current_location = models.CharField(max_length=255, blank=True, null=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.found_location
    
class MatchSuggestion(models.Model):
    missing_person = models.ForeignKey(
        'MissingPerson',
        on_delete=models.CASCADE,
        related_name='match_suggestions'
    )
    found_person = models.ForeignKey(
        'FoundPerson',
        on_delete=models.CASCADE,
        related_name='match_suggestions'
    )
    confidence = models.FloatField()
    is_confirmed = models.BooleanField(default=False)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Match {self.missing_person.id} - {self.found_person.id}"
