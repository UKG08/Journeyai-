import os
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from typing import Optional

from models import RoadmapResponse
from pdf_parser import parse_pdf
from groq_service import analyze_profile
from supabase_service import save_roadmap, get_roadmap

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.get("/")
def root():
    return {"status": "JourneyAI backend is running"}


@app.post("/analyze")
async def analyze(
    resume: UploadFile = File(...),          # PDF file upload
    recent_work: str = Form(...),            # text field
    career_goal: str = Form(...),            # text field
    job_description: Optional[str] = Form(None)  # optional text field
):

    print("Step 1: Parsing PDF...")
    file_bytes = await resume.read()
    resume_text = parse_pdf(file_bytes)
    print(f"Extracted {len(resume_text)} characters from PDF")

  
    print("Step 2: Calling Groq...")
    result = analyze_profile(
        resume_text=resume_text,
        recent_work=recent_work,
        career_goal=career_goal,
        job_description=job_description
    )
    print("Groq returned successfully")

    print("Step 3: Saving to Supabase...")
    share_id = save_roadmap(result)
    result["share_id"] = share_id
    print(f"Saved with share ID: {share_id}")

    # step 4 — return full result to React
    return result



@app.get("/roadmap/{share_id}")
def get_shared_roadmap(share_id: str):
    data = get_roadmap(share_id)

    if not data:
        return {"error": "Roadmap not found"}

    return data