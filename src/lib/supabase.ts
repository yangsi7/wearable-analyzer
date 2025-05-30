// import { createClient } from '@supabase/supabase-js';
// import { DayData, HeartMetrics, Symptom } from '../types';
// import { refreshSession } from './auth';

// export async function getFirstMetricDate(): Promise<Date | null> {
//   try {
//     const session = await refreshSession();
//     if (!session?.user?.id) {
//       console.warn('getFirstMetricDate: No authenticated user');
//       return null;
//     }

//     // Add retry logic for fetch failures
//     let retries = 3;
//     let lastError;

//     while (retries > 0) {
//       try {
//         const { data, error } = await supabase
//           .from('daily_metrics')
//           .select('date')
//           .eq('user_id', session.user.id)
//           .order('date', { ascending: true })
//           .limit(1);

//         if (error) {
//           throw error;
//         }

//         if (!data || data.length === 0) {
//           console.warn('getFirstMetricDate: No data found');
//           return null;
//         }

//         return new Date(data[0].date);
//       } catch (err) {
//         lastError = err;
//         retries--;
//         if (retries > 0) {
//           // Wait before retrying (exponential backoff)
//           await new Promise(resolve => setTimeout(resolve, Math.pow(2, 3 - retries) * 1000));
//           continue;
//         }
//         break;
//       }
//     }

//     console.error('getFirstMetricDate error after retries:', lastError);
//     return null;
//   } catch (error) {
//     console.error('getFirstMetricDate unexpected error:', error);
//     return null;
//   }
// }

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// if (!supabaseUrl || !supabaseAnonKey) {
//   throw new Error('Missing Supabase environment variables');
// }

// export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// const MAX_RETRIES = 3;
// const INITIAL_RETRY_DELAY = 2000; // 2 seconds
// const MAX_RETRY_DELAY = 10000; // 10 seconds
// const JITTER_MAX = 1000; // Maximum jitter in milliseconds

// interface SupabaseResponse<T> {
//   data: T | null;
//   error: any;
// }

// // Enhanced error handling for network errors
// function isNetworkError(error: unknown): boolean {
//   return error instanceof Error && (
//     error.message.includes('Failed to fetch') ||
//     error.message.includes('Network error') ||
//     error.message.includes('NetworkError') ||
//     error.message.includes('network timeout')
//   );
// }

// // Enhanced retry operation with exponential backoff and jitter
// async function retryOperation<T>(
//   operation: () => Promise<SupabaseResponse<T>>,
//   retries = MAX_RETRIES,
//   delay = INITIAL_RETRY_DELAY
// ): Promise<SupabaseResponse<T>> {
//   try {
//     const response = await Promise.race([operation(), new Promise((_, reject) => setTimeout(() => reject(new Error('network timeout')), 5000))]);
//     if (response.error?.message?.includes('Failed to fetch') || 
//         response.error?.message?.includes('NetworkError')) {
//       throw new Error('Network error');
//     }
//     return response;
//   } catch (error) {
//     if (retries > 0) {
//       if (isNetworkError(error)) {
//         console.warn(`Network error, retrying operation (${retries} attempts remaining)`);
        
//         // Add jitter to prevent thundering herd
//         const jitter = Math.random() * JITTER_MAX;
//         const nextDelay = Math.min(delay * 2 + jitter, MAX_RETRY_DELAY);

//         await new Promise(resolve => setTimeout(resolve, nextDelay));
//         return retryOperation(operation, retries - 1, nextDelay);
//       }
//     }
    
//     return {
//       data: null,
//       error: error instanceof Error ? error : new Error('Unknown error')
//     };
//   }
// }

// // Wrap Supabase client initialization in a retry mechanism
// async function initializeSupabase() {
//   let retries = MAX_RETRIES;
//   let delay = INITIAL_RETRY_DELAY;

