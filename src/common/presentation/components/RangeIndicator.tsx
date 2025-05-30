import { MetricStatus } from "../../../features/report/domain/models/metrics/metric_status";

const severityColor = {
    normal: '#9ABD7A',
    borderline: '#F1E451',
    max: '#E1BB60',
    min: '#E1BB60'
};

export default function ExpandedRangeIndicator({ metricStatus }: { metricStatus: MetricStatus }) {
    let gradient: string = '';
    let text: string = '';

    switch (metricStatus) {
        case MetricStatus.normal:
            gradient = severityColor.normal;
            text = 'Normal';
            break;
        case MetricStatus.belowNormalBorderline:
        case MetricStatus.aboveNormalBorderline:
            gradient = severityColor.borderline;
            text = 'Moderate';
            break;
        case MetricStatus.belowNormal:
            gradient = severityColor.min;
            text = 'Below Normal';
            break;
        case MetricStatus.aboveNormal:
            gradient = severityColor.max;
            text = 'Above Normal';
            break;
    }

    return (
        <div className={`ml-auto px-3 py-1 rounded-full text-s font-medium bg-opacity-70`} style={{ backgroundColor: gradient }}>
            {text}
        </div>
    );
}

export const MinimizedRangeIndicator = ({ metricStatus, animate = true, size }: { metricStatus: MetricStatus, animate: boolean, size: number }) => {
    let gradient: string = '';
    let animation = '';

    switch (metricStatus) {
        case MetricStatus.normal:
            gradient = severityColor.normal;
            animation = '';
            break;
        case MetricStatus.belowNormalBorderline:
        case MetricStatus.aboveNormalBorderline:
            gradient = severityColor.borderline;
            animation = 'animate-delayedPingMedium';
            break;
        case MetricStatus.belowNormal:
            gradient = severityColor.min;
            animation = 'animate-delayedPingIntense';
            break;
        case MetricStatus.aboveNormal:
            gradient = severityColor.max;
            animation = 'animate-delayedPingIntense';
            break;
    }

    return (
        <span className="relative flex ml-auto" id="rangeIndicator" style={{ width: size, height: size }}>
            <span className={`absolute inline-flex h-full w-full ${animate ? animation : ''} rounded-full opacity-75`} style={{ backgroundColor: gradient }}></span>
            <span className={`relative inline-flex h-full w-full rounded-full `} style={{ backgroundColor: gradient }}></span>
        </span>
    );
}
