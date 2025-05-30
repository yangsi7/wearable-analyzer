import { MetricStatus } from "../models/metrics/metric_status";

export const getMetricStatusColor = (status: MetricStatus) => {
    switch (status) {
        case MetricStatus.aboveNormal:
        case MetricStatus.belowNormal:
            return '#E1BB60';
        case MetricStatus.aboveNormalBorderline:
        case MetricStatus.belowNormalBorderline:
            return '#F1E451';
        case MetricStatus.normal:
            return '#9ABD7A';
    }
}