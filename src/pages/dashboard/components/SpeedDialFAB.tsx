import { useState, useRef } from 'react';
import { Phone } from '@mui/icons-material';
import { CardioAgentPanel } from '../../../common/presentation/components/CardioAgentPanel';
import DailyReport from '../../../features/report/domain/models/daily_report';

interface SpeedDialFABProps {
  data: DailyReport | null;
  heartRateAverage?: number;
}

export function SpeedDialFAB({ data, heartRateAverage }: SpeedDialFABProps) {
  const [showAgent, setShowAgent] = useState(false);
  const fabRef = useRef<HTMLDivElement>(null);


  return (
    <div
      ref={fabRef}
      className=" flex flex-col items-end space-y-4 pointer-events-auto"
      role="region"
      aria-label="Quick actions menu"
    >
      {/* CardioAI Panel */}
      {showAgent && (
        <CardioAgentPanel
          onClose={() => setShowAgent(false)}
          data={data}
          heartRateAverage={heartRateAverage}
        />
      )}


      {/* Chat Button */}
      <button
        onClick={() => {
          setShowAgent(true);
        }}
        className="p-2 text-gray-600 hover:text-blue-600 rounded-full hover:bg-gray-100"
        aria-label="Start CardioAI chat"
      >
        <Phone className="w-5 h-5" />
      </button>


    </div>
  );
}