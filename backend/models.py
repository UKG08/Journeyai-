from pydantic import BaseModel
from typing import Optional , List 

class AlalyzeRequest(BaseModel):
    recent_work : str 
    carreer_goal : str
    job_description : Optional[str] = None

class Skill(BaseModel):
    name : str 
    level : str

class WeekTask(BaseModel):
    day : int 
    tasks : List[str]

class Resurce(BaseModel):
    tittle : str 
    url  : str 

class RoadmapStep(BaseModel):
    step : str 
    description : str
    iscurrent : bool

class ResumeWeakSpot(BaseModel):
    issue : str
    fix :str 

class NextStep(BaseModel):
    tittle : str 
    why :str 
    time_estimate : str 
    week_plan : List[WeekTask]
    resources : List[Resurce]

class RoadmapResponse(BaseModel):
    current_level: str
    readiness_score: int
    skills: List[Skill]
    resume_weak_spots: List[ResumeWeakSpot]
    next_step: NextStep
    roadmap: List[RoadmapStep]
    share_id: Optional[str] = None
    curr_level : str 
    readiness_score: int      # 0-100
    skills: List[Skill]
    resume_weak_spots: List[ResumeWeakSpot]
    next_step: NextStep
    roadmap: List[RoadmapStep]
    share_id: Optional[str] = None