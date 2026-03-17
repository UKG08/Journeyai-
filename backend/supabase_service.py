import os 
import uuid 
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))

def save_roadmap(data: dict) -> str:
    share_id = str(uuid.uuid4())[:8]

    supabase.table("roadmaps").insert({
        "share_id": share_id,
        "data": data
    }).execute()

    return share_id 

def get_roadmap(share_id: str) -> dict:
    result = supabase.table("roadmaps") \
        .select("data") \
        .eq("share_id", share_id) \
        .execute()

    if result.data:
        return result.data[0]["data"]
    return None