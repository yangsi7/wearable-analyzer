import { HttpClient } from "../../../../common/data/remote/http_service";
import DailyReport from "../../domain/models/daily_report";
import ReportDataSource from "./report_data_source";

export default class ApiReportDataSource implements ReportDataSource {
    constructor(private httpClient: HttpClient) { }

    async getReport(userId: string, date: Date): Promise<DailyReport | null> {
        try {
            const response = await this.httpClient.get<DailyReport>(`/reports/${userId}/date/${date.toISOString()}`);
            return response;
        } catch (error) {
            console.error("Error fetching report:", error);
            return null;
        }
    }

    async getReportsForTimeRange(userId: string, startDate: Date, endDate: Date): Promise<DailyReport[]> {
        try {
            const response = await this.httpClient.get<DailyReport[]>(`/reports/${userId}/range`, {
                params: {
                    start: startDate.toISOString(),
                    end: endDate.toISOString()
                }
            });
            return response;
        } catch (error) {
            console.error("Error fetching reports for time range:", error);
            return [];
        }
    }

    async getTotalDays(userId: string): Promise<number> {
        try {
            const response = await this.httpClient.get<number>(`/reports/${userId}/total-days`);
            return response;
        } catch (error) {
            console.error("Error fetching total days:", error);
            return 0;
        }
    }

    async getLatestDay(userId: string): Promise<{ day: number; date: Date; } | null> {
        try {
            const response = await this.httpClient.get<{ day: number, date: Date }>(`/reports/${userId}/latest-day`);
            return response;
        } catch (error) {
            console.error("Error fetching latest day:", error);
            return null;
        }
    }

    async getEarliestDate(userId: string): Promise<Date | null> {
        try {
            const response = await this.httpClient.get<Date>(`/reports/${userId}/earliest-date`);
            return response;
        } catch (error) {
            console.error("Error fetching earliest date:", error);
            return null;
        }
    }

    async getDateNumber(userId: string, date: Date): Promise<number> {
        try {
            const response = await this.httpClient.get<number>(`/reports/${userId}/date-number`, {
                params: { date: date.toISOString() }
            });
            return response;
        } catch (error) {
            console.error("Error fetching date number:", error);
            return 0;
        }
    }
}