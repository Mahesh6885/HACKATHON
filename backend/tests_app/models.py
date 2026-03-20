from django.db import models
from django.contrib.auth.models import User

class TestScore(models.Model):
    TEST_TYPES = (
        ('APTITUDE', 'Aptitude'),
        ('CODING', 'Coding'),
        ('ENGLISH', 'English'),
        ('DOMAIN', 'Domain'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    test_name = models.CharField(max_length=150)
    type = models.CharField(max_length=50, choices=TEST_TYPES, default='APTITUDE')
    score = models.IntegerField()
    total = models.IntegerField(default=100)
    percentile = models.FloatField(blank=True, null=True)
    taken_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.test_name} ({self.score}/{self.total})"
