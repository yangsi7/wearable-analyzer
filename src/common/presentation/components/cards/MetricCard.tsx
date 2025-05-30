import React from 'react';
import ExpandedRangeIndicator, { MinimizedRangeIndicator } from '../RangeIndicator';
import { Block, FavoriteBorder, PauseCircleOutline } from '@mui/icons-material';
import { HeartPulse } from 'lucide-react';
import { MetricStatus } from '../../../../features/report/domain/models/metrics/metric_status';
import { HeartRateMetric } from '../../../../features/report/domain/models/metrics/heart_rate_metric';
import { Baseline } from '../../../../features/report/domain/models/baseline';
import getMetricStatusFromBaselines from '../../../../features/report/domain/use_cases/get_metric_status_from_baseline';
import { getAVBlockStatus } from '../../../../features/report/domain/use_cases/get_av_block_status';
import { formatDurationToMinuteSecond } from '../../../../utils/duration_utils';
import { AfibMetric } from '../../../../features/report/domain/models/metrics/afib_metric';
import { AvBlock } from '../../../../features/report/domain/models/metrics/av_block';
import { PauseMetric } from '../../../../features/report/domain/models/metrics/pause_metric';

interface MetricCardProps {
  title: string;
  mainValue: string | number;
  mainUnit?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  titleIcon?: React.ReactNode;
  metricStatus: MetricStatus | null;
  withExpandedStatusIndicator: boolean;
  description?: string | null;
  id?: string;
}



export function MetricCard({
  title,
  mainValue,
  mainUnit,
  children,
  onClick,
  titleIcon: icon,
  metricStatus,
  withExpandedStatusIndicator,
  description,
  id
}: MetricCardProps) {
  return (
    <div id={id} onClick={onClick} className='glass-card p-4 mb-4 transform transition-all duration-500 hover:scale-[1.01]'>
      <div className='flex items-center justify-between'>
        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-gray-700 font-medium flex items-center gap-2">
              {icon}
              {title}
            </h3>
          </div>

          <div className="mt-3 flex items-end gap-2">
            <span className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              {mainValue}
              {mainUnit && <span className="text-xl ml-1">{mainUnit}</span>}
            </span>
          </div>
        </div>
        {metricStatus && (withExpandedStatusIndicator ?
          <ExpandedRangeIndicator metricStatus={metricStatus} /> :
          <MinimizedRangeIndicator metricStatus={metricStatus} size={32} animate />)}
      </div>

      {description && (
        <div className="mt-2" id='statusDescription'>
          <span className="text-sm text-gray-500">
            {description}
          </span>
        </div>
      )}


      {children && (
        <div className="mt-4 pt-4 border-t border-gray-100 animate-fadeIn bg-gradient-to-b from-transparent to-gray-50/30 rounded-b-lg">
          {children}
        </div>
      )}
    </div>
  );
}

interface CommonMetricCardProps {
  onClick?: () => void;
  baseline: Baseline | null;
  withDetails: boolean;
  withExpandedIndicator?: boolean;
}

interface HeartRateCardProps extends CommonMetricCardProps {
  heartRateMetric: HeartRateMetric;
}

export const HeartRateCard = ({ onClick, heartRateMetric, baseline, withDetails, withExpandedIndicator }: HeartRateCardProps) => {
  const metricStatus = baseline && getMetricStatusFromBaselines(heartRateMetric.average, baseline)
  const baselineString = baseline && `${baseline.q1} - ${baseline.q3}bpm`;
  const getMetricStatusText = (status: MetricStatus, baselineString: string) => {
    switch (status) {
      case MetricStatus.normal:
        return 'Your average heart rate is within the normal range of ' + baselineString;
      case MetricStatus.belowNormal:
        return 'Your average heart rate is significantly below the normal range of ' + baselineString;
      case MetricStatus.aboveNormal:
        return 'Your average heart rate is significantly above the normal range of ' + baselineString;
      case MetricStatus.belowNormalBorderline:
        return 'Your average heart rate is slightly below the normal range of ' + baselineString;
      case MetricStatus.aboveNormalBorderline:
        return 'Your average heart rate is slightly above the normal range of ' + baselineString;
      default:
        return 'Your average heart rate is within the normal range of ' + baselineString;
    }
  }
  return (
    <MetricCard
      onClick={onClick}
      title="Heart Rate"
      mainValue={heartRateMetric.average || 0}
      mainUnit='bpm'
      metricStatus={metricStatus}
      titleIcon={<FavoriteBorder />}
      withExpandedStatusIndicator={withExpandedIndicator || false}
      description={metricStatus && baselineString && getMetricStatusText(metricStatus, baselineString)}
      id='heartRateCard'
    >
      {withDetails &&
        (<div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Minimum</span>
            <span className="font-medium">
              {heartRateMetric.min} bpm
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Maximum</span>
            <span className="font-medium">
              {heartRateMetric.max} bpm
            </span>
          </div>
        </div>)
      }
    </MetricCard>
  )
}

interface AfibCardProps extends CommonMetricCardProps {
  afibMetric: AfibMetric;
}

