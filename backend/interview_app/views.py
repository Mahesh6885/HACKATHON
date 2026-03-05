from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from ml_engine.mock_interview.ai_engine import generate_first_question, evaluate_and_next
from .models import InterviewSession
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
        
        # Save score randomly or keep track of session ID (simplified for hackathon)
        user = request.user if request.user.is_authenticated else None
        if user and evaluation.get('score'):
            InterviewSession.objects.create(
                user=user,
                role_target=role_target,
                score=evaluation['score'],
                feedback=evaluation['feedback']
            )

        return Response(evaluation, status=status.HTTP_200_OK)
