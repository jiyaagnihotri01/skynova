import io
import csv
import uuid
from typing import Optional, List
from fastapi import APIRouter, HTTPException, Query, Response
from pydantic import BaseModel
from app.services.db_service import load_reviews_from_db, save_reviews_to_db
from app.services.nlp_engine import (
    clean_text,
    analyze_sentiment,
    detect_complaint_category,
    predict_satisfaction_score
)

router = APIRouter(prefix="/api/admin", tags=["Admin Operations"])

class ReviewCreateRequest(BaseModel):
    title: str
    text: str
    date: Optional[str] = "2024-07-30"
    verified: Optional[bool] = True

class BulkDeleteRequest(BaseModel):
    ids: List[str]

@router.get("/reviews")
def get_admin_reviews(
    search: Optional[str] = None,
    sentiment: Optional[str] = None,
    category: Optional[str] = None,
    verified: Optional[bool] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100)
):
    reviews = load_reviews_from_db()
    filtered = reviews

    if search:
        s_lower = search.lower()
        filtered = [
            r for r in filtered
            if s_lower in r.get("title", "").lower() or s_lower in r.get("text", "").lower() or s_lower in r.get("id", "").lower()
        ]

    if sentiment and sentiment != "All":
        filtered = [r for r in filtered if r.get("sentiment") == sentiment]

    if category and category != "All":
        filtered = [r for r in filtered if r.get("category") == category]

    if verified is not None:
        filtered = [r for r in filtered if r.get("verified") == verified]

    total_items = len(filtered)
    start = (page - 1) * limit
    end = start + limit
    paginated_items = filtered[start:end]

    return {
        "total": total_items,
        "page": page,
        "limit": limit,
        "total_pages": (total_items + limit - 1) // limit if limit > 0 else 1,
        "reviews": paginated_items
    }

@router.get("/reviews/{review_id}")
def get_single_review(review_id: str):
    reviews = load_reviews_from_db()
    match = next((r for r in reviews if r.get("id") == review_id), None)
    if not match:
        raise HTTPException(status_code=404, detail="Review not found")
    return match

@router.post("/reviews")
def create_review(req: ReviewCreateRequest):
    title = clean_text(req.title)
    text = clean_text(req.text)
    
    if not text:
        raise HTTPException(status_code=400, detail="Review text content cannot be empty.")
        
    sentiment_res = analyze_sentiment(text, title)
    category = detect_complaint_category(text, title)
    csat_score = predict_satisfaction_score(sentiment_res, text, title)

    reviews = load_reviews_from_db()
    new_id = f"rev-{len(reviews)+1:04d}"

    new_item = {
        "id": new_id,
        "title": title or "Customer Feedback",
        "text": text,
        "sentiment": sentiment_res["sentiment"],
        "confidence": sentiment_res["confidence"],
        "csat_score": csat_score,
        "category": category,
        "date": req.date or "2024-07-30",
        "verified": req.verified,
        "source": sentiment_res.get("source", "SatisAI Manual Entry")
    }

    reviews.insert(0, new_item)
    save_reviews_to_db(reviews)

    return {
        "message": "Review added successfully",
        "review": new_item
    }

@router.delete("/reviews/{review_id}")
def delete_review(review_id: str):
    reviews = load_reviews_from_db()
    initial_len = len(reviews)
    reviews = [r for r in reviews if r.get("id") != review_id]

    if len(reviews) == initial_len:
        raise HTTPException(status_code=404, detail="Review not found")

    save_reviews_to_db(reviews)
    return {"message": f"Review {review_id} successfully deleted."}

@router.delete("/reviews")
def bulk_delete_reviews(req: BulkDeleteRequest):
    reviews = load_reviews_from_db()
    delete_set = set(req.ids)
    remaining = [r for r in reviews if r.get("id") not in delete_set]

    deleted_count = len(reviews) - len(remaining)
    save_reviews_to_db(remaining)

    return {"message": f"Successfully deleted {deleted_count} reviews.", "deleted_count": deleted_count}

@router.get("/export")
def export_csv(
    search: Optional[str] = None,
    sentiment: Optional[str] = None
):
    reviews = load_reviews_from_db()
    if search:
        s_lower = search.lower()
        reviews = [r for r in reviews if s_lower in r.get("title", "").lower() or s_lower in r.get("text", "").lower()]
    if sentiment and sentiment != "All":
        reviews = [r for r in reviews if r.get("sentiment") == sentiment]

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["ID", "Title", "Text", "Sentiment", "Confidence", "CSAT Score", "Category", "Date", "Verified"])

    for r in reviews:
        writer.writerow([
            r.get("id"),
            r.get("title"),
            r.get("text"),
            r.get("sentiment"),
            r.get("confidence"),
            r.get("csat_score"),
            r.get("category"),
            r.get("date"),
            r.get("verified")
        ])

    response = Response(content=output.getvalue(), media_type="text/csv")
    response.headers["Content-Disposition"] = "attachment; filename=satisai_filtered_reviews.csv"
    return response
