from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['role', 'department', 'year', 'cgpa', 'skills', 'target_role']

class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'profile']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    department = serializers.CharField(write_only=True, required=False)
    target_role = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name', 'department', 'target_role']

    def create(self, validated_data):
        dept = validated_data.pop('department', '')
        target = validated_data.pop('target_role', '')
        user = User.objects.create_user(**validated_data)
        Profile.objects.create(user=user, department=dept, target_role=target)
        return user
