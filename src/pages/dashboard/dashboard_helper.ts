import { useEffect, useState } from 'react';
import { useDailyReportProvider } from '../../features/report/presentation/providers/DailyReportProvider';
import DailyReport from '../../features/report/domain/models/daily_report';

const useGetTotalDays = () => {
    const reportProvider = useDailyReportProvider();
    const [totalDays, setTotalDays] = useState<number | null>(null);

    useEffect(() => {
        const loadTotalDays = async () => {
            const total = await reportProvider.getTotalDays();
            setTotalDays(total);
        };

        loadTotalDays();
    }, []);

    return totalDays;
}

const useSelectedDayNumber = (selectedDate: Date | null) => {
    const reportProvider = useDailyReportProvider();
    const [selectedDayNumber, setSelectedDayNumber] = useState<number>(0);

    useEffect(() => {
        if (selectedDate != null) {
            const loadSelectedDayNumber = async () => {
                try {
                    const dayNumber = await reportProvider.getDateNumber(selectedDate);
                    setSelectedDayNumber(dayNumber);
                }
                catch (error) {
                    console.error('Error loading selected day number:', error);
                }
            }
            loadSelectedDayNumber();
        }
    }, [selectedDate]);

    return selectedDayNumber;
}


const useLoadLatestDay = () => {
    const reportProvider = useDailyReportProvider();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [latestDate, setLatestDate] = useState<Date | null>(null);

    useEffect(() => {
        const loadLatestDay = async () => {
            setLoading(true);
            setError(null);

            try {
                const latest = await reportProvider.getLatestDay();
                if (latest) {
                    setLatestDate(latest.date);
                }
            } catch (error) {
                console.error('Error loading latest day:', error);
                setError('Failed to load data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        loadLatestDay();
    }, []);

    return { latestDate, latestDateLoading: loading, latestDateError: error };
};

const useGetEarliestDate = () => {
    const reportProvider = useDailyReportProvider();
    const [earliestDate, setEarliestDate] = useState<Date | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        const loadEarliestDate = async () => {
            try {
                const earliestDate = await reportProvider.getEarliestDate();
                setEarliestDate(earliestDate);
            }
            catch (error) {
                console.error('Error loading earliest date:', error);
                setError('Failed to load data. Please try again.');
            }
            finally {
                setLoading(false);
            }
        };

        loadEarliestDate();
    }, []);

    return { earliestDate, earliestDateLoading: loading, earliestDateError: error };
}

const useShowWelcome = (totalDays: number | null) => {
    const [showWelcome, setShowWelcome] = useState(false);

    useEffect(() => {
        setShowWelcome(totalDays === 0 || totalDays === 1);
    }, [totalDays]);

    return { showWelcome, setShowWelcome };
}

const useLoadDailyReport = (selectedDate: Date | null) => {
    const reportProvider = useDailyReportProvider();
    const [report, setReport] = useState<DailyReport | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;


        const loadData = async () => {
            if (selectedDate === null) return;

            setLoading(true);
            setError(null);
            setReport(null);

            try {

                if (!isMounted) {
                    setLoading(false);
                    return;
                }

                const report = await reportProvider.getReport(selectedDate);
                if (isMounted && report) {
                    setReport(report);
                }
            } catch (error) {
                console.error('Error loading data:', error);
                setError('Failed to load data. Please try again.');
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadData();

        return () => {
            isMounted = false;
        };
    }, [selectedDate]);

    return { report: report, metricsLoading: loading, metricsError: error };
};

// const useSubscribeToUpdates = (currentDay: number | null, earliestDate: Date | null, setError: (error: string | null) => void, setData: (data: DayData | null) => void) => {
//     useEffect(() => {
//         let isMounted = true;
//         let cleanupFn: (() => Promise<void>) | undefined;

//         if (currentDay === null || !earliestDate) return;

//         const handleMetricsUpdate = async () => {
//             if (!isMounted) return;

//             const targetDate = new Date(earliestDate);
//             targetDate.setDate(earliestDate.getDate() + currentDay - 1);

//             try {
//                 const dayData = await fetchDayMetrics(targetDate);
//                 if (isMounted && dayData) {
//                     dayData.day = currentDay;
//                     setData(dayData);
//                 }
//             } catch (error) {
//                 console.error('Error updating metrics:', error);
//                 setError('Failed to update metrics. Please try again.');
//             }
//         };

//         const handleSymptomsUpdate = async () => {
//             if (!isMounted) return;

//             const targetDate = new Date(earliestDate);
//             targetDate.setDate(earliestDate.getDate() + currentDay - 1);

//             try {
//                 const dayData = await fetchDayMetrics(targetDate);
//                 if (isMounted && dayData) {
//                     dayData.day = currentDay;
//                     setData(dayData);
//                 }
//             } catch (error) {
//                 console.error('Error updating symptoms:', error);
//                 setError('Failed to update symptoms. Please try again.');
//             }
//         };

//         subscribeToUpdates(handleMetricsUpdate, handleSymptomsUpdate)
//             .then(cleanup => {
//                 if (isMounted) {
//                     cleanupFn = cleanup;
//                 } else {
//                     cleanup().catch(error => {
//                         if (error?.message !== 'Connection closed') {
//                             console.warn('Subscription cleanup warning:', error);
//                         }
//                     });
//                 }
//             })
//             .catch(error => {
//                 console.error('Error setting up subscriptions:', error);
//                 setError('Failed to set up real-time updates. Please try again.');
//             });

//         return () => {
//             isMounted = false;
//             if (cleanupFn) {
//                 cleanupFn().catch(error => {
//                     if (error?.message !== 'Connection closed') {
//                         console.warn('Subscription cleanup warning:', error);
//                     }
//                 });
//             }
//         };
//     }, [currentDay, earliestDate, setError, setData]);
// };

export { useGetTotalDays, useLoadLatestDay, useShowWelcome, useLoadDailyReport as useLoadMetrics, useSelectedDayNumber, useGetEarliestDate };