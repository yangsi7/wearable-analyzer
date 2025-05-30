import { SupabaseService } from "../../../../common/data/remote/supabase_service";
import { DurationEnum } from "../../../../common/domain/models/duration";
import { getDateRangeForDate } from "../../../../utils/date_range_utils";
import { toIsoStringWithAdjustedTimezone } from "../../../../utils/date_utils";
import DailyReport from "../../domain/models/daily_report";
import ReportDataSource from "./report_data_source";

export class SupabaseReportDataSource implements ReportDataSource {
    private supabaseService: SupabaseService;

    constructor(supabaseService: SupabaseService) {
        this.supabaseService = supabaseService;
    }

    private mapDataToMetrics = (data: any, qualityMinutesData: any, date: Date): DailyReport => {
        return ({
            date: date,
            heartRate: {
                average: data.heart_rate_avg,
                min: data.heart_rate_min,
                max: data.heart_rate_max,
            },
            afib: {
                burden: data.afib_burden,
                maxDuration: data.afib_max_duration,
                minHR: 0,
                maxHR: data.afib_max_hr,
            },
            avBlocks: {
                types: data.av_blocks_types,
            },
            pauses: {
                count: data.pauses_count,
                longestDurationInSeconds: data.pauses_longest,
            },
            loggedSymptoms: data.logged_symptoms && data.logged_symptoms.map((l: any) => ({
                id: l.id,
                symptomDate: new Date(l.symptomDate),
                symptoms: l.symptoms,
                reviewStatus: l.reviewStatus,
                correlatedEvents: l.correlatedEvents && l.correlatedEvents.map((e: any) => ({
                    start: new Date(e.start),
                    end: new Date(e.end),
                    pathology: e.pathology,
                    notes: e.notes,
                })),

            })),
            baseline: data.baseline && {
                heartRate: data.baseline.heart_rate_avg24h,
                afib: data.baseline.afib_burden24h,
                pauses: data.baseline.pauses_count24h,
            },
            insights: data.insights && {
                summary: data.insights.summary,
                score: data.insights.score,
                insights: data.insights.insights.filter((i: any) => i !== null),
                title: data.insights.title,
            },
            dataQualityInfo: qualityMinutesData && {
                qualityMinutes: qualityMinutesData.qualityMinutes,
                totalMinutes: qualityMinutesData.totalMinutes,
            }
        })
    }

    async getTotalDays(userId: string): Promise<number> {
        try {

            // Get all dates to check for continuity
            const { data, error } = await this.supabaseService.supabase
                .from('daily_metrics')
                .select('date')
                .eq('user_id', userId);

            if (error) {
                console.error('getTotalDays error:', error);
                return 0;
            }


            if (!data || data.length === 0) {
                console.warn('getTotalDays: No data found');
                return 0;
            }

            return data.length;
        } catch (error) {
            console.error('getTotalDays unexpected error:', error);
            return 0;
        }
    }

    async getReportsForTimeRange(userId: string, startDate: Date, endDate: Date): Promise<DailyReport[]> {
        try {
            const { data, error } = await this.supabaseService.supabase
                .from('daily_metrics')
                .select('*')
                .eq('user_id', userId)
                .gte('date', startDate.toISOString().split('T')[0])
                .lte('date', endDate.toISOString().split('T')[0])
                .order('date', { ascending: true });

            const { data: qualityData, error: qualityError } = await this.supabaseService.supabase
                .from('study_readings_clinical')
                .select('sum(qualityminutes)::float as qualityminutes, sum(totalminutes)::float as totalminutes')
                .gt('timestamp', startDate.toISOString().split('T')[0])
                .lt('timestamp', endDate.toISOString().split('T')[0]).single();

            if (error) {
                console.error('Error fetching data for time range:', error);
                return [];
            }

            if (!data || data.length === 0) {
                console.warn('getDataForTimeRange: No data found in range');
                return [];
            }

            if (qualityError) {
                // No data found - this is expected sometimes
                if (qualityError.code !== 'PGRST116') {
                    console.error('Error fetching quality data for date:', qualityError);
                }
            }

            return data.map((row) => (this.mapDataToMetrics(row, qualityData, new Date(row.date))
            ));

        } catch (error) {
            console.error('Unexpected error in getDataForTimeRange:', error);
            return [];
        }
    }