//   while (retries > 0) {
//     try {
//       const { data: { session } } = await supabase.auth.getSession();
//       if (session) {
//         console.log('Supabase connection established');
//       }
//       return;
//     } catch (error) {
//       console.warn(`Failed to initialize Supabase (${retries} attempts remaining)`);
//       retries--;
//       if (retries > 0) {
//         const jitter = Math.random() * 1000;
//         delay = Math.min(delay * 2 + jitter, MAX_RETRY_DELAY);
//         await new Promise(resolve => setTimeout(resolve, delay));
//       }
//     }
//   }
// }

// // Initialize Supabase connection
// initializeSupabase().catch(error => {
//   console.error('Failed to initialize Supabase after all retries:', error);
// });

// export async function fetchDayMetrics(date: Date): Promise<DayData | null> {
//   // Get the user ID first
//   const session = await refreshSession();
//   if (!session?.user) {
//     console.warn('fetchDayMetrics: No authenticated user');
//     return null;
//   }

//   // Format date to YYYY-MM-DD to ensure consistent timezone handling
//   const formattedDate = date.toISOString().split('T')[0];

//   // Fetch metrics with proper error handling
//   const { data: metricsData, error: metricsError } = await retryOperation(() => supabase
//       .from('daily_metrics')
//       .select()
//       .eq('date', formattedDate)
//       .eq('user_id', session.user.id)
//       .single());

//   if (metricsError) {
//     if (metricsError.code === 'PGRST116') {
//       // No data found - this is expected sometimes
//       return null;
//     }
//     throw metricsError;
//   }

//   // If no metrics found, return null instead of throwing an error
//   if (!metricsData) {
//     return null;
//   }

//   // Fetch symptoms with proper error handling
//   const { data: symptoms, error: symptomsError } = await retryOperation(() => supabase
//     .from('symptom_log')
//     .select()
//     .eq('date', formattedDate)
//     .eq('user_id', session.user.id)
//     .order('time', { ascending: true }));
    
//   if (symptomsError) {
//     console.error('Error fetching symptoms:', symptomsError);
//     // Don't throw on symptom fetch error, just return empty array
//     return {
//       day: 0,
//       date: formattedDate,
//       metrics: metricsData ? {
//         heartRate: {
//           average: metricsData.heart_rate_avg,
//           min: metricsData.heart_rate_min,
//           max: metricsData.heart_rate_max,
//         },
//         afib: {
//           burden: metricsData.afib_burden,
//           maxDuration: metricsData.afib_max_duration,
//           minHR: 0,
//           maxHR: metricsData.afib_max_hr,
//         },
//         avBlocks: {
//           burden: 0,
//           types: metricsData.av_blocks_types,
//         },
//         pauses: {
//           count: metricsData.pauses_count,
//           longest: metricsData.pauses_longest,
//         },
//       } : null,
//       symptoms: [],
//     };
//   }
//   if (!metricsData || !symptoms) {
//     return null;
//   }

//   return {
//     day: 0, // Will be set by the component
//     date: formattedDate,
//     metrics: {
//       heartRate: {
//         average: metricsData.heart_rate_avg,
//         min: metricsData.heart_rate_min,
//         max: metricsData.heart_rate_max,
//       },
//       afib: {
//         burden: metricsData.afib_burden,
//         maxDuration: metricsData.afib_max_duration,
//         minHR: 0, // Removed as per requirements
//         maxHR: metricsData.afib_max_hr,
//       },
//       avBlocks: {
//         burden: 0, // Removed as per requirements
//         types: metricsData.av_blocks_types,
//       },
//       pauses: {
//         count: metricsData.pauses_count,
//         longest: metricsData.pauses_longest,
//       },
//     },
//     symptoms: symptoms?.map((s) => ({
//       name: s.name,
//       severity: s.severity as 'mild' | 'moderate' | 'severe',
//       time: s.time,
//       pathology: s.pathology,
//       correlatedEvents: s.correlated_events,
//       notes: s.notes,
//     })) || [],
//   };
// }

// export async function fetchBaseline(): Promise<HeartMetrics | null> {
//   try {
//     const session = await refreshSession();
//     if (!session?.user?.id) {
//       console.warn('fetchBaseline: No authenticated user');
//       return null;
//     }

