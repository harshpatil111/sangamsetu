from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = (
        ('ADMIN', 'Admin'),
        ('VOLUNTEER', 'Volunteer'),
        ('POLICE', 'Police'),
    )

    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    zone = models.CharField(max_length=100, blank=True, null=True)

    