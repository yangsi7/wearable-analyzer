import DailyReport from "../../domain/models/daily_report";

export default interface ReportDataSource {
    getReport: (userId: string, date: Date) => Promise<DailyReport | null>;
    getReportsForTimeRange: (userId: string, startDate: Date, endDate: Date) => Promise<DailyReport[]>;
    getTotalDays: (userId: string,) => Promise<number>;
    getLatestDay: (userId: string,) => Promise<{ day: number; date: Date } | null>;
    getEarliestDate: (userId: string,) => Promise<Date | null>
    getDateNumber: (userId: string, date: Date) => Promise<number>;
}