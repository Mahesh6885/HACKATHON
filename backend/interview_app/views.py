from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from ml_engine.mock_interview.ai_engine import generate_first_question, evaluate_and_next
from ml_engine.mock_interview.stt import transcribe_audio_bytes
from .models import InterviewSession
from django.contrib.auth.models import User
from .serializers import InterviewSessionSerializer

class StartInterviewView(APIView):
    # permission_classes = [IsAuthenticated] # Uncomment for prod
    def post(self, request, *args, **kwargs):
        role_target = request.data.get("role_target", "Software Engineer")
        question_data = generate_first_question(role_target)
        return Response(question_data, status=status.HTTP_200_OK)

class EvaluateAnswerView(APIView):
    # permission_classes = [IsAuthenticated] # Uncomment for prod
    def post(self, request, *args, **kwargs):
        role_target = request.data.get("role_target", "Software Engineer")
        previous_q = request.data.get("previous_question")
        student_answer = request.data.get("answer")
        
        if not previous_q or not student_answer:
            return Response({"error": "Missing previous question or answer"}, status=status.HTTP_400_BAD_REQUEST)
            
        evaluation = evaluate_and_next(role_target, previous_q, student_answer)
        
        user = request.user if request.user.is_authenticated else User.objects.first()
        if user and evaluation.get('score'):
            InterviewSession.objects.create(
                user=user,
                role_target=role_target,
                score=evaluation['score'].get('communication', 0) if isinstance(evaluation['score'], dict) else evaluation['score'],
                feedback=evaluation['feedback']
            )

        return Response(evaluation, status=status.HTTP_200_OK)

class HistoryView(APIView):
    # permission_classes = [IsAuthenticated] # Uncomment for prod
    def get(self, request, *args, **kwargs):
        from django.contrib.auth.models import User
        user = request.user if request.user.is_authenticated else User.objects.first()
        sessions = InterviewSession.objects.filter(user=user).order_by('-session_date')
        
        data = []
        for s in sessions:
            data.append({
                "id": s.id,
                "role_target": s.role_target,
                "score": s.score,
                "feedback": s.feedback,
                "session_date": s.session_date.strftime("%b %d, %Y")
            })
            
        return Response({"history": data}, status=status.HTTP_200_OK)

class VoiceAnswerView(APIView):
    # permission_classes = [IsAuthenticated] # Uncomment for prod
    def post(self, request, *args, **kwargs):
        audio_file = request.FILES.get('audio')
        if not audio_file:
            return Response({"error": "No audio file provided."}, status=status.HTTP_400_BAD_REQUEST)
            
        audio_bytes = audio_file.read()
        content_type = audio_file.content_type
        
        try:
            transcript = transcribe_audio_bytes(audio_bytes, content_type)
            return Response({"transcript": transcript}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
