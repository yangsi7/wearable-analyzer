import { Bot, X, Heart, Activity } from 'lucide-react';
import { Report } from '../../features/report/domain/models/daily_report';

interface CardioAgentPanelProps {
  onClose: () => void;
  data?: Report | null;
  heartRateAverage?: number;
}

export function CardioAgentPanel({ onClose, data, heartRateAverage }: CardioAgentPanelProps) {
  const getSuggestedQuestion = () => {
    if (!data || !heartRateAverage) return null;

    return `My heart rate is ${data.heartRate?.average || 72.9} and my baseline average is ${(heartRateAverage).toFixed(1)}. How should I interpret this?`;
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      style={{ backdropFilter: 'blur(4px)' }}
    >
      <div className="bg-white/95 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-blue-100">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <Bot className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Chat with CardioAI
              </h2>
              <p className="text-sm text-gray-500">Your personal heart health assistant</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
            aria-label="Close chat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Suggested Question */}
        {data && heartRateAverage && (
          <div className="p-6 border-b border-blue-100">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-900 mb-2 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Suggested Question
              </h3>
              <p className="text-blue-800">{getSuggestedQuestion()}</p>
            </div>
          </div>
        )}

        {/* Question Context */}
        <div className="px-6 py-4 border-b border-blue-100 bg-gradient-to-r from-blue-50/50 to-transparent">
          <div className="flex items-center gap-2 text-sm text-blue-600">
            <Heart className="w-4 h-4" />
            <span>
              Please include your metrics in your questions for personalized insights
            </span>
          </div>
        </div>

        {/* ElevenLabs Widget */}
        <div className="flex-1 p-6 overflow-auto">
          <elevenlabs-convai
            agent-id="IUYmGRbdis9xqSciJKcg"
          ></elevenlabs-convai>
        </div>
      </div>
    </div>
  );
}