import { HeartCrack } from "lucide-react";
import EmptyState from "../../common/presentation/EmptyState";
import { useSelectedDay } from "../dashboard/state/SelectedDayContext";
import { NormalRangeCard } from "./components/NormalRangeCard";
import { AfibCard } from "../../common/presentation/components/cards/MetricCard";
import ChartWrapper, { ChartType } from "./charts/ChartWrapper";

const AfibDetails = () => {
    const { report: metrics, selectedDayNumber } = useSelectedDay();
    if (!metrics) return <EmptyState title="No atrial fibrillation data" description="Atrial fibrillation data will appear here when available." icon={<HeartCrack />} />;
    const showAdvancedAFib = selectedDayNumber >= 3;

    const baseline = metrics.baseline?.afib || null;
    return (
        <div>
            <AfibCard
                afibMetric={metrics.afib}
                baseline={metrics.baseline?.afib || null}
                withDetails={showAdvancedAFib}
                withExpandedIndicator={true}
            />
            {baseline && <NormalRangeCard baseline={baseline} unit='%' />}
            <ChartWrapper chartType={ChartType.afib} />
        </div>
    );
}

export default AfibDetails;