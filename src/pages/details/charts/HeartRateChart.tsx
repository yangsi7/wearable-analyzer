import { Area, CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import DateRange from "../../../common/domain/models/date_range";
import { getYAxisDomain, xAxisLabelFormatted, xAxisLabelInterval } from "./chart_helper";
import { TimeRange } from "../../../common/domain/models/time_range";
import { Baseline } from "../../../features/report/domain/models/baseline";
import CustomTooltip from "./components/ChartTooltip";
import getMetricStatusFromBaselines from "../../../features/report/domain/use_cases/get_metric_status_from_baseline";
import { MetricStatus } from "../../../features/report/domain/models/metrics/metric_status";


interface HeartRateChartProps {
    data: AggregatedHeartRateData[];
    timeRange: TimeRange;
}

export interface AggregatedHeartRateData {
    dateRange: DateRange;
    heartRateAverage: number | null;
    baseline: Baseline | null;
}



export default function HeartRateChart({ data, timeRange }: HeartRateChartProps) {
    const hasEnoughData = data.filter(d => d.heartRateAverage !== null).length >= 2;
    if (!hasEnoughData) {
        return (<div className="flex items-center justify-center text-center text-gray-400">
            Not enough data to show Heart Rate history
        </div  >)
    }
    return (
        <ResponsiveContainer width="100%" height="100%" className="mt-4">
            <ComposedChart
                data={data}
                margin={{ right: 20 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis

                    dataKey={(data) => data.dateRange.start.toDateString() + "$" + data.dateRange.end.toDateString()}
                    tickLine={{ stroke: '#6b7280' }}
                    tickFormatter={(value) => xAxisLabelFormatted(value, timeRange)}
                    interval={xAxisLabelInterval(data.length, timeRange)}
                />
                <YAxis
                    domain={getYAxisDomain}
                    tickFormatter={(value) => `${value}`}
                    tick={{ fill: '#6b7280' }}
                    tickLine={{ stroke: '#6b7280' }}
                    label={{
                        value: 'Heart Rate (bpm)',
                        angle: -90,
                        offset: 20,
                        position: 'insideBottomLeft',
                        style: { fill: '#6b7280' },
                    }}
                />
                <Tooltip content={CustomTooltip} filterNull={false} />
                <Legend />

                {/* Heart Rate Lines */}
                <Line
                    connectNulls={true}
                    type="monotone"
                    dataKey="heartRateAverage"
                    stroke="#4496CC"
                    strokeWidth={2}
                    dot={(props) => <CustomizedDot key={props.key} props={props} isActive={false} />}
                    activeDot={(props: any) => <CustomizedDot props={props} isActive={true} />}
                    name="Average"
                    unit=" bpm"

                />

                {/* Heart Rate Range Area */}
                <Area
                    connectNulls={true}
                    type="monotone"
                    dataKey={(data) => data.baseline && [data.baseline.q1, data.baseline.q3] || null}
                    stroke="#4496CC"
                    strokeWidth={2}
                    strokeOpacity={0.2}
                    fill="#4496CC"
                    fillOpacity={0.2}
                    name="Normal Range"
                    legendType="square"
                    unit=" %"
                    activeDot={false}

                />


            </ComposedChart>
        </ResponsiveContainer>

    );
}

const CustomizedDot = ({ props, isActive }: { props: any, isActive: boolean }) => {
    const { cx, cy, stroke, payload, value } = props;
    if (payload === null || value == null) return null;


    const metricStatus: MetricStatus | null = payload.baseline && getMetricStatusFromBaselines(payload.heartRateAverage, payload.baseline);

    let color: string;
    let nonActiveSize: number;


    switch (metricStatus) {
        case MetricStatus.aboveNormalBorderline:
        case MetricStatus.belowNormalBorderline:
            nonActiveSize = 4;
            color = '#F1E451';
            break;
        case MetricStatus.aboveNormal:
        case MetricStatus.belowNormal:
            nonActiveSize = 4;
            color = '#E1BB60';
            break;
        case MetricStatus.normal:
        case null:
            nonActiveSize = 3;
            color = "#4496CC"
            break;
    }

    return (
        <svg x={cx - 10} y={cy - 10} width={20} height={20}>
            {isActive ? <circle cx={10} cy={10} r={6} fill="white" stroke={color} strokeWidth={3} /> : <circle cx={10} cy={10} r={nonActiveSize} fill={color} stroke={stroke} />}
        </svg>
    );
};