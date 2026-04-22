import os
import json
import time
import requests
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

# ── API KEY ROTATION ──────────────────────────────────
API_KEYS = [
    os.getenv("GROQ_API_KEY_1"),
    os.getenv("GROQ_API_KEY_2"),
    os.getenv("GROQ_API_KEY_3"),
]
API_KEYS = [k for k in API_KEYS if k]

current_key_index = 0

def get_client():
    return Groq(api_key=API_KEYS[current_key_index])

# ── HELPER ────────────────────────────────────────────
def call_groq(system: str, user: str, temperature=0.3, max_tokens=2000) -> dict:
    global current_key_index

    for attempt in range(len(API_KEYS)):
        try:
            client = get_client()
            response = get_client().chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {"role": "system", "content": system},
                    {"role": "user",   "content": user}
                ],
                temperature=temperature,
                max_tokens=max_tokens
            )
            raw = response.choices[0].message.content.strip()

            # strip markdown code fences if present
            if "```" in raw:
                raw = raw.split("```")[1]
                if raw.startswith("json"):
                    raw = raw[4:]
                raw = raw.strip()

            return json.loads(raw)

        except Exception as e:
            error_str = str(e)

            if "rate_limit_exceeded" in error_str or "429" in error_str:
                print(f"Rate limit on key {current_key_index + 1} — switching")
                current_key_index = (current_key_index + 1) % len(API_KEYS)
                if attempt == len(API_KEYS) - 1:
                    print("All keys rate limited — waiting 60 seconds")
                    time.sleep(60)
            else:
                raise e

    raise Exception("All API keys are rate limited")



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
      {{"day": "Day 7", "task": "final task",    "goal": "something to show someone"}}
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
Respond only in valid JSON.""",

        user=f"""Build a deep personalized roadmap for this person.

RESUME:
{resume_text}

RECENT WORK:
{recent_work}

GOAL: {career_goal}
HOURS PER DAY: {hours_per_day}

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
# PROMPT 5 — portfolio score
# ─────────────────────────────────────
def get_portfolio_score(
    resume_text: str,
    recent_work: str,
    career_goal: str,
    github_analysis: dict = None
) -> dict:

    github_section = f"""
GITHUB ANALYSIS:
Score: {github_analysis.get('score')}
Summary: {github_analysis.get('summary')}
Top project: {github_analysis.get('top_project')}
Findings: {json.dumps(github_analysis.get('findings', []))}
""" if github_analysis else "No GitHub profile provided."

    return call_groq(
        system="""You are a hiring manager and senior developer.
You evaluate developer portfolios like you would in a real hiring process.
You score honestly — a score of 80+ means genuinely impressive.
Most early career developers score 20-50. Be realistic.
Respond only in valid JSON.""",

        user=f"""Score this developer's portfolio for their goal: {career_goal}

RESUME (projects section most important):
{resume_text}

RECENT WORK AND PROJECTS:
{recent_work}

{github_section}

Return ONLY this JSON:
{{
  "portfolio_score": {{
    "score": honest number 0-100,
    "grade": "A or B or C or D or F",
    "summary": "2-3 sentences on portfolio strength for their goal",
    "breakdown": [
      {{
        "category": "Project relevance",
        "score": number 0-10,
        "comment": "specific comment on their projects"
      }},
      {{
        "category": "Project quality",
        "score": number 0-10,
        "comment": "specific comment"
      }},
      {{
        "category": "Deployment",
        "score": number 0-10,
        "comment": "are projects live or just local"
      }},
      {{
        "category": "Problem solving",
        "score": number 0-10,
        "comment": "tutorials vs real problems"
      }},
      {{
        "category": "GitHub presence",
        "score": number 0-10,
        "comment": "how their GitHub looks to a hiring manager"
      }}
    ],
    "missing_projects": [
      "specific project type they should build for their goal",
      "another project type",
      "another"
    ],
    "strongest_project": "their best project and why it stands out"
  }}
}}"""
    )


