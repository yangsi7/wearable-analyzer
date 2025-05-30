import DailyReport from "../models/daily_report"
import { HealthStatus } from "../models/health_status_enum"
import { MetricStatus } from "../models/metrics/metric_status";
import { MetricType } from "../models/metrics/metric_type"
import { getMetricStatusFromReport } from "./get_metric_status_from_report";

export const getHealthStatusFromReport = (report: DailyReport) => {
    const statuses = Object.values(MetricType).map(metricType => {
        return getMetricStatusFromReport(report, metricType);
    });

    if (statuses.some(status => status === MetricStatus.aboveNormal || status === MetricStatus.belowNormal)) {
        return HealthStatus.alert;
    } else if (statuses.some(status => status === MetricStatus.belowNormalBorderline || status === MetricStatus.aboveNormalBorderline)) {
        return HealthStatus.warning;
    }

    return HealthStatus.normal;
}