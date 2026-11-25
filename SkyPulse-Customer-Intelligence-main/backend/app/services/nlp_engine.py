import re
import math
from collections import Counter
from app.services.aws_service import detect_sentiment_comprehend

STOPWORDS = {
    "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren't",
    "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "can't",
    "cannot", "could", "couldn't", "did", "didn't", "do", "does", "doesn't", "doing", "don't", "down", "during",
    "each", "few", "for", "from", "further", "had", "hadn't", "has", "hasn't", "have", "haven't", "having",
    "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself", "him", "himself", "his", "how",
    "how's", "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "isn't", "it", "it's", "its", "itself",
    "let's", "me", "more", "most", "mustn't", "my", "myself", "no", "nor", "not", "of", "off", "on", "once",
    "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "shan't", "she",
    "she'd", "she'll", "she's", "should", "shouldn't", "so", "some", "such", "than", "that", "that's", "the",
    "their", "theirs", "them", "themselves", "then", "there", "there's", "these", "they", "they'd", "they'll",
    "they're", "they've", "this", "those", "through", "to", "too", "under", "until", "up", "very", "was",
    "wasn't", "we", "we'd", "we'll", "we're", "we've", "were", "weren't", "what", "what's", "when", "when's",
    "where", "where's", "which", "while", "who", "who's", "whom", "why", "why's", "with", "won't", "would",
    "wouldn't", "you", "you'd", "you'll", "you're", "you've", "your", "yours", "yourself", "yourselves",
    "ba", "british", "airways", "flight", "flights", "plane", "airline", "one", "got", "get", "also", "would"
}

POSITIVE_WORDS = {
    "great", "excellent", "amazing", "good", "wonderful", "pleasant", "comfortable", "friendly", "helpful",
    "superb", "satisfying", "satisfied", "clean", "delicious", "efficient", "prompt", "smooth", "courteous",
    "polite", "professional", "enjoyed", "loved", "perfect", "punctual", "nice", "easy", "best", "fantastic"
}

NEGATIVE_WORDS = {
    "terrible", "horrible", "awful", "bad", "poor", "disgusting", "appalling", "unprofessional", "rude",
    "delayed", "cancelled", "delay", "cancellation", "disappointing", "disappointed", "lost", "dirty",
    "cramped", "uncomfortable", "stolen", "incompetent", "shambles", "worst", "avoid", "refused", "slow",
    "useless", "outdated", "bland", "chaos", "chaotic", "ridiculous", "rubbish", "crowded", "cold"
}

CATEGORY_KEYWORDS = {
    "Flight Delays & Cancelations": ["delay", "delayed", "cancel", "cancelled", "cancellation", "late", "schedule", "time", "hours", "layover", "slot", "connection"],
    "Baggage & Ground Service": ["bag", "baggage", "luggage", "lost", "damaged", "gate", "check in", "check-in", "security", "lounge", "ground", "agent", "staff"],
    "In-flight Cabin Staff": ["crew", "attendant", "attendants", "staff", "service", "polite", "rude", "friendly", "helpful", "unprofessional", "manager"],
    "Food & Beverage": ["food", "meal", "breakfast", "dinner", "snack", "drink", "drinks", "water", "coffee", "tea", "sausage", "catering", "gluten", "tasty", "disgusting"],
    "Seating & Comfort": ["seat", "seats", "legroom", "recline", "bed", "business class", "economy", "club", "cramped", "dirty", "uncomfortable", "space", "aisle"],
    "Booking & Customer Service": ["booking", "customer service", "refund", "phone", "call", "agent", "online", "app", "website", "miles", "price", "ticket", "cost", "pay"]
}

def clean_text(text: str) -> str:
    """Clean raw text string."""
    if not text or not isinstance(text, str):
        return ""
    # Remove leading quotes or formatting symbols
    cleaned = re.sub(r'^[“"”\s]+|[“"”\s]+$', '', text)
    cleaned = re.sub(r'\s+', ' ', cleaned)
    return cleaned.strip()

