# SkyPulse AI Deployment Guide

## 1. Deploy Frontend on Vercel
1. Push repository to GitHub.
2. Sign in to Vercel and click **Add New Project**.
3. Set **Root Directory** to `frontend`.
4. Build Settings:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Environment Variables:
   - `VITE_API_URL` = `https://your-backend-app.onrender.com`
6. Click **Deploy**.

## 2. Deploy Backend on Render
1. Sign in to Render and click **New > Web Service**.
2. Set **Root Directory** to `backend`.
3. Build Settings:
   - Environment: Python 3
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Add Environment Variables:
   - `AWS_ACCESS_KEY_ID` (Optional)
   - `AWS_SECRET_ACCESS_KEY` (Optional)
   - `AWS_REGION` = `us-east-1`
   - `AWS_S3_BUCKET_NAME` = `skypulse-reviews-bucket`
   - `AWS_DYNAMODB_TABLE_NAME` = `skypulse_reviews`
   - `AWS_BEDROCK_MODEL_ID` = `anthropic.claude-3-haiku-20240307-v1:0`
5. Click **Create Web Service**.
