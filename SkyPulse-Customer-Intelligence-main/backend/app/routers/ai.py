from fastapi import APIRouter
from pydantic import BaseModel
from app.routers.dashboard import get_dashboard_summary
from app.services.recommendation_engine import (
    generate_ai_recommendations,
    answer_ai_chat_query
)

router = APIRouter(prefix="/api/ai", tags=["AI Engine"])

class ChatRequest(BaseModel):
    question: str

@router.post("/recommendations")
def get_recommendations():
    dashboard_data = get_dashboard_summary()
    recommendations = generate_ai_recommendations(dashboard_data)
    return recommendations

@router.post("/chat")
def chat_with_bedrock(req: ChatRequest):
    if not req.question or not req.question.strip():
        return {"answer": "Please ask a specific question about customer feedback or recommendations."}
        
    dashboard_data = get_dashboard_summary()
    res = answer_ai_chat_query(req.question.strip(), dashboard_data)
    return res
