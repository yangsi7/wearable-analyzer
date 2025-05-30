import { FavoriteBorder } from '@mui/icons-material';
import { BulletPoint } from './BulletPoint';
import { AnimatedModalDialog } from './AnimatedModalDialog';

interface WelcomeModalProps {
  onClose: () => void;
}

export function WelcomeModal({ onClose }: WelcomeModalProps) {
  const bulletPoints: Array<{ title: string, description: string }> = [
    {
      title: 'Daily Metrics',
      description: 'Track heart rate, AFib episodes, and more. Click the arrow icons to reveal detailed information.'
    },
    {
      title: 'Progressive Learning',
      description: 'Unlock new insights and metrics as you progress'
    },
    {
      title: 'Symptom Tracking',
      description: 'Log and monitor your symptoms over time'
    }
  ]

  return (
    <AnimatedModalDialog
      titleIcon={<FavoriteBorder fontSize='medium' className="text-blue-600" />}
      title="Welcome to Your Heart Health Dashboard"
      onConfirm={onClose}
      confirmLabel="Let's Get Started">
      <p className="text-gray-600 mb-6 text-center">
        Track your heart health metrics, understand your symptoms, and learn more
        about your cardiac health day by day.
      </p>

      <div className="space-y-4 mb-6">
        {bulletPoints.map((point, index) => <BulletPoint key={index} title={point.title} description={point.description} />)}
      </div>
    </AnimatedModalDialog>

  );
}