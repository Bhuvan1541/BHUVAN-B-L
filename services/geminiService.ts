
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { PatientData, PredictionResult } from "../types";

const apiKey = process.env.API_KEY;

// Enhanced schema including Explainable AI (XAI) features
const predictionSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    overallRisk: { type: Type.NUMBER, description: "Overall risk percentage from 0 to 100" },
    riskLevel: { type: Type.STRING, enum: ["Low", "Moderate", "High", "Very High"] },
    safetyStatus: { 
      type: Type.STRING, 
      enum: ["Safe", "Monitor", "Critical"], 
      description: "Immediate safety assessment. 'Critical' if vitals like Glucose > 200 or BP > 180. 'Safe' if normal." 
    },
    safetyDescription: { type: Type.STRING, description: "Brief explanation of the safety status (e.g., 'Blood pressure is dangerously high')." },
    modelOutputs: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          type: { type: Type.STRING, enum: ["ANN", "DNN", "KNN"] },
          confidence: { type: Type.NUMBER, description: "Confidence score between 0 and 1" },
          prediction: { type: Type.STRING, enum: ["Diabetic", "Non-Diabetic"] },
          description: { type: Type.STRING, description: "Short description of what this specific model detected" }
        },
        required: ["name", "type", "confidence", "prediction", "description"]
      }
    },
    keyFactors: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of key contributing health factors to the risk"
    },
    featureImportance: {
      type: Type.ARRAY,
      description: "Explainable AI (SHAP-like): Directional contribution of each factor. Positive values increase risk, negative values decrease risk.",
      items: {
        type: Type.OBJECT,
        properties: {
          feature: { type: Type.STRING },
          value: { type: Type.NUMBER, description: "-100 to 100 score. E.g., High BMI might be +40 (increases risk), Young Age might be -20 (decreases risk)" },
          description: { type: Type.STRING, description: "Why this feature mattered" }
        }
      }
    },
    recommendations: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Actionable health recommendations"
    },
    analysis: { type: Type.STRING, description: "A comprehensive textual analysis of the patient's condition." }
  },
  required: ["overallRisk", "riskLevel", "safetyStatus", "safetyDescription", "modelOutputs", "keyFactors", "featureImportance", "recommendations", "analysis"]
};

// Robust JSON extraction helper
const cleanAndParseJSON = (text: string): any => {
  try {
    // 1. Attempt direct parse first
    return JSON.parse(text);
  } catch (e) {
    // 2. Extract JSON from Markdown code blocks (```json ... ```)
    const markdownMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (markdownMatch && markdownMatch[1]) {
      try {
        return JSON.parse(markdownMatch[1]);
      } catch (e2) {
        // Continue
      }
    }

    // 3. Extract purely based on the first '{' and last '}'
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      const jsonCandidate = text.substring(firstBrace, lastBrace + 1);
      try {
        return JSON.parse(jsonCandidate);
      } catch (e3) {
        console.error("Failed to extract JSON via braces");
      }
    }

    console.error("JSON Parsing failed. Raw text:", text);
    throw new Error("Failed to parse analysis results. The model response was not valid JSON.");
  }
};

export const analyzeDiabetesRisk = async (data: PatientData): Promise<PredictionResult> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please configuration your environment.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    You are a high-precision Multimodal Medical AI system for Diabetes Prediction.
    Analyze the following patient data:
    
    Clinical Data:
    - Gender: ${data.gender}
    - Age: ${data.age} years
    - BMI: ${data.bmi}
    - Pregnancies: ${data.pregnancies}
    - Glucose: ${data.glucose} mg/dL
    - Blood Pressure: ${data.bloodPressure} mm Hg
    - Insulin: ${data.insulin} mu U/ml
    - Diabetes Pedigree: ${data.diabetesPedigreeFunction}
    
    Lifestyle & Health History:
    - Cholesterol: ${data.cholesterol} mg/dL
    - Smoking Status: ${data.smokingHistory}
    - Alcohol Consumption: ${data.alcoholConsumption}
    - Physical Activity: ${data.physicalActivity}
    - Family History of Diabetes: ${data.familyHistory ? 'Yes' : 'No'}

    Perform an ensemble analysis simulation using STRICTLY the following architectures (DNN, KNN, ANN):
    1. ANN (Artificial Neural Network): Analyze basic clinical relationships (Glucose, BMI, Age).
    2. DNN (Deep Neural Network): Deep learning analysis of complex interactions between lifestyle factors and clinical metrics.
    3. KNN (K-Nearest Neighbors): Compare patient metrics against a simulated dataset of 10,000 cases to find the nearest neighbor clusters for classification.
    
    CRITICAL: Evaluate 'safetyStatus' based on immediate vitals.
    - 'Critical': If Glucose > 200 mg/dL OR Blood Pressure > 160/100 OR BMI > 40.
    - 'Monitor': If Glucose 140-199 OR Blood Pressure 140-159.
    - 'Safe': If metrics are within normal ranges.

    IMPORTANT: Return the result STRICTLY as a valid JSON object matching the schema. Do not add any markdown formatting or conversational text outside the JSON.
    For 'featureImportance', ensure values are between -100 (Strongly reduces risk) and +100 (Strongly increases risk).
  `;

  const parts: any[] = [{ text: prompt }];

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: predictionSchema,
        temperature: 0.1, // Lower temperature for more deterministic/valid JSON
      },
    });

    if (response.text) {
      const result = cleanAndParseJSON(response.text) as PredictionResult;
      
      // Add client-side metadata
      result.timestamp = new Date().toISOString();
      result.id = Math.random().toString(36).substr(2, 9);
      
      if (!result.featureImportance || !Array.isArray(result.featureImportance)) {
        result.featureImportance = [];
      }

      return result;
    } else {
      throw new Error("No data returned from model");
    }
  } catch (error) {
    console.error("Error analyzing risk:", error);
    throw error;
  }
};
