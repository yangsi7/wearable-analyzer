export const formatDurationToMinuteSecond = (durationInSeconds: number): string => {
    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = durationInSeconds % 60;

    return ` ${minutes}m ${seconds}s`;
}

export const formatDurationToHourMinute = (durationInSeconds: number): string => {
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);

    const hoursString = hours > 0 ? `${hours}h` : '';
    const minutesString = minutes > 0 ? `${minutes}m` : '';
    const separator = hours > 0 && minutes > 0 ? ' ' : '';
    return hoursString + separator + minutesString;
}

export const getHoursFromDuration = (durationInSeconds: number): number => {
    return Number((durationInSeconds / 3600).toFixed);
}
