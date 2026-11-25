import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID", "")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY", "")
AWS_REGION = os.getenv("AWS_REGION", "us-east-1")

AWS_S3_BUCKET_NAME = os.getenv("AWS_S3_BUCKET_NAME", "skypulse-reviews-bucket")
AWS_DYNAMODB_TABLE_NAME = os.getenv("AWS_DYNAMODB_TABLE_NAME", "CustomerReviews")
AWS_BEDROCK_MODEL_ID = os.getenv("AWS_BEDROCK_MODEL_ID", "anthropic.claude-3-haiku-20240307-v1:0")

UPLOADS_DIR = BASE_DIR / "data" / "uploads"
DB_FILE = BASE_DIR / "data" / "skypulse_db.json"

UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
BASE_DIR.joinpath("data").mkdir(parents=True, exist_ok=True)

IS_AWS_CONFIGURED = bool(
    AWS_ACCESS_KEY_ID and 
    AWS_SECRET_ACCESS_KEY and 
    AWS_ACCESS_KEY_ID != "YOUR_AWS_ACCESS_KEY"
)

CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:5174,http://localhost:3000,https://skypulse.vercel.app,https://skypulse-customer-intelligence.vercel.app")
