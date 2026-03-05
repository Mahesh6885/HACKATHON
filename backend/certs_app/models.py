from django.db import models
from django.contrib.auth.models import User

class Certification(models.Model):
    CATEGORIES = (
        ('CLOUD', 'Cloud'),
        ('DSA', 'DSA'),
        ('JAVA', 'Java'),
        ('FRONTEND', 'Frontend'),
        ('DATA', 'Data Science'),
        ('OTHER', 'Other'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    platform = models.CharField(max_length=100)
    category = models.CharField(max_length=50, choices=CATEGORIES, default='OTHER')
    credential_url = models.URLField(blank=True, max_length=500)
    completed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.title}"
