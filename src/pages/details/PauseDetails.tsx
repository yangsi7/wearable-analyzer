import { PauseCircle } from "lucide-react";
import EmptyState from "../../common/presentation/EmptyState";
import { useSelectedDay } from "../dashboard/state/SelectedDayContext";
import ChartWrapper, { ChartType } from "./charts/ChartWrapper";
import { NormalRangeCard } from "./components/NormalRangeCard";
import { PausesCard } from "../../common/presentation/components/cards/MetricCard";

const PauseDetails = () => {
    const { report: metrics } = useSelectedDay();
    if (!metrics) return <EmptyState title="No pauses data" description="Pauses data will appear here when available." icon={<PauseCircle />} />;
    const baseline = metrics.baseline?.pauses || null;

    return (
        <div>
            <PausesCard
                pauseMetric={metrics.pauses}
                baseline={metrics.baseline?.pauses || null}
                withDetails={true}
                withExpandedIndicator={true}
            />
            {baseline && <NormalRangeCard baseline={baseline} unit='episodes' />}
            <ChartWrapper chartType={ChartType.pauses} />
        </div>
    );
}

export default PauseDetails;