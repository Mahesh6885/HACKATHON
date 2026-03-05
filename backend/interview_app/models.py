from django.db import models
from django.contrib.auth.models import User

class InterviewSession(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    role_target = models.CharField(max_length=100)
    score = models.FloatField(default=0)
    feedback = models.TextField(blank=True)
    session_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.role_target} Mock"
