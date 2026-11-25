# SkyPulse AI - British Airways Customer Intelligence Platform

> Transform Passenger Feedback into Actionable Intelligence

[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20TypeScript-61DAFB?logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38BDF8?logo=tailwindcss)](https://tailwindcss.com/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Amazon Bedrock](https://img.shields.io/badge/AI-Amazon%20Bedrock-FF9900?logo=amazonaws)](https://aws.amazon.com/bedrock/)

SkyPulse AI is a enterprise-grade airline customer intelligence platform engineered for British Airways executive management. It converts qualitative passenger feedback into quantitative Customer Satisfaction Index (CSI) forecasts, Flight Touchpoint matrices, Bedrock generative advisor briefs, and interactive trend heatmaps.

---

## UI & Design Architecture

- **Primary Color Canvas**: Clean Pristine White (`#FFFFFF`) & Platinum Light Canvas (`#F8FAFC`).
- **Brand Palette**: British Airways Royal Navy (`#00205B` / `#0A192F`) & Speedmark Crimson Red (`#EB2226`).
- **Card Design**: Glassmorphism cards with smooth rounded-3xl corners, ambient shadows (`shadow-xl shadow-slate-200/50`), and dark/light mode toggling.

---

## 7-Section Navigation Structure

1. 🏠 **Home**: Executive Hero, Customer Satisfaction Index (CSI), Passenger Happiness %, Critical Complaints, Resolved Issues, Prediction Accuracy, Monthly Satisfaction Trend Area Chart, Airport Experience Matrix, Top Complaint Regions.
2. ✈️ **Flight Experience**: Touchpoint Matrix (Cabin Crew, Food & Beverage, In-flight Entertainment, Check-in Experience, Boarding Process, Flight Delays & Punctuality, Baggage & Ground Support) with Ratings, Sentiment ratios, and Bedrock AI Summaries.
3. 👥 **Passenger Insights**: Timeline view, Sentiment Heatmap Grid, Customer Journey Stage Health Map, Emotion Analysis, Keyword & Topic Extraction.
4. 🧠 **AI Advisor**: Amazon Bedrock ChatGPT-style Assistant with suggested questions (*"What should British Airways improve?"*, *"Why are customers unhappy?"*, *"Generate Executive Report"*, *"Summarize all complaints"*, *"Predict future satisfaction"*) and Executive Brief synthesis.
5. 📈 **Trend Explorer**: Interactive Line & Area Charts, Multi-quarter Complaint Timelines, Sentiment Calendar, Country-wise Review Distributions.
6. 📄 **Reports**: Executive Board Report Generator, CSV Export download, Monthly Reports, Complaint Summaries, and AI Strategic Recommendations.
7. ⚙️ **Settings**: S3 Bucket & DynamoDB Configuration parameters, Dataset Re-indexing, CSV Drag & Drop Uploader.

---

## Quickstart Guide

### 1. Start FastAPI Backend
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
API running at `http://localhost:8000` (Docs at `http://localhost:8000/docs`).

### 2. Start React + Vite + TypeScript Frontend
```bash
cd frontend
npm install
npm run dev
```
App running at `http://localhost:5173`.

---

## Deployment

- **Frontend → Vercel**: Import repository, root directory `frontend`, build command `npm run build`, output `dist`. Set `VITE_API_URL` to backend.
- **Backend → Render**: Web service, root directory `backend`, environment Python, build `pip install -r requirements.txt`, start command `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
