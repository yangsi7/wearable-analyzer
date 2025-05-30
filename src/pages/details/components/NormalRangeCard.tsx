import { AreaChart } from "lucide-react"
import { Baseline } from "../../../features/report/domain/models/baseline"

export const NormalRangeCard = ({ baseline, unit }: { baseline: Baseline, unit: string }) => {
    return (<div className='glass-card p-4 mb-4 transform transition-all duration-500 hover:scale-[1.01]' id="baselineCard">
        <div className='flex items-center justify-between'>
            <div>
                <div className="flex items-center justify-between">
                    <h3 className="text-gray-700 font-medium flex items-center gap-2">
                        <AreaChart />
                        Normal range
                    </h3>
                </div>

                <div className="mt-3 flex items-end gap-2">
                    <span className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                        {baseline.q1} - {baseline.q3} {unit}
                    </span>
                </div>
            </div>
        </div>
        <div className="mt-2">
            <span className="text-sm text-gray-500 leading-none">
                Your normal range based on your historical data.
            </span>
        </div>
    </div>)
}