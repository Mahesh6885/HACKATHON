from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from .serializers import RegisterSerializer, UserSerializer
from rest_framework_simplejwt.tokens import RefreshToken


def _get_user_role_info(user):
    """Return profile data for a given user."""
    try:
        from organization_app.models import StudentProfile
        profile = StudentProfile.objects.get(user=user)
        department = profile.year.department.name
        role_desc = f"Student {department}"
    except Exception:
        role_desc = "Student"

    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "role": "admin" if user.is_staff else "student",
        "role_desc": "Administrator" if user.is_staff else role_desc,
        "display_name": user.first_name or user.username.capitalize(),
    }


class LoginView(APIView):
    """
    Accept POST { username, password }.
    username can be:
      - a roll number  (student)
      - an email address (admin or student)
    Returns JWT tokens + role so the frontend can route correctly.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        identifier = request.data.get("username", "").strip()
        password = request.data.get("password", "").strip()

        if not identifier or not password:
            return Response({"error": "Username and password are required."},
                            status=status.HTTP_400_BAD_REQUEST)

        # Try to find the user by email first (for admins who login with email)
        user = None
        if "@" in identifier:
            try:
                user_obj = User.objects.get(email=identifier)
                user = authenticate(username=user_obj.username, password=password)
            except User.DoesNotExist:
                pass

        # Fall back to direct username lookup (roll number for students)
        if user is None:
            user = authenticate(username=identifier, password=password)

        if user is None:
            return Response({"error": "Invalid credentials. Check your roll number / email and password."},
                            status=status.HTTP_401_UNAUTHORIZED)

        if not user.is_active:
            return Response({"error": "Account has been deactivated. Contact your administrator."},
                            status=status.HTTP_403_FORBIDDEN)

        refresh = RefreshToken.for_user(user)
        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": _get_user_role_info(user),
        }, status=status.HTTP_200_OK)


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            "user": UserSerializer(user).data,
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        })


class UserProfileView(APIView):
    permission_classes = [permissions.AllowAny]  # Relax for dev; restrict in prod

    def get(self, request):
        if request.user.is_authenticated:
            user = request.user
        else:
            user = User.objects.filter(is_active=True).first()

        if not user:
            return Response({"error": "No user found"}, status=404)

        return Response(_get_user_role_info(user))