//     // Ensure we have at least 7 days of data before calculating baseline
//     const totalDays = await getTotalDays();
//     if (totalDays < 7) {
//       console.warn('fetchBaseline: Not enough days for baseline calculation');
//       return null;
//     }

//     // Get latest day info
//     const latestInfo = await getLatestDay();
//     if (!latestInfo) {
//       console.warn('fetchBaseline: No latest day found');
//       return null;
//     }

//     const endDate = latestInfo.date;
//     const startDate = new Date(endDate);
//     startDate.setDate(endDate.getDate() - 27); // -27 to include end date (28 days total)

//     const formattedStartDate = startDate.toISOString().split('T')[0];
//     const formattedEndDate = endDate.toISOString().split('T')[0];

//     // Fetch the last 28 days of data
//     const { data: metricsData, error: metricsError } = await supabase
//       .from('daily_metrics')
//       .select('*')
//       .eq('user_id', session.user.id)
//       .gte('date', formattedStartDate)
//       .lte('date', formattedEndDate)
//       .order('date', { ascending: false });

//     if (metricsError) {
//       console.error('fetchBaseline metrics error:', metricsError);
//       return null;
//     }

//     if (!metricsData || metricsData.length === 0) {
//       console.warn('fetchBaseline: No metrics data found');
//       return null;
//     }

//     const daysToUse = Math.min(metricsData.length, 28);
    
//     // Verify data continuity
//     const dates = metricsData.map(d => d.date).sort();
//     const expectedDates = new Set();
//     const currentDate = new Date(dates[0]);
//     const endDateObj = new Date(dates[dates.length - 1]);
    
//     while (currentDate <= endDateObj) {
//       expectedDates.add(currentDate.toISOString().split('T')[0]);
//       currentDate.setDate(currentDate.getDate() + 1);
//     }
    
//     const missingDates = Array.from(expectedDates).filter(date => !dates.includes(date));
//     if (missingDates.length > 0) {
//       console.warn('fetchBaseline: Data gaps detected:', missingDates);
//       return null;
//     }

//     const recentData = metricsData.slice(0, daysToUse);

//     // Calculate standard deviations for normal ranges
//     const heartRateStats = calculateStats(recentData.map(d => d.heart_rate_avg));
//     const afibStats = calculateStats(recentData.map(d => d.afib_burden));
//     const pausesStats = calculateStats(recentData.map(d => d.pauses_count));

//     // Calculate averages
//     const baseline: HeartMetrics = {
//       heartRate: {
//         average: Math.round(heartRateStats.mean),
//         min: Math.round(recentData.reduce((sum, d) => sum + d.heart_rate_min, 0) / daysToUse),
//         max: Math.round(recentData.reduce((sum, d) => sum + d.heart_rate_max, 0) / daysToUse),
//         normalRange: {
//           low: Math.round(heartRateStats.mean - 2 * heartRateStats.stdDev),
//           high: Math.round(heartRateStats.mean + 2 * heartRateStats.stdDev)
//         }
//       },
//       afib: {
//         burden: Number(afibStats.mean.toFixed(1)),
//         maxDuration: Math.max(...recentData.map(d => d.afib_max_duration)),
//         minHR: 0,
//         maxHR: Math.max(...recentData.map(d => d.afib_max_hr)),
//         normalRange: {
//           low: Math.max(0, Number((afibStats.mean - 2 * afibStats.stdDev).toFixed(1))),
//           high: Number((afibStats.mean + 2 * afibStats.stdDev).toFixed(1))
//         }
//       },
//       avBlocks: {
//         burden: 0,
//         types: Array.from(new Set(recentData.flatMap(d => d.av_blocks_types))),
//       },
//       pauses: {
//         count: Math.round(pausesStats.mean),
//         longest: Math.max(...recentData.map(d => d.pauses_longest)),
//         normalRange: {
//           low: Math.max(0, Math.round(pausesStats.mean - 2 * pausesStats.stdDev)),
//           high: Math.round(pausesStats.mean + 2 * pausesStats.stdDev)
//         }
//       },
//     };

