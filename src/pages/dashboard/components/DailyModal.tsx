import { Info } from 'lucide-react';
import { DailyModalContent } from '../daily_modal_helper';
import { BulletPoint } from './BulletPoint';
import { AnimatedModalDialog } from './AnimatedModalDialog';

interface DayModalProps {
  onClose: () => void;
  content: DailyModalContent | null;
}

export function DailyModal({ onClose, content }: DayModalProps) {
  if (!content) return null;

  return (
    <AnimatedModalDialog titleIcon={<Info className="w-8 h-8 text-blue-600" />} title={content.title} onConfirm={onClose} confirmLabel="Got it">
      <p className="text-gray-600 mb-6 text-center">
        {content.description}
      </p>

      <div className="space-y-4 mb-6">
        {content.features.map((feature, index) => (
          <BulletPoint key={index} title={feature} />
        ))}
      </div>
    </AnimatedModalDialog>

  );
}