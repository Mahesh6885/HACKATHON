from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.db.models import Avg
from django.utils import timezone
from django.db import transaction


def _compute_readiness(user):
    """Compute overall readiness score for a user."""
    from resume_app.models import Resume
    from interview_app.models import InterviewSession
    from tests_app.models import TestScore

    resume_score = 0
    try:
        latest = Resume.objects.filter(user=user).order_by('-uploaded_at').first()
        if latest:
            resume_score = latest.ats_score or 0
    except Exception:
        pass

    interview_avg = InterviewSession.objects.filter(user=user).aggregate(a=Avg('score'))['a'] or 0
    test_avg = TestScore.objects.filter(user=user).aggregate(a=Avg('score'))['a'] or 0

    return round((resume_score * 0.3) + (float(interview_avg) * 0.4) + (float(test_avg) * 0.3), 1)


def _last_active(user):
    if not user.last_login:
        return 'Never'
    delta = timezone.now() - user.last_login
    if delta.seconds < 3600 and delta.days == 0:
        return f"{delta.seconds // 60} mins ago"
    elif delta.days == 0:
        return f"{delta.seconds // 3600} hrs ago"
    elif delta.days == 1:
        return "1 day ago"
    return f"{delta.days} days ago"


class DepartmentTreeView(APIView):
    """
    GET /api/admin/tree/
    Returns Department → Year → Students tree for management UI.
    """
    def get(self, request):
        from organization_app.models import Department, AcademicYear, StudentProfile

        tree = []
        for dept in Department.objects.prefetch_related('years__students__user').all():
            years = []
            for year in dept.years.all():
                students = []
                for profile in year.students.select_related('user').all():
                    u = profile.user
                    students.append({
                        'id': u.id,
                        'roll': u.username,
                        'name': u.get_full_name() or u.username,
                        'email': u.email,
                        'readiness': _compute_readiness(u),
                        'last_active': _last_active(u),
                        'is_active': u.is_active,
                    })
                years.append({
                    'id': year.id,
                    'year_name': year.year_name,
                    'student_count': len(students),
                    'students': students,
                })
            tree.append({
                'id': dept.id,
                'name': dept.name,
                'year_count': len(years),
                'student_count': sum(y['student_count'] for y in years),
                'years': years,
            })
        return Response(tree)


class DepartmentDeleteView(APIView):
    """DELETE /api/admin/department/<dept_id>/delete/"""
    def delete(self, request, dept_id):
        from organization_app.models import Department
        try:
            dept = Department.objects.get(id=dept_id)
        except Department.DoesNotExist:
            return Response({'error': 'Department not found'}, status=404)

        with transaction.atomic():
            # Delete all users who belong to this department
            user_ids = list(
                dept.years.values_list('students__user__id', flat=True)
            )
            User.objects.filter(id__in=[uid for uid in user_ids if uid]).delete()
            dept.delete()

        return Response({'message': f'Department "{dept.name}" and all its students deleted.'})


class DepartmentCreateView(APIView):
    """POST /api/admin/department/create/"""
    def post(self, request):
        from organization_app.models import Department
        name = request.data.get('name', '').strip()
        if not name:
            return Response({'error': 'Department name is required'}, status=400)
        
        if Department.objects.filter(name__iexact=name).exists():
            return Response({'error': 'A department with this name already exists'}, status=400)
            
        dept = Department.objects.create(name=name)
        return Response({'message': 'Department created successfully', 'id': dept.id, 'name': dept.name}, status=201)


class AcademicYearDeleteView(APIView):
    """DELETE /api/admin/year/<year_id>/delete/"""
    def delete(self, request, year_id):
        from organization_app.models import AcademicYear
        try:
            year = AcademicYear.objects.get(id=year_id)
        except AcademicYear.DoesNotExist:
            return Response({'error': 'Year not found'}, status=404)

        with transaction.atomic():
            user_ids = list(year.students.values_list('user__id', flat=True))
            User.objects.filter(id__in=[uid for uid in user_ids if uid]).delete()
            year.delete()

        return Response({'message': f'Year "{year.year_name}" and all its students deleted.'})


class AcademicYearCreateView(APIView):
    """POST /api/admin/year/create/"""
    def post(self, request):
        from organization_app.models import AcademicYear, Department
        year_name = request.data.get('year_name', '').strip()
        department_id = request.data.get('department_id')
        
        if not year_name or not department_id:
            return Response({'error': 'Year name and department_id are required'}, status=400)
            
        try:
            dept = Department.objects.get(id=department_id)
        except Department.DoesNotExist:
            return Response({'error': 'Department not found'}, status=404)
            
        if AcademicYear.objects.filter(department=dept, year_name__iexact=year_name).exists():
            return Response({'error': 'This year already exists in the department'}, status=400)
            
        year = AcademicYear.objects.create(department=dept, year_name=year_name)
        return Response({
            'message': 'Year created successfully', 
            'id': year.id, 
            'year_name': year.year_name,
            'department_id': dept.id
        }, status=201)


class StudentDeleteView(APIView):
    """DELETE /api/admin/student/<user_id>/delete/"""
    def delete(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'error': 'Student not found'}, status=404)

        if user.is_staff or user.is_superuser:
            return Response({'error': 'Cannot delete admin users.'}, status=403)

        username = user.username
        user.delete()
        return Response({'message': f'Student "{username}" deleted.'})


class StudentUpdateCredentialsView(APIView):
    """PATCH /api/admin/student/<user_id>/credentials/"""
    def patch(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'error': 'Student not found'}, status=404)

        if user.is_staff or user.is_superuser:
            return Response({'error': 'Cannot edit admin credentials here.'}, status=403)

        data = request.data
        errors = {}

        new_username = data.get('username', '').strip()
        new_email = data.get('email', '').strip()
        new_password = data.get('password', '').strip()
        new_name = data.get('name', '').strip()

        if new_username and new_username != user.username:
            if User.objects.filter(username=new_username).exclude(id=user_id).exists():
                errors['username'] = 'This roll number is already taken.'
            else:
                user.username = new_username

        if new_email and new_email != user.email:
            if User.objects.filter(email=new_email).exclude(id=user_id).exists():
                errors['email'] = 'This email is already in use.'
            else:
                user.email = new_email

        if new_name:
            parts = new_name.split(' ', 1)
            user.first_name = parts[0]
            user.last_name = parts[1] if len(parts) > 1 else ''

        if new_password:
            if len(new_password) < 6:
                errors['password'] = 'Password must be at least 6 characters.'
            else:
                user.set_password(new_password)

        if errors:
            return Response({'errors': errors}, status=400)

        user.save()
        return Response({'message': 'Credentials updated successfully.', 'roll': user.username, 'email': user.email})
