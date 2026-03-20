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
def get_skills(
    resume_text: str,
    recent_work: str,
    career_goal: str,
    hours_per_day: str,
    struggle: str,
    background: str
) -> dict:
    return call_groq(
        system="""You are a senior technical recruiter with 15 years experience
at top tech companies. You read between the lines of resumes.
You understand what someone actually knows vs what they just listed.
You give people a clear honest picture of where they stand.
Respond only in valid JSON.""",

        user=f"""Analyze this person deeply. Understand their full situation.

RESUME:
{resume_text}

RECENT WORK (not on resume yet — weight this heavily):
{recent_work}

CAREER GOAL: {career_goal}
HOURS PER DAY AVAILABLE: {hours_per_day}
WHAT THEY STRUGGLE WITH: {struggle}
BACKGROUND: {background}

Return ONLY this JSON:
{{
  "current_level": "Beginner or Intermediate or Advanced",
  "readiness_score": honest number 0-100,
  "current_position_summary": {{
    "overview": "2-3 sentences on where they stand. Specific to their situation.",
    "strengths": [
      "specific strength referencing actual skill or project",
      "specific strength",
      "specific strength"
    ],
    "honest_gaps": [
      "specific gap for their goal",
      "specific gap",
      "specific gap"
    ],
    "hidden_advantage": "one thing in their profile most people overlook but is valuable for their goal"
  }},
  "skills": [
    {{
      "name": "actual skill from their profile",
      "level": "strong or basic or missing",
      "note": "one line on their actual level with this skill"
    }}
  ]
}}"""
    )


# ─────────────────────────────────────
# PROMPT 2 — resume weak spots
# ─────────────────────────────────────
def get_resume_weak_spots(resume_text: str, career_goal: str) -> dict:
    return call_groq(
        system="""You are a ruthlessly honest resume coach who has reviewed
10,000 resumes and coached hundreds into top tech jobs.
You give surgical, specific, actionable feedback.
You reference actual resume content — never generic advice.
You always give a rewrite example.
Respond only in valid JSON.""",

        user=f"""Review this resume for someone targeting: {career_goal}

RESUME:
{resume_text}

Find the real problems costing them interviews.
For each issue — explain it, show impact, give exact fix.

Return ONLY this JSON:
{{
  "resume_summary": {{
    "overall_impression": "what a hiring manager thinks in first 10 seconds",
    "biggest_strength": "the single best thing about this resume",
    "biggest_problem": "the single most damaging thing holding it back"
  }},
  "resume_weak_spots": [
    {{
      "section": "which part — Experience, Projects, Skills, Summary",
      "issue": "specific problem referencing actual content",
      "why_it_hurts": "what hiring manager thinks when they see this",
      "fix": "exact fix with specific change to make",
      "example": "before: what it says → after: what it should say"
    }}
  ],
  "quick_wins": [
    "one line change that takes 5 minutes but makes big difference",
    "another quick win",
    "another quick win"
  ]
}}"""
    )


# ─────────────────────────────────────
# PROMPT 3 — next step
# ─────────────────────────────────────
def get_next_step(
    resume_text: str,
    recent_work: str,
    career_goal: str,
    hours_per_day: str,
    struggle: str,
    job_description: str = None
) -> dict:
    jd = f"TARGET JOB:\n{job_description}" if job_description else "No specific job description."

    return call_groq(
        system="""You are the world's best career mentor for developers.
You find the single highest leverage action someone can take RIGHT NOW.
Not the easiest. The most impactful bridge from where they are to their goal.
Your week plans are day by day — each day has ONE clear specific task.
Your resources are hand-picked for exactly this person and this step.
Respond only in valid JSON.""",

        user=f"""Find this person's single most important next step.

RESUME:
{resume_text}

RECENT WORK:
{recent_work}

GOAL: {career_goal}
HOURS PER DAY: {hours_per_day}
STRUGGLES WITH: {struggle}

{jd}

The next step must:
- Build directly on what they already have
- Close the most important gap between them and their goal
- Result in something tangible for their portfolio
- Be realistic given their available hours per day

The week plan must be day by day.
Each day is ONE specific task they can sit down and do.
Day 7 must produce something they can show someone.

Resources must be ONLY for this specific next step.
Free, specific, real URLs.

Return ONLY this JSON:
{{
  "next_step": {{
    "title": "specific action not generic",
    "why": {{
      "main_reason": "core reason this is right for them specifically",
      "career_impact": "how this moves them toward their goal",
      "builds_on": "what they already have making this achievable"
    }},
    "what_you_will_have_after": "specific tangible output",
    "time_estimate": "realistic based on their hours per day",
    "week_plan": [
      {{"day": "Day 1", "task": "specific task", "goal": "end of day outcome"}},
      {{"day": "Day 2", "task": "specific task", "goal": "end of day outcome"}},
      {{"day": "Day 3", "task": "specific task", "goal": "end of day outcome"}},
      {{"day": "Day 4", "task": "specific task", "goal": "end of day outcome"}},
      {{"day": "Day 5", "task": "specific task", "goal": "end of day outcome"}},
      {{"day": "Day 6", "task": "specific task", "goal": "end of day outcome"}},
      {{"day": "Day 7", "task": "final task", "goal": "something to show someone"}}
    ],
    "resources": [
      {{
        "title": "exact resource name",
        "url": "real free URL",
        "type": "video or docs or course or article",
        "use_on": "Day X",
        "why_this_one": "why this specific resource for this person"
      }}
    ]
  }}
}}""",
        max_tokens=2500
    )


