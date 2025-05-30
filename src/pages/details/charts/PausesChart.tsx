import { Bar, CartesianGrid, ComposedChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import DateRange from "../../../common/domain/models/date_range";
import { xAxisLabelFormatted, xAxisLabelInterval } from "./chart_helper";
import { Baseline } from "../../../features/report/domain/models/baseline";
import { TimeRange } from "../../../common/domain/models/time_range";
import CustomTooltip from "./components/ChartTooltip";
import { BaselineBarBackground } from "./components/BaselineBarBackground";


interface PausesChartProps {
    data: AggregatedPausesData[];
    timeRange: TimeRange;
}


interface AggregatedPausesData {
    dateRange: DateRange;
    count: number | null;
    baseline: Baseline | null;
}

export default function PausesChart({ data, timeRange }: PausesChartProps) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
                data={data}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey={(data) => data.dateRange.start.toDateString() + "$" + data.dateRange.end.toDateString()}
                    tick={{ fill: '#6b7280' }}
                    tickLine={{ stroke: '#6b7280' }}
                    tickFormatter={(value) => xAxisLabelFormatted(value, timeRange)}
                    interval={xAxisLabelInterval(data.length, timeRange)}
                />
                <YAxis
                    domain={([, dataMax]) => [0, dataMax + 2]}
                    tick={{ fill: '#6b7280' }}
                    tickLine={{ stroke: '#6b7280' }}
                    label={{
                        value: 'Number of Pauses',
                        angle: -90,
                        offset: 20,
                        position: 'insideBottomLeft',
                        style: { fill: '#6b7280' }
                    }}
                />
                <Tooltip content={CustomTooltip} filterNull={false} />
                <Legend />
                <Bar
                    dataKey="count"
                    fill="#4496CC"
                    name="Pauses"
                    radius={[4, 4, 0, 0]}
                    background={<BaselineBarBackground />}
                />
            </ComposedChart>
        </ResponsiveContainer>
    )
}