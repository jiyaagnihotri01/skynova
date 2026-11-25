export interface Review {
  id: string;
  title: string;
  text: string;
  sentiment: 'Positive' | 'Negative' | 'Neutral';
  confidence: number;
  emotion: string;
  csi_score: number;
  touchpoints: string[];
  primary_touchpoint: string;
  airport: string;
  region: string;
  date: string;
  verified: boolean;
  source?: string;
}

export interface HomeDashboardData {
  total_reviews: number;
  csi_index: number;
  passenger_happiness: number;
  critical_complaints: number;
  resolved_issues: number;
  prediction_accuracy: number;
  monthly_satisfaction_trend: {
    month: string;
    csi: number;
    reviews: number;
    target: number;
  }[];
  airport_experience: {
    airport: string;
    avg_csi: number;
    total_reviews: number;
    happiness_rate: number;
  }[];
  top_complaint_regions: {
    region: string;
    complaints: number;
    percentage: number;
  }[];
}

export interface FlightTouchpoint {
  id: string;
  name: string;
  category: string;
  rating: number;
  max_rating: number;
  sentiment: 'Positive' | 'Negative' | 'Neutral';
  positive_pct: number;
  negative_pct: number;
  ai_summary: string;
  icon: string;
}

export interface ExecutiveReportData {
  executive_summary: string;
  top_issues: string[];
  business_risks: string[];
  immediate_actions: string[];
  long_term_improvements: string[];
  predicted_csi_lift: string;
  source?: string;
}

export interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  source?: string;
}
