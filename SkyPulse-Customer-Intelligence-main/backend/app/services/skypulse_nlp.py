import re
from collections import Counter
from app.services.aws_client import detect_comprehend_sentiment

STOPWORDS = {
    "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "as", "at",
    "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "could", "did",
    "do", "does", "doing", "down", "during", "each", "few", "for", "from", "further", "had", "has", "have",
    "having", "he", "her", "here", "hers", "herself", "him", "himself", "his", "how", "i", "if", "in", "into",
    "is", "it", "its", "itself", "just", "me", "more", "most", "my", "myself", "no", "nor", "not", "of", "off",
    "on", "once", "only", "or", "other", "our", "ours", "ourselves", "out", "over", "own", "same", "she",
    "should", "so", "some", "such", "than", "that", "the", "their", "theirs", "them", "themselves", "then",
    "there", "these", "they", "this", "those", "through", "to", "too", "under", "until", "up", "very", "was",
    "we", "were", "what", "when", "where", "which", "while", "who", "whom", "why", "with", "would", "you",
    "your", "yours", "yourself", "ba", "british", "airways", "flight", "flights", "plane", "airline"
}

TOUCHPOINT_KEYWORDS = {
    "Cabin Crew": ["crew", "attendant", "attendants", "staff", "service", "stewardess", "polite", "rude", "friendly", "helpful", "hostess"],
    "Food & Beverage": ["food", "meal", "meals", "breakfast", "dinner", "snack", "drink", "drinks", "water", "coffee", "tea", "catering", "tasty", "disgusting", "wine"],
    "In-flight Entertainment": ["entertainment", "movie", "movies", "screen", "wifi", "internet", "headphone", "audio", "video", "charging", "tv"],
    "Check-in Experience": ["check in", "check-in", "desk", "agent", "counter", "kiosk", "online checkin", "boarding pass", "terminal"],
    "Boarding Process": ["boarding", "gate", "queue", "priority", "group", "bridge", "delay boarding", "boarding gate"],
    "Flight Delays & Punctuality": ["delay", "delayed", "late", "cancellation", "cancelled", "schedule", "layover", "slot", "connection", "hours late"],
    "Baggage & Ground Support": ["bag", "baggage", "luggage", "lost", "damaged", "wait baggage", "carousel", "lost property", "suitcase"]
}

EMOTION_KEYWORDS = {
    "Frustration": ["furious", "angry", "annoyed", "frustrated", "ridiculous", "shambles", "waste", "useless", "terrible"],
    "Disappointment": ["disappointed", "disappointing", "expected better", "downfall", "sad", "unfortunate", "poor quality"],
    "Delight": ["delighted", "amazing", "wonderful", "love", "fantastic", "pleasure", "flawless", "superb", "brilliant"],
    "Anxiety": ["worried", "scared", "nervous", "missed connection", "panic", "stranded", "helpless"],
    "Satisfaction": ["satisfied", "comfortable", "good", "decent", "pleasant", "smooth", "easy", "clean"]
}

def clean_text(text: str) -> str:
    """Removes noise, HTML, extra whitespace, and special characters."""
    if not text or not isinstance(text, str):
        return ""
    text = re.sub(r'<[^>]+>', ' ', text)
    text = re.sub(r'^[“"”\s]+|[“"”\s]+$', '', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def tokenize_and_lemmatize(text: str) -> list[str]:
    """Tokenizes text and applies word normalization/lemmatization simulation."""
    words = re.findall(r'\b[a-zA-Z]{3,}\b', text.lower())
    lemmas = []
    for w in words:
        if w in STOPWORDS:
            continue
        # Simple lemmatization suffixes
        if w.endswith('ies') and len(w) > 4:
            w = w[:-3] + 'y'
        elif w.endswith('ing') and len(w) > 4:
            w = w[:-3]
        elif w.endswith('ed') and len(w) > 4:
            w = w[:-2]
        lemmas.append(w)
    return lemmas

def analyze_sentiment(text: str, title: str = "") -> dict:
    """Runs Amazon Comprehend or SkyPulse Rule Engine."""
    comp_res = detect_comprehend_sentiment(text)
    if comp_res:
        return comp_res

    full_text = (f"{title} {text}").lower()
    tokens = tokenize_and_lemmatize(full_text)
    
    pos_words = {"great", "excellent", "amazing", "good", "wonderful", "pleasant", "comfortable", "friendly", "helpful", "clean", "delicious", "efficient", "prompt", "smooth", "courteous", "perfect", "punctual"}
    neg_words = {"terrible", "horrible", "awful", "bad", "poor", "disgusting", "appalling", "unprofessional", "rude", "delayed", "cancelled", "disappointing", "lost", "dirty", "cramped", "uncomfortable", "stolen", "incompetent", "shambles", "worst", "avoid"}

    pos_count = sum(1 for w in tokens if w in pos_words)
    neg_count = sum(1 for w in tokens if w in neg_words)

    if pos_count > neg_count * 1.2:
        sentiment = "Positive"
        confidence = min(0.98, 0.65 + (pos_count / (pos_count + neg_count + 1)) * 0.35)
    elif neg_count > pos_count * 1.2:
        sentiment = "Negative"
        confidence = min(0.98, 0.65 + (neg_count / (pos_count + neg_count + 1)) * 0.35)
    else:
        sentiment = "Neutral"
        confidence = 0.75

    return {
        "sentiment": sentiment,
        "confidence": round(confidence, 4),
        "source": "SkyPulse NLP Engine"
    }

def detect_primary_emotion(text: str) -> str:
    """Detects dominant emotional tone of the review."""
    text_lower = text.lower()
    scores = {}
    for emotion, keywords in EMOTION_KEYWORDS.items():
        scores[emotion] = sum(1 for kw in keywords if kw in text_lower)
    best_emotion = max(scores, key=scores.get)
    if scores[best_emotion] == 0:
        return "Neutral"
    return best_emotion

def extract_flight_touchpoints(text: str) -> dict:
    """Extracts affected flight touchpoints from review body."""
    text_lower = text.lower()
    touchpoints = []
    for category, keywords in TOUCHPOINT_KEYWORDS.items():
        if any(kw in text_lower for kw in keywords):
            touchpoints.append(category)
    return touchpoints or ["General Service"]

def predict_csi_index(sentiment: str, confidence: float, touchpoints: list[str]) -> float:
    """
    Predicts Customer Satisfaction Index (CSI) on a 0 - 100 scale.
    """
    if sentiment == "Positive":
        base_csi = 72 + (confidence * 25)
    elif sentiment == "Negative":
        base_csi = 35 - (confidence * 25)
    else:
        base_csi = 52.0

    # Touchpoint penalty for high-friction touchpoints (Flight Delays / Baggage)
    if "Flight Delays & Punctuality" in touchpoints:
        base_csi -= 8.0
    if "Baggage & Ground Support" in touchpoints:
        base_csi -= 6.0

    return round(max(5.0, min(98.0, base_csi)), 1)
