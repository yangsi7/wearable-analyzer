import React, {
    createContext,
    useContext
} from 'react';
import ReportRepository from '../../domain/repositories/report_repository';

// Create context
const DailyReportContext = createContext<ReportRepository | undefined>(undefined);

// Auth Provider Component
export const DailyReportProvider: React.FC<{
    children: React.ReactNode,
    reportRepository: ReportRepository
}> = ({ children, reportRepository: reportRepository }) => {
    return (
        <DailyReportContext.Provider value={reportRepository}>
            {children}
        </DailyReportContext.Provider>
    );
};

// Custom hook to use auth context
export const useDailyReportProvider = () => {
    const context = useContext(DailyReportContext);
    if (context === undefined) {
        throw new Error('useDailyReportProvider must be used within an DailyReportProvider');
    }
    return context;
};