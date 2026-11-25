import json
import uuid
import pandas as pd
from pathlib import Path
from app.config import DB_FILE, UPLOADS_DIR
from app.services.aws_client import batch_write_reviews_to_dynamodb, batch_save_items_to_dynamodb
from app.services.skypulse_nlp import (
    clean_text,
    analyze_sentiment,
    detect_primary_emotion,
    extract_flight_touchpoints,
    predict_csi_index
)

def load_reviews_from_db() -> list[dict]:
    """Loads SkyPulse reviews database."""
    if DB_FILE.exists():
        try:
            with open(DB_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return []
    return []

def save_reviews_to_db(reviews: list[dict]):
    """Saves SkyPulse reviews database to JSON file."""
    with open(DB_FILE, "w", encoding="utf-8") as f:
        json.dump(reviews, f, indent=2, ensure_ascii=False)

def initialize_skypulse_db_if_empty():
    """Initializes SkyPulse database from pre-packaged British Airways CSV dataset if empty."""
    reviews = load_reviews_from_db()
    if not reviews:
        csv_path = UPLOADS_DIR / "british_airways_reviews.csv"
        if csv_path.exists():
            print("[DATASET SEED] Database empty. Initializing British Airways customer reviews dataset...")
            process_and_save_csv(csv_path)

def process_and_save_csv(file_path: Path) -> dict:
    """Processes British Airways CSV file through SkyPulse NLP pipeline and syncs with DynamoDB & JSON DB."""
    try:
        df = pd.read_csv(file_path)
        print(f"[INFO] CSV parsed successfully ({len(df)} rows read from '{file_path.name}')")
    except Exception as e:
        print(f"[PIPELINE LOG ERROR] Failed to read/parse CSV: {e}")
        return {"processed": [], "ddb_res": {"success": False, "error": str(e)}}

    print(f"[INFO] NLP processing started for {len(df)} rows...")
    processed = []
    df.columns = [c.strip().lower() for c in df.columns]
    
    title_col = next((c for c in df.columns if "title" in c or "header" in c), None)
    text_col = next((c for c in df.columns if "review" in c or "text" in c or "comment" in c), None)
    date_col = next((c for c in df.columns if "date" in c or "time" in c), None)
    verified_col = next((c for c in df.columns if "verified" in c), None)

    airports = ["LHR (London Heathrow)", "LGW (London Gatwick)", "JFK (New York)", "HKG (Hong Kong)", "LAX (Los Angeles)", "SIN (Singapore)", "DXB (Dubai)", "BOS (Boston)"]
    regions = ["Europe", "North America", "Asia Pacific", "Middle East", "Latin America"]

    for idx, row in df.iterrows():
        raw_title = str(row[title_col]) if title_col and pd.notna(row[title_col]) else "Passenger Feedback"
        raw_text = str(row[text_col]) if text_col and pd.notna(row[text_col]) else ""
        
        title = clean_text(raw_title)
        text = clean_text(raw_text)
        
        if not text:
            continue

        # Fast NLP analysis
        sent_info = analyze_sentiment(text, title)
        emotion = detect_primary_emotion(text)
        touchpoints = extract_flight_touchpoints(text)
        csi = predict_csi_index(sent_info["sentiment"], sent_info["confidence"], touchpoints)
        
        date_str = str(row[date_col]) if date_col and pd.notna(row[date_col]) else f"2024-{(idx % 12) + 1:02d}-{(idx % 28) + 1:02d}"
        airport = airports[idx % len(airports)]
        region = regions[idx % len(regions)]
        verified = True if (verified_col and pd.notna(row[verified_col]) and "verified" in str(row[verified_col]).lower()) else ((idx % 4) != 0)
        category = touchpoints[0] if touchpoints else "Flight Experience"

        item = {
            "customerID": f"cust-{idx+1:04d}",
            "id": f"sp-{idx+1:04d}",
            "title": title,
            "text": text,
            "sentiment": sent_info["sentiment"],
            "confidence": sent_info["confidence"],
            "category": category,
            "csat_score": csi,
            "csi_score": csi,
            "emotion": emotion,
            "touchpoints": touchpoints,
            "primary_touchpoint": category,
            "airport": airport,
            "region": region,
            "date": date_str,
            "verified": verified,
            "source": sent_info.get("source", "SkyPulse NLP")
        }
        processed.append(item)

    print(f"[INFO] NLP processing completed ({len(processed)} records processed)")

    # Save to local JSON database
    try:
        save_reviews_to_db(processed)
        print(f"[PIPELINE LOG] Local JSON database updated ({len(processed)} records).")
    except Exception as e:
        print(f"[PIPELINE LOG ERROR] Failed to save local JSON database: {e}")

    # Batch Insert into DynamoDB
    ddb_res = batch_write_reviews_to_dynamodb(processed)

    print(f"[PIPELINE LOG COMPLETE] End-to-end ingestion pipeline finished for {len(processed)} records.\n")
    return {"processed": processed, "ddb_res": ddb_res}
