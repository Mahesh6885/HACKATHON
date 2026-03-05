from django.db import models
from django.contrib.auth.models import User

class Resume(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    file_url = models.CharField(max_length=500)
    score = models.IntegerField(default=0)
    feedback_items = models.JSONField(default=dict)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Resume of {self.user.username} - Score: {self.score}"
