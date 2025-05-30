enum SymptomDurationEnum {
    onAndOff,
    ongoing,
}

interface Symptom {
    symptom: string; // symptom name (e.g. "headache")
    intensity: number; // intensity of the symptom (a scale from 0-10)
    triggers: string[]; // list of triggers (e.g. "stress", "coffee")
    symptomDurationEnum?: SymptomDurationEnum; // enum for symptom duration (values are "onAndOff" or "ongoing")
    symptomDuration?: { // duration of the symptom
        hour: number;
        minute: number;
    };
    notes?: string; // adding notes about the symptom
}

export { SymptomDurationEnum };
export type { Symptom };
