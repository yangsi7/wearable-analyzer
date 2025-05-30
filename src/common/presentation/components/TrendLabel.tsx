import { MoveRight, TrendingDown, TrendingUp } from "lucide-react";

export default function TrendLabel(trend: number) {


    return (
        <div
            className={`flex items-center ${trend == 0 ?
                'text-gray-600 bg-gradient-to-r from-gray-100 to-gray-200/50' :
                trend > 0
                    ? 'text-rose-600 bg-gradient-to-r from-rose-50 to-rose-100/50'
                    : 'text-emerald-600 bg-gradient-to-r from-emerald-50 to-emerald-100/50'}`}
        >
            {trend == 0 ?
                <MoveRight className="w-5 h-4" /> :
                trend > 0 ?
                    <TrendingUp className="w-5 h-5" /> :
                    <TrendingDown className="w-5 h-5" />
            }
            <span className="text-sm ml-1">{Math.abs(trend)}%</span>
        </div>
    );
}