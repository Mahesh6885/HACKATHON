from django.urls import path
from .views import StartInterviewView, EvaluateAnswerView

urlpatterns = [
    path('start/', StartInterviewView.as_view(), name='interview-start'),
    path('answer/', EvaluateAnswerView.as_view(), name='interview-answer'),
]
