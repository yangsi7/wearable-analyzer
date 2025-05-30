import { Insights } from "./insights";
import { SymptomLog } from "./symptoms/symptom_log";
import { AfibMetric } from "./metrics/afib_metric";
import { AvBlock } from "./metrics/av_block";
import { HeartRateMetric } from "./metrics/heart_rate_metric";
import { PauseMetric } from "./metrics/pause_metric";
import { MetricBaselines } from "./metric_baselines";
import DataQualityInfo from "./data_quality_info";

export default interface DailyReport {
    date: Date
    heartRate: HeartRateMetric;
    afib: AfibMetric;
    avBlocks: AvBlock;
    pauses: PauseMetric;
    loggedSymptoms: SymptomLog[];
    baseline?: MetricBaselines;
    insights?: Insights;
    dataQualityInfo?: DataQualityInfo;
}


