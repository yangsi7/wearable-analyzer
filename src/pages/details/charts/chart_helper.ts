import { useState, useEffect } from "react";
import { getDateRangeForDate } from "../../../utils/date_range_utils";
import { TimeRange } from "../../../common/domain/models/time_range";
import { MetricBaselines } from "../../../features/report/domain/models/metric_baselines";
import { useDailyReportProvider } from "../../../features/report/presentation/providers/DailyReportProvider";
import DailyReport from "../../../features/report/domain/models/daily_report";
import { DurationEnum } from "../../../common/domain/models/duration";
import DateRange from "../../../common/domain/models/date_range";

const xAxisLabelFormatted = (value: string, timeRange: TimeRange) => {
    return new Date(value.split('$')[0]).toLocaleDateString('default', {
        weekday: timeRange == TimeRange.week ? 'short' : undefined,
        month: timeRange != TimeRange.week ? 'short' : undefined,
        day: timeRange != TimeRange.week && timeRange != TimeRange.year ? '2-digit' : undefined,
        year: timeRange == TimeRange.year ? '2-digit' : undefined,
    });
}

const xAxisLabelInterval = (dataLength: number, timeRange: TimeRange) => {
    if (timeRange == TimeRange.week) {
        return 0;
    }
    if (timeRange == TimeRange.month) {
        return Math.ceil(dataLength / 4);
    }
    if (timeRange == TimeRange.threeMonths) {
        return Math.ceil(dataLength / 12);
    }
    if (timeRange == TimeRange.year) {
        return Math.ceil(dataLength / 12);
    }
}

const getYAxisDomain = ([minData, maxData]: [number, number]): [number, number] => {
    const min = Math.max(Math.floor(minData / 10) * 10 - 10, 0);
    const max = Math.ceil(maxData / 10) * 10 + 10;
    return [min, max];
};

export interface AggregatedMetrics {
    dateRange: DateRange;
    chartMetrics: ChartMetrics | null;
    baselines: MetricBaselines | null;
}

export interface ChartMetrics {
    heartRate: { average: number | null };
    afib: { burden: number | null };
    pauses: { count: number | null };
}

const useLoadMetricsForTimeRange = (startDate: Date, endDate: Date) => {
    const reportProvider = useDailyReportProvider();
    const [reports, setReports] = useState<Array<DailyReport>>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        setError(null);
        setReports([]);
        const fetchMetrics = async () => {
            try {
                const data = await reportProvider.getReportsForTimeRange({ start: startDate, end: endDate });
                if (isMounted) {
                    setReports(data);
                }
            } catch (error) {
                if (isMounted) {
                    setError('Failed to load metrics for time range');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchMetrics();

        return () => {
            isMounted = false;
        };
    }, [startDate, endDate]);

    return { metrics: reports, loading, error };
}

const aggregateDataWithDateRange = (data: Array<DailyReport>, groupBy: DurationEnum.month | DurationEnum.week): AggregatedMetrics[] => {
    interface GroupedData {
        dateRange: DateRange;
        data: Array<DailyReport>;
    }

    const groupedData = new Map<string, GroupedData>();

    data.forEach(d => {
        const dateRange = getDateRangeForDate(d.date, groupBy);
        const key = JSON.stringify(dateRange);
        if (!groupedData.has(key)) {
            groupedData.set(key, { dateRange, data: [] });
        }
        groupedData.set(key, { dateRange, data: [...groupedData.get(key)!.data, d] });
    });

    const aggregatedData: Array<AggregatedMetrics> = [];

    groupedData.forEach((value) => {
        const aggregatedMetrics = value.data.reduce((acc, report) => {
            acc.heartRateSum += report.heartRate.average;
            acc.afibSum += report.afib.burden;
            acc.pausesSum += report.pauses.count;


            return acc;
        }, {
            heartRateSum: 0,
            afibSum: 0,
            pausesSum: 0,
        });

        const dataLength = value.data.length;
        aggregatedData.push({
            dateRange: value.dateRange,
            chartMetrics: {
                heartRate: {
                    average: Math.round(aggregatedMetrics.heartRateSum / dataLength),
                },
                afib: {
                    burden: Number((aggregatedMetrics.afibSum / dataLength).toFixed(1)),
                },
                pauses: {
                    count: Math.round(aggregatedMetrics.pausesSum / dataLength),
                },
            },
            baselines: null,
        });
    });

    return aggregatedData;
}


export { xAxisLabelFormatted, xAxisLabelInterval, getYAxisDomain, useLoadMetricsForTimeRange, aggregateDataWithDateRange };