//     return baseline;
//   } catch (error) {
//     console.error('Error fetching baseline:', error);
//     return null;
//   }
// }

// function calculateStats(values: number[]) {
//   const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
//   const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
//   const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
//   const stdDev = Math.sqrt(variance);
//   return { mean, stdDev };
// }

// export async function getTotalDays(): Promise<number> {
//   try {
//     const session = await refreshSession();
//     if (!session?.user) {
//       console.warn('getTotalDays: No authenticated user');
//       return 0;
//     }

//     // Get all dates to check for continuity
//     const { data, error } = await supabase
//       .from('daily_metrics')
//       .select('date')
//       .eq('user_id', session.user.id)
//       .order('date', { ascending: true });

//     if (error) {
//       console.error('getTotalDays error:', error);
//       return 0;
//     }

//     if (!data || data.length === 0) {
//       console.warn('getTotalDays: No data found');
//       return 0;
//     }

//     const firstDate = new Date(data[0].date);
//     const lastDate = new Date(data[data.length - 1].date);
    
//     // Verify data continuity
//     const dates = data.map(d => d.date).sort();
//     const expectedDates = new Set();
//     const currentDate = new Date(firstDate);
    
//     while (currentDate <= lastDate) {
//       expectedDates.add(currentDate.toISOString().split('T')[0]);
//       currentDate.setDate(currentDate.getDate() + 1);
//     }
    
//     const missingDates = Array.from(expectedDates).filter(date => !dates.includes(date));
//     if (missingDates.length > 0) {
//       console.warn('getTotalDays: Data gaps detected:', missingDates);
//       // Return the actual number of days with data instead of the date range
//       return dates.length;
//     }

//     const diffTime = Math.abs(lastDate.getTime() - firstDate.getTime());
//     const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

//     return totalDays;
//   } catch (error) {
//     console.error('getTotalDays unexpected error:', error);
//     return 0;
//   }
// }

// export async function getLatestDay(): Promise<{ day: number; date: Date } | null> {
//   try {
//     const session = await refreshSession();
//     if (!session?.user) {
//       console.warn('getLatestDay: No authenticated user');
//       return null;
//     }

//     const { data, error } = await supabase
//       .from('daily_metrics')
//       .select('date')
//       .eq('user_id', session.user.id)
//       .order('date', { ascending: false })
//       .limit(1);

//     if (error) {
//       console.error('getLatestDay error:', error);
//       return null;
//     }

//     if (!data || data.length === 0) {
//       console.warn('getLatestDay: No data found');
//       return null;
//     }

//     const latestDate = new Date(data[0].date);
    
//     // Get the first date to calculate total days
//     const { data: firstDateData } = await supabase
//       .from('daily_metrics')
//       .select('date')
//       .eq('user_id', session.user.id)
//       .order('date', { ascending: true })
//       .limit(1);

//     if (!firstDateData || firstDateData.length === 0) {
//       console.warn('getLatestDay: No first date found');
//       return null;
//     }

//     const firstDate = new Date(firstDateData[0].date);
//     const diffTime = Math.abs(latestDate.getTime() - firstDate.getTime());
//     const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

//     return {
//       day: totalDays,
//       date: latestDate
//     };
//   } catch (error) {
//     console.error('getLatestDay unexpected error:', error);
//     return null;
//   }
// }

// export async function fetchTrendsData(timeframe: 'week' | 'month' | '3months' | 'year'): Promise<Array<{ date: string; metrics: HeartMetrics }>> {
//   try {
//     const session = await refreshSession();
//     const user = session?.user;
//     if (!user?.id) {
//       console.warn('fetchTrendsData: No authenticated user');
//       return [];
//     }

//     // Get latest day info
//     const latestInfo = await getLatestDay();
//     if (!latestInfo) {
//       console.warn('fetchTrendsData: No latest day found');
//       return [];
//     }

