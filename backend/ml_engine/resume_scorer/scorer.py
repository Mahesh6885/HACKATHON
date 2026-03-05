import pdfplumber
import re

# Simple set of technical keywords to map against the resume
ats_keywords = {
    'python', 'java', 'sql', 'react', 'javascript', 'django', 'spring',
    'docker', 'aws', 'machine learning', 'api', 'git', 'node'
}

def extract_text(pdf_path):
    text = ""
    try:
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                text += page.extract_text() + "\n"
    except Exception as e:
        print(f"Error reading PDF: {e}")
    return text.lower()

def check_keywords(text):
    found = [kw for kw in ats_keywords if kw in text]
    score = (len(found) / min(len(ats_keywords), 10)) * 40 # Max 40 points for 10 keywords
    return min(score, 40), found

def check_structure(text):
    sections = ['education', 'experience', 'projects', 'skills']
    found = [sec for sec in sections if sec in text]
    score = (len(found) / len(sections)) * 30 # Max 30 points for sections
    return score, found

def check_contact(text):
    has_email = bool(re.search(r'[\w\.-]+@[\w\.-]+', text))
    has_phone = bool(re.search(r'[\+\(]?[1-9][0-9 .\-\(\)]{8,}[0-9]', text))
    has_link = 'github.com' in text or 'linkedin.com' in text
    
    score = 0
    issues = []
    if has_email: score += 10
    else: issues.append("Missing Email")
    
    if has_phone: score += 10
    else: issues.append("Missing Phone Number")
    
    if has_link: score += 10
    else: issues.append("Missing LinkedIn or GitHub link")
        
    return score, issues

def score_resume(file_path):
    text = extract_text(file_path)
    
    if not text.strip():
        return {"score": 0, "issues": ["Could not extract text from PDF"], "feedback": []}
    
    kw_score, found_keywords = check_keywords(text)
    str_score, found_sections = check_structure(text)
    cont_score, cont_issues = check_contact(text)
    
    total = int(kw_score + str_score + cont_score)
    
    feedback = []
    if len(found_keywords) < 5:
        feedback.append(f"Add more technical keywords. Found: {', '.join(found_keywords)}")
    if len(found_sections) < 4:
        feedback.append("Ensure you have clear headings for Education, Experience, Projects, and Skills.")
        
    return {
        "score": total,
        "issues": cont_issues,
        "feedback": feedback,
        "keywords": found_keywords
    }
