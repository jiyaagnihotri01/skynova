import time
import logging
import traceback
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.config import UPLOADS_DIR
from app.services.aws_client import upload_to_s3
from app.services.db_manager import process_and_save_csv, load_reviews_from_db

router = APIRouter(prefix="/api/upload", tags=["Upload & Seeding"])
logger = logging.getLogger("skypulse.upload")

@router.post("")
async def upload_csv(file: UploadFile = File(...)):
    """Receives CSV file upload, streams to Amazon S3, processes NLP, and syncs to DynamoDB."""
    if not file.filename.endswith(".csv"):
        print("[API ERROR] Invalid file format. Only CSV allowed.")
        raise HTTPException(status_code=400, detail="Only .csv files are supported.")
        
    try:
        contents = await file.read()
        filename = file.filename
        local_path = UPLOADS_DIR / filename
        
        print(f"\n==================================================")
        print(f"[INFO] CSV received: '{filename}' ({len(contents)} bytes)")
        print(f"==================================================")
        
        with open(local_path, "wb") as f:
            f.write(contents)
            
        print(f"[INFO] Uploading CSV to Amazon S3...")
        s3_res = upload_to_s3(contents, filename)
        
        res = process_and_save_csv(local_path)
        processed = res.get("processed", [])
        ddb_res = res.get("ddb_res", {})
        
        print(f"[API SUCCESS] Processed {len(processed)} customer review records.")
        return {
            "message": f"Successfully processed {len(processed)} reviews for SkyPulse AI.",
            "filename": filename,
            "total_processed": len(processed),
            "s3_status": s3_res,
            "dynamodb_status": ddb_res
        }
    except Exception as e:
        print(f"[API INGESTION ERROR] Exception during upload:")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Upload processing failed: {str(e)}")

@router.post("/seed")
def seed_dataset():
    """Seeds database using British Airways dataset."""
    sample_csv = UPLOADS_DIR / "british_airways_reviews.csv"
    if not sample_csv.exists():
        print("[API ERROR] Sample British Airways dataset CSV not found.")
        raise HTTPException(status_code=404, detail="British Airways dataset CSV file not found on server.")
        
    try:
        print(f"\n==================================================")
        print(f"[INFO] CSV received (Seeding dataset: '{sample_csv.name}')")
        print(f"==================================================")
        
        with open(sample_csv, "rb") as f:
            contents = f.read()
        print(f"[INFO] Uploading CSV to Amazon S3...")
        s3_res = upload_to_s3(contents, sample_csv.name)
        
        res = process_and_save_csv(sample_csv)
        processed = res.get("processed", [])
        ddb_res = res.get("ddb_res", {})
        
        return {
            "message": f"Successfully seeded SkyPulse AI with {len(processed)} British Airways customer review records.",
            "total": len(processed),
            "s3_status": s3_res,
            "dynamodb_status": ddb_res
        }
    except Exception as e:
        print(f"[API SEED ERROR] Exception during seeding:")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Dataset seeding failed: {str(e)}")
