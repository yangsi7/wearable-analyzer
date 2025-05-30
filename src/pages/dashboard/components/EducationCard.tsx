import { BookOpen } from 'lucide-react';
import { EducationalContent } from '../../../types';

interface EducationCardProps {
  content?: EducationalContent;
}

export function EducationCard({ content = {
  title: 'Welcome to Your Heart Health Journey',
  description: 'Track your heart health metrics and learn more about your cardiac health day by day.',
} }: EducationCardProps) {
  return (
    <div className="glass-card bg-gradient-to-br from-blue-50/50 to-white/50 p-4 mb-6">
      <div className="flex items-center gap-2 mb-2">
        <div className="bg-blue-100 rounded-full p-1">
          <BookOpen className="w-4 h-4 text-blue-600" />
        </div>
        <h3 className="text-blue-900 font-medium">Today's Learning</h3>
      </div>

      <h4 className="text-lg font-semibold text-blue-900 mb-3">
        {content.title}
      </h4>

      <p className="text-blue-800 leading-relaxed">{content.description}</p>

      {content.link && (
        <a
          href={content.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-accent hover:text-blue-700 mt-4 group transition-colors duration-300"
        >
          Learn more
          <svg
            className="w-4 h-4 ml-1 transform group-hover:translate-x-0.5 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>
      )}
    </div>
  );
}