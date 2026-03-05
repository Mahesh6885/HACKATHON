from django.db import models
from django.contrib.auth.models import User

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=50, default="STUDENT") # STUDENT, ADMIN
    department = models.CharField(max_length=100, blank=True)
    year = models.IntegerField(default=1)
    cgpa = models.FloatField(default=0.0)
    skills = models.TextField(blank=True, help_text="Comma separated skills")
    target_role = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.role}"
