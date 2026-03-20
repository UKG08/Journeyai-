import os
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from typing import Optional, List
from pydantic import BaseModel

from models import RoadmapResponse
from pdf_parser import parse_pdf
from groq_service import analyze_profile, mentor_chat
from supabase_service import save_roadmap, get_roadmap

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─────────────────────────────────────
# MODELS FOR CHAT
# ─────────────────────────────────────
class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    profile: dict


# ─────────────────────────────────────
# ROUTES
# ─────────────────────────────────────
@app.get("/")
def root():
    return {"status": "JourneyAI backend is running"}


@app.post("/analyze")
async def analyze(
    resume: UploadFile = File(...),
    recent_work: str = Form(...),
    career_goal: str = Form(...),
    hours_per_day: str = Form("1-2 hours"),
    struggle: str = Form("nothing specific"),
    background: str = Form("not specified"),
    job_description: Optional[str] = Form(None)
):
    # step 1 — parse PDF
    print("Step 1: Parsing PDF...")
    file_bytes = await resume.read()
    resume_text = parse_pdf(file_bytes)
    print(f"Extracted {len(resume_text)} characters")

    # step 2 — send to Groq
    print("Step 2: Calling Groq...")
    result = analyze_profile(
        resume_text=resume_text,
        recent_work=recent_work,
        career_goal=career_goal,
        hours_per_day=hours_per_day,
        struggle=struggle,
        background=background,
        job_description=job_description
    )
    print("Groq returned successfully")

    # step 3 — save to Supabase
    print("Step 3: Saving to Supabase...")
    share_id = save_roadmap(result)
    result["share_id"] = share_id
    print(f"Saved with share ID: {share_id}")

    return result


@app.post("/chat")
async def chat(request: ChatRequest):
    messages = [
        {"role": msg.role, "content": msg.content}
        for msg in request.messages
    ]
    reply = mentor_chat(
        messages=messages,
        profile=request.profile
    )
    return {"reply": reply}


@app.get("/roadmap/{share_id}")
def get_shared_roadmap(share_id: str):
    data = get_roadmap(share_id)
    if not data:
        return {"error": "Roadmap not found"}
    return data