# ─────────────────────────────────────
# PROMPT 4 — roadmap
# ─────────────────────────────────────
def get_roadmap(
    resume_text: str,
    recent_work: str,
    career_goal: str,
    hours_per_day: str
) -> dict:
    return call_groq(
        system="""You are a senior engineering career coach who has taken
hundreds of developers from where they are to hired.
You build roadmaps that are logical, ordered by dependency, specific to each person.
Each step unlocks the next. Nothing is skippable.
You explain not just WHAT to do but WHY at this exact point.
Respond only in valid JSON.""",

        user=f"""Build a deep personalized roadmap for this person.

RESUME:
{resume_text}

RECENT WORK:
{recent_work}

GOAL: {career_goal}
HOURS PER DAY: {hours_per_day}

Rules:
- 5-6 steps maximum
- Order by dependency
- Each step has clear purpose
- Time estimates based on their hours per day
- Final step is exactly their goal
- Tell a logical story from current position to goal

Return ONLY this JSON:
{{
  "roadmap_title": "Your path to [their goal]",
  "estimated_total_time": "realistic total based on hours per day",
  "roadmap": [
    {{
      "step": "specific step title",
      "why_now": "why this step first — what it unlocks",
      "what_to_learn": ["topic 1", "topic 2", "topic 3"],
      "milestone": "tangible thing they will have",
      "time": "realistic time for this step",
      "is_current": true
    }},
    {{
      "step": "specific step title",
      "why_now": "why this comes after previous",
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
      "step": "specific step title",
      "why_now": "why this comes here",
      "what_to_learn": ["topic", "topic"],
      "milestone": "tangible milestone",
      "time": "realistic time",
      "is_current": false
    }},
    {{
      "step": "{career_goal}",
      "why_now": "their complete profile at this point and why they are ready",
      "what_to_learn": ["interview prep", "portfolio polish", "networking"],
      "milestone": "first job offer as {career_goal}",
      "time": "2-4 weeks active applying",
      "is_current": false
    }}
  ]
}}""",
        max_tokens=2500
    )


# ─────────────────────────────────────
# MENTOR CHAT
# ─────────────────────────────────────
def mentor_chat(messages: list, profile: dict) -> str:

    # build rich context from their full profile
    skills_have = [
        s['name'] for s in profile.get('skills', [])
        if s.get('level') == 'strong'
    ]
    skills_missing = [
        s['name'] for s in profile.get('skills', [])
        if s.get('level') == 'missing'
    ]
    skills_basic = [
        s['name'] for s in profile.get('skills', [])
        if s.get('level') == 'basic'
    ]
    roadmap_steps = [
        step.get('step') for step in profile.get('roadmap', [])
    ]
    next_step_title = profile.get('next_step', {}).get('title', 'unknown')

    context = f"""You are JourneyAI — a personal career mentor.
You already analyzed this person's resume and built their roadmap.
You know everything about them. Use this knowledge in every answer.

WHAT YOU KNOW ABOUT THEM:
- Current level: {profile.get('current_level')}
- Readiness score: {profile.get('readiness_score')}%
- Their immediate next step: {next_step_title}
- Skills they have (strong): {', '.join(skills_have) if skills_have else 'none listed'}
- Skills at basic level: {', '.join(skills_basic) if skills_basic else 'none listed'}
- Skills they are missing: {', '.join(skills_missing) if skills_missing else 'none listed'}
- Their full roadmap: {' → '.join(roadmap_steps) if roadmap_steps else 'not available'}

HOW TO RESPOND:
- Be conversational and warm — like a mentor not a robot
- Keep answers to 2-4 sentences unless they ask for detail
- Always reference their actual situation — never generic advice
- If they ask about time, factor in their available hours
- If they seem discouraged, be encouraging but honest
- If they ask about a skill, reference their current level with it
- Never repeat the same advice — build on the conversation"""

    groq_messages = [{"role": "system", "content": context}]

    for msg in messages:
        groq_messages.append({
            "role": msg["role"],
            "content": msg["content"]
        })

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=groq_messages,
        temperature=0.5,
        max_tokens=500
    )

    return response.choices[0].message.content.strip()


# ─────────────────────────────────────
# MAIN — runs all 4 prompts
# ─────────────────────────────────────
def analyze_profile(
    resume_text: str,
    recent_work: str,
    career_goal: str,
    hours_per_day: str = "1-2 hours",
    struggle: str = "nothing specific",
    background: str = "not specified",
    job_description: str = None
) -> dict:

    print("Analyzing skills...")
    skills_data = get_skills(
        resume_text, recent_work, career_goal,
        hours_per_day, struggle, background
    )

    print("Reviewing resume...")
    resume_data = get_resume_weak_spots(resume_text, career_goal)

    print("Finding next step...")
    next_step_data = get_next_step(
        resume_text, recent_work, career_goal,
        hours_per_day, struggle, job_description
    )

    print("Building roadmap...")
    roadmap_data = get_roadmap(
        resume_text, recent_work, career_goal, hours_per_day
    )

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