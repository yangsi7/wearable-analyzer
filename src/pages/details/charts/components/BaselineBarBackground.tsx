import { MetricStatus } from "../../../../features/report/domain/models/metrics/metric_status";
import getMetricStatusFromBaselines from "../../../../features/report/domain/use_cases/get_metric_status_from_baseline";

export const BaselineBarBackground = (props: any) => {
    const { x, y, payload, dataKey, height, width } = props;
    if (payload === null) return null;


    const metricStatus: MetricStatus | null = payload.baseline && getMetricStatusFromBaselines(payload[dataKey], payload.baseline);

    let color: string;

    switch (metricStatus) {
        case MetricStatus.normal:
            color = 'none';
            break;
        case MetricStatus.aboveNormalBorderline:
        case MetricStatus.belowNormalBorderline:
            color = '#F1E451';
            break;
        case MetricStatus.aboveNormal:
        case MetricStatus.belowNormal:
            color = '#E1BB60';
            break;
        case null:
            color = "none"
            break;
    }
    return (
        <rect x={x} y={y} height={height} fill={color} width={width} opacity={0.3} />
    )
}