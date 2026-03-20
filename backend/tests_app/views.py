from rest_framework import serializers, generics, permissions
from .models import TestScore

class TestScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestScore
        fields = '__all__'
        read_only_fields = ['user', 'taken_at']

class TestScoreListCreateView(generics.ListCreateAPIView):
    # permission_classes = [permissions.IsAuthenticated] # Uncomment for prod
    serializer_class = TestScoreSerializer

    def get_queryset(self):
        from django.contrib.auth.models import User
        user = self.request.user if self.request.user.is_authenticated else User.objects.first()
        return TestScore.objects.filter(user=user).order_by('-taken_at')

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        if user:
            serializer.save(user=user)
        else:
            # Fallback for hackathon testing without JWT
            from django.contrib.auth.models import User
            dummy_user, _ = User.objects.get_or_create(username='hackathon_test')
            serializer.save(user=dummy_user)
