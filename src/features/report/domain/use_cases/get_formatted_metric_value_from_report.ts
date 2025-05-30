import DailyReport from "../models/daily_report";
import { MetricType } from "../models/metrics/metric_type";

export const getFormattedMetricValueFromReport = ({ metricType, report }: { metricType: MetricType, report: DailyReport }) => {
    switch (metricType) {
        case MetricType.heartRate:
            return `${report.heartRate.average}`;
        case MetricType.afib:
            return `${report.afib.burden}`;
        case MetricType.pauses:
            return `${report.pauses.count}`;
        case MetricType.avBlocks:
            return `${report.avBlocks.types?.length ? 'Detected' : 'None'}`;
    }
}