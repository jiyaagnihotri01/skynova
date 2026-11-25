import json
import logging
import boto3
from botocore.exceptions import BotoCoreError, ClientError
from app.config import (
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
    AWS_REGION,
    AWS_S3_BUCKET_NAME,
    AWS_DYNAMODB_TABLE_NAME,
    AWS_BEDROCK_MODEL_ID,
    IS_AWS_CONFIGURED
)

logger = logging.getLogger("satisai.aws")

def get_boto3_client(service_name: str):
    if not IS_AWS_CONFIGURED:
        return None
    try:
        return boto3.client(
            service_name,
            aws_access_key_id=AWS_ACCESS_KEY_ID,
            aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
            region_name=AWS_REGION
        )
    except Exception as e:
        logger.warning(f"Failed to initialize boto3 client for {service_name}: {e}")
        return None

def upload_file_to_s3(file_bytes: bytes, filename: str) -> dict:
    """Uploads a file to Amazon S3 bucket, returning s3 metadata or local status."""
    s3_client = get_boto3_client("s3")
    if s3_client:
        try:
            s3_client.put_object(
                Bucket=AWS_S3_BUCKET_NAME,
                Key=f"uploads/{filename}",
                Body=file_bytes
            )
            return {
                "status": "success",
                "storage": "Amazon S3",
                "bucket": AWS_S3_BUCKET_NAME,
                "key": f"uploads/{filename}",
                "s3_url": f"https://{AWS_S3_BUCKET_NAME}.s3.{AWS_REGION}.amazonaws.com/uploads/{filename}"
            }
        except (BotoCoreError, ClientError) as e:
            logger.error(f"S3 upload error: {e}")
            return {
                "status": "fallback",
                "storage": "Local File Storage (S3 Fallback)",
                "error": str(e)
            }
    return {
        "status": "fallback",
        "storage": "Local File Storage (Mock S3)"
    }

def detect_sentiment_comprehend(text: str) -> dict:
    """Detects sentiment using Amazon Comprehend."""
    comprehend = get_boto3_client("comprehend")
    if comprehend:
        try:
            # Comprehend has a 5000 byte limit per request
            truncated_text = text[:4500] if len(text) > 4500 else text
            res = comprehend.detect_sentiment(Text=truncated_text, LanguageCode="en")
            scores = res.get("SentimentScore", {})
            sentiment = res.get("Sentiment", "NEUTRAL").upper()
            
            # Map Comprehend sentiment format
            sentiment_map = {
                "POSITIVE": "Positive",
                "NEGATIVE": "Negative",
                "NEUTRAL": "Neutral",
                "MIXED": "Neutral"
            }
            mapped_sentiment = sentiment_map.get(sentiment, "Neutral")
            confidence = scores.get(sentiment.capitalize(), 0.85)
            
            return {
                "sentiment": mapped_sentiment,
                "confidence": round(confidence, 4),
                "source": "Amazon Comprehend",
                "scores": scores
            }
        except (BotoCoreError, ClientError) as e:
            logger.warning(f"Comprehend sentiment failed, falling back: {e}")
    return None

def invoke_bedrock_model(prompt: str, system_prompt: str = "") -> str:
    """Invokes Amazon Bedrock LLM model for recommendations and chat."""
    bedrock = get_boto3_client("bedrock-runtime")
    if bedrock:
        try:
            # Anthropic Claude 3 format on Bedrock
            payload = {
                "anthropic_version": "bedrock-2023-05-31",
                "max_tokens": 1500,
                "temperature": 0.7,
                "messages": [
                    {
                        "role": "user",
                        "content": prompt
                    }
                ]
            }
            if system_prompt:
                payload["system"] = system_prompt
                
            response = bedrock.invoke_model(
                modelId=AWS_BEDROCK_MODEL_ID,
                body=json.dumps(payload)
            )
            response_body = json.loads(response.get("body").read())
            content_list = response_body.get("content", [])
            if content_list and len(content_list) > 0:
                return content_list[0].get("text", "")
        except (BotoCoreError, ClientError) as e:
            logger.warning(f"Amazon Bedrock invocation error: {e}")
    return None
