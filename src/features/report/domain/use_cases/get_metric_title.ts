import { MetricType } from "../models/metrics/metric_type";

export const getMetricTitle = (metricType: MetricType) => {
    switch (metricType) {
        case MetricType.heartRate:
            return 'Heart Rate';
        case MetricType.afib:
            return 'Atrial Fibrillation';
        case MetricType.pauses:
            return 'Pauses';
        case MetricType.avBlocks:
            return 'AV Blocks';
    }
}
