import DateRange from "../common/domain/models/date_range";
import { DurationEnum } from "../common/domain/models/duration";

export const getDateRangeForDate = (date: Date, rangeDuration: DurationEnum): DateRange => {
    if (rangeDuration === DurationEnum.month) {
        const start = new Date(date.getFullYear(), date.getMonth(), 1);
        const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        return { start, end };
    }

    if (rangeDuration === DurationEnum.week) {
        const dayOfWeek = date.getDay();
        const start = new Date(date);
        start.setDate(date.getDate() - dayOfWeek);
        start.setHours(0, 0, 0, 0);

        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        end.setHours(23, 59, 59, 999);

        return { start, end };
    }

    if (rangeDuration === DurationEnum.day) {
        const start = new Date(date);
        start.setHours(0, 0, 0, 0);

        const end = new Date(date);
        end.setHours(23, 59, 59, 999);

        return { start, end };
    }

    return { start: date, end: date };
}

export const formatDateRange = (dateRange: DateRange): string => {
    const { start, end } = dateRange;

    if (isSameDay(start, end)) {
        return start.toLocaleDateString('default', { month: 'short', day: 'numeric', });
    }

    const years = end.getFullYear() - start.getFullYear();

    if (years === 0) {
        if (start.getMonth() === end.getMonth()) {
            return `${start.getDate()}-${end.getDate()} ${start.toLocaleString('default', { month: 'short' })} ${start.getFullYear()}`;
        } else {
            return `${start.getDate()} ${start.toLocaleString('default', { month: 'short' })}-${end.getDate()} ${end.toLocaleString('default', { month: 'short' })} ${start.getFullYear()}`;
        }
    }

    return `${start.getDate()} ${start.toLocaleString('default', { month: 'short' })} ${start.getFullYear()}-${end.getDate()} ${end.toLocaleString('default', { month: 'short' })} ${end.getFullYear()}`;
};

const isSameDay = (date1: Date, date2: Date): boolean => {
    return date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate();
};

