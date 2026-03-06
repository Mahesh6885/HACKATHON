from django.urls import path
from .views import StartInterviewView, EvaluateAnswerView, HistoryView, VoiceAnswerView

urlpatterns = [
    path('start/', StartInterviewView.as_view(), name='interview-start'),
    path('evaluate/', EvaluateAnswerView.as_view(), name='interview-answer'),
    path('history/', HistoryView.as_view(), name='interview-history'),
    path('transcribe/', VoiceAnswerView.as_view(), name='interview-transcribe'),
]