    async getLatestDay(userId: string): Promise<{ day: number; date: Date } | null> {
        try {
            const { data, error } = await this.supabaseService.supabase
                .from('daily_metrics')
                .select('date')
                .eq('user_id', userId)
                .order('date', { ascending: false })
                .limit(1);

            if (error) {
                console.error('getLatestDay error:', error);
                return null;
            }

            if (!data || data.length === 0) {
                console.warn('getLatestDay: No data found');
                return null;
            }

            const latestDate = new Date(data[0].date);

            const totalDays = await this.getTotalDays(userId);

            return {
                day: totalDays,
                date: latestDate
            };
        } catch (error) {
            console.error('getLatestDay unexpected error:', error);
            return null;
        }
    }

    async getEarliestDate(userId: string): Promise<Date | null> {
        try {
            const { data, error } = await this.supabaseService.supabase
                .from('daily_metrics')
                .select('date')
                .eq('user_id', userId)
                .order('date', { ascending: true })
                .limit(1);

            if (error) {
                console.error('getEarliestDate error:', error);
                return null;
            }

            if (!data || data.length === 0) {
                console.warn('getEarliestDate: No data found');
                return null;
            }

            return new Date(data[0].date);
        } catch (error) {
            console.error('getEarliestDate unexpected error:', error);
            return null;
        }
    }

    async getReport(userId: string, date: Date): Promise<DailyReport | null> {
        // Format date to YYYY-MM-DD to ensure consistent timezone handling
        const formattedDate = date.toISOString().split('T')[0];

        // Fetch metrics with proper error handling
        const { data, error } = await this.supabaseService.supabase
            .from('daily_metrics')
            .select('*')
            .eq('date', formattedDate)
            .eq('user_id', userId)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                // No data found - this is expected sometimes
                return null;
            }
            throw error;
        }

        // If no metrics found, return null instead of throwing an error
        if (!data) { return null; }

        const { data: studyId, error: studyError } = await this.supabaseService.supabase
            .from('study_clinical')
            .select('id')
            .eq('userid', userId)
            .single();

        let qualityInfo = null;

        if (studyError) {
            console.error('Error fetching studyId:', studyError);
        } else if (studyId?.id) {

            const dateRange = getDateRangeForDate(date, DurationEnum.day);

            const { data: qualityData, error: qualityError } = await this.supabaseService.supabase
                .from('study_readings_clinical')
                .select('totalqualityminutes:qualityminutes.sum(), totalminutes:totalminutes.sum()')
                .eq('studyid', studyId.id)
                .gt('timestamp', toIsoStringWithAdjustedTimezone(dateRange.start))
                .lt('timestamp', toIsoStringWithAdjustedTimezone(dateRange.end))
                .single();
            if (qualityError) {
                // No data found - this is expected sometimes
                if (qualityError.code !== 'PGRST116') {
                    console.error('Error fetching quality data for date:', qualityError);
                }
            } else {
                qualityInfo = {
                    qualityMinutes: qualityData.totalqualityminutes,
                    totalMinutes: qualityData.totalminutes,
                };
            }
        }

        return this.mapDataToMetrics(data, qualityInfo, date);
    }

    async getDateNumber(userId: string, date: Date): Promise<number> {
        try {

            const targetDate = date.toISOString().split('T')[0];

            const { data, error } = await this.supabaseService.supabase
                .from('daily_metrics')
                .select('date')
                .eq('user_id', userId).lt('date', targetDate);

            if (error) {
                console.error('getDateNumber error:', error);
                return 0;
            }

            if (!data || data.length === 0) {
                console.warn('getDateNumber: No data found');
                return 1;
            } else {
                return data.length + 1;
            }
        } catch (error) {
            console.error('getDateNumber unexpected error:', error);
        }

        return 0;
    }
}