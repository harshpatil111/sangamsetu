from django.urls import path
from .views import (
    ConfirmMatchView, RejectMatchView, MatchListView, 
    MissingPersonCreateView, MissingPersonListView,
    FoundPersonCreateView, FoundPersonListView,
    DashboardStatsView
)

urlpatterns = [
    path('missing/', MissingPersonCreateView.as_view()),
    path('missing/list/', MissingPersonListView.as_view()),
    path('found/', FoundPersonCreateView.as_view()),
    path('found/list/', FoundPersonListView.as_view()),
    path('matches/', MatchListView.as_view()),
    path('matches/confirm/<int:match_id>/', ConfirmMatchView.as_view()),
    path('matches/reject/<int:match_id>/', RejectMatchView.as_view()),
    path('stats/', DashboardStatsView.as_view()),
    ]