//     const endDate = latestInfo.date;
//     const startDate = new Date(endDate);

//     // Set start date based on timeframe
//     switch (timeframe) {
//       case 'week':
//         startDate.setDate(endDate.getDate() - 6); // Last 7 days including today
//         break;
//       case 'month':
//         startDate.setDate(endDate.getDate() - 29); // Last 30 days including today
//         break;
//       case '3months':
//         startDate.setDate(endDate.getDate() - 90);
//         break;
//       case 'year':
//         startDate.setDate(endDate.getDate() - 365);
//         break;
//     }

//     const { data, error } = await retryOperation(() => supabase
//       .from('daily_metrics')
//       .select('*')
//       .eq('user_id', user.id)
//       .gte('date', startDate.toISOString().split('T')[0])
//       .lte('date', endDate.toISOString().split('T')[0])
//       .order('date', { ascending: true }));

//     if (error) {
//       console.error('Error fetching trends data:', error);
//       return [];
//     }

//     if (!data || data.length === 0) {
//       console.warn('fetchTrendsData: No data found in range');
//       return [];
//     }

//     // Also fetch symptoms for the date range
//     const { data: symptoms, error: symptomsError } = await retryOperation(() => supabase
//       .from('symptom_log')
//       .select('*')
//       .eq('user_id', user.id)
//       .gte('date', startDate.toISOString().split('T')[0])
//       .lte('date', endDate.toISOString().split('T')[0])
//       .order('date', { ascending: true }));

//     if (symptomsError) {
//       console.error('Error fetching symptoms:', symptomsError);
//     }

//     // Create a map of dates to symptoms
//     const symptomsByDate = new Map();
//     symptoms?.forEach(symptom => {
//       const date = symptom.date;
//       if (!symptomsByDate.has(date)) {
//         symptomsByDate.set(date, []);
//       }
//       symptomsByDate.get(date).push(symptom);
//     });

//     return data.map(row => ({
//       date: row.date,
//       metrics: {
//         heartRate: {
//           average: row.heart_rate_avg,
//           min: row.heart_rate_min,
//           max: row.heart_rate_max,
//         },
//         afib: {
//           burden: row.afib_burden,
//           maxDuration: row.afib_max_duration,
//           minHR: 0,
//           maxHR: row.afib_max_hr,
//         },
//         avBlocks: {
//           burden: 0,
//           types: row.av_blocks_types,
//         },
//         pauses: {
//           count: row.pauses_count,
//           longest: row.pauses_longest,
//         },
//         symptoms: symptomsByDate.get(row.date) || [],
//       },
//     }));
//   } catch (error) {
//     console.error('Unexpected error in fetchTrendsData:', error);
//     return [];
//   }
// }

// export async function subscribeToUpdates(
//   onMetricsUpdate: () => void,
//   onSymptomsUpdate: () => void
// ): Promise<() => Promise<void>> {
//   const metricsChannel = supabase
//     .channel('daily_metrics_changes')
//     .on(
//       'postgres_changes',
//       {
//         event: '*',
//         schema: 'public',
//         table: 'daily_metrics',
//       },
//       () => onMetricsUpdate()
//     )
//     .subscribe();

//   const symptomsChannel = supabase
//     .channel('symptom_log_changes')
//     .on(
//       'postgres_changes',
//       {
//         event: '*',
//         schema: 'public',
//         table: 'symptom_log',
//       },
//       () => onSymptomsUpdate()
//     )
//     .subscribe();

//   return async () => {
//     try {
//       await Promise.all([
//         metricsChannel.unsubscribe(),
//         symptomsChannel.unsubscribe()
//       ]);
//     } catch (error) {
//       console.warn('Error during subscription cleanup:', error);
//       // Even if there's an error, we want to ensure both channels attempt cleanup
//       try { await metricsChannel.unsubscribe(); } catch {}
//       try { await symptomsChannel.unsubscribe(); } catch {}
//     }
//   };
// }