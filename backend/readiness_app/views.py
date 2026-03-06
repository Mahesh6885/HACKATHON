from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from ml_engine.career_mentor.roadmap_generator import generate_roadmap
from resume_app.models import Resume
from interview_app.models import InterviewSession

class DashboardMetricsView(APIView):
    # permission_classes = [IsAuthenticated] # Uncomment for prod
    
    def get(self, request, *args, **kwargs):
        from django.contrib.auth.models import User
        # We will use the first mock user for hackathon tests if not logged in
        user = request.user if request.user.is_authenticated else User.objects.first()
        user_id = user.id if user else 1
        
        # 1. Fetch Latest Resume Score
        latest_resume = Resume.objects.filter(user_id=user_id).order_by('-uploaded_at').first()
        resume_score = latest_resume.score if latest_resume else 0
        
        # 2. Fetch Interview Scores
        interviews = InterviewSession.objects.filter(user_id=user_id)
        interview_score = sum(i.score for i in interviews) / len(interviews) if interviews else 0
        
        # 3. Fetch User and Student Profile (for real data instead of dummy)
        from django.contrib.auth.models import User
        from organization_app.models import StudentProfile
        
        try:
            user = User.objects.get(id=user_id)
            student_profile = StudentProfile.objects.get(user=user)
            username = user.get_full_name() or user.username.capitalize()
            test_score = student_profile.previous_test_score
            department_name = student_profile.year.department.name
            year_name = student_profile.year.year_name
        except (User.DoesNotExist, StudentProfile.DoesNotExist):
            username = "Guest"
            test_score = 0
            department_name = "Unknown"
            year_name = "Unknown"
            
        cert_score = 60 # Certs app is not yet modeled
        
        # 4. Calculate Overall Readiness
        overall_ready = (resume_score * 0.25) + (test_score * 0.25) + (cert_score * 0.20) + (interview_score * 0.30)
        
        # 5. ML Engine: Generate Actionable Roadmap Tasks
        metrics = {
            "resume_score": resume_score,
            "overall_test_score": test_score,
            "interview_avg_score": interview_score
        }
        ai_tasks = generate_roadmap(metrics)
        
        return Response({
            "metrics": {
                "readiness_percentage": round(overall_ready, 1),
                "resume_score": resume_score,
                "test_score": test_score,
                "cert_score": cert_score,
                "interview_score": round(interview_score, 1)
            },
            "user_info": {
                "name": username,
                "department": department_name,
                "year": year_name
            },
            "ai_roadmap": ai_tasks
        }, status=status.HTTP_200_OK)
