import { useNavigate } from "react-router-dom";
import EmptyState from "../../../common/presentation/EmptyState";
import DailyReport from "../../../features/report/domain/models/daily_report";
import { AfibCard, AVBlocksCard, HeartRateCard, PausesCard } from "../../../common/presentation/components/cards/MetricCard";
import LockedCard from "../../../common/presentation/components/cards/LockedCard";

interface DashboardPageProps {
    metrics: DailyReport | null;
    currentDay: number;
}


export default function MetricsSection({ metrics, currentDay }: DashboardPageProps) {
    const navigate = useNavigate();
    const showNewArrhythmias = currentDay !== null && currentDay >= 5;

    if (!metrics) {
        return (
            <EmptyState
                title="No Heart Health data found"
                description="No heart health data found for the selected day."
            />
        );
    }


    return (
        <section className="space-y-4" id="metrics">
            <HeartRateCard
                heartRateMetric={(metrics.heartRate)}
                baseline={metrics.baseline?.heartRate || null}
                withDetails={false}
                onClick={() => navigate('/dashboard/heart-rate')}
            />

            <AfibCard
                afibMetric={metrics.afib}
                baseline={metrics.baseline?.afib || null}
                withDetails={false}
                onClick={() => navigate('/dashboard/afib')}
            />

            {showNewArrhythmias || ((metrics.avBlocks.types?.length || 0) > 0) ?
                <AVBlocksCard
                    onClick={() => navigate('/dashboard/av-blocks')}
                    avBlockMetric={metrics.avBlocks}
                    baseline={null}
                    withDetails={false}
                />
                :
                <LockedCard title="AV Block" unlocksOnDay={5} currentDay={currentDay} />
            }

            {(showNewArrhythmias || metrics.pauses.count) ? <PausesCard
                onClick={() => navigate('/dashboard/pauses')}
                pauseMetric={metrics.pauses}
                baseline={metrics.baseline?.pauses || null}
                withDetails={false}
            /> : <LockedCard title="Pauses" unlocksOnDay={5} currentDay={currentDay} />
            }
        </section>
    );
}