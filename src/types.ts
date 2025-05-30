interface NormalRange {
  low: number;
  high: number;
}

export interface HeartMetrics {
  heartRate: {
    average: number;
    min: number;
    max: number;
    normalRange?: NormalRange;
  };
  afib: {
    burden: number;
    maxDuration: number;
    minHR: number;
    maxHR: number;
    normalRange?: NormalRange;
  };
  avBlocks: {
    burden: number;
    types: string[];
  };
  pauses: {
    count: number;
    longest: number;
    normalRange?: NormalRange;
  };
  symptoms?: Symptom[];
}

export interface Symptom {
  name: string;
  severity: 'mild' | 'moderate' | 'severe';
  time: string;
  pathology: string[];
  correlatedEvents?: string[];
  notes?: string;
}

export interface DayData {
  day: number;
  date: string;
  metrics: HeartMetrics;
  symptoms: Symptom[];
  baseline?: HeartMetrics;
  aiInsights?: {
    patterns: string[];
    recommendations: string[];
  };
  predictiveAlerts?: {
    upcoming: Array<{
      type: string;
      probability: number;
      timeframe: string;
      triggers: string[];
    }>;
    preventiveActions: string[];
  };
  treatmentInsights?: {
    effectiveness: number;
    improvements: string[];
    suggestions: string[];
  };
}

export interface EducationalContent {
  title: string;
  description: string;
  link?: string;
}