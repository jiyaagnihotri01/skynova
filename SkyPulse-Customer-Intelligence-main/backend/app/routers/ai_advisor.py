from fastapi import APIRouter
from pydantic import BaseModel
from app.routers.home import get_home_dashboard
from app.services.bedrock_advisor import (
    get_bedrock_executive_report,
    process_advisor_chat_query
)

router = APIRouter(prefix="/api/ai-advisor", tags=["AI Advisor"])

class ChatMessageRequest(BaseModel):
    query: str

@router.post("/report")
def generate_executive_report():
    home_data = get_home_dashboard()
    report = get_bedrock_executive_report(home_data)
    return report

@router.post("/chat")
def advisor_chat(req: ChatMessageRequest):
    if not req.query or not req.query.strip():
        return {"answer": "Please provide a valid question regarding British Airways customer feedback or strategic recommendations."}
        
    home_data = get_home_dashboard()
    res = process_advisor_chat_query(req.query.strip(), home_data)
    return res
