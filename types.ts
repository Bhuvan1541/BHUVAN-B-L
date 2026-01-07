
export interface PatientData {
  // Basic Clinical
  pregnancies: number;
  glucose: number;
  bloodPressure: number;
  insulin: number;
  bmi: number;
  diabetesPedigreeFunction: number;
  age: number;
  
  // Extended Clinical & Lifestyle (New Features)
  gender: 'Male' | 'Female' | 'Other';
  cholesterol: number; // mg/dL
  smokingHistory: 'Never' | 'Former' | 'Current';
  alcoholConsumption: 'None' | 'Occasional' | 'Frequent';
  physicalActivity: 'Sedentary' | 'Moderate' | 'Active';
  familyHistory: boolean;
}

export interface ModelOutput {
  name: string;
  type: 'ANN' | 'DNN' | 'KNN';
  confidence: number;
  prediction: 'Diabetic' | 'Non-Diabetic';
  description: string;
}

export interface FeatureContribution {
  feature: string;
  value: number; // -100 to 100 (Negative reduces risk, Positive increases risk)
  description: string;
}

export interface Feedback {
  rating: number; // 1-5
  comment: string;
  timestamp: string;
}

export interface PredictionResult {
  id: string;
  timestamp: string;
  overallRisk: number; // 0-100
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Very High';
  
  // New Safety Assessment
  safetyStatus: 'Safe' | 'Monitor' | 'Critical';
  safetyDescription: string;

  modelOutputs: ModelOutput[];
  keyFactors: string[];
  featureImportance: FeatureContribution[]; // XAI (SHAP-like)
  recommendations: string[];
  analysis: string;
  feedback?: Feedback;
}

export interface UserProfile {
  name: string;
  role: 'Doctor' | 'Patient' | 'Admin';
  email: string;
}

export interface Appointment {
  id: string;
  doctorName: string;
  date: string;
  time: string;
  type: 'Video Call' | 'In-Person';
  status: string;
}

export const DEFAULT_PATIENT_DATA: PatientData = {
  pregnancies: 0,
  glucose: 100,
  bloodPressure: 72,
  insulin: 79,
  bmi: 25.0,
  diabetesPedigreeFunction: 0.5,
  age: 30,
  gender: 'Female',
  cholesterol: 180,
  smokingHistory: 'Never',
  alcoholConsumption: 'None',
  physicalActivity: 'Moderate',
  familyHistory: false
};
