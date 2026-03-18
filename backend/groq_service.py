import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


# ─────────────────────────────────────
# HELPER
# ─────────────────────────────────────
def call_groq(system: str, user: str, temperature=0.3, max_tokens=2000) -> dict:
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": system},
            {"role": "user",   "content": user}
        ],
        temperature=temperature,
        max_tokens=max_tokens
    )
    raw = response.choices[0].message.content.strip()

    if "```" in raw:
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
        raw = raw.strip()

    return json.loads(raw)


# ─────────────────────────────────────
# PROMPT 1 — skills + understanding
# ─────────────────────────────────────
def get_skills(resume_text: str, recent_work: str, career_goal: str) -> dict:
    return call_groq(
        system="""You are a senior technical recruiter with 15 years experience 
at top tech companies. You read between the lines of resumes.
You understand what someone actually knows vs what they just listed.
You give people a clear honest picture of where they stand.
Respond only in valid JSON.""",

        user=f"""Analyze this person deeply. Understand their full situation.

RESUME:
{resume_text}

RECENT WORK (not on resume yet — very important, weight this heavily):
{recent_work}

CAREER GOAL: {career_goal}

Give me a deep honest analysis. The current_position_summary must feel like 
you truly read and understood their situation — not generic. 
Reference their actual projects, tools, experience level.

Return ONLY this JSON:
{{
  "current_level": "Beginner or Intermediate or Advanced",
  
  "readiness_score": honest number 0-100,
  
  "current_position_summary": {{
    "overview": "2-3 sentences on where they stand overall. Specific to their situation.",
    "strengths": [
      "specific strength 1 — reference actual skill or project",
      "specific strength 2",
      "specific strength 3"
    ],
    "honest_gaps": [
      "specific gap 1 — what is actually missing for their goal",
      "specific gap 2",
      "specific gap 3"
    ],
    "hidden_advantage": "one thing in their profile that most people overlook but is actually valuable for their goal"
  }},
  
  "skills": [
    {{"name": "skill name", "level": "strong or basic or missing", "note": "one line on their actual level with this skill"}}
  ]
}}"""
    )


# ─────────────────────────────────────
# PROMPT 2 — resume weak spots
# ─────────────────────────────────────
def get_resume_weak_spots(resume_text: str, career_goal: str) -> dict:
    return call_groq(
        system="""You are a ruthlessly honest resume coach who has reviewed 
10,000 resumes and coached hundreds of people into top tech jobs.
You give feedback that is surgical, specific, and actionable.
You reference actual resume content — never generic advice.
You explain impact — what a hiring manager actually thinks.
You always give a rewrite example so the person knows exactly what to do.
Respond only in valid JSON.""",

        user=f"""Review this resume for someone targeting: {career_goal}

RESUME:
{resume_text}

Be surgical. Find the real problems that are costing them interviews.
For each issue — explain it clearly, show the impact, give the exact fix.

Think about:
- Are there numbers and metrics or just vague descriptions
- Does it show impact or just list duties
- Are projects explained well — what problem, what tech, what outcome
- Is the language strong or weak (responsible for vs built, led, increased)
- Is anything missing that hiring managers for this role expect to see
- Is anything there that should be removed or repositioned

Return ONLY this JSON:
{{
  "resume_summary": {{
    "overall_impression": "what a hiring manager thinks in the first 10 seconds",
    "biggest_strength": "the single best thing about this resume right now",
    "biggest_problem": "the single most damaging thing holding this resume back"
  }},
  "resume_weak_spots": [
    {{
      "section": "which part of resume — e.g. Experience, Projects, Skills",
      "issue": "specific problem with actual content referenced",
      "why_it_hurts": "what the hiring manager thinks when they see this",
      "fix": "exact rewrite or specific change to make",
      "example": "before: what it says now → after: what it should say"
    }}
  ],
  "quick_wins": [
    "one line change that takes 5 minutes but makes a big difference",
    "another quick win",
    "another quick win"
  ]
}}"""
    )


# ─────────────────────────────────────
# PROMPT 3 — next step
# ─────────────────────────────────────
def get_next_step(resume_text: str, recent_work: str, career_goal: str, job_description: str = None) -> dict:
    jd = f"TARGET JOB DESCRIPTION:\n{job_description}\nMatch resources and tasks to exactly what this job needs." if job_description else "No specific job. Base everything on the career goal."

    return call_groq(
        system="""You are the world's best career mentor for developers.
You find the single highest leverage action someone can take RIGHT NOW.
Not the easiest. The most impactful bridge between where they are and where they want to go.
Your week plans are day by day — each day has ONE clear specific task.
Your resources are hand-picked for exactly what this person needs for exactly this step.
Every resource must be free and must directly serve the next step.
Respond only in valid JSON.""",

        user=f"""Find this person's single most important next step.

RESUME:
{resume_text}

RECENT WORK:
{recent_work}

GOAL: {career_goal}

{jd}

The next step must:
- Build directly on what they already have
- Close the most important gap between them and their goal
- Result in something tangible they can add to their portfolio or resume
- Be achievable in 1-2 weeks

The week plan must:
- Be day by day — Day 1, Day 2, etc
- Each day is ONE specific task they can sit down and do
- Tasks must build on each other — Day 2 builds on Day 1
- Day 7 must produce something they can show someone

Resources must:
- Be ONLY for this specific next step — not general learning
- Be free
- Be specific — not just "YouTube" but exact channel or video
- Each resource maps to a specific part of the week plan

Return ONLY this JSON:
{{
  "next_step": {{
    "title": "specific action title — not generic",
    
    "why": {{
      "main_reason": "the core reason this is the right next step for them specifically",
      "career_impact": "how completing this moves them toward their goal",
      "builds_on": "what they already have that makes this achievable right now"
    }},
    
    "what_you_will_have_after": "specific tangible output — a deployed app, a live URL, a portfolio project, a certificate",
    
    "time_estimate": "X days at Y hours per day — be realistic for their level",
    
    "week_plan": [
      {{"day": "Day 1", "task": "specific task", "goal": "what you will have by end of day"}},
      {{"day": "Day 2", "task": "specific task", "goal": "what you will have by end of day"}},
      {{"day": "Day 3", "task": "specific task", "goal": "what you will have by end of day"}},
      {{"day": "Day 4", "task": "specific task", "goal": "what you will have by end of day"}},
      {{"day": "Day 5", "task": "specific task", "goal": "what you will have by end of day"}},
      {{"day": "Day 6", "task": "specific task", "goal": "what you will have by end of day"}},
      {{"day": "Day 7", "task": "final task", "goal": "something you can show someone"}}
    ],
    
    "resources": [
      {{
        "title": "exact resource name",
        "url": "real free URL",
        "type": "video or docs or course or article",
        "use_on": "Day X — which day of the week plan this is for",
        "why_this_one": "why this specific resource for this specific person and step"
      }}
    ]
  }}
}}""",
        max_tokens=2500
    )