# ─────────────────────────────────────
# PROMPT 6 — job match
# ─────────────────────────────────────
def get_job_match(
    resume_text: str,
    recent_work: str,
    skills: list,
    job_description: str,
    career_goal: str
) -> dict:

    skills_list = [s.get('name') for s in skills] if skills else []

    return call_groq(
        system="""You are an expert ATS system and technical recruiter.
You compare candidate profiles against job descriptions with surgical precision.
You give exact match percentages and specific gaps.
Respond only in valid JSON.""",

        user=f"""Compare this person against this job description.

THEIR PROFILE:
Resume: {resume_text}
Recent work: {recent_work}
Confirmed skills: {', '.join(skills_list)}
Goal: {career_goal}

JOB DESCRIPTION:
{job_description}

Return ONLY this JSON:
{{
  "job_match": {{
    "match_percentage": exact number 0-100,
    "summary": "2 sentences on overall fit for this role",
    "matched_requirements": [
      {{
        "requirement": "exact requirement from job description",
        "how_they_match": "specific evidence from their profile"
      }}
    ],
    "missing_requirements": [
      {{
        "requirement": "exact missing requirement",
        "importance": "critical or important or nice to have",
        "time_to_close": "realistic time to learn this",
        "how_to_close": "specific action to close this gap"
      }}
    ],
    "verdict": "Should apply now or wait — specific reasoning",
    "apply_recommendation": "yes or no or almost"
  }}
}}""",
        max_tokens=2500
    )


# ─────────────────────────────────────
# PROMPT 7 — skill dependency map
# ─────────────────────────────────────
def get_skill_dependency_map(
    resume_text: str,
    recent_work: str,
    career_goal: str,
    skills: list
) -> dict:

    skills_have    = [s.get('name') for s in skills if s.get('level') == 'strong']
    skills_basic   = [s.get('name') for s in skills if s.get('level') == 'basic']
    skills_missing = [s.get('name') for s in skills if s.get('level') == 'missing']

    return call_groq(
        system="""You are a world-class computer science educator and career coach.
You understand exactly how technical skills build on each other.
You know what must be learned before what — and why skipping steps causes people to struggle.
You create skill dependency maps that are accurate, specific, and tailored to each person.
Respond only in valid JSON.""",

        user=f"""Build a skill dependency map for this person.

THEIR CURRENT SKILLS:
Strong: {', '.join(skills_have)}
Basic: {', '.join(skills_basic)}
Missing: {', '.join(skills_missing)}

RESUME:
{resume_text}

RECENT WORK:
{recent_work}

CAREER GOAL: {career_goal}

Build a dependency map showing exactly what leads to what.
Start from their current strongest skills and map path to goal.
Show ONLY skills relevant to their specific goal.
Maximum 15 nodes total.

Return ONLY this JSON:
{{
  "map_title": "Your skill path to [their goal]",
  "critical_path": ["skill_id_1", "skill_id_2", "skill_id_3"],
  "nodes": [
    {{
      "id": "python",
      "name": "Python",
      "level": "have",
      "unlocks": ["numpy", "pandas", "ml_basics"],
      "why_first": "Foundation for all ML work — every library is Python based",
      "time_to_learn": "already have",
      "is_critical_path": true
    }},
    {{
      "id": "numpy",
      "name": "NumPy",
      "level": "basic",
      "unlocks": ["pandas", "ml_basics"],
      "why_first": "Numerical computing backbone — Pandas and Scikit-learn are built on it",
      "time_to_learn": "3-5 days",
      "is_critical_path": true
    }}
  ]
}}""",
        max_tokens=3000
    )


