from django.urls import path
from .views import (
    DepartmentTreeView,
    DepartmentDeleteView,
    DepartmentCreateView,
    AcademicYearDeleteView,
    AcademicYearCreateView,
    StudentDeleteView,
    StudentUpdateCredentialsView,
)

# Keep old dashboard view for the AdminDashboard page
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.db.models import Avg


def _compute_student_stats(user):
    from resume_app.models import Resume
    from interview_app.models import InterviewSession
    from tests_app.models import TestScore
    from certs_app.models import Certification
    from django.utils import timezone

    resume_score = 0
    try:
        latest = Resume.objects.filter(user=user).order_by('-uploaded_at').first()
        if latest:
            resume_score = latest.ats_score or 0
    except Exception:
        pass

    interviews = InterviewSession.objects.filter(user=user)
    interview_avg = interviews.aggregate(a=Avg('score'))['a'] or 0
    interview_count = interviews.count()

    tests = TestScore.objects.filter(user=user)
    test_avg = tests.aggregate(a=Avg('score'))['a'] or 0
    test_count = tests.count()

    certs_count = Certification.objects.filter(user=user).count()

    readiness = round(
        (resume_score * 0.3) + (float(interview_avg) * 0.4) + (float(test_avg) * 0.3), 1
    )
    areas = {'Resume': resume_score, 'Interview': float(interview_avg) * 10,
              'Aptitude': float(test_avg)}
    weakness = min(areas, key=areas.get) if any(areas.values()) else 'N/A'

    if user.last_login:
        delta = timezone.now() - user.last_login
        if delta.seconds < 3600 and delta.days == 0:
            last_active = f"{delta.seconds // 60} mins ago"
        elif delta.days == 0:
            last_active = f"{delta.seconds // 3600} hrs ago"
        elif delta.days == 1:
            last_active = "1 day ago"
        else:
            last_active = f"{delta.days} days ago"
    else:
        last_active = "Never"

    return {
        'readiness': readiness, 'resume_score': resume_score,
        'interview_avg': round(float(interview_avg), 1), 'interview_count': interview_count,
        'test_avg': round(float(test_avg), 1), 'test_count': test_count,
        'certs_count': certs_count, 'weakness': weakness, 'last_active': last_active,
    }


class AdminDashboardView(APIView):
    def get(self, request):
        students_qs = User.objects.filter(is_staff=False, is_active=True)
        total_students = students_qs.count()
        rows = []
        readiness_scores = []
        for u in students_qs:
            stats = _compute_student_stats(u)
            readiness_scores.append(stats['readiness'])
            rows.append({'id': u.id, 'roll': u.username,
                         'name': u.first_name or u.username.capitalize(),
                         'email': u.email, 'dept': 'CSE', 'year': 'Final', **stats})
        avg_readiness = round(sum(readiness_scores) / len(readiness_scores), 1) if readiness_scores else 0
        at_risk = sum(1 for s in readiness_scores if s < 60)
        all_weaknesses = [r['weakness'] for r in rows if r['weakness'] != 'N/A']
        top_gap = max(set(all_weaknesses), key=all_weaknesses.count) if all_weaknesses else 'N/A'
        return Response({
            'stats': {'total_students': total_students, 'avg_readiness': avg_readiness,
                      'at_risk_count': at_risk, 'top_gap_area': top_gap},
            'students': rows,
        })


class AdminStudentDetailView(APIView):
    def get(self, request, username):
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({'error': f'Student with roll {username} not found.'}, status=404)
        stats = _compute_student_stats(user)
        return Response({'id': user.id, 'roll': user.username,
                         'name': user.first_name or user.username.capitalize(),
                         'email': user.email, 'dept': 'CSE', 'year': 'Final', **stats})


urlpatterns = [
    path('dashboard/', AdminDashboardView.as_view(), name='admin_dashboard'),
    path('student/<str:username>/', AdminStudentDetailView.as_view(), name='admin_student_detail'),

    # Hierarchical management
    path('tree/', DepartmentTreeView.as_view(), name='admin_tree'),
    path('department/create/', DepartmentCreateView.as_view(), name='admin_dept_create'),
    path('department/<int:dept_id>/delete/', DepartmentDeleteView.as_view(), name='admin_dept_delete'),
    path('year/create/', AcademicYearCreateView.as_view(), name='admin_year_create'),
    path('year/<int:year_id>/delete/', AcademicYearDeleteView.as_view(), name='admin_year_delete'),
    path('student/<int:user_id>/delete/', StudentDeleteView.as_view(), name='admin_student_delete'),
    path('student/<int:user_id>/credentials/', StudentUpdateCredentialsView.as_view(), name='admin_student_credentials'),
]