# ─────────────────────────────────────
# PROMPT 4 — roadmap
# ─────────────────────────────────────
def get_roadmap(resume_text: str, recent_work: str, career_goal: str) -> dict:
    return call_groq(
        system="""You are a senior engineering career coach who has taken 
hundreds of developers from beginner to hired.
You build roadmaps that are logical, ordered by dependency, and specific to each person.
Each step unlocks the next. Nothing is skippable.
You explain not just WHAT to do but WHY at this exact point in the journey.
Respond only in valid JSON.""",

        user=f"""Build a deep personalized roadmap for this person.

RESUME:
{resume_text}

RECENT WORK:
{recent_work}

GOAL: {career_goal}

Rules:
- Maximum 5-6 steps — quality over quantity
- Order by dependency — what must come first
- Each step has a clear purpose in the journey
- Milestones are tangible things they will have
- Time estimates are realistic for each step
- Final step is exactly their stated goal
- The whole roadmap must tell a logical story from their current position to their goal

Return ONLY this JSON:
{{
  "roadmap_title": "personalized title for their journey e.g. Your path to ML Engineer",
  
  "estimated_total_time": "realistic total time to reach goal e.g. 4-6 months at 2 hrs/day",
  
  "roadmap": [
    {{
      "step": "specific step title",
      "why_now": "why this step comes first — what it unlocks for everything after",
      "what_to_learn": [
        "specific topic 1",
        "specific topic 2",
        "specific topic 3"
      ],
      "milestone": "tangible thing you will have when this step is done",
      "time": "realistic time for this step",
      "is_current": true
    }},
    {{
      "step": "specific step title",
      "why_now": "why this comes after the previous step",
      "what_to_learn": [
        "specific topic",
        "specific topic"
      ],
      "milestone": "tangible thing you will have",
      "time": "realistic time",
      "is_current": false
    }},
    {{
      "step": "specific step title",
      "why_now": "why this comes here",
      "what_to_learn": ["topic", "topic"],
      "milestone": "tangible milestone",
      "time": "realistic time",
      "is_current": false
    }},
    {{
      "step": "specific step title",
      "why_now": "why this comes here",
      "what_to_learn": ["topic", "topic"],
      "milestone": "tangible milestone",
      "time": "realistic time",
      "is_current": false
    }},
    {{
      "step": "{career_goal}",
      "why_now": "what their complete profile looks like at this point and why they are ready",
      "what_to_learn": ["interview prep", "portfolio polish", "networking"],
      "milestone": "first job offer as {career_goal}",
      "time": "2-4 weeks of active applying",
      "is_current": false
    }}
  ]
}}""",
        max_tokens=2500
    )


# ─────────────────────────────────────
# MAIN — runs all 4 prompts
# ─────────────────────────────────────
def analyze_profile(
    resume_text: str,
    recent_work: str,
    career_goal: str,
    job_description: str = None
) -> dict:

    print("Analyzing skills...")
    skills_data = get_skills(resume_text, recent_work, career_goal)

    print("Reviewing resume...")
    resume_data = get_resume_weak_spots(resume_text, career_goal)

    print("Finding next step...")
    next_step_data = get_next_step(resume_text, recent_work, career_goal, job_description)

    print("Building roadmap...")
    roadmap_data = get_roadmap(resume_text, recent_work, career_goal)

    return {
        "current_level":            skills_data.get("current_level"),
        "readiness_score":          skills_data.get("readiness_score"),
        "current_position_summary": skills_data.get("current_position_summary"),
        "skills":                   skills_data.get("skills"),
        "resume_summary":           resume_data.get("resume_summary"),
        "resume_weak_spots":        resume_data.get("resume_weak_spots"),
        "quick_wins":               resume_data.get("quick_wins"),
        "next_step":                next_step_data.get("next_step"),
        "roadmap_title":            roadmap_data.get("roadmap_title"),
        "estimated_total_time":     roadmap_data.get("estimated_total_time"),
        "roadmap":                  roadmap_data.get("roadmap"),
    }