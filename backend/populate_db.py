from django.contrib.auth.models import User
from organization_app.models import Department, AcademicYear, StudentProfile
from resume_app.models import Resume
from interview_app.models import InterviewSession
from tests_app.models import TestScore

print("Starting Database Integrity Test and Seeding...\n")

# 1. Clean slate
Department.objects.all().delete()
User.objects.filter(is_superuser=False).delete()

# 2. Create actual sample data
dept_cse = Department.objects.create(name='Computer Science')
year_2 = AcademicYear.objects.create(department=dept_cse, year_name='Second Year')
year_3 = AcademicYear.objects.create(department=dept_cse, year_name='Third Year')

user_s1 = User.objects.create(username='alice', email='alice@example.com')
profile_s1 = StudentProfile.objects.create(user=user_s1, year=year_3, previous_test_score=85.0)

# Load some dummy Resume and Interview data for Alice so the dashboard isn't blank
Resume.objects.create(user=user_s1, file_url="/media/dummy.pdf", score=88, feedback_items={"formatting":{"status":"good", "text":"Great formatting!"}})
InterviewSession.objects.create(user=user_s1, role_target="Software Engineer", score=78.5, feedback="Good system design grasp, needs more practice on dynamic programming.")

# Dummy test scores for charts
TestScore.objects.create(user=user_s1, test_name="Cognizant GenC Next Aptitude", type="APTITUDE", score=80)
TestScore.objects.create(user=user_s1, test_name="TCS Ninja Coding Round", type="CODING", score=75)
TestScore.objects.create(user=user_s1, test_name="Infosys Pseudo Code", type="DOMAIN", score=62)

user_s2 = User.objects.create(username='bob', email='bob@example.com')
profile_s2 = StudentProfile.objects.create(user=user_s2, year=year_2, previous_test_score=72.5)

print(f"✅ Created Department [{dept_cse.name}] with {dept_cse.years.count()} years.")
print(f"✅ Created Students: {StudentProfile.objects.count()} (with Analytics Scores loaded)")

# 3. Test CASCADE DELETION mechanics
print("\n--- Verifying CASCADE Deletion Constraint ---")
temp_dept = Department.objects.create(name='Mechanical Engineering (Temp)')
temp_year = AcademicYear.objects.create(department=temp_dept, year_name='Temp Year')
temp_user = User.objects.create(username='temp_user_del')
temp_profile = StudentProfile.objects.create(user=temp_user, year=temp_year, previous_test_score=0)

dept_count_before = Department.objects.count()
year_count_before = AcademicYear.objects.count()
student_count_before = StudentProfile.objects.count()

print(f"Temp Environment setup. Deleting department '{temp_dept.name}'...")
temp_dept.delete() # Trigger constraint

dept_count_after = Department.objects.count()
year_count_after = AcademicYear.objects.count()
student_count_after = StudentProfile.objects.count()

assert dept_count_after == dept_count_before - 1, "Department failed to delete"
assert year_count_after == year_count_before - 1, "Year failed to CASCADE cascade"
assert student_count_after == student_count_before - 1, "Student profile failed to CASCADE delete"

print("✅ CASCADE integrity verified: Deleting the department successfully removed associated Years and Students from the DB.")
print("\nDatabase is now running on PostgreSQL with initial schemas loaded and analytics score fields active.")
