import { TimeRange } from "../../../../common/domain/models/time_range";

const timeRangeOptions: { value: TimeRange; label: string }[] = [
    { value: TimeRange.week, label: '7 Days' },
    { value: TimeRange.month, label: '30 Days' },
    { value: TimeRange.threeMonths, label: '3 Months' },
    { value: TimeRange.year, label: '1 Year' },
];

interface TimeRangeSelectorProps {
    selectedRange: TimeRange;
    onSelectRange: (range: TimeRange) => void;
}

export default function TimeRangeSelector({ selectedRange, onSelectRange }: TimeRangeSelectorProps) {
    return (
        <div className="flex gap-2 overflow-x-auto pb-2">
            {timeRangeOptions.map((option, index) => (
                <button
                    key={option.value}
                    onClick={() => onSelectRange(option.value)}
                    className={`${index == 0 ? 'ml-6' : ''} px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedRange === option.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
}