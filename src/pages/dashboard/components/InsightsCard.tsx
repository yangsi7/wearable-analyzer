import { Insights as InsightsIcon } from "@mui/icons-material";
import { Insights } from "../../../features/report/domain/models/insights";
import { blue } from "@mui/material/colors";
import { useEffect, useState } from "react";
import { useTutorialContext } from "../../../features/onboarding/presentation/state/TutorialState";

enum GeneralStatus {
    normal = 'normal',
    warning = 'warning',
    alert = 'alert'
}

export const InsightsCard = ({ insights }: { insights: Insights }) => {
    const { state: { tourActive, stepIndex }, setState: setTutorialState } = useTutorialContext();
    const { summary, insights: dailyInsights, score, title } = insights;

    const [showDetails, setShowDetails] = useState(false);
    const [visibleDailyInsights, setVisibleDailyInsights] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const getColor = (score: number) => {
        if (score >= 8) return GeneralStatus.normal;
        if (score >= 5) return GeneralStatus.warning;
        return GeneralStatus.alert;
    };

    const hasDailyInsights = dailyInsights.length > 0;

    useEffect(() => {
        if (tourActive && stepIndex == 2) {
            if (isAnimating) {
                setTutorialState({ run: false });
            } else {
                setTimeout(() => {
                    setTutorialState({ run: true, stepIndex: 3 });
                },
                    1500,
                );
            }
        }

    }, [tourActive, isAnimating]);

    useEffect(() => {
        if (showDetails && visibleDailyInsights < dailyInsights.length) {
            setIsAnimating(true);
            const interval = setInterval(() => {
                setVisibleDailyInsights((prev) => {
                    if (prev >= dailyInsights.length - 1) {
                        setIsAnimating(false);
                        return dailyInsights.length;
                    }
                    return prev + 1;
                });
            }, 1000);

            return () => {
                console.log(`clearing interval`);
                clearInterval(interval);
            };
        }
    }, [showDetails, tourActive, stepIndex]);

    const color = score && getColor(score);

    return (<div className={`rounded-lg shadow-sm p-4 ${color ? `bg-${color}/50 border border-2 border-${color}` : 'bg-white'}`} id="insightsCard">
        <div className="flex items-center mb-4 justify-between border-b border-opacity-50 border-gray-200">
            <div className="flex items-center mb-4 gap-2 text-blue-700">
                <InsightsIcon />
                <h2 className="text-gray-900 font-medium">Insights</h2>
            </div>
        </div>
        {title && <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>}
        <p className="text-gray-700 mb-4">
            {summary}
        </p>
        {showDetails && hasDailyInsights && (
            <div className="mb-4">
                <h4 className="font-medium text-gray-800 mb-2 text-sm animate-fadeIn">Detailed Insights</h4>
                <ul className="space-y-2">
                    {dailyInsights.slice(0, visibleDailyInsights).map((item, index) => (
                        <li key={index} className="flex items-start animate-fadeIn gap-2">
                            <div className=" w-2 h-2 aspect-square rounded-full bg-gray-600 mt-1.5" />
                            <p className="text-gray-700 text-sm">
                                {item}
                            </p>
                        </li>
                    ))}
                </ul>
            </div>
        )}
        {hasDailyInsights && isAnimating ? <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto m-2 inline-block"></div> : (
            <button
                className="text-blue-600 font-medium text-sm animate-fadeIn"
                onClick={() => setShowDetails(!showDetails)}
                id={`${showDetails ? 'hideDetailsButton' : 'showDetailsButton'}`}
            >
                {showDetails ? 'Hide' : 'Show'} details
            </button>
        )}
    </div>);
}