import { AVBlockType } from "../models/metrics/av_block";
import { MetricStatus } from "../models/metrics/metric_status";

export const getAVBlockStatus = (avBlockTypes: AVBlockType[]) => {
    if (avBlockTypes.length === 0) {
        return MetricStatus.normal;
    } else if (avBlockTypes.some((b) => b === AVBlockType.complete || b === AVBlockType.mobitz2)) {
        return MetricStatus.aboveNormal;
    } else if (avBlockTypes.includes(AVBlockType.mobitz1)) {
        return MetricStatus.aboveNormalBorderline;
    }
    return null;
}