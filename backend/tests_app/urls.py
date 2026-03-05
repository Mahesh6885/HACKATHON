from django.urls import path
from .views import TestScoreListCreateView

urlpatterns = [
    path('', TestScoreListCreateView.as_view(), name='tests-list-create'),
]
