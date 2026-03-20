from rest_framework import serializers
from .models import InterviewSession

class InterviewSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = InterviewSession
        fields = ['id', 'user', 'role_target', 'score', 'feedback', 'session_date']
        read_only_fields = ['user', 'session_date']
