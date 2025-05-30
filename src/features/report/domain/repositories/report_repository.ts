import DateRange from "../../../../common/domain/models/date_range";
import DailyReport from "../models/daily_report";

export default interface ReportRepository {
    getReport: (date: Date) => Promise<DailyReport | null>;
    getReportsForTimeRange: (dateRange: DateRange) => Promise<DailyReport[]>;
    getTotalDays: () => Promise<number>;
    getLatestDay: () => Promise<{ day: number; date: Date } | null>;
    getEarliestDate: () => Promise<Date | null>
    getDateNumber: (date: Date) => Promise<number>;
}