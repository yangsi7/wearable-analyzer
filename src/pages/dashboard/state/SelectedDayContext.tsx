import { createContext, useContext } from "react";
import DailyReport from "../../../features/report/domain/models/daily_report";

const SelectedDayContext = createContext<{
    selectedDate: Date;
    selectedDayNumber: number;
    setSelectedDate: (date: Date) => void;
    report: DailyReport | null;
    error: string | null;
    isLoading: boolean;
}>({
    selectedDate: new Date(),
    setSelectedDate: () => { },
    selectedDayNumber: 0,
    report: null,
    error: null,
    isLoading: false,
});

export default SelectedDayContext;

export const useSelectedDay = () => useContext(SelectedDayContext);

