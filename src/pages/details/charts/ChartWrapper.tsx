import { useEffect, useState } from "react";
import HeartRateChart, { AggregatedHeartRateData } from "./HeartRateChart";
import { useSelectedDay } from "../../dashboard/state/SelectedDayContext";
import { Heart, HeartPulse } from "lucide-react";
import AFibBurdenChart, { AggregatedAFibData } from "./AFibBurdenChart";
import PausesChart from "./PausesChart";
import { getDateRangeForDate } from "../../../utils/date_range_utils";
import DateRange from "../../../common/domain/models/date_range";
import { aggregateDataWithDateRange, AggregatedMetrics, useLoadMetricsForTimeRange } from "./chart_helper";
import { PauseCircleOutline } from "@mui/icons-material";
import { TimeRange } from "../../../common/domain/models/time_range";
import { DurationEnum } from "../../../common/domain/models/duration";
import DailyReport from "../../../features/report/domain/models/daily_report";
import TimeRangeSelector from "./components/TimeRangeSelector";
import LoadingSpinner from "../../../common/presentation/components/LoadingSpinner";

enum ChartType {
    heartRate,
    afib,
    pauses
}

interface ChartWrapperProps {
    chartType: ChartType;
}

const ChartWrapper = ({ chartType }: ChartWrapperProps) => {
    const { selectedDate } = useSelectedDay();

    const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>(TimeRange.week);

    const [startDate, setStartDate] = useState<Date>(new Date(selectedDate));

    useEffect(() => {
        const date = new Date(selectedDate);
        switch (selectedTimeRange) {
            case TimeRange.week:
                date.setDate(date.getDate() - 7);
                break;
            case TimeRange.month:
                date.setMonth(date.getMonth() - 1);
                break;
            case TimeRange.threeMonths:
                date.setMonth(date.getMonth() - 3);
                break;
            case TimeRange.year:
                date.setFullYear(date.getFullYear() - 1);
                break;
        }
        setStartDate(date);
    }, [selectedDate, selectedTimeRange])

    const { metrics: metricsOverTime, loading } = useLoadMetricsForTimeRange(startDate, selectedDate);


    const getSubRangeDuration = (timeRange: TimeRange) => {
        switch (timeRange) {
            case TimeRange.week:
            case TimeRange.month:
                return DurationEnum.day;
            case TimeRange.threeMonths:
                return DurationEnum.week;
            case TimeRange.year:
                return DurationEnum.month
        }
    }

    const subRangeDuration = getSubRangeDuration(selectedTimeRange);


    let chart: JSX.Element;
    let chartName: string;
    let chartIcon: JSX.Element;

    const getAggregatedData = (data: Array<DailyReport>, rangeDuration: DurationEnum): AggregatedMetrics[] => {
        if (rangeDuration === DurationEnum.day) {
            return data.map(d => ({ dateRange: getDateRangeForDate(d.date, subRangeDuration), chartMetrics: d, baselines: d.baseline || null }));
        }

        return aggregateDataWithDateRange(data, rangeDuration);
    }

    const aggregatedData = loading ? [] : getAggregatedData(metricsOverTime, subRangeDuration);


    const getAllExpectedRanges = () => {
        const ranges: Array<DateRange> = [];
        let date: Date = new Date(startDate);
        while (date < selectedDate) {
            ranges.push(getDateRangeForDate(date, subRangeDuration));
            switch (subRangeDuration) {
                case DurationEnum.day:
                    date = new Date(date.setDate(date.getDate() + 1));
                    break;
                case DurationEnum.week:
                    date = new Date(date.setDate(date.getDate() + 7));
                    break;
                case DurationEnum.month:
                    date = new Date(date.setMonth(date.getMonth() + 1));
                    break;
            }
        }
        return ranges;
    }

    for (const range of getAllExpectedRanges()) {
        if (!aggregatedData.some(d => d.dateRange.start.toLocaleDateString() === range.start.toLocaleDateString())) {
            aggregatedData.push({ dateRange: range, chartMetrics: null, baselines: null });
        }
    }
    aggregatedData.sort((a, b) => a.dateRange.start.getTime() - b.dateRange.start.getTime());

    switch (chartType) {
        case ChartType.heartRate:
            const aggregatedHeartRateData = aggregatedData.map<AggregatedHeartRateData>
                (d => ({
                    dateRange: d.dateRange,
                    heartRateAverage: d.chartMetrics?.heartRate.average || null,
                    baseline: d.baselines?.heartRate || null
                }))

            chart = <HeartRateChart data={aggregatedHeartRateData} timeRange={selectedTimeRange} />;
            chartName = "Heart Rate history";
            chartIcon = <Heart className="w-5 h-5 text-blue-600" />
            break;
        case ChartType.afib:
            const aggregatedAfibData = aggregatedData.map<AggregatedAFibData>(d => ({
                dateRange: d.dateRange,
                burden: d.chartMetrics?.afib.burden || null,
                baseline: d.baselines?.afib || null
            }))

            chart = <AFibBurdenChart afibData={aggregatedAfibData} timeRange={selectedTimeRange} />;
            chartName = "Atrial Fibrillation history";
            chartIcon = <HeartPulse className="w-5 h-5 text-blue-600" />
            break;
        case ChartType.pauses:
            const aggregatedPausesData = aggregatedData.map(d => ({
                dateRange: d.dateRange,
                count: d.chartMetrics?.pauses.count || null,
                baseline: d.baselines?.pauses || null
            }))
            chart = <PausesChart data={aggregatedPausesData} timeRange={selectedTimeRange} />;
            chartName = "Pauses history";
            chartIcon = <PauseCircleOutline className="w-5 h-5 text-blue-600" />
            break;
    }

    return (
        <div className="bg-white rounded-lg shadow-sm pb-6" id="chart">
            <div className="flex items-center gap-3 p-6">
                <div className="bg-blue-100 p-2 rounded-full">
                    {chartIcon}
                </div>
                <h2 className="text-lg font-semibold text-gray-900">{chartName}</h2>
            </div>
            <TimeRangeSelector selectedRange={selectedTimeRange} onSelectRange={(range) => setSelectedTimeRange(range)} />
            <div className="h-[300px] flex items-center justify-center px-6">
                {loading ? <LoadingSpinner title="Loading trend data..." /> : chart}
            </div>
        </div>
    )
}

export default ChartWrapper;

export { ChartType };