def tokenize_and_remove_stopwords(text: str) -> list[str]:
    """Tokenizes text and strips punctuation and stopwords."""
    words = re.findall(r'\b[a-zA-Z]{3,}\b', text.lower())
    return [w for w in words if w not in STOPWORDS]

def analyze_sentiment(text: str, title: str = "") -> dict:
    """
    Performs sentiment analysis using Amazon Comprehend,
    with custom rule-based fallback.
    """
    # 1. Try Amazon Comprehend if active
    comprehend_result = detect_sentiment_comprehend(text)
    if comprehend_result:
        return comprehend_result

    # 2. Rule-based NLP Sentiment Analyzer fallback
    full_text = (f"{title} {text}").lower()
    tokens = tokenize_and_remove_stopwords(full_text)
    
    pos_count = sum(1 for w in tokens if w in POSITIVE_WORDS)
    neg_count = sum(1 for w in tokens if w in NEGATIVE_WORDS)
    
    # Give extra weight to title sentiment
    title_lower = title.lower()
    pos_count += sum(2 for w in POSITIVE_WORDS if w in title_lower)
    neg_count += sum(2 for w in NEGATIVE_WORDS if w in title_lower)
    
    total = pos_count + neg_count
    if total == 0:
        sentiment = "Neutral"
        confidence = 0.70
    elif pos_count > neg_count * 1.2:
        sentiment = "Positive"
        confidence = min(0.98, round(0.65 + (pos_count / (total + 1)) * 0.35, 2))
    elif neg_count > pos_count * 1.2:
        sentiment = "Negative"
        confidence = min(0.98, round(0.65 + (neg_count / (total + 1)) * 0.35, 2))
    else:
        sentiment = "Neutral"
        confidence = 0.75
        
    return {
        "sentiment": sentiment,
        "confidence": confidence,
        "source": "SatisAI Rule-Based NLP",
        "scores": {
            "Positive": round(pos_count / (total + 1), 2),
            "Negative": round(neg_count / (total + 1), 2),
            "Neutral": 0.2
        }
    }

def detect_complaint_category(text: str, title: str = "") -> str:
    """Categorize review feedback into airline service categories."""
    combined = (f"{title} {text}").lower()
    category_scores = {}
    
    for category, keywords in CATEGORY_KEYWORDS.items():
        score = sum(1 for kw in keywords if kw in combined)
        category_scores[category] = score
        
    best_category = max(category_scores, key=category_scores.get)
    if category_scores[best_category] == 0:
        return "General Service Experience"
    return best_category

def predict_satisfaction_score(
    sentiment_data: dict,
    text: str,
    title: str = "",
    rating_seat: float = None,
    rating_staff: float = None,
    rating_food: float = None,
    rating_value: float = None
) -> float:
    """
    Predict Customer Satisfaction Score (CSAT) on a 1.0 to 10.0 scale.
    Combines NLP sentiment confidence, word polarities, and optional numeric ratings.
    """
    sentiment = sentiment_data.get("sentiment", "Neutral")
    confidence = sentiment_data.get("confidence", 0.8)
    
    # Base score by sentiment
    if sentiment == "Positive":
        base_csat = 7.5 + (confidence * 2.3)
    elif sentiment == "Negative":
        base_csat = 3.5 - (confidence * 2.2)
    else:
        base_csat = 5.5
        
    # If sub-ratings are available, blend them in
    provided_ratings = [r for r in [rating_seat, rating_staff, rating_food, rating_value] if r is not None and r > 0]
    if provided_ratings:
        ratings_avg = (sum(provided_ratings) / len(provided_ratings)) * 2  # scale 5-star to 10
        final_csat = (base_csat * 0.5) + (ratings_avg * 0.5)
    else:
        final_csat = base_csat
        
    # Clamp between 1.0 and 10.0
    return round(max(1.0, min(10.0, final_csat)), 1)

def extract_top_keywords(text_list: list[str], top_n: int = 30) -> list[dict]:
    """Generates word frequency table for word cloud and analytics."""
    all_tokens = []
    for text in text_list:
        all_tokens.extend(tokenize_and_remove_stopwords(text))
        
    counts = Counter(all_tokens)
    return [{"word": word, "count": count} for word, count in counts.most_common(top_n)]
