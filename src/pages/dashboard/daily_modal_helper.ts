import { useEffect, useState } from "react";

export interface DailyModalContent {
    title: string;
    description: string;
    features: string[];
}

const dailyModalContentByDay: Map<number, DailyModalContent> = new Map([
    [3, {
        title: 'Advanced AFib Metrics Unlocked',
        description: 'You can now see detailed AFib metrics including maximum episode duration and heart rate ranges during AFib.',
        features: [
            'Maximum AFib Episode Duration',
            'Heart Rate During AFib Episodes',
            'Detailed AFib Burden Analysis',
        ],
    }],
    [5, {
        title: 'New Arrhythmia Metrics Available',
        description: 'Your dashboard now includes AV Blocks and Pauses detection.',
        features: [
            'AV Block Detection and Classification',
            'Pause Detection (>3s)',
            'Detailed Duration Analysis',
        ],
    }],
    [7, {
        title: 'Baseline Analysis Unlocked',
        description: 'After 7 days of monitoring, you can now compare your daily metrics to your personal baseline.',
        features: [
            'Trend Comparisons',
            'Weekly Averages',
            'Personalized Insights',
        ],
    }],
    // [8, {
    //     title: 'AI-Powered Insights Available',
    //     description: 'Your dashboard now includes advanced AI analysis of your heart health patterns.',
    //     features: [
    //         'Personalized Trend Analysis',
    //         'Smart Symptom Correlation',
    //         'Predictive Health Insights',
    //     ],
    // }],
]);

export const useDailyModalContent = (forDay: number | null) => {
    const [dayModalContent, setDayModalContent] = useState<DailyModalContent | null>(null);

    useEffect(() => {
        if (forDay) {
            setDayModalContent(dailyModalContentByDay.get(forDay) || null);
        }
    }, [forDay]);

    return dayModalContent;
};