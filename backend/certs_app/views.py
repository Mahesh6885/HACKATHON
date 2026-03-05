from rest_framework import serializers, generics, permissions
from .models import Certification

class CertificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certification
        fields = '__all__'
        read_only_fields = ['user', 'completed_at']

class CertificationListCreateView(generics.ListCreateAPIView):
    # permission_classes = [permissions.IsAuthenticated] # Uncomment for prod
    serializer_class = CertificationSerializer

    def get_queryset(self):
        user = self.request.user if self.request.user.is_authenticated else 1
        return Certification.objects.filter(user_id=user).order_by('-completed_at')

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        if user:
            serializer.save(user=user)
        else:
            # Fallback for hackathon testing without JWT
            from django.contrib.auth.models import User
            dummy_user, _ = User.objects.get_or_create(username='hackathon_test')
            serializer.save(user=dummy_user)
