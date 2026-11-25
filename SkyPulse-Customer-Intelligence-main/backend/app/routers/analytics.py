from fastapi import APIRouter
from app.services.db_service import load_reviews_from_db
from app.services.nlp_engine import extract_top_keywords

router = APIRouter(prefix="/api/analytics", tags=["Analytics"])

@router.get("")
def get_analytics_data():
    reviews = load_reviews_from_db()
    total = len(reviews)
    
    if total == 0:
        return {
            "ratings_distribution": [],
            "monthly_trends": [],
            "word_cloud": [],
            "complaint_breakdown": [],
            "csat_histogram": []
        }

    # CSAT Score Histogram Breakdown (1-2, 3-4, 5-6, 7-8, 9-10)
    buckets = {"1-2 (Detractor)": 0, "3-4 (Poor)": 0, "5-6 (Average)": 0, "7-8 (Good)": 0, "9-10 (Promoter)": 0}
    for r in reviews:
        score = r.get("csat_score", 5.0)
        if score <= 2:
            buckets["1-2 (Detractor)"] += 1
        elif score <= 4:
            buckets["3-4 (Poor)"] += 1
        elif score <= 6:
            buckets["5-6 (Average)"] += 1
        elif score <= 8:
            buckets["7-8 (Good)"] += 1
        else:
            buckets["9-10 (Promoter)"] += 1

    csat_histogram = [{"range": k, "count": v, "percentage": round((v / total) * 100, 1)} for k, v in buckets.items()]

    # Ratings by category (Seat Comfort, Cabin Staff, Food & Beverage, Ground Service, Value)
    ratings_dist = [
        {"category": "Cabin Staff & Service", "rating": 3.8, "benchmark": 4.5},
        {"category": "Seat & Cabin Comfort", "rating": 2.4, "benchmark": 4.0},
        {"category": "Food & Beverage", "rating": 2.1, "benchmark": 3.8},
        {"category": "Ground & Baggage", "rating": 1.9, "benchmark": 4.2},
        {"category": "Value for Money", "rating": 2.2, "benchmark": 4.0}
    ]

    # Keyword frequency
    texts = [r["text"] for r in reviews if "text" in r]
    top_words = extract_top_keywords(texts, top_n=25)

    return {
        "total_reviews": total,
        "csat_histogram": csat_histogram,
        "ratings_distribution": ratings_dist,
        "word_cloud": top_words
    }
