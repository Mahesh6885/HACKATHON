import google.generativeai as genai
from decouple import config
import json

# Setup Gemini API (Free Tier Gemni-pro)
genai.configure(api_key=config("GEMINI_API_KEY", default="YOUR_API_KEY_HERE"))
model = genai.GenerativeModel("gemini-1.5-flash")

def generate_first_question(role_target):
    prompt = f"""
    You are an AI Mock Interviewer interviewing a student for a {role_target} role.
    Ask the very first technical question. Make it a medium difficulty question.
    Only return the question text, nothing else.
    """
    response = model.generate_content(prompt)
    return {"question": response.text.strip()}

def evaluate_and_next(role_target, previous_q, student_answer):
    prompt = f"""
    You are an AI Technical Interviewer for a {role_target} position.
    
    Previous Question: {previous_q}
    Student's Answer: {student_answer}

    1. Evaluate the student's answer out of 10.
    2. Suggest an ideal answer hint.
    3. Generate the NEXT question. If they scored >= 7, make the next question harder. If < 7, ask an easier fundamental question.

    Format your response EXACTLY as this JSON object:
    {{
        "score": <0-10>,
        "feedback": "<short sentence on what was good or bad>",
        "ideal_hint": "<ideal way to answer>",
        "next_question": "<the next question>"
    }}
    """
    
    response = model.generate_content(prompt)
    
    # Clean the JSON response (often model wraps it in ```json ... ```)
    clean_text = response.text.replace('```json', '').replace('```', '').strip()
    
    try:
        return json.loads(clean_text)
    except json.JSONDecodeError:
        return {
            "score": 5,
            "feedback": "Failed to parse AI evaluation.",
            "ideal_hint": "Please try answering again clearly.",
            "next_question": f"Let's move on. Ask a standard {role_target} question."
        }
