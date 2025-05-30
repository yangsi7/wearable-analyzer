import { Baseline } from "../models/baseline";
import { MetricStatus } from "../models/metrics/metric_status";

export default function getMetricStatusFromBaselines(metric: number, baseline: Baseline): MetricStatus {
    const lowerBound = baseline.q1 - 1.5 * baseline.iqr;
    const upperBound = baseline.q3 + 1.5 * baseline.iqr;

    if (metric >= baseline.q1 && metric <= baseline.q3) {
        return MetricStatus.normal;
    } else if (metric >= lowerBound && metric < baseline.q1) {
        return MetricStatus.belowNormalBorderline;
    } else if (metric > baseline.q3 && metric <= upperBound) {
        return MetricStatus.aboveNormalBorderline;
    }
    else if (metric < lowerBound) {
        return MetricStatus.belowNormal;
    } else if (metric > upperBound) {
        return MetricStatus.aboveNormal;
    }

    return MetricStatus.normal;
}