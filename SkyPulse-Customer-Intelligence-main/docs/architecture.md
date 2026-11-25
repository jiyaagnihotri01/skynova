# SkyPulse AI System Architecture

## Architecture Diagram

```
                              ┌──────────────────────────────────────────┐
                              │    React + Vite + TypeScript Frontend    │
                              │           (Deployed on Vercel)           │
                              └────────────────────┬─────────────────────┘
                                                   │ Axios REST API
                                                   ▼
                              ┌──────────────────────────────────────────┐
                              │            FastAPI Backend App           │
                              │         (Deployed on Render / AWS)       │
                              └───────┬─────────────┬─────────────┬──────┘
                                      │             │             │
                    ┌─────────────────┘             │             └──────────────────┐
                    ▼                               ▼                                ▼
       ┌────────────────────────┐     ┌────────────────────────┐      ┌────────────────────────┐
       │     Amazon S3 Bucket   │     │    Amazon Comprehend   │      │     Amazon Bedrock     │
       │(skypulse-reviews-bucket) │   │  (Sentiment & Emotion) │      │ (Claude 3 / Titan LLM) │
       └───────────┬────────────┘     └────────────────────────┘      └────────────────────────┘
                   │ S3 ObjectCreated
                   ▼
       ┌────────────────────────┐
       │   AWS Lambda Worker    │ ───► ┌────────────────────────┐
       │ (process_review.py)    │      │    Amazon DynamoDB     │
       └────────────────────────┘      │   (skypulse_reviews)   │
                                       └────────────────────────┘
```

## System Modules

1. **Frontend**: React 18 + Vite + TypeScript + Tailwind CSS + Recharts. Styled with white glassmorphism cards, British Airways Speedmark red accents, and 7-section navigation.
2. **Backend**: Python FastAPI with Pandas, boto3, and Pydantic. Dual-mode execution (Live AWS vs Standalone Local Fallback).
3. **AWS Infrastructure**:
   - **Amazon S3**: Bucket `skypulse-reviews-bucket` for CSV datasets.
   - **Amazon DynamoDB**: Table `skypulse_reviews` for processed review records.
   - **Amazon Comprehend**: Sentiment detection and key phrase extraction.
   - **Amazon Bedrock**: Generative AI executive recommendations and ChatGPT-style AI Advisor.
