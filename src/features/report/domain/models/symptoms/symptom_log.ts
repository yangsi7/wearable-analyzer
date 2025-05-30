import HeartEvent from "../heart_event";
import { Symptom } from "./symptom";

enum SymptomLogReviewStatus {
    none = "none",
    pending = "pending",
    completed = "completed",
}

interface SymptomLog {
    id: string; // unique identifier
    symptomDate: Date; // date of the symptom
    symptoms: Symptom[]; // list of symptoms
    reviewStatus: SymptomLogReviewStatus; // enum for review status (values are "none", "pending", "completed")
    correlatedEvents: HeartEvent[]; // list of correlated heart events
}

export { SymptomLogReviewStatus };
export type { SymptomLog, Symptom };
