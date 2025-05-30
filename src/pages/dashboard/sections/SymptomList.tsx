import EmptyState from '../../../common/presentation/EmptyState';
import { Pathology } from '../../../features/report/domain/models/heart_event';
import { Symptom, SymptomLog } from '../../../features/report/domain/models/symptoms/symptom_log';
import { formatTime } from '../../../utils/date_utils';



enum SymptomSeverity {
  mild = 'Mild',
  moderate = 'Moderate',
  severe = 'Severe',
}

const severityToColor = (severity: SymptomSeverity) => {
  switch (severity) {
    case SymptomSeverity.mild:
      return 'bg-yellow-100 text-yellow-800';
    case SymptomSeverity.moderate:
      return 'bg-orange-100 text-orange-800';
    case SymptomSeverity.severe:
      return 'bg-red-100 text-red-800';
  }
};

const pathologyColors: Map<Pathology, string> = new Map([
  [Pathology.AFib, 'bg-purple-100 text-purple-800 border-purple-200'],
  [Pathology.AVBlock, 'bg-blue-100 text-blue-800 border-blue-200'],
  [Pathology.Pause, 'bg-indigo-100 text-indigo-800 border-indigo-200'],
  [Pathology.Tachycardia, 'bg-orange-100 text-orange-800 border-orange-200'],
  [Pathology.SVT, 'bg-rose-100 text-rose-800 border-rose-200'],
  [Pathology.VT, 'bg-red-100 text-red-800 border-red-200'],
  [Pathology.Bradycardia, 'bg-amber-100 text-amber-800 border-amber-200'],
]);

function SymptomLogListItem({ symptomLog }: { symptomLog: SymptomLog }) {
  console.log(symptomLog);
  const correlatedEvents = symptomLog.correlatedEvents;
  const hasCorrelatedEvents = correlatedEvents?.length > 0;
  return (
    <div className="space-y-2 md-card p-4">
      <h4 className="text-lg font-medium text-gray-900">{symptomLog.symptomDate.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</h4>
      {symptomLog.symptoms.map((symptom) => <SymptomListItem symptom={symptom} key={symptom.symptom} />)}
      {hasCorrelatedEvents && (
        <div className="space-y-2">
          <h5 className="text-sm font-medium text-gray-900">Correlated Heart Events</h5>
          <div className="space-y-2">
            {correlatedEvents.map((event) => (
              <div className={`p-2 rounded-md border ${pathologyColors.get(event.pathology)}`} key={event.start.toISOString()}>
                <h5 className="text-sm font-medium text-gray-900">{event.pathology}</h5>
                <h6 className="text-sm font-medium text-gray-900">{formatTime(event.start)}-{formatTime(event.end)}</h6>
                <p className="text-xs text-gray-600">{event.notes}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function SymptomList({ symptomLogs }: { symptomLogs: SymptomLog[] }) {

  if (symptomLogs.length === 0) {
    return (
      <EmptyState
        title="No Symptoms Logged"
        description="No symptoms have been recorded for today. Your symptom log helps track your heart health journey."
      />
    );

  }

  return (
    <div className='space-y-4' id="symptomList">
      {symptomLogs.map((symptomLog) => (
        <SymptomLogListItem key={symptomLog.id} symptomLog={symptomLog} />
      ))}
    </div>
  );
}

const symptomSeverity = (intensity: number) => {
  if (intensity < 4) {
    return SymptomSeverity.mild;
  } else if (intensity < 7) {
    return SymptomSeverity.moderate;
  }

  return SymptomSeverity.severe
}

export function SymptomListItem({ symptom }: { symptom: Symptom }) {

  const symptomDuration = symptom.symptomDuration || { hour: 0, minute: 0 };
  const isZeroDuration = symptomDuration?.hour === 0 && symptomDuration?.minute === 0;
  const severity = (symptom.intensity && symptomSeverity(symptom.intensity)) || null;


  return (
    <div className="bg-gray-100 p-2 rounded-md border border-gray-200">
      <div className="flex items-start gap-2">
        <div>
          <h4 className="text-lg font-medium text-gray-900">{symptom.symptom}</h4>
          {!isZeroDuration && <span className="text-sm text-gray-500">Duration: {symptomDuration.hour} hours {symptomDuration.minute} minutes</span>}
        </div>
        {severity && <span
          className={`ml-auto px-3 py-1 rounded-full text-xs font-medium transition-colors  ${severityToColor(severity!)
            }`}
        >
          {severity}
        </span>}
      </div>

      {symptom.notes && (
        <p className="text-sm text-gray-600">{symptom.notes}</p>
      )}
    </div>
  )
}


