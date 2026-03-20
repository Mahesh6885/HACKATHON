from django.db import models
from django.contrib.auth.models import User

class Department(models.Model):
    name = models.CharField(max_length=150, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class AcademicYear(models.Model):
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='years')
    year_name = models.CharField(max_length=50) # e.g., "First Year", "Class of 2024"
    
    class Meta:
        unique_together = ('department', 'year_name')

    def __str__(self):
        return f"{self.department.name} - {self.year_name}"

class StudentProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student_profile')
    year = models.ForeignKey(AcademicYear, on_delete=models.CASCADE, related_name='students')
    previous_test_score = models.FloatField(default=0.0, help_text="Stored base test score for analytical predictions.")

    def __str__(self):
        return f"{self.user.username} ({self.year})"
