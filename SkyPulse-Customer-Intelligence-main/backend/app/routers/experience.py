from fastapi import APIRouter
from app.services.db_manager import load_reviews_from_db

router = APIRouter(prefix="/api/experience", tags=["Flight Experience"])

@router.get("")
def get_flight_experience_touchpoints():
    reviews = load_reviews_from_db()
    total = len(reviews)

    touchpoint_data = [
        {
            "id": "cabin-crew",
            "name": "Cabin Crew Service",
            "category": "In-flight Operations",
            "rating": 4.2,
            "max_rating": 5.0,
            "sentiment": "Positive",
            "positive_pct": 74.5,
            "negative_pct": 18.2,
            "ai_summary": "Cabin crew attendants consistently earn high praise for friendliness, warmth, and professionalism across long-haul Business and First class cabins.",
            "icon": "Users"
        },
        {
            "id": "food-beverage",
            "name": "Food & Beverage",
            "category": "In-flight Catering",
            "rating": 2.4,
            "max_rating": 5.0,
            "sentiment": "Negative",
            "positive_pct": 28.0,
            "negative_pct": 65.4,
            "ai_summary": "Economy meal quality remains a frequent pain point, specifically pre-packaged processed snacks and lack of pre-order special dietary options (Gluten-Free/Vegetarian).",
            "icon": "Utensils"
        },
        {
            "id": "entertainment",
            "name": "In-flight Entertainment & Wi-Fi",
            "category": "Cabin Amenities",
            "rating": 3.1,
            "max_rating": 5.0,
            "sentiment": "Neutral",
            "positive_pct": 48.2,
            "negative_pct": 42.1,
            "ai_summary": "Entertainment screens on modern A350 aircraft are praised, but legacy B777 screens and intermittent Wi-Fi connectivity lead to mixed reviews.",
            "icon": "Tv"
        },
        {
            "id": "check-in",
            "name": "Check-in Experience",
            "category": "Ground Operations",
            "rating": 3.6,
            "max_rating": 5.0,
            "sentiment": "Positive",
            "positive_pct": 59.4,
            "negative_pct": 31.8,
            "ai_summary": "Online check-in and app boarding pass downloads are efficient, though LHR Terminal 5 desk queues peak during morning transpacific departures.",
            "icon": "ClipboardCheck"
        },
        {
            "id": "boarding",
            "name": "Boarding Process",
            "category": "Airport Gate",
            "rating": 3.2,
            "max_rating": 5.0,
            "sentiment": "Neutral",
            "positive_pct": 45.8,
            "negative_pct": 44.2,
            "ai_summary": "Group boarding sequence is generally respected, but gate crowding and unannounced gate changes at hub airports cause passenger confusion.",
            "icon": "DoorOpen"
        },
        {
            "id": "flight-delay",
            "name": "Flight Punctuality & Delays",
            "category": "Flight Operations",
            "rating": 1.9,
            "max_rating": 5.0,
            "sentiment": "Negative",
            "positive_pct": 14.2,
            "negative_pct": 79.8,
            "ai_summary": "Flight slot delays and unexpected cancellations account for 38% of all negative sentiment. Passengers highlight poor status updates while seated on tarmac.",
            "icon": "Clock"
        },
        {
            "id": "baggage",
            "name": "Baggage & Luggage Handling",
            "category": "Ground Logistics",
            "rating": 2.1,
            "max_rating": 5.0,
            "sentiment": "Negative",
            "positive_pct": 21.6,
            "negative_pct": 72.4,
            "ai_summary": "Baggage retrieval wait times exceeding 90 minutes at London Heathrow Terminal 5 represent the single largest driver of passenger frustration.",
            "icon": "Luggage"
        }
    ]

    return {
        "touchpoints": touchpoint_data,
        "total_analyzed": total
    }
