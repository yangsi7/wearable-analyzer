import { HeartCrack } from "lucide-react";
import EmptyState from "../../common/presentation/EmptyState";
import { useSelectedDay } from "../dashboard/state/SelectedDayContext";
import { AVBlocksCard } from "../../common/presentation/components/cards/MetricCard";

const AvBlockDetails = () => {
    const { report: metrics } = useSelectedDay();
    if (!metrics) return <EmptyState title="No AV blocks data" description="AV blocks data will appear here when available." icon={<HeartCrack />} />;

    return (
        <AVBlocksCard
            avBlockMetric={metrics.avBlocks}
            baseline={null}
            withDetails={true}
            withExpandedIndicator={true}
        />
    );
}

export default AvBlockDetails;