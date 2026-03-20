import os
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Resume
from .serializers import ResumeSerializer
from ml_engine.resume_scorer.scorer import score_resume

class ResumeUploadView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        # We assume the file is passed under the key 'file'
        file_obj = request.FILES.get('file')
        if not file_obj:
            return Response({'error': 'No file uploaded.'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Save temp file
        temp_path = f"temp_{file_obj.name}"
        with open(temp_path, 'wb+') as destination:
            for chunk in file_obj.chunks():
                destination.write(chunk)
                
        # ML Engine NLP Scoring
        ml_result = score_resume(temp_path)
        
        # Cleanup
        if os.path.exists(temp_path):
            os.remove(temp_path)
            
        # Use an admin user or a dummy user for now if authentication isn't sent
        if request.user.is_authenticated:
            user = request.user
        else:
            # Fallback to the first available user (the dummy we created)
            from django.contrib.auth.models import User
            user = User.objects.first()
        
        if user:
            # Save to Database
            resume = Resume.objects.create(
                user=user,
                file_url=file_obj.name, # Usually an S3 link in production
                score=ml_result['score'],
                feedback_items=ml_result
            )
            
            # Create a TestScore record so it shows up in the user's history (User Request)
            from tests_app.models import TestScore
            TestScore.objects.create(
                user=user,
                test_name="Resume AI Evaluation",
                type="DOMAIN",
                score=ml_result['score'],
                total=100
            )

            serializer = ResumeSerializer(resume)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            # Just return preview if not logged in
            return Response(ml_result, status=status.HTTP_200_OK)