# ─────────────────────────────────────
# PROMPT 8 — meta analysis
# ─────────────────────────────────────
def get_meta_analysis(
    career_goal: str,
    current_level: str,
    readiness_score: int,
    next_step_title: str,
    skills: list,
    roadmap: list,
    portfolio_score: dict = None,
    job_match: dict = None
) -> dict:

    skills_strong  = [s.get('name') for s in skills if s.get('level') == 'strong']
    skills_missing = [s.get('name') for s in skills if s.get('level') == 'missing']
    roadmap_steps  = [r.get('step') for r in roadmap]
    portfolio_info = f"Portfolio score: {portfolio_score.get('score')}/100" if portfolio_score else "No portfolio score"
    job_info       = f"Job match: {job_match.get('match_percentage')}%" if job_match else "No job description provided"

    return call_groq(
        system="""You are the most experienced career strategist in tech.
You have seen thousands of developer profiles.
You cut through noise and tell people exactly what matters most.
Your insights are sharp, specific, and memorable.
Respond only in valid JSON.""",

        user=f"""Read this full profile analysis and give the most important insights.

PROFILE SUMMARY:
Goal: {career_goal}
Current level: {current_level}
Readiness: {readiness_score}%
Immediate next step: {next_step_title}
Strong skills: {', '.join(skills_strong)}
Missing skills: {', '.join(skills_missing)}
Roadmap: {' → '.join(roadmap_steps)}
{portfolio_info}
{job_info}

Give the 3 most important things this person needs to understand.
Be the mentor who tells them what no one else will say directly.

Return ONLY this JSON:
{{
  "meta_analysis": {{
    "headline": "one powerful sentence capturing their entire situation",
    "top_3_insights": [
      {{
        "insight": "most important thing they need to understand",
        "why_it_matters": "why this specifically for them",
        "action": "what to do about it"
      }},
      {{
        "insight": "second most important insight",
        "why_it_matters": "why this specifically",
        "action": "what to do about it"
      }},
      {{
        "insight": "third insight",
        "why_it_matters": "why this",
        "action": "what to do about it"
      }}
    ],
    "realistic_timeline": "honest assessment of when they reach goal at current pace",
    "biggest_risk": "single most likely thing that derails people in their exact situation",
    "biggest_risk_solution": "specifically how to avoid it"
  }}
}}"""
    )


# ─────────────────────────────────────
# GITHUB ANALYZER
# ─────────────────────────────────────
def analyze_github(github_url: str, career_goal: str) -> dict:
    username = github_url.rstrip('/').split('/')[-1]

    try:
        headers = {'Accept': 'application/vnd.github.v3+json'}

        repos_res = requests.get(
            f'https://api.github.com/users/{username}/repos?per_page=20&sort=updated',
            headers=headers
        )
        repos = repos_res.json() if repos_res.status_code == 200 else []

        user_res = requests.get(
            f'https://api.github.com/users/{username}',
            headers=headers
        )
        user = user_res.json() if user_res.status_code == 200 else {}

        repo_summary = []
        languages = {}

        for repo in repos:
            if isinstance(repo, dict) and not repo.get('fork'):
                repo_summary.append({
                    'name':        repo.get('name'),
                    'description': repo.get('description'),
                    'language':    repo.get('language'),
                    'stars':       repo.get('stargazers_count', 0),
                    'topics':      repo.get('topics', []),
                    'updated':     repo.get('updated_at', '')[:10]
                })
                lang = repo.get('language')
                if lang:
                    languages[lang] = languages.get(lang, 0) + 1

        github_data = {
            'username':     username,
            'public_repos': user.get('public_repos', 0),
            'followers':    user.get('followers', 0),
            'languages':    languages,
            'repos':        repo_summary[:10]
        }

    except Exception as e:
        print(f"GitHub API error: {e}")
        return {
            "github_analysis": {
                "error":   "Could not fetch GitHub data",
                "score":   0,
                "summary": "GitHub profile could not be analyzed",
                "findings":      [],
                "improvements":  []
            }
        }

    return call_groq(
        system="""You are a senior developer reviewing someone's GitHub profile.
You look at their repos and tell them honestly what their code shows.
You focus on what hiring managers see when they visit a GitHub profile.
Respond only in valid JSON.""",

        user=f"""Analyze this GitHub profile for someone targeting: {career_goal}

GITHUB DATA:
Username: {github_data['username']}
Public repos: {github_data['public_repos']}
Followers: {github_data['followers']}
Languages used: {github_data['languages']}
Recent repos: {json.dumps(github_data['repos'], indent=2)}

Return ONLY this JSON:
{{
  "github_analysis": {{
    "score": number 0-100,
    "summary": "2 sentences on what their GitHub shows overall",
    "findings": [
      {{
        "type": "positive or negative",
        "point": "specific finding about their GitHub"
      }}
    ],
    "top_project": "name of most impressive repo and why",
    "improvements": [
      "specific thing to add or improve on GitHub",
      "another improvement",
      "another improvement"
    ]
  }}
}}"""
    )


