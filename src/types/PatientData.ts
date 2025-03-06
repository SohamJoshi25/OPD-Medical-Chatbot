export interface PatientData {
    FullName: string;
    Age: number;
    Gender: string;
    Location: string;
    MedicalHistory: string[];
    LikelySymptoms: string[];
    LikelyDiseases: string[];
    SeverityLevel: number;
    Urgency: string;
    RecommendedOPD: string;
  }