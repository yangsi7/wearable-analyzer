import DateRange from "../../../../common/domain/models/date_range";
import { AuthService } from "../../../auth/domain/service/auth_service";
import DailyReport from "../../domain/models/daily_report";
import ReportRepository from "../../domain/repositories/report_repository";
import ReportDataSource from "../data_source/report_data_source";

export default class ReportRepositoryImpl implements ReportRepository {
    constructor(private reportDataSource: ReportDataSource, private authService: AuthService) { }

    async getReport(date: Date): Promise<DailyReport | null> {
        const session = await this.authService.refreshSession();
        if (!session?.user) {
            console.warn('getTotalDays: No authenticated user');
            return null;
        }
        return await this.reportDataSource.getReport(session.user.id, date);
    }

    async getReportsForTimeRange(dateRange: DateRange): Promise<DailyReport[]> {
        const session = await this.authService.refreshSession();
        if (!session?.user) {
            console.warn('getTotalDays: No authenticated user');
            return [];
        }
        return await this.reportDataSource.getReportsForTimeRange(session.user.id, dateRange.start, dateRange.end);
    }

    async getTotalDays(): Promise<number> {
        const session = await this.authService.refreshSession();
        if (!session?.user) {
            console.warn('getTotalDays: No authenticated user');
            return 0;
        }
        return await this.reportDataSource.getTotalDays(session.user.id,);
    }

    async getLatestDay(): Promise<{ day: number; date: Date } | null> {
        const session = await this.authService.refreshSession();
        if (!session?.user) {
            console.warn('getTotalDays: No authenticated user');
            return null;
        }
        return await this.reportDataSource.getLatestDay(session.user.id,);
    }

    async getEarliestDate(): Promise<Date | null> {
        const session = await this.authService.refreshSession();
        if (!session?.user) {
            console.warn('getTotalDays: No authenticated user');
            return null;
        }
        return await this.reportDataSource.getEarliestDate(session.user.id,);
    }

    async getDateNumber(date: Date): Promise<number> {
        const session = await this.authService.refreshSession();
        if (!session?.user) {
            console.warn('getTotalDays: No authenticated user');
            return 0;
        }
        return await this.reportDataSource.getDateNumber(session.user.id, date);
    }

}