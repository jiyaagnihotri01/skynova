import os
from fastapi import FastAPI, UploadFile, File, HTTPException, Query, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List

from app.config import CORS_ORIGINS, IS_AWS_CONFIGURED
from app.services.aws_client import verify_aws_connection
from app.services.db_manager import initialize_skypulse_db_if_empty, load_reviews_from_db
from app.routers import home, experience, insights, ai_advisor, trends, reports, upload, dashboard, analytics, ai, admin

app = FastAPI(
    title="SkyPulse AI & SatisAI - Customer Intelligence Platform API",
    description="Enterprise-grade airline customer satisfaction platform powered by Amazon Bedrock, Comprehend, S3, and DynamoDB.",
    version="2.0.0"
)

# CORS Setup
origins = [o.strip() for o in CORS_ORIGINS.split(",") if o.strip()]
origins.extend([
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://localhost:3000",
    "https://skypulse.vercel.app",
    "https://skypulse-customer-intelligence.vercel.app"
])

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Router Modules
app.include_router(home.router)
app.include_router(experience.router)
app.include_router(insights.router)
app.include_router(ai_advisor.router)
app.include_router(trends.router)
app.include_router(reports.router)
app.include_router(upload.router)

app.include_router(dashboard.router)
app.include_router(analytics.router)
app.include_router(ai.router)
app.include_router(admin.router)

# Health & Root Routes
@app.get("/")
def root():
    return {
        "status": "online",
        "app": "SkyPulse AI Backend",
        "health": "/api/health"
    }

@app.get("/health")
@app.get("/api/health")
def health_check():
    reviews = load_reviews_from_db()
    aws_details = verify_aws_connection()
    return {
        "status": "online",
        "app_name": "SkyPulse AI",
        "tagline": "British Airways Customer Intelligence Platform",
        "version": "2.0.0",
        "aws_mode": aws_details["mode"],
        "aws_details": aws_details,
        "database_records": len(reviews),
        "dataset": "British Airways Customer Reviews"
    }

# Route Aliases
@app.get("/dashboard")
def dashboard_alias():
    return dashboard.get_dashboard_summary()

@app.get("/reviews")
def reviews_alias(
    search: Optional[str] = None,
    sentiment: Optional[str] = None,
    category: Optional[str] = None,
    verified: Optional[bool] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100)
):
    return admin.get_admin_reviews(search, sentiment, category, verified, page, limit)

@app.get("/analytics")
def analytics_alias():
    return analytics.get_analytics_data()

@app.post("/recommendations")
def recommendations_alias():
    return ai.get_recommendations()

@app.get("/home")
def home_alias():
    return home.get_home_dashboard()

@app.get("/experience")
def experience_alias():
    return experience.get_flight_experience_touchpoints()

@app.get("/insights")
def insights_alias():
    return insights.get_passenger_insights()

@app.get("/trends")
def trends_alias():
    return trends.get_trend_analytics()

@app.on_event("startup")
def startup_event():
    initialize_skypulse_db_if_empty()

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=True)
