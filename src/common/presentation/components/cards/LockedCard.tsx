import { LockOutlined } from "@mui/icons-material";

interface LockedCardProps {
    title: string;
    unlocksOnDay: number;
    currentDay: number;
}
export default function LockedCard({ title, unlocksOnDay, currentDay }: LockedCardProps) {
    const daysLeft = unlocksOnDay - currentDay;
    const percentage = (currentDay / unlocksOnDay) * 100;
    return (
        <div className="glass-card bg-gray-50/30 mb-4 transform transition-all duration-500 hover:bg-gray-50/40 relative border-none">
            <div className={`bg-gradient-to-l from-teal-400/15 to-yellow-200/15 rounded-s h-full absolute z-1`} style={{ width: `${percentage}%` }} />
            <div className="flex items-center justify-between p-4">
                <h3 className="text-gray-400 font-medium">{title}</h3>
                <div className="flex items-center gap-2 text-gray-400  ">
                    <LockOutlined />
                    <span className="text-sm font-medium">Unlocks in {daysLeft} {daysLeft > 1 ? 'days' : 'day'}</span>
                </div>
            </div>
        </div>
    );
}