# ─────────────────────────────────────
# MENTOR CHAT
# ─────────────────────────────────────
def mentor_chat(messages: list, profile: dict) -> str:

    skills_have    = [s['name'] for s in profile.get('skills', []) if s.get('level') == 'strong']
    skills_missing = [s['name'] for s in profile.get('skills', []) if s.get('level') == 'missing']
    skills_basic   = [s['name'] for s in profile.get('skills', []) if s.get('level') == 'basic']
    roadmap_steps  = [step.get('step') for step in profile.get('roadmap', [])]
    next_step_title = profile.get('next_step', {}).get('title', 'unknown')

    context = f"""You are JourneyAI — a personal career mentor.
You already analyzed this person's full profile.
Use this knowledge in every answer.

WHAT YOU KNOW:
- Current level: {profile.get('current_level')}
- Readiness: {profile.get('readiness_score')}%
- Their next step: {next_step_title}
- Strong skills: {', '.join(skills_have) if skills_have else 'none listed'}
- Basic skills: {', '.join(skills_basic) if skills_basic else 'none listed'}
- Missing skills: {', '.join(skills_missing) if skills_missing else 'none listed'}
- Full roadmap: {' → '.join(roadmap_steps) if roadmap_steps else 'not available'}

HOW TO RESPOND:
- Conversational and warm — like a mentor not a robot
- 2-4 sentences unless they ask for detail
- Always reference their actual situation — never generic advice
- If they seem discouraged be encouraging but honest
- Never repeat the same advice — build on the conversation"""

    groq_messages = [{"role": "system", "content": context}]

    for msg in messages:
        groq_messages.append({
            "role":    msg["role"],
            "content": msg["content"]
        })

    response = get_client().chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=groq_messages,
        temperature=0.5,
        max_tokens=500
    )

    return response.choices[0].message.content.strip()


# ─────────────────────────────────────
# MAIN — runs all prompts
# ─────────────────────────────────────
def analyze_profile(
    resume_text: str,
    recent_work: str,
    career_goal: str,
    hours_per_day: str = "1-2 hours",
    struggle: str = "nothing specific",
    background: str = "not specified",
    job_description: str = None,
    github_url: str = None
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

    # github — optional
    github_analysis = None
    if github_url and github_url.strip():
        print("Analyzing GitHub...")
        github_result  = analyze_github(github_url, career_goal)
        github_analysis = github_result.get('github_analysis')

    # portfolio score — always run
    print("Scoring portfolio...")
    portfolio_data = get_portfolio_score(
        resume_text, recent_work, career_goal, github_analysis
    )

    # job match — only if JD provided
    job_match_data = None
    if job_description and job_description.strip():
        print("Running job match...")
        job_match_data = get_job_match(
            resume_text, recent_work,
            skills_data.get('skills', []),
            job_description, career_goal
        )

    # skill dependency map
    print("Building skill dependency map...")
    dependency_data = get_skill_dependency_map(
        resume_text, recent_work, career_goal,
        skills_data.get('skills', [])
    )

    # meta analysis — last, reads everything
    print("Running meta analysis...")
    meta_data = get_meta_analysis(
        career_goal=career_goal,
        current_level=skills_data.get('current_level'),
        readiness_score=skills_data.get('readiness_score'),
        next_step_title=next_step_data.get('next_step', {}).get('title', ''),
        skills=skills_data.get('skills', []),
        roadmap=roadmap_data.get('roadmap', []),
        portfolio_score=portfolio_data.get('portfolio_score'),
        job_match=job_match_data.get('job_match') if job_match_data else None
    )

    result = {
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
        "portfolio_score":          portfolio_data.get("portfolio_score"),
        "dependency_map":           dependency_data,
        "meta_analysis":            meta_data.get("meta_analysis"),
    }

    if github_analysis:
        result["github_analysis"] = github_analysis

    if job_match_data:
        result["job_match"] = job_match_data.get("job_match")

    return result