export const AfibCard = ({ onClick, afibMetric, baseline, withDetails, withExpandedIndicator }: AfibCardProps) => {
  const metricStatus = baseline && getMetricStatusFromBaselines(afibMetric.burden, baseline)
  const baselineString = baseline && `${baseline.q1} - ${baseline.q3}%`;
  const getMetricStatusText = (status: MetricStatus, baselineString: string) => {
    switch (status) {
      case MetricStatus.normal:
        return 'Your atrial burden is within the normal range of ' + baselineString;
      case MetricStatus.belowNormal:
        return 'Your atrial burden is significantly below the normal range of ' + baselineString;
      case MetricStatus.aboveNormal:
        return 'Your atrial burden is significantly above the normal range of ' + baselineString;
      case MetricStatus.belowNormalBorderline:
        return 'Your atrial burden is slightly below the normal range of ' + baselineString;
      case MetricStatus.aboveNormalBorderline:
        return 'Your atrial burden is slightly above the normal range of ' + baselineString;
      default:
        return 'Your atrial burden is within the normal range of ' + baselineString;
    }
  }
  return <MetricCard
    onClick={onClick}
    title="Atrial Fibrillation"
    mainValue={afibMetric.burden}
    mainUnit={'%'}
    metricStatus={metricStatus}
    titleIcon={<HeartPulse />}
    withExpandedStatusIndicator={withExpandedIndicator || false}
    description={metricStatus && baselineString && getMetricStatusText(metricStatus, baselineString)}
  >
    {withDetails &&
      <div className="space-y-2">
        {afibMetric.maxDuration && (
          <div className="flex justify-between">
            <span className="text-gray-600">Longest event</span>
            <span className="font-medium">
              {formatDurationToMinuteSecond(afibMetric.maxDuration)}
            </span>
          </div>
        )}
        {afibMetric.maxHR && <div className="flex justify-between">
          <span className="text-gray-600">Highest HR in Atrial Fibrillation</span>
          <span className="font-medium">
            {afibMetric.maxHR} bpm
          </span>
        </div>}
      </div>
    }
  </MetricCard>
}

interface AVBlocksCardProps extends CommonMetricCardProps {
  avBlockMetric: AvBlock
}

export const AVBlocksCard = ({ onClick, avBlockMetric, withDetails, withExpandedIndicator }: AVBlocksCardProps) => {
  const avBlockTypes = avBlockMetric.types || [];
  const metricStatus = getAVBlockStatus(avBlockTypes);
  const avBlocksDetected = avBlockTypes.length > 0;


  return <MetricCard
    onClick={onClick}
    title="AV Block"
    mainValue={avBlocksDetected ? "Detected" : "None"}
    titleIcon={<Block />}
    metricStatus={metricStatus}
    withExpandedStatusIndicator={withExpandedIndicator || false}
    description={avBlocksDetected ? 'AV Blocks detected in your ECG' : 'No AV Blocks detected in your ECG'}
  >
    {withDetails && avBlocksDetected &&
      (<div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">Types Detected</span>
          <span className="font-medium">
            {avBlockMetric.types!.join(', ')}
          </span>
        </div>
      </div>)}
  </MetricCard>
}

interface PausesCardProps extends CommonMetricCardProps {
  pauseMetric: PauseMetric;
}

export const PausesCard = ({ onClick, pauseMetric, baseline, withDetails, withExpandedIndicator }: PausesCardProps) => {
  const metricStatus = baseline && getMetricStatusFromBaselines(pauseMetric.count, baseline)
  const baselineString = baseline && `${baseline.q1} - ${baseline.q3} episodes`;
  const getMetricStatusText = (status: MetricStatus, baselineString: string) => {
    switch (status) {
      case MetricStatus.normal:
        return 'Your number of pauses is within the normal range of ' + baselineString;
      case MetricStatus.belowNormal:
        return 'Your number of pauses is significantly below the normal range of ' + baselineString;
      case MetricStatus.aboveNormal:
        return 'Your number of pauses is significantly above the normal range of ' + baselineString;
      case MetricStatus.belowNormalBorderline:
        return 'Your number of pauses is slightly below the normal range of ' + baselineString;
      case MetricStatus.aboveNormalBorderline:
        return 'Your number of pauses is slightly above the normal range of ' + baselineString;
      default:
        return 'Your number of pauses is within the normal range of ' + baselineString;
    }
  }
  return <MetricCard
    onClick={onClick}
    title="Pauses"
    mainValue={pauseMetric.count || 0}
    mainUnit='episodes'
    metricStatus={metricStatus}
    withExpandedStatusIndicator={withExpandedIndicator || false}
    titleIcon={<PauseCircleOutline />}
    description={metricStatus && baselineString && getMetricStatusText(metricStatus, baselineString)}
  >
    {(withDetails && pauseMetric.count > 0 && pauseMetric.longestDurationInSeconds) && (
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">Longest Pause</span>
          <span className="font-medium">
            {pauseMetric.longestDurationInSeconds}s
          </span>
        </div>
      </div>
    )}
  </MetricCard >
}



