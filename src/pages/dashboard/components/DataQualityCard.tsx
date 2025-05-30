import { ExpandMore, QueryStats, Warning } from "@mui/icons-material";
import DataQualityInfo from "../../../features/report/domain/models/data_quality_info";
import { formatDurationToHourMinute } from "../../../utils/duration_utils";
import { useState } from "react";

export const DataQualityCard = ({ qualityMinutes, totalMinutes }: DataQualityInfo) => {
    if (!qualityMinutes || !totalMinutes) {
        return null;
    }
    const qualityPercentage = (qualityMinutes / totalMinutes) * 100;
    const hasWarning = qualityPercentage < 80;
    return (
        <div className="border-b border-violet-200 bg-violet-100 text-violet-800 shadow-sm rounded-lg p-4 space-y-1" >
            <div className="flex items-center justify-between gap-2">
                <div>
                    <div className="flex items-center gap-2">
                        <QueryStats className="w-4 h-4" />
                        <h2 className="font-medium">Recorded data</h2>
                    </div>
                    <p className="font-medium">
                        <span className="text-3xl font-bold">
                            {formatDurationToHourMinute(qualityMinutes * 60)}
                        </span>
                        <span> of quality data</span>
                    </p>
                </div>
            </div>

            <p className="text-sm">
                Total monitoring time: {formatDurationToHourMinute(totalMinutes * 60)}
            </p>
            {hasWarning && <WarningNote />}
        </div >
    );
}

const WarningNote = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    return (
        <div className="text-gray-900 space-y-1  bg-warning/50 border-warning border-2 p-2 rounded-lg" onClick={() => setIsExpanded(!isExpanded)}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Warning fontSize="small" />
                    <p className="font-medium">
                        Low data quality
                    </p>
                </div>
                <button
                    className={`transition-all duration-200  transform ${isExpanded ? 'rotate-180' : 'rotate-0'}`}
                >
                    <ExpandMore />
                </button>
            </div>
            {isExpanded && (
                <>
                    <p className="text-sm text-gray-600">
                        Please check your device and ensure it is properly connected during monitoring.
                    </p>
                    <button className="w-full bg-white/50 p-2 rounded-md  text-blue-600">Monitoring recommendations</button>
                </>
            )}
        </div>
    );
}