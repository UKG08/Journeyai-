import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def analyze_profile(
    resume_text: str,     
    recent_work: str,     
    career_goal: str,      
    job_description: str = None   
) -> dict:                

  
    if job_description:
        jd_section = f"Job Description the user is targeting:\n{job_description}"
    else:
        jd_section = "No job description provided."


   
    prompt = f"""
You are JourneyAI — an expert career strategist and mentor.
Be honest, specific, and encouraging like a senior developer 
mentoring a junior. Never sugarcoat but always stay constructive.

Here is everything about the user:

RESUME:
{resume_text}

WHAT THEY HAVE DONE RECENTLY (not on resume yet):
{recent_work}

CAREER GOAL:
{career_goal}

{jd_section}

Based on ALL of this, return ONLY a JSON object like this:
{{
  "current_level": "Beginner or Intermediate or Advanced",
  "readiness_score": 68,
  "skills": [
    {{"name": "Python", "level": "strong"}},
    {{"name": "Docker", "level": "basic"}},
    {{"name": "MLOps", "level": "missing"}}
  ],
  "resume_weak_spots": [
    {{
      "issue": "No numbers or metrics anywhere",
      "fix": "Add outcomes like improved X by Y percent"
    }}
  ],
  "next_step": {{
    "title": "One specific major thing to do next",
    "why": "Why this is the most important step right now",
    "time_estimate": "roughly 1 week at 1-2 hours per day",
    "week_plan": [
      {{"day": "Day 1-2", "task": "specific task here"}},
      {{"day": "Day 3-4", "task": "specific task here"}},
      {{"day": "Day 5-7", "task": "specific task here"}}
    ],
    "resources": [
      {{"title": "Resource name", "url": "https://free-url.com"}}
    ]
  }},
  "roadmap": [
    {{"step": "Deploy model as API",      "description": "closes biggest gap", "is_current": true}},
    {{"step": "Learn MLOps basics",       "description": "next priority",      "is_current": false}},
    {{"step": "Build ML pipeline",        "description": "portfolio project",  "is_current": false}},
    {{"step": "System design for ML",     "description": "needed for interviews", "is_current": false}},
    {{"step": "Apply for ML Engineer jobs","description": "you will be ready", "is_current": false}}
  ]
}}

IMPORTANT — return ONLY the JSON. No explanation. No markdown. No extra text.
"""


    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",  # best free model on Groq
        messages=[
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,    
        max_tokens=2000     
    )

 
    raw = response.choices[0].message.content.strip()

  
    if "```" in raw:
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]

  
    return json.loads(raw)