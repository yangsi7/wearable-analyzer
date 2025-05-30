export const formatDate = (date: Date) => {
    const now = new Date();
    if (isSameDay(date, now)) {
        return 'Today';
    }
    if (isSameDay(date, new Date(now.setDate(now.getDate() - 1)))) {
        return 'Yesterday';
    }
    return date.toLocaleDateString('default', { weekday: 'short' }) + ', ' + date.toLocaleDateString('default', { year: date.getFullYear() === new Date().getFullYear() ? undefined : 'numeric', month: 'long', day: 'numeric' })
}

export const isSameDay = (date1: Date, date2: Date) => {
    return date1.toDateString() === date2.toDateString();
}

export const formatTime = (date: Date) => {
    return date.toLocaleTimeString('default', { hour: 'numeric', minute: '2-digit' });
}

export const toIsoStringWithAdjustedTimezone = (date: Date) => {
    const offset = date.getTimezoneOffset()
    const offsetDate = new Date(date.getTime() - (offset * 60 * 1000))
    return offsetDate.toISOString();
}