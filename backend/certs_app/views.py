from rest_framework import serializers, generics, permissions
from .models import Certification
from django.contrib.auth.models import User

def _get_user(request):
    """Return the authenticated user, or the shared hackathon_test fallback."""
    if request.user.is_authenticated:
        return request.user
    user, _ = User.objects.get_or_create(username='hackathon_test')
    return user

class CertificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certification
        fields = '__all__'
        read_only_fields = ['user', 'completed_at']

class CertificationListCreateView(generics.ListCreateAPIView):
    # permission_classes = [permissions.IsAuthenticated] # Uncomment for prod
    serializer_class = CertificationSerializer

    def get_queryset(self):
        user = _get_user(self.request)
        return Certification.objects.filter(user=user).order_by('-completed_at')

    def perform_create(self, serializer):
        user = _get_user(self.request)
        serializer.save(user=user)
