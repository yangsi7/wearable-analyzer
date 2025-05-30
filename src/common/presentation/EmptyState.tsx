import { ClipboardList } from "lucide-react";
import { ReactNode } from "react";

interface EmptyStateProps {
    title: string;
    description: string;
    icon?: ReactNode;
    action?: ReactNode;
}

const EmptyState = ({ title, description, icon, action }: EmptyStateProps) => {
    return <div className="md-empty-state">
        <div className="bg-gray-100 p-3 rounded-full mb-4">
            {icon || <ClipboardList className="w-6 h-6 text-gray-400" />}
        </div>
        <h3 className="text-lg font-medium text-gray-700 mb-2">{title}</h3>
        <p className="text-gray-500 text-center">{description}</p>
        {action && <div className="mt-4">{action}</div>}
    </div>
}

export default EmptyState;