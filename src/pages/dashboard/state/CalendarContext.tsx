import { createContext, useContext } from "react";

interface CalendarContextType {
    totalDays: number;
    latestDate: Date;
    earliestDate: Date;
}

const CalendarContext = createContext<CalendarContextType>({
    totalDays: 0,
    latestDate: new Date(),
    earliestDate: new Date()
});

export default CalendarContext;

export const useCalendar = () => useContext(CalendarContext);