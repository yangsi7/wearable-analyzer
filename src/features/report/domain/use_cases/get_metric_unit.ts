import { MetricType } from "../models/metrics/metric_type";

export const getMetricUnit = (metricType: MetricType) => {
    switch (metricType) {
        case MetricType.heartRate:
            return 'bpm';
        case MetricType.afib:
            return '%';
        case MetricType.pauses:
            return 'episodes';
        case MetricType.avBlocks:
            return '';
    }
}