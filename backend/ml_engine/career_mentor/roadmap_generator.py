def analyze_growth_areas(resume_score, test_score, interview_score):
    tasks = []

    # Resume Rules
    if resume_score < 50:
        tasks.append({"title": "Fix Critical Resume Formatting Issues", "category": "Resume", "priority": "High"})
        tasks.append({"title": "Add 2 Strong Projects with GitHub Links", "category": "Resume", "priority": "Medium"})
    elif resume_score < 75:
        tasks.append({"title": "Add Quantified Metrics to Experience Details", "category": "Resume", "priority": "Medium"})

    # Test Score Rules
    if test_score < 60:
        tasks.append({"title": "Review Data Structures & Algorithms (Arrays, Strings)", "category": "Aptitude", "priority": "High"})
        tasks.append({"title": "Take 2 General Aptitude Quizzes", "category": "Aptitude", "priority": "Medium"})

    # Interview Rules
    if interview_score < 60:
        tasks.append({"title": "Practice STAR Method (Situation, Task, Action, Result)", "category": "Behavioral", "priority": "High"})
        tasks.append({"title": "Complete 3 Technical Mock Interviews", "category": "Technical", "priority": "High"})

    # Good Score Boosters
    if resume_score >= 80 and interview_score >= 80:
        tasks.append({"title": "Apply for 3 Dream Tech Companies", "category": "Career", "priority": "Low"})
        tasks.append({"title": "Contribute to an Open Source Project on GitHub", "category": "Growth", "priority": "Low"})

    return tasks

def generate_roadmap(user_metrics):
    resume_score = user_metrics.get("resume_score", 0)
    test_score = user_metrics.get("overall_test_score", 0)
    interview_score = user_metrics.get("interview_avg_score", 0)
    
    return analyze_growth_areas(resume_score, test_score, interview_score)
