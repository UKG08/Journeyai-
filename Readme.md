# JourneyAI

An AI-powered career roadmap generator. Upload your resume, describe what you've been working on, and get a personalized next step + learning roadmap.

## What it does
- Analyzes your resume + recent work combined
- Detects your real skill level honestly
- Gives you one major next step with a day-by-day plan
- Reviews your resume and flags weak spots
- Builds a personalized linear roadmap to your goal
- Generates a shareable public link

## Tech Stack
- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Python + FastAPI
- **AI:** Groq API (Llama 3.3 70B) — free
- **Database:** Supabase
- **PDF Parsing:** PyPDF2

## Getting Started

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file in `backend/`:
```
GROQ_API_KEY=your_groq_key
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```
```bash
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Live Demo
[Add your deployed URL here]