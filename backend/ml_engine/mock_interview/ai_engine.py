import os
from groq import Groq
import json

GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "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")

def generate_first_question(role_target):
    if GROQ_API_KEY == "YOUR_API_KEY_HERE":
        return {"question": f"What is your typical approach to system design for a highly scalable {role_target} application? Can you walk me through your architecture?"}
        
    client = Groq(api_key=GROQ_API_KEY)
    
    prompt = f"""
    You are an AI Mock Interviewer interviewing a student for a {role_target} role.
    Ask the very first technical question. Make it a medium difficulty question.
    Only return the question text, nothing else.
    """
    
    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.4,
        max_completion_tokens=1024,
    )
    
    return {"question": completion.choices[0].message.content.strip()}

def evaluate_and_next(role_target, previous_q, student_answer):
    if GROQ_API_KEY == "YOUR_API_KEY_HERE":
        return {
            "score": 8,
            "feedback": "You clearly explained the concepts, but missed some edge cases.",
            "ideal_hint": "Consider mentioning load balancing and database sharding.",
            "next_question": f"Excellent. Next question: Can you explain how you would handle zero-downtime database migrations in a production {role_target} environment?"
        }
        
    client = Groq(api_key=GROQ_API_KEY)
    
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
    
    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.4,
        max_completion_tokens=1024,
    )
    
    response_text = completion.choices[0].message.content
    
    # Clean the JSON response (often model wraps it in ```json ... ```)
    clean_text = response_text.replace('```json', '').replace('```', '').strip()
    
    try:
        return json.loads(clean_text)
    except json.JSONDecodeError:
        return {
            "score": 5,
            "feedback": "Failed to parse AI evaluation.",
            "ideal_hint": "Please try answering again clearly.",
            "next_question": f"Let's move on. Ask a standard {role_target} question."
        }
