import { Baseline } from "./baseline";

export interface MetricBaselines {
    heartRate: Baseline;
    afib: Baseline;
    pauses: Baseline;
}