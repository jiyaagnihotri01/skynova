# SkyPulse AI API Documentation

## Base Endpoint
- Local: `http://localhost:8000`
- Production: `https://skypulse-backend.onrender.com`

---

## 1. System Health
`GET /api/health`
Returns backend online status, active AWS connectivity mode, and dataset record counts.

---

## 2. Home Dashboard
`GET /api/home`
Returns Customer Satisfaction Index (CSI), Passenger Happiness %, Critical Complaints, Resolved Issues, Monthly Satisfaction Trend, Airport Experience Matrix, and Top Complaint Regions.

---

## 3. Flight Experience
`GET /api/experience`
Returns 7 Flight Touchpoints (Cabin Crew, Food & Beverage, Entertainment, Check-in, Boarding, Delays, Baggage) with ratings, sentiment breakdown, and Bedrock AI summaries.

---

## 4. Passenger Insights
`GET /api/insights`
Returns emotion analysis breakdown, customer journey stage ratings, sentiment heatmap grid, and keyword frequency tags.

---

## 5. AI Advisor (Amazon Bedrock)
`POST /api/ai-advisor/chat`
Answers natural language queries regarding British Airways customer feedback.
- Request Body: `{"query": "What should British Airways improve?"}`

`POST /api/ai-advisor/report`
Generates structured C-Suite executive briefing report via Bedrock.

---

## 6. Trend Explorer
`GET /api/trends`
Returns quarterly complaint timeline, monthly sentiment calendar, and country-wise review distributions.

---

## 7. Reports & CSV Export
`POST /api/reports/generate` - Generates formal executive PDF report content.
`GET /api/reports/export-csv` - Exports full dataset as CSV file.
