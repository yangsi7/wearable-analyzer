import { formatDateRange } from "../../../../utils/date_range_utils";

export default function CustomTooltip({ active, payload, label }: any) {
    if (!active && !label) return null;
    console.log('payload', payload);
    console.log('label', label);



    const dateRange = (label as String).split('$');

    const formattedLabel = formatDateRange({
        start: new Date(dateRange[0]),
        end: new Date(dateRange[1]),
    });

    const hasNonNullValues = payload?.some((entry: any) => entry.value !== null);


    return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
            <h3 className="font-medium text-gray-900">{formattedLabel}</h3>
            {hasNonNullValues && <div className="space-y-2 mt-2">
                {payload.map((entry: any, index: number) => (
                    entry.value &&
                    <div key={index} className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: entry.color }} />
                        <span className="text-sm text-gray-600">{entry.name}:</span>
                        <span className="text-sm font-medium text-gray-900">
                            {entry.name == 'Normal Range' ? `${entry.value[0]}-${entry.value[1]}` : `${entry.value}`}{entry.unit || ''}
                        </span>
                    </div>
                ))}
            </div>}
        </div>
    );
}


