import { Heart } from "lucide-react";
import { useSelectedDay } from "../dashboard/state/SelectedDayContext";
import EmptyState from "../../common/presentation/EmptyState";
import { NormalRangeCard } from "./components/NormalRangeCard";
import { HeartRateCard } from "../../common/presentation/components/cards/MetricCard";
import ChartWrapper, { ChartType } from "./charts/ChartWrapper";
import { useTutorialContext } from "../../features/onboarding/presentation/state/TutorialState";
import { useMount } from "react-use";



const HeartRateDetails = () => {
    const {
        setState,
        state: { tourActive },
    } = useTutorialContext();

    useMount(() => {
        if (tourActive) {
            setTimeout(() => {
                setState({ run: true });
            }, 600);
        }
    });
    const { report: metrics } = useSelectedDay();
    if (!metrics) return <EmptyState title="No heart rate data" description="Heart rate data will appear here when available." icon={<Heart />} />;
    const baseline = metrics.baseline?.heartRate || null;

    return (
        <div>
            <HeartRateCard
                heartRateMetric={(metrics.heartRate)}
                baseline={metrics.baseline?.heartRate || null}
                withDetails={true}
                withExpandedIndicator={true}
            />
            {baseline && <NormalRangeCard baseline={baseline} unit='bpm' />}
            <ChartWrapper chartType={ChartType.heartRate} />
        </div>
    );
}

export default HeartRateDetails;