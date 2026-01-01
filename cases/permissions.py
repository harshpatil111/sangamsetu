

from rest_framework.permissions import BasePermission

class IsVolunteerOrPolice(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            request.user.groups.filter(name__in=["VOLUNTEER", "POLICE"]).exists()
        )

class IsPoliceOrAdmin(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            request.user.groups.filter(name__in=["POLICE", "ADMIN"]).exists()
        )
