import { Favorite } from "@mui/icons-material";
import { MetricType } from "../../domain/models/metrics/metric_type";
import { MetricStatus } from "../../domain/models/metrics/metric_status";
import { getMetricStatusColor } from "../../domain/use_cases/get_metric_status_color";
import { getMetricTitle } from "../../domain/use_cases/get_metric_title";
import { MinimizedRangeIndicator } from "../../../../common/presentation/components/RangeIndicator";

interface MonitorCardProps {
    metricType: MetricType;
    metricStatus: MetricStatus;
    value: string;
}
export const MonitorCard = ({ metricType, value, metricStatus }: MonitorCardProps) => {
    const color = getMetricStatusColor(metricStatus);
    return (
        <div className={`bg-white rounded-lg shadow-md p-4 border flex justify-between items-center`} style={{ borderColor: color, color: color }}>
            <div className="flex items-center gap-2">
                <Favorite fontSize="small" />
                <span className="text-gray-800">{getMetricTitle(metricType)}</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-gray-800">{value}</span>
                <MinimizedRangeIndicator metricStatus={metricStatus} animate={false} size={24} />
            </div>
        </div>
    )
}