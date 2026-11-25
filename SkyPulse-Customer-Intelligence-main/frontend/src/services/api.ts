import axios from 'axios';
import { HomeDashboardData, FlightTouchpoint, ExecutiveReportData } from '../types';

// Determine API Base URL:
// 1. Explicit environment variable VITE_API_URL if provided
// 2. Production fallback: Deployed Render backend URL
// 3. Local Development fallback: http://localhost:8000
const API_BASE_URL = 
  import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD 
    ? 'https://skypulse-customer-intelligence.onrender.com' 
    : 'http://localhost:8000');

console.log(`[SkyPulse API Engine] Connected Base URL: ${API_BASE_URL}`);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30-second timeout to accommodate Render free-tier cold starts
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getHealth = async () => {
  const res = await api.get('/api/health');
  return res.data;
};

export const getHomeDashboard = async (): Promise<HomeDashboardData> => {
  const res = await api.get('/api/home');
  return res.data;
};

export const getFlightExperience = async (): Promise<{ touchpoints: FlightTouchpoint[]; total_analyzed: number }> => {
  const res = await api.get('/api/experience');
  return res.data;
};

export const getPassengerInsights = async () => {
  const res = await api.get('/api/insights');
  return res.data;
};

export const postAdvisorChat = async (query: string) => {
  const res = await api.post('/api/ai-advisor/chat', { query });
  return res.data;
};

export const generateExecutiveReport = async (): Promise<ExecutiveReportData> => {
  const res = await api.post('/api/ai-advisor/report');
  return res.data;
};

export const getTrendAnalytics = async () => {
  const res = await api.get('/api/trends');
  return res.data;
};

export const uploadCSV = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await api.post('/api/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 60000, // 60s timeout for cloud CSV processing & S3 streaming
  });
  return res.data;
};

export const seedDataset = async () => {
  const res = await api.post('/api/upload/seed', {}, {
    timeout: 60000,
  });
  return res.data;
};

export const getExportCSVUrl = () => {
  return `${API_BASE_URL}/api/reports/export-csv`;
};

export default api;
