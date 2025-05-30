import { Bar, CartesianGrid, ComposedChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import DateRange from "../../../common/domain/models/date_range";
import { getYAxisDomain, xAxisLabelFormatted, xAxisLabelInterval } from "./chart_helper";
import { Baseline } from "../../../features/report/domain/models/baseline";
import { TimeRange } from "../../../common/domain/models/time_range";
import { BaselineBarBackground } from "./components/BaselineBarBackground";
import CustomTooltip from "./components/ChartTooltip";

interface AFibBurdenChartProps {
    afibData: AggregatedAFibData[];
    timeRange: TimeRange;
}

export interface AggregatedAFibData {
    dateRange: DateRange;
    burden: number | null;
    baseline: Baseline | null;
}

export default function AFibBurdenChart({ afibData, timeRange }: AFibBurdenChartProps) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
                data={afibData}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey={(data) => data.dateRange.start.toDateString() + "$" + data.dateRange.end.toDateString()}
                    tick={{ fill: '#6b7280' }}
                    tickLine={{ stroke: '#6b7280' }}
                    tickFormatter={(value) => xAxisLabelFormatted(value, timeRange)}
                    interval={xAxisLabelInterval(afibData.length, timeRange)}
                />
                <YAxis
                    domain={getYAxisDomain}
                    tick={{ fill: '#6b7280' }}
                    tickLine={{ stroke: '#6b7280' }}
                    label={{
                        value: 'AFib Burden (%)',
                        angle: -90,
                        position: 'insideLeft',
                        style: { fill: '#6b7280' }
                    }}
                />
                <Tooltip content={CustomTooltip} filterNull={false} />
                <Legend />
                <Bar
                    dataKey="burden"
                    name="AFib Burden"
                    unit="%"
                    radius={[4, 4, 0, 0]}
                    stroke="none"
                    fill="#4496CC"
                    background={<BaselineBarBackground />}
                >

                </Bar>
            </ComposedChart>
        </ResponsiveContainer>
    )
}

