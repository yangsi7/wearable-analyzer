export function filterOutNulls<T>(array: (T | null | undefined)[]): T[] {
    return array.filter((item) => item !== null && item != undefined) as T[];
} 