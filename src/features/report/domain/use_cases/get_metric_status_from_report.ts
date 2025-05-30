import { MetricType } from "../models/metrics/metric_type";
import DailyReport from "../models/daily_report";
import getMetricStatusFromBaselines from "./get_metric_status_from_baseline";
import { getAVBlockStatus } from "./get_av_block_status";

export const getMetricStatusFromReport = (metrics: DailyReport, metric: MetricType) => {
    switch (metric) {
        case MetricType.heartRate:
            return metrics.baseline && getMetricStatusFromBaselines(metrics.heartRate.average, metrics.baseline.heartRate);
        case MetricType.afib:
            return metrics.baseline && getMetricStatusFromBaselines(metrics.afib.burden, metrics.baseline.afib);
        case MetricType.pauses:
            return metrics.baseline && getMetricStatusFromBaselines(metrics.pauses.count, metrics.baseline.pauses);
        case MetricType.avBlocks:
            const avBlockTypes = metrics.avBlocks.types || [];
            return getAVBlockStatus(avBlockTypes);
    }
}