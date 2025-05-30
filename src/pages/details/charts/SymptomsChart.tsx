import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import SymptomSelector from "./components/SymptomSelector";
import { SymptomType } from "../../../data/enums";
import { Activity } from "lucide-react";
import { useState } from "react";

interface SymptomsChartProps {
    symptomData: AggregatedSymptomsData[];
}

interface AggregatedSymptomsData {
    date: string;
    symptoms?: Map<SymptomType, {
        count: number;
        severity: {
            mild: number;
            moderate: number;
            severe: number;
        };
    }>;
}

export default function SymptomsChart({ symptomData }: SymptomsChartProps) {
    const [selectedSymptoms, setSelectedSymptoms] = useState<Set<SymptomType>>(
        new Set(Object.values(SymptomType))
    );

    return (
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">

            <div className="flex items-center gap-3 mb-6">
                <div className="bg-indigo-100 p-2 rounded-full">
                    <Activity className="w-5 h-5 text-indigo-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Symptoms Over Time</h2>
            </div>
            <SymptomSelector allSymptoms={Object.values(SymptomType)} selectedSymptoms={selectedSymptoms} onSelectSymptoms={setSelectedSymptoms} />
            <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={symptomData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="date"
                            tick={{ fill: '#6b7280' }}
                            tickLine={{ stroke: '#6b7280' }}
                        />
                        <YAxis
                            tick={{ fill: '#6b7280' }}
                            tickLine={{ stroke: '#6b7280' }}
                            label={{
                                value: 'Number of Symptoms',
                                angle: -90,
                                position: 'insideLeft',
                                style: { fill: '#6b7280' }
                            }}
                        />
                        <Tooltip
                            content={({ active, payload }) => {
                                if (!active || !payload?.length) return null;

                                const data = payload[0].payload;
                                const symptom = payload[0].dataKey.split('.')[1] as SymptomType;
                                const symptomData = data.symptoms[symptom];

                                return (
                                    <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
                                        <p className="font-medium text-gray-900">{symptom}</p>
                                        <p className="text-sm text-gray-600">Total: {symptomData?.count || 0}</p>
                                        <div className="mt-2 space-y-1">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-yellow-400" />
                                                <p className="text-xs text-gray-600">Mild: {symptomData?.severity.mild || 0}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-orange-400" />
                                                <p className="text-xs text-gray-600">Moderate: {symptomData?.severity.moderate || 0}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-red-400" />
                                                <p className="text-xs text-gray-600">Severe: {symptomData?.severity.severe || 0}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }}
                        />
                        <Legend />
                        {Array.from(selectedSymptoms).map((symptom, index) => (
                            <Bar
                                key={symptom}
                                dataKey={`symptoms.${symptom}.count`}
                                name={symptom}
                                fill={[
                                    '#818cf8', // Indigo
                                    '#f472b6', // Pink
                                    '#fb923c', // Orange
                                    '#4ade80', // Green
                                ][index]}
                                stackId="symptoms"
                            />
                        ))}
                    </BarChart>
                </ResponsiveContainer>
            </div>

        </div>